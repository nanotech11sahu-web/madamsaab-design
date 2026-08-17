import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SettingsDocument = Settings & Document;

@Schema({ timestamps: true })
export class Settings {
  @Prop({ required: true, default: '' })
  whatsappNumber: string;

  @Prop({
    default:
      'Hello, I would like to book a salon service.\n\nBooking Number: {{bookingNumber}}\n\nCustomer:\n{{customerName}}\n\nPhone:\n{{customerPhone}}\n\nSelected Services:\n{{services}}\n\nSelected Packages:\n{{packages}}\n\nAppointment Date:\n{{appointmentDate}}\n\nPreferred Time:\n{{timeSlot}}\n\nService Type:\n{{serviceType}}\n\nAddress:\n{{address}}\n\nTotal Booking Amount:\n₹{{totalAmount}}\n\nI would like to confirm this booking and complete the payment through WhatsApp.\n\nThank you.',
  })
  whatsappMessageTemplate: string;

  @Prop({ default: 'MadamSaab' })
  businessName: string;

  @Prop({ default: '' })
  phone: string;

  @Prop({ default: '' })
  email: string;

  @Prop({ default: '' })
  address: string;

  @Prop({ default: '' })
  googleMapsUrl: string;

  @Prop({ default: '09:00' })
  openingTime: string;

  @Prop({ default: '20:00' })
  closingTime: string;

  @Prop({
    type: [String],
    default: ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'],
  })
  workingDays: string[];

  @Prop({ default: 99 })
  homeServiceFee: number;

  @Prop({ default: '' })
  logoUrl: string;
}

export const SettingsSchema = SchemaFactory.createForClass(Settings);
