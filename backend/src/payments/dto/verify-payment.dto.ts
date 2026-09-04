import { IsMongoId, IsString } from 'class-validator';

export class VerifyPaymentDto {
  @IsMongoId()
  bookingId: string;

  @IsString()
  razorpayOrderId: string;

  @IsString()
  razorpayPaymentId: string;

  @IsString()
  razorpaySignature: string;
}
