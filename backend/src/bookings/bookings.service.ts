import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  Booking,
  BookingDocument,
  BookingStatus,
} from './schemas/booking.schema';
import { Service, ServiceDocument } from '../services/schemas/service.schema';
import { Package, PackageDocument } from '../packages/schemas/package.schema';
import {
  Settings,
  SettingsDocument,
} from '../settings/schemas/settings.schema';
import { CreateBookingDto } from './dto/create-booking.dto';
import { QueryBookingDto } from './dto/query-booking.dto';
import { CouponsService } from '../coupons/coupons.service';

interface BookedItemInput {
  refId: Types.ObjectId;
  name: string;
  price: number;
}

@Injectable()
export class BookingsService {
  constructor(
    @InjectModel(Booking.name) private bookingModel: Model<BookingDocument>,
    @InjectModel(Service.name) private serviceModel: Model<ServiceDocument>,
    @InjectModel(Package.name) private packageModel: Model<PackageDocument>,
    @InjectModel(Settings.name) private settingsModel: Model<SettingsDocument>,
    private readonly couponsService: CouponsService,
  ) {}

  private generateBookingNumber(): string {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const d = String(now.getDate()).padStart(2, '0');
    const random = Math.floor(100000 + Math.random() * 900000);
    return `SAL-${y}${m}${d}-${random}`;
  }

  private formatDate(iso: string): string {
    const date = new Date(iso);
    if (isNaN(date.getTime())) return iso;
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }

  private buildWhatsappMessage(
    template: string,
    params: {
      bookingNumber: string;
      customerName: string;
      customerPhone: string;
      services: BookedItemInput[];
      packages: BookedItemInput[];
      appointmentDate: string;
      timeSlot: string;
      serviceType: string;
      address?: {
        line1?: string;
        line2?: string;
        city?: string;
        state?: string;
        pincode?: string;
      };
      totalAmount: number;
    },
  ): string {
    const servicesText = params.services.length
      ? params.services.map((s) => `• ${s.name} - ₹${s.price}`).join('\n')
      : 'None';
    const packagesText = params.packages.length
      ? params.packages.map((p) => `• ${p.name} - ₹${p.price}`).join('\n')
      : 'None';

    let addressText = 'N/A';
    if (params.serviceType === 'HOME' && params.address) {
      const lines = [
        params.address.line1,
        params.address.line2,
        [params.address.city, params.address.state].filter(Boolean).join(', '),
        params.address.pincode,
      ].filter(Boolean);
      addressText = lines.length ? lines.join('\n') : 'N/A';
    }

    return template
      .replace(/{{bookingNumber}}/g, params.bookingNumber)
      .replace(/{{customerName}}/g, params.customerName)
      .replace(/{{customerPhone}}/g, params.customerPhone)
      .replace(/{{services}}/g, servicesText)
      .replace(/{{packages}}/g, packagesText)
      .replace(/{{appointmentDate}}/g, this.formatDate(params.appointmentDate))
      .replace(/{{timeSlot}}/g, params.timeSlot)
      .replace(
        /{{serviceType}}/g,
        params.serviceType === 'HOME' ? 'Home Service' : 'Salon Visit',
      )
      .replace(/{{address}}/g, addressText)
      .replace(/{{totalAmount}}/g, String(params.totalAmount));
  }

  async create(dto: CreateBookingDto, userId?: string) {
    const serviceIds = dto.serviceIds ?? [];
    const packageIds = dto.packageIds ?? [];

    const [services, packages, settings] = await Promise.all([
      this.serviceModel.find({ _id: { $in: serviceIds } }).lean(),
      this.packageModel.find({ _id: { $in: packageIds } }).lean(),
      this.getSettingsSingleton(),
    ]);

    if (serviceIds.length && services.length !== serviceIds.length) {
      throw new BadRequestException(
        'One or more selected services were not found',
      );
    }
    if (packageIds.length && packages.length !== packageIds.length) {
      throw new BadRequestException(
        'One or more selected packages were not found',
      );
    }
    if (!services.length && !packages.length) {
      throw new BadRequestException(
        'At least one service or package must be selected',
      );
    }

    const bookedServices: BookedItemInput[] = services.map((s) => ({
      refId: s._id,
      name: s.name,
      price: s.price,
    }));
    const bookedPackages: BookedItemInput[] = packages.map((p) => ({
      refId: p._id,
      name: p.name,
      price: p.packagePrice,
    }));

    const subtotal =
      bookedServices.reduce((sum, s) => sum + s.price, 0) +
      bookedPackages.reduce((sum, p) => sum + p.price, 0);

    let discountAmount = 0;
    let appliedCouponCode: string | null = null;
    let couponDoc: { _id: Types.ObjectId } | undefined;
    if (dto.couponCode) {
      const evaluation = await this.couponsService.evaluate(
        dto.couponCode,
        subtotal,
      );
      if (!evaluation.valid) {
        throw new BadRequestException(evaluation.message);
      }
      discountAmount = evaluation.discountAmount;
      appliedCouponCode = dto.couponCode.trim().toUpperCase();
      couponDoc = evaluation.coupon;
    }

    const homeServiceFee =
      dto.serviceType === 'HOME' ? settings.homeServiceFee : 0;
    const totalAmount = Math.max(
      0,
      subtotal - discountAmount + homeServiceFee,
    );

    let booking: BookingDocument | undefined;
    let lastError: unknown;
    const maxAttempts = 5;

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      const bookingNumber = this.generateBookingNumber();
      try {
        booking = await this.bookingModel.create({
          bookingNumber,
          user: userId ?? null,
          customer: dto.customer,
          services: bookedServices,
          packages: bookedPackages,
          serviceType: dto.serviceType,
          address: dto.serviceType === 'HOME' ? dto.address : undefined,
          appointmentDate: dto.appointmentDate,
          timeSlot: dto.timeSlot,
          subtotal,
          homeServiceFee,
          couponCode: appliedCouponCode,
          discountAmount,
          totalAmount,
          bookingStatus: BookingStatus.PENDING_WHATSAPP_CONFIRMATION,
          whatsappNumber: settings.whatsappNumber,
          notes: dto.notes ?? '',
        });
        break;
      } catch (err: unknown) {
        lastError = err;
        const mongoErr = err as { code?: number };
        if (mongoErr?.code === 11000) {
          continue;
        }
        throw err;
      }
    }

