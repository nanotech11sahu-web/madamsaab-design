import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type FaqDocument = Faq & Document;

@Schema({ timestamps: true })
export class Faq {
  @Prop({ required: true, trim: true })
  question: string;

  @Prop({ required: true })
  answer: string;

  @Prop({ default: 'General' })
  category: string;

  @Prop({ default: 0 })
  sortOrder: number;

  @Prop({ enum: ['ACTIVE', 'INACTIVE'], default: 'ACTIVE' })
  status: string;
}

export const FaqSchema = SchemaFactory.createForClass(Faq);
