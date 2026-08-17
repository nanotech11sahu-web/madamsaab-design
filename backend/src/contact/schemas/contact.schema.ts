import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ContactSubmissionDocument = ContactSubmission & Document;

@Schema({ timestamps: true })
export class ContactSubmission {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  phone: string;

  @Prop({ default: '' })
  subject: string;

  @Prop({ required: true })
  message: string;

  @Prop({ enum: ['NEW', 'READ', 'REPLIED', 'ARCHIVED'], default: 'NEW' })
  status: string;

  @Prop({ default: '' })
  adminNotes: string;
}

export const ContactSubmissionSchema =
  SchemaFactory.createForClass(ContactSubmission);
