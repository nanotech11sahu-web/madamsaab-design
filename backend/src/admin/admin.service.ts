import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Booking, BookingDocument, BookingStatus } from '../bookings/schemas/booking.schema';
import { User, UserDocument } from '../users/schemas/user.schema';
import { Service, ServiceDocument } from '../services/schemas/service.schema';
import { Package, PackageDocument } from '../packages/schemas/package.schema';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(Booking.name) private bookingModel: Model<BookingDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Service.name) private serviceModel: Model<ServiceDocument>,
    @InjectModel(Package.name) private packageModel: Model<PackageDocument>,
  ) {}

  private todayString(): string {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const d = String(now.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  async getDashboardStats() {
    const today = this.todayString();
    const nonFinalStatuses = [
      BookingStatus.CANCELLED,
      BookingStatus.COMPLETED,
      BookingStatus.NO_SHOW,
    ];

    const [
      totalBookings,
      todaysBookings,
      upcomingBookings,
      pendingWhatsappConfirmations,
      confirmedBookings,
      completedBookings,
      cancelledBookings,
      totalCustomers,
      totalBookingValueAgg,
      popularServicesAgg,
      popularPackagesAgg,
      recentBookings,
    ] = await Promise.all([
      this.bookingModel.countDocuments(),
      this.bookingModel.countDocuments({
        appointmentDate: { $regex: `^${today}` },
      }),
      this.bookingModel.countDocuments({
        appointmentDate: { $gte: today },
        bookingStatus: { $nin: nonFinalStatuses },
      }),
      this.bookingModel.countDocuments({
        bookingStatus: BookingStatus.PENDING_WHATSAPP_CONFIRMATION,
      }),
      this.bookingModel.countDocuments({
        bookingStatus: BookingStatus.CONFIRMED,
      }),
      this.bookingModel.countDocuments({
        bookingStatus: BookingStatus.COMPLETED,
      }),
      this.bookingModel.countDocuments({
        bookingStatus: BookingStatus.CANCELLED,
      }),
      this.userModel.countDocuments({ role: 'CUSTOMER' }),
      this.bookingModel.aggregate([
        { $match: { bookingStatus: { $ne: BookingStatus.CANCELLED } } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } },
      ]),
      this.bookingModel.aggregate([
        { $unwind: '$services' },
        {
          $group: {
            _id: { refId: '$services.refId', name: '$services.name' },
            count: { $sum: 1 },
          },
        },
        { $sort: { count: -1 } },
        { $limit: 5 },
        { $project: { _id: 0, name: '$_id.name', count: 1 } },
      ]),
      this.bookingModel.aggregate([
        { $unwind: '$packages' },
        {
          $group: {
            _id: { refId: '$packages.refId', name: '$packages.name' },
            count: { $sum: 1 },
          },
        },
        { $sort: { count: -1 } },
        { $limit: 5 },
        { $project: { _id: 0, name: '$_id.name', count: 1 } },
      ]),
      this.bookingModel.find().sort({ createdAt: -1 }).limit(10).lean(),
    ]);

    return {
      totalBookings,
      todaysBookings,
      upcomingBookings,
      pendingWhatsappConfirmations,
      confirmedBookings,
      completedBookings,
      cancelledBookings,
      totalCustomers,
      totalBookingValue: totalBookingValueAgg[0]?.total ?? 0,
      popularServices: popularServicesAgg,
      popularPackages: popularPackagesAgg,
      recentBookings,
    };
  }
}
