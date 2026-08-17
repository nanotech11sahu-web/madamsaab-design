import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Testimonial, TestimonialDocument } from './schemas/testimonial.schema';
import { CreateTestimonialDto } from './dto/create-testimonial.dto';
import { UpdateTestimonialDto } from './dto/update-testimonial.dto';

@Injectable()
export class TestimonialsService {
  constructor(
    @InjectModel(Testimonial.name)
    private testimonialModel: Model<TestimonialDocument>,
  ) {}

  async findAllPublic() {
    return this.testimonialModel
      .find({ status: 'ACTIVE' })
      .sort({ sortOrder: 1, createdAt: 1 })
      .lean();
  }

  async findAllAdmin() {
    return this.testimonialModel
      .find()
      .sort({ sortOrder: 1, createdAt: 1 })
      .lean();
  }

  async findOne(id: string) {
    const testimonial = await this.testimonialModel.findById(id).lean();
    if (!testimonial) throw new NotFoundException('Testimonial not found');
    return testimonial;
  }

  async create(dto: CreateTestimonialDto) {
    return this.testimonialModel.create(dto);
  }

  async update(id: string, dto: UpdateTestimonialDto) {
    const testimonial = await this.testimonialModel.findByIdAndUpdate(
      id,
      dto,
      { new: true },
    );
    if (!testimonial) throw new NotFoundException('Testimonial not found');
    return testimonial;
  }

  async remove(id: string) {
    const testimonial = await this.testimonialModel.findByIdAndDelete(id);
    if (!testimonial) throw new NotFoundException('Testimonial not found');
    return { deleted: true };
  }
}
