import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as crypto from 'crypto';
import Razorpay from 'razorpay';
import { Booking, BookingDocument } from '../bookings/schemas/booking.schema';
import { CreateOrderDto } from './dto/create-order.dto';
import { VerifyPaymentDto } from './dto/verify-payment.dto';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);
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

  /**
   * Marks a booking paid exactly once. Called from both the client-side verify
   * callback (fast UI feedback) and the Razorpay webhook (authoritative source
   * of truth, since it doesn't depend on the customer's browser staying open).
   * Idempotent: a booking already marked PAID is left untouched.
   *
   * Deliberately does NOT touch bookingStatus — payment success and the salon
   * actually approving/confirming the appointment are separate steps. A paid
   * booking stays PENDING_WHATSAPP_CONFIRMATION until admin confirms it.
   */
  private async markPaid(bookingId: string, razorpayPaymentId: string) {
    const booking = await this.bookingModel.findById(bookingId);
    if (!booking) return null;
    if (booking.paymentStatus === 'PAID') return booking;

    booking.paymentStatus = 'PAID';
    booking.razorpayPaymentId = razorpayPaymentId;
    await booking.save();
    return booking;
  }

  /**
   * Client-side confirmation right after Razorpay Checkout succeeds. Gives the
   * browser instant feedback, but is never the sole source of truth for
   * whether a booking is actually paid — the webhook is authoritative.
   */
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

    const updated = await this.markPaid(dto.bookingId, dto.razorpayPaymentId);
    return { success: true, booking: updated };
  }

  /**
   * Razorpay server-to-server webhook. This is the authoritative payment
   * confirmation path — it fires from Razorpay's infrastructure regardless of
   * whether the customer's browser is still open, so it's what should be
   * trusted in production rather than the frontend redirect/callback alone.
   *
   * Configure this URL (POST {API_URL}/api/v1/payments/webhook) with the
   * `payment.captured` event in the Razorpay Dashboard → Settings → Webhooks,
   * and put the webhook secret shown there into RAZORPAY_WEBHOOK_SECRET.
   */
  async handleWebhook(rawBody: Buffer, signature: string | undefined) {
    const webhookSecret =
      this.configService.get<string>('RAZORPAY_WEBHOOK_SECRET') ?? '';

    if (!webhookSecret) {
      this.logger.warn(
        'RAZORPAY_WEBHOOK_SECRET is not set — rejecting webhook call',
      );
      throw new BadRequestException('Webhook is not configured');
    }
    if (!signature) {
      throw new BadRequestException('Missing webhook signature');
    }

    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(rawBody)
      .digest('hex');

    if (expectedSignature !== signature) {
      throw new BadRequestException('Invalid webhook signature');
    }

    const event = JSON.parse(rawBody.toString('utf8')) as {
      event: string;
      payload?: {
        payment?: { entity?: { id?: string; order_id?: string } };
      };
    };

    if (event.event !== 'payment.captured' && event.event !== 'order.paid') {
      return { received: true };
    }

    const paymentEntity = event.payload?.payment?.entity;
    const orderId = paymentEntity?.order_id;
    const paymentId = paymentEntity?.id;

    if (!orderId || !paymentId) {
      this.logger.warn(`Webhook event ${event.event} missing order/payment id`);
      return { received: true };
    }

    const booking = await this.bookingModel.findOne({
      razorpayOrderId: orderId,
    });
    if (!booking) {
      this.logger.warn(`Webhook: no booking found for order ${orderId}`);
      return { received: true };
    }

    await this.markPaid(booking._id.toString(), paymentId);
    return { received: true };
  }
}
