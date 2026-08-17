import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type StaffDocument = Staff & Document;

@Schema({ _id: false })
export class WorkingHours {
  @Prop({ required: true })
  start: string;

  @Prop({ required: true })
  end: string;
}
const WorkingHoursSchema = SchemaFactory.createForClass(WorkingHours);

@Schema({ timestamps: true })
export class Staff {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, trim: true })
  phone: string;

  @Prop({ default: '', trim: true, lowercase: true })
  email: string;

  @Prop({ default: '' })
  image: string;

  @Prop({ type: [String], default: [] })
  skills: string[];

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Service' }], default: [] })
  services: Types.ObjectId[];

  @Prop({ type: [String], default: [] })
  workingDays: string[];

  @Prop({ type: WorkingHoursSchema, required: false })
  workingHours?: WorkingHours;

  @Prop({ enum: ['ACTIVE', 'INACTIVE'], default: 'ACTIVE' })
  status: string;
}

export const StaffSchema = SchemaFactory.createForClass(Staff);
