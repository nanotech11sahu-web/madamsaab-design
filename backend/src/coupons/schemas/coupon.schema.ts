import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CouponDocument = Coupon & Document;

@Schema({ timestamps: true })
export class Coupon {
  @Prop({ required: true, unique: true, trim: true, uppercase: true })
  code: string;

  @Prop({ default: '' })
  description: string;

  @Prop({ enum: ['PERCENTAGE', 'FLAT'], required: true })
  type: string;

  @Prop({ required: true, min: 0 })
  value: number;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ type: Date, default: null })
  validFrom: Date | null;

  @Prop({ type: Date, default: null })
  validUntil: Date | null;

  @Prop({ default: 0, min: 0 })
  minOrderAmount: number;

  @Prop({ type: Number, default: null })
  maxDiscountAmount: number | null;

  @Prop({ type: Number, default: null })
  usageLimit: number | null;

  @Prop({ default: 0 })
  usedCount: number;
}

export const CouponSchema = SchemaFactory.createForClass(Coupon);
