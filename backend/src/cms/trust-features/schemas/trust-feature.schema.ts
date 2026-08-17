import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TrustFeatureDocument = TrustFeature & Document;

@Schema({ timestamps: true })
export class TrustFeature {
  @Prop({ required: true, trim: true })
  icon: string;

  @Prop({ required: true, trim: true })
  label: string;

  @Prop({ default: 0 })
  sortOrder: number;

  @Prop({ enum: ['ACTIVE', 'INACTIVE'], default: 'ACTIVE' })
  status: string;
}

export const TrustFeatureSchema = SchemaFactory.createForClass(TrustFeature);
