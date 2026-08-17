import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type PackageDocument = Package & Document;

@Schema({ timestamps: true })
export class Package {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, unique: true, trim: true, lowercase: true })
  slug: string;

  @Prop({ default: '' })
  description: string;

  @Prop({ default: '' })
  shortDescription: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Service' }], default: [] })
  services: Types.ObjectId[];

  @Prop({ required: true, min: 0 })
  packagePrice: number;

  @Prop({ min: 0 })
  originalPrice: number;

  @Prop({ required: true, min: 0 })
  duration: number;

  @Prop({ default: '' })
  image: string;

  @Prop({ enum: ['ACTIVE', 'INACTIVE'], default: 'ACTIVE' })
  status: string;

  @Prop({ default: false })
  featured: boolean;

  @Prop({ default: 0 })
  sortOrder: number;

  @Prop({ default: '' })
  validity: string;

  @Prop({ default: '' })
  terms: string;
}

export const PackageSchema = SchemaFactory.createForClass(Package);
