import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { CouponsService } from './coupons.service';
import { Coupon } from './schemas/coupon.schema';

type MockCoupon = Partial<Coupon> & { _id: string };

describe('CouponsService.evaluate', () => {
  let service: CouponsService;
  let findOneMock: jest.Mock;

  const buildCoupon = (overrides: Partial<MockCoupon> = {}): MockCoupon => ({
    _id: 'coupon-1',
    code: 'WELCOME10',
    type: 'PERCENTAGE',
    value: 10,
    isActive: true,
    validFrom: null,
    validUntil: null,
    minOrderAmount: 0,
    maxDiscountAmount: null,
    usageLimit: null,
    usedCount: 0,
    ...overrides,
  });

  beforeEach(async () => {
    findOneMock = jest.fn();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CouponsService,
        {
          provide: getModelToken(Coupon.name),
          useValue: { findOne: findOneMock },
        },
      ],
    }).compile();

    service = module.get<CouponsService>(CouponsService);
  });

  it('rejects an unknown coupon code', async () => {
    findOneMock.mockResolvedValue(null);
    const result = await service.evaluate('NOPE', 1000);
    expect(result.valid).toBe(false);
    expect(result.discountAmount).toBe(0);
  });

  it('rejects an inactive coupon', async () => {
    findOneMock.mockResolvedValue(buildCoupon({ isActive: false }));
    const result = await service.evaluate('WELCOME10', 1000);
    expect(result.valid).toBe(false);
  });

  it('rejects when subtotal is below minOrderAmount', async () => {
    findOneMock.mockResolvedValue(buildCoupon({ minOrderAmount: 500 }));
    const result = await service.evaluate('WELCOME10', 100);
    expect(result.valid).toBe(false);
    expect(result.discountAmount).toBe(0);
  });

  it('rejects an expired coupon', async () => {
    findOneMock.mockResolvedValue(
      buildCoupon({ validUntil: new Date('2000-01-01') }),
    );
    const result = await service.evaluate('WELCOME10', 1000);
    expect(result.valid).toBe(false);
  });

  it('rejects a coupon that hit its usage limit', async () => {
    findOneMock.mockResolvedValue(buildCoupon({ usageLimit: 1, usedCount: 1 }));
    const result = await service.evaluate('WELCOME10', 1000);
    expect(result.valid).toBe(false);
  });

  it('computes a percentage discount', async () => {
    findOneMock.mockResolvedValue(buildCoupon({ type: 'PERCENTAGE', value: 10 }));
    const result = await service.evaluate('WELCOME10', 1000);
    expect(result.valid).toBe(true);
    expect(result.discountAmount).toBe(100);
  });

  it('caps a percentage discount at maxDiscountAmount', async () => {
    findOneMock.mockResolvedValue(
      buildCoupon({ type: 'PERCENTAGE', value: 50, maxDiscountAmount: 100 }),
    );
    const result = await service.evaluate('WELCOME10', 1000);
    expect(result.valid).toBe(true);
    expect(result.discountAmount).toBe(100);
  });

  it('computes a flat discount and never exceeds the subtotal', async () => {
    findOneMock.mockResolvedValue(buildCoupon({ type: 'FLAT', value: 5000 }));
    const result = await service.evaluate('WELCOME10', 300);
    expect(result.valid).toBe(true);
    expect(result.discountAmount).toBe(300);
  });
});
