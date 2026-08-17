import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type BookingDocument = Booking & Document;

export enum BookingStatus {
  PENDING_WHATSAPP_CONFIRMATION = 'PENDING_WHATSAPP_CONFIRMATION',
  CONFIRMED = 'CONFIRMED',
  ASSIGNED = 'ASSIGNED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  NO_SHOW = 'NO_SHOW',
}

@Schema({ _id: false })
export class BookedItem {
  @Prop({ required: true })
  refId: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  price: number;
}
const BookedItemSchema = SchemaFactory.createForClass(BookedItem);

@Schema({ _id: false })
export class BookingAddress {
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
}
const BookingAddressSchema = SchemaFactory.createForClass(BookingAddress);

@Schema({ _id: false })
export class BookingCustomer {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  phone: string;

  @Prop({ default: '' })
  email: string;
}
const BookingCustomerSchema = SchemaFactory.createForClass(BookingCustomer);

@Schema({ timestamps: true })
export class Booking {
  @Prop({ required: true, unique: true })
  bookingNumber: string;

  @Prop({ type: Types.ObjectId, ref: 'User', default: null })
  user: Types.ObjectId | null;

  @Prop({ type: BookingCustomerSchema, required: true })
  customer: BookingCustomer;

  @Prop({ type: [BookedItemSchema], default: [] })
  services: BookedItem[];

  @Prop({ type: [BookedItemSchema], default: [] })
  packages: BookedItem[];

  @Prop({ enum: ['HOME', 'SALON'], default: 'HOME' })
  serviceType: string;

  @Prop({ type: BookingAddressSchema, required: false })
  address?: BookingAddress;

  @Prop({ required: true })
  appointmentDate: string;

  @Prop({ required: true })
  timeSlot: string;

  @Prop({ required: true, min: 0 })
  subtotal: number;

  @Prop({ required: true, min: 0, default: 0 })
  homeServiceFee: number;

  @Prop({ required: true, min: 0 })
  totalAmount: number;

  @Prop({
    enum: BookingStatus,
    default: BookingStatus.PENDING_WHATSAPP_CONFIRMATION,
  })
  bookingStatus: BookingStatus;

  @Prop({ required: true })
  whatsappNumber: string;

  @Prop({ default: false })
  whatsappContacted: boolean;

  @Prop({ default: '' })
  notes: string;

  @Prop({ type: Types.ObjectId, ref: 'Staff', default: null })
  assignedStaff: Types.ObjectId | null;
}

export const BookingSchema = SchemaFactory.createForClass(Booking);
