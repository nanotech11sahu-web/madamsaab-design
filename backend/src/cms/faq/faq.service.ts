import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Faq, FaqDocument } from './schemas/faq.schema';
import { CreateFaqDto } from './dto/create-faq.dto';
import { UpdateFaqDto } from './dto/update-faq.dto';

@Injectable()
export class FaqService {
  constructor(@InjectModel(Faq.name) private faqModel: Model<FaqDocument>) {}

  async findAllPublic() {
    return this.faqModel
      .find({ status: 'ACTIVE' })
      .sort({ sortOrder: 1, createdAt: 1 })
      .lean();
  }

  async findAllAdmin() {
    return this.faqModel.find().sort({ sortOrder: 1, createdAt: 1 }).lean();
  }

  async findOne(id: string) {
    const faq = await this.faqModel.findById(id).lean();
    if (!faq) throw new NotFoundException('FAQ not found');
    return faq;
  }

  async create(dto: CreateFaqDto) {
    return this.faqModel.create(dto);
  }

  async update(id: string, dto: UpdateFaqDto) {
    const faq = await this.faqModel.findByIdAndUpdate(id, dto, { new: true });
    if (!faq) throw new NotFoundException('FAQ not found');
    return faq;
  }

  async remove(id: string) {
    const faq = await this.faqModel.findByIdAndDelete(id);
    if (!faq) throw new NotFoundException('FAQ not found');
    return { deleted: true };
  }
}