    if (!booking) {
      throw lastError instanceof Error
        ? lastError
        : new BadRequestException('Failed to create booking, please try again');
    }

    if (couponDoc) {
      await this.couponsService.incrementUsage(couponDoc._id.toString());
    }

    const whatsappMessage = this.buildWhatsappMessage(
      settings.whatsappMessageTemplate,
      {
        bookingNumber: booking.bookingNumber,
        customerName: dto.customer.name,
        customerPhone: dto.customer.phone,
        services: bookedServices,
        packages: bookedPackages,
        appointmentDate: dto.appointmentDate,
        timeSlot: dto.timeSlot,
        serviceType: dto.serviceType,
        address: dto.address,
        totalAmount,
      },
    );

    const digitsOnly = settings.whatsappNumber.replace(/\D/g, '');
    const whatsappUrl = `https://wa.me/${digitsOnly}?text=${encodeURIComponent(
      whatsappMessage,
    )}`;

    return {
      booking,
      whatsappMessage,
      whatsappUrl,
    };
  }

  private async getSettingsSingleton() {
    let settings = await this.settingsModel.findOne();
    if (!settings) {
      settings = await this.settingsModel.create({});
    }
    return settings;
  }

  async findAll(query: QueryBookingDto) {
    const page = Math.max(1, parseInt(query.page ?? '1', 10) || 1);
    const limit = Math.min(
      100,
      Math.max(1, parseInt(query.limit ?? '20', 10) || 20),
    );
    const filter: Record<string, unknown> = {};

    if (query.status) filter.bookingStatus = query.status;

    if (query.from || query.to) {
      const dateFilter: Record<string, string> = {};
      if (query.from) dateFilter.$gte = query.from;
      if (query.to) dateFilter.$lte = query.to;
      filter.appointmentDate = dateFilter;
    }

    if (query.search) {
      const regex = new RegExp(query.search, 'i');
      filter.$or = [
        { bookingNumber: regex },
        { 'customer.name': regex },
        { 'customer.phone': regex },
      ];
    }

    const [items, total] = await Promise.all([
      this.bookingModel
        .find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      this.bookingModel.countDocuments(filter),
    ]);

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string, requester: { userId: string; role: string }) {
    const booking = await this.bookingModel.findById(id).lean();
    if (!booking) throw new NotFoundException('Booking not found');

    const isOwner =
      booking.user && booking.user.toString() === requester.userId;
    const isAdmin = requester.role === 'ADMIN';
    if (!isOwner && !isAdmin) {
      throw new ForbiddenException('You do not have access to this booking');
    }

    return booking;
  }

  async findByUser(userId: string) {
    return this.bookingModel
      .find({ user: userId })
      .sort({ createdAt: -1 })
      .lean();
  }

  async updateStatus(id: string, bookingStatus: BookingStatus) {
    const booking = await this.bookingModel.findByIdAndUpdate(
      id,
      { bookingStatus },
      { new: true },
    );
    if (!booking) throw new NotFoundException('Booking not found');
    return booking;
  }

  async cancelByCustomer(id: string, userId: string) {
    const booking = await this.bookingModel.findById(id).exec();
    if (!booking) throw new NotFoundException('Booking not found');

    if (!booking.user || booking.user.toString() !== userId) {
      throw new ForbiddenException('You can only cancel your own bookings');
    }

    if (
      booking.bookingStatus === BookingStatus.COMPLETED ||
      booking.bookingStatus === BookingStatus.CANCELLED
    ) {
      throw new BadRequestException('This booking cannot be cancelled');
    }

    booking.bookingStatus = BookingStatus.CANCELLED;
    await booking.save();
    return booking;
  }

  async assignStaff(id: string, staffId: string) {
    const booking = await this.bookingModel.findByIdAndUpdate(
      id,
      { assignedStaff: staffId, bookingStatus: BookingStatus.ASSIGNED },
      { new: true },
    );
    if (!booking) throw new NotFoundException('Booking not found');
    return booking;
  }
}
