import * as crypto from 'crypto';
import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { BadRequestException } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { Booking, BookingStatus } from '../bookings/schemas/booking.schema';

const WEBHOOK_SECRET = 'whsec_test_123';

function signBody(body: string, secret: string) {
  return crypto.createHmac('sha256', secret).update(body).digest('hex');
}

describe('PaymentsService.handleWebhook', () => {
  let service: PaymentsService;
  let findOneMock: jest.Mock;
  let savedBooking: {
    _id: { toString: () => string };
    paymentStatus: string;
    razorpayPaymentId: string | null;
    bookingStatus: BookingStatus;
    save: jest.Mock;
  };

  beforeEach(async () => {
    savedBooking = {
      _id: { toString: () => 'booking-1' },
      paymentStatus: 'PENDING',
      razorpayPaymentId: null,
      bookingStatus: BookingStatus.PENDING_WHATSAPP_CONFIRMATION,
      save: jest.fn().mockResolvedValue(undefined),
    };
    findOneMock = jest.fn().mockResolvedValue(savedBooking);
    const findByIdMock = jest.fn().mockResolvedValue(savedBooking);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentsService,
        {
          provide: getModelToken(Booking.name),
          useValue: { findOne: findOneMock, findById: findByIdMock },
        },
        {
          provide: ConfigService,
          useValue: {
            get: (key: string) =>
              key === 'RAZORPAY_WEBHOOK_SECRET' ? WEBHOOK_SECRET : 'irrelevant',
          },
        },
      ],
    }).compile();

    service = module.get<PaymentsService>(PaymentsService);
  });

  const payload = (orderId: string, paymentId: string) =>
    JSON.stringify({
      event: 'payment.captured',
      payload: { payment: { entity: { id: paymentId, order_id: orderId } } },
    });

  it('marks the booking paid on a valid signature', async () => {
    const body = payload('order_abc', 'pay_xyz');
    const signature = signBody(body, WEBHOOK_SECRET);

    const result = await service.handleWebhook(Buffer.from(body), signature);

    expect(result).toEqual({ received: true });
    expect(savedBooking.paymentStatus).toBe('PAID');
    expect(savedBooking.razorpayPaymentId).toBe('pay_xyz');
    expect(savedBooking.bookingStatus).toBe(BookingStatus.CONFIRMED);
    expect(savedBooking.save).toHaveBeenCalledTimes(1);
  });

  it('rejects a forged signature', async () => {
    const body = payload('order_abc', 'pay_xyz');
    await expect(
      service.handleWebhook(Buffer.from(body), 'not-the-real-signature'),
    ).rejects.toBeInstanceOf(BadRequestException);
    expect(savedBooking.save).not.toHaveBeenCalled();
  });

  it('rejects a call with no signature header', async () => {
    const body = payload('order_abc', 'pay_xyz');
    await expect(
      service.handleWebhook(Buffer.from(body), undefined),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('is idempotent — a second delivery of the same event is a no-op', async () => {
    savedBooking.paymentStatus = 'PAID';
    savedBooking.razorpayPaymentId = 'pay_xyz';

    const body = payload('order_abc', 'pay_xyz');
    const signature = signBody(body, WEBHOOK_SECRET);

    await service.handleWebhook(Buffer.from(body), signature);

    expect(savedBooking.save).not.toHaveBeenCalled();
  });

  it('acknowledges but ignores events for an unknown order', async () => {
    findOneMock.mockResolvedValue(null);
    const body = payload('order_unknown', 'pay_xyz');
    const signature = signBody(body, WEBHOOK_SECRET);

    const result = await service.handleWebhook(Buffer.from(body), signature);
    expect(result).toEqual({ received: true });
  });

  it('ignores unrelated event types without touching the booking', async () => {
    const body = JSON.stringify({ event: 'refund.processed', payload: {} });
    const signature = signBody(body, WEBHOOK_SECRET);

    const result = await service.handleWebhook(Buffer.from(body), signature);
    expect(result).toEqual({ received: true });
    expect(savedBooking.save).not.toHaveBeenCalled();
  });
});
