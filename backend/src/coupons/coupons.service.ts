import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Coupon, CouponDocument } from './schemas/coupon.schema';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';

export interface CouponEvaluation {
  valid: boolean;
  message: string;
  discountAmount: number;
  coupon?: CouponDocument;
}

@Injectable()
export class CouponsService {
  constructor(
    @InjectModel(Coupon.name) private couponModel: Model<CouponDocument>,
  ) {}

  async findAll() {
    return this.couponModel.find().sort({ createdAt: -1 }).lean();
  }

  async findOne(id: string) {
    const coupon = await this.couponModel.findById(id);
    if (!coupon) throw new NotFoundException('Coupon not found');
    return coupon;
  }

  async create(dto: CreateCouponDto) {
    return this.couponModel.create({
      ...dto,
      code: dto.code.trim().toUpperCase(),
      validFrom: dto.validFrom ? new Date(dto.validFrom) : null,
      validUntil: dto.validUntil ? new Date(dto.validUntil) : null,
    });
  }

  async update(id: string, dto: UpdateCouponDto) {
    const update: Record<string, unknown> = { ...dto };
    if (dto.code) update.code = dto.code.trim().toUpperCase();
    if (dto.validFrom !== undefined)
      update.validFrom = dto.validFrom ? new Date(dto.validFrom) : null;
    if (dto.validUntil !== undefined)
      update.validUntil = dto.validUntil ? new Date(dto.validUntil) : null;

    const coupon = await this.couponModel.findByIdAndUpdate(id, update, {
      new: true,
    });
    if (!coupon) throw new NotFoundException('Coupon not found');
    return coupon;
  }

  async remove(id: string) {
    const coupon = await this.couponModel.findByIdAndDelete(id);
    if (!coupon) throw new NotFoundException('Coupon not found');
    return { deleted: true };
  }

  /**
   * Evaluates a coupon code against a subtotal. Used both for the customer-facing
   * "apply" preview and re-validated server-side again at booking creation time.
   */
  async evaluate(code: string, subtotal: number): Promise<CouponEvaluation> {
    const coupon = await this.couponModel.findOne({
      code: code.trim().toUpperCase(),
    });

    if (!coupon) {
      return { valid: false, message: 'Invalid coupon code', discountAmount: 0 };
    }
    if (!coupon.isActive) {
      return { valid: false, message: 'This coupon is no longer active', discountAmount: 0 };
    }
    const now = new Date();
    if (coupon.validFrom && now < coupon.validFrom) {
      return { valid: false, message: 'This coupon is not active yet', discountAmount: 0 };
    }
    if (coupon.validUntil && now > coupon.validUntil) {
      return { valid: false, message: 'This coupon has expired', discountAmount: 0 };
    }
    if (coupon.usageLimit !== null && coupon.usedCount >= coupon.usageLimit) {
      return { valid: false, message: 'This coupon has reached its usage limit', discountAmount: 0 };
    }
    if (subtotal < coupon.minOrderAmount) {
      return {
        valid: false,
        message: `Minimum order of ₹${coupon.minOrderAmount} required for this coupon`,
        discountAmount: 0,
      };
    }

    let discountAmount =
      coupon.type === 'PERCENTAGE' ? (subtotal * coupon.value) / 100 : coupon.value;

    if (coupon.type === 'PERCENTAGE' && coupon.maxDiscountAmount !== null) {
      discountAmount = Math.min(discountAmount, coupon.maxDiscountAmount);
    }
    discountAmount = Math.min(discountAmount, subtotal);
    discountAmount = Math.round(discountAmount * 100) / 100;

    return { valid: true, message: 'Coupon applied', discountAmount, coupon };
  }

  async incrementUsage(id: string) {
    await this.couponModel.findByIdAndUpdate(id, { $inc: { usedCount: 1 } });
  }
}
