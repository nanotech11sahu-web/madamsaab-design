import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type HeroContentDocument = HeroContent & Document;

@Schema({ timestamps: true })
export class HeroContent {
  @Prop({ default: '' })
  heading: string;

  @Prop({ default: '' })
  subheading: string;

  @Prop({ default: '' })
  image: string;

  @Prop({ default: 'Book Now' })
  ctaText: string;

  @Prop({ default: '/book' })
  ctaLink: string;

  @Prop({ enum: ['ACTIVE', 'INACTIVE'], default: 'ACTIVE' })
  status: string;
}

export const HeroContentSchema = SchemaFactory.createForClass(HeroContent);
