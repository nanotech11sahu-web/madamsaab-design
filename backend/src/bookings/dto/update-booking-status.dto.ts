import { IsIn } from 'class-validator';
import { BookingStatus } from '../schemas/booking.schema';

export class UpdateBookingStatusDto {
  @IsIn(Object.values(BookingStatus))
  bookingStatus: BookingStatus;
}
