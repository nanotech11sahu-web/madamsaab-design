import { IsIn, IsOptional, IsString } from 'class-validator';
import { BookingStatus } from '../schemas/booking.schema';

export class QueryBookingDto {
  @IsOptional()
  @IsIn(Object.values(BookingStatus))
  status?: BookingStatus;

  @IsOptional()
  @IsString()
  from?: string;

  @IsOptional()
  @IsString()
  to?: string;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  page?: string;

  @IsOptional()
  @IsString()
  limit?: string;
}
