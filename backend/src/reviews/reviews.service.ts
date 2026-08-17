import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Review, ReviewDocument, ReviewStatus } from './schemas/review.schema';
import {
  Booking,
  BookingDocument,
  BookingStatus,
} from '../bookings/schemas/booking.schema';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewStatusDto } from './dto/update-review-status.dto';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectModel(Review.name) private reviewModel: Model<ReviewDocument>,
    @InjectModel(Booking.name) private bookingModel: Model<BookingDocument>,
  ) {}

  async create(userId: string, dto: CreateReviewDto) {
    const booking = await this.bookingModel.findById(dto.bookingId).exec();
    if (!booking) throw new NotFoundException('Booking not found');

    if (!booking.user || booking.user.toString() !== userId) {
      throw new ForbiddenException('You can only review your own bookings');
    }

    if (booking.bookingStatus !== BookingStatus.COMPLETED) {
      throw new BadRequestException(
        'Only completed bookings can be reviewed',
      );
    }

    const existing = await this.reviewModel
      .findOne({ booking: dto.bookingId })
      .exec();
    if (existing) {
      throw new ConflictException('A review for this booking already exists');
    }

    return this.reviewModel.create({
      booking: dto.bookingId,
      customer: userId,
      rating: dto.rating,
      comment: dto.comment,
      status: ReviewStatus.PENDING,
    });
  }

  async findAllPublic() {
    return this.reviewModel
      .find({ status: ReviewStatus.PUBLISHED })
      .populate('customer', 'name')
      .sort({ createdAt: -1 })
      .limit(50)
      .exec();
  }

  async findAllAdmin() {
    return this.reviewModel
      .find()
      .populate('customer', 'name')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findMine(userId: string) {
    return this.reviewModel
      .find({ customer: userId })
      .sort({ createdAt: -1 })
      .exec();
  }

  async updateStatus(id: string, dto: UpdateReviewStatusDto) {
    const review = await this.reviewModel.findByIdAndUpdate(
      id,
      { status: dto.status },
      { new: true },
    );
    if (!review) throw new NotFoundException('Review not found');
    return review;
  }
}
