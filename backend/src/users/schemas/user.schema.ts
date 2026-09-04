import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ _id: false })
export class Address {
  @Prop({ required: true })
  label: string;

  @Prop({ required: true })
  line1: string;

  @Prop({ default: '' })
  line2: string;

  @Prop({ required: true })
  city: string;

  @Prop({ required: true })
  state: string;

  @Prop({ required: true })
  pincode: string;

  @Prop({ default: false })
  isDefault: boolean;
}

const AddressSchema = SchemaFactory.createForClass(Address);

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, unique: true, trim: true, lowercase: true })
  email: string;

  @Prop({ required: true, trim: true })
  phone: string;

  @Prop({ type: String, default: null, unique: true, sparse: true, trim: true })
  username: string | null;

  @Prop({ required: true, select: false })
  password: string;

  @Prop({ enum: ['CUSTOMER', 'ADMIN'], default: 'CUSTOMER' })
  role: string;

  @Prop({ type: [AddressSchema], default: [] })
  addresses: Address[];

  @Prop({ type: String, default: null })
  dateOfBirth: string | null;

  @Prop({ type: String, enum: ['FEMALE', 'MALE', 'OTHER', null], default: null })
  gender: string | null;

  @Prop({ type: String, default: null })
  profilePhoto: string | null;

  @Prop({ type: String, default: null, select: false })
  refreshTokenHash: string | null;

  @Prop({ type: String, default: null, select: false })
  resetPasswordTokenHash: string | null;

  @Prop({ type: Date, default: null, select: false })
  resetPasswordExpires: Date | null;

  @Prop({ default: true })
  isActive: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
