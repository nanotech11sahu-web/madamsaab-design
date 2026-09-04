import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as crypto from 'crypto';
import Razorpay from 'razorpay';
import {
  Booking,
  BookingDocument,
  BookingStatus,
} from '../bookings/schemas/booking.schema';
import { CreateOrderDto } from './dto/create-order.dto';
import { VerifyPaymentDto } from './dto/verify-payment.dto';

@Injectable()
export class PaymentsService {
  private readonly razorpay: Razorpay;

  constructor(
    @InjectModel(Booking.name) private bookingModel: Model<BookingDocument>,
    private readonly configService: ConfigService,
  ) {
    this.razorpay = new Razorpay({
      key_id: this.configService.get<string>('RAZORPAY_KEY_ID') ?? '',
      key_secret: this.configService.get<string>('RAZORPAY_KEY_SECRET') ?? '',
    });
  }

  async createOrder(dto: CreateOrderDto) {
    const booking = await this.bookingModel.findById(dto.bookingId);
    if (!booking) throw new NotFoundException('Booking not found');
    if (booking.paymentStatus === 'PAID') {
      throw new BadRequestException('This booking has already been paid for');
    }

    const order = await this.razorpay.orders.create({
      amount: Math.round(booking.totalAmount * 100),
      currency: 'INR',
      receipt: booking.bookingNumber,
      notes: { bookingId: booking._id.toString() },
    });

    booking.razorpayOrderId = order.id;
    await booking.save();

    return {
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: this.configService.get<string>('RAZORPAY_KEY_ID'),
    };
  }

  async verifyPayment(dto: VerifyPaymentDto) {
    const booking = await this.bookingModel.findById(dto.bookingId);
    if (!booking) throw new NotFoundException('Booking not found');
    if (booking.razorpayOrderId !== dto.razorpayOrderId) {
      throw new BadRequestException('Order mismatch for this booking');
    }

    const keySecret =
      this.configService.get<string>('RAZORPAY_KEY_SECRET') ?? '';
    const expectedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(`${dto.razorpayOrderId}|${dto.razorpayPaymentId}`)
      .digest('hex');

    if (expectedSignature !== dto.razorpaySignature) {
      booking.paymentStatus = 'FAILED';
      await booking.save();
      throw new BadRequestException('Payment verification failed');
    }

    booking.paymentStatus = 'PAID';
    booking.razorpayPaymentId = dto.razorpayPaymentId;
    if (booking.bookingStatus === BookingStatus.PENDING_WHATSAPP_CONFIRMATION) {
      booking.bookingStatus = BookingStatus.CONFIRMED;
    }
    await booking.save();

    return { success: true, booking };
  }
}
