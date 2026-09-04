import { Type } from 'class-transformer';
import {
  IsArray,
  IsEmail,
  IsIn,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class BookingCustomerDto {
  @IsString()
  name: string;

  @IsString()
  phone: string;

  @IsOptional()
  @IsEmail()
  email?: string;
}

export class BookingAddressDto {
  @IsOptional()
  @IsString()
  line1?: string;

  @IsOptional()
  @IsString()
  line2?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  state?: string;

  @IsOptional()
  @IsString()
  pincode?: string;
}

export class CreateBookingDto {
  @ValidateNested()
  @Type(() => BookingCustomerDto)
  customer: BookingCustomerDto;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  serviceIds?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  packageIds?: string[];

  @IsIn(['HOME', 'SALON'])
  serviceType: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => BookingAddressDto)
  address?: BookingAddressDto;

  @IsString()
  appointmentDate: string;

  @IsString()
  timeSlot: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsString()
  couponCode?: string;
}
