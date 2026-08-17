import { IsIn } from 'class-validator';
import { ReviewStatus } from '../schemas/review.schema';

export class UpdateReviewStatusDto {
  @IsIn([ReviewStatus.PENDING, ReviewStatus.PUBLISHED, ReviewStatus.REJECTED])
  status: ReviewStatus;
}
