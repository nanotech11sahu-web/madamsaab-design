import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  ContactSubmission,
  ContactSubmissionDocument,
} from './schemas/contact.schema';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactStatusDto } from './dto/update-contact-status.dto';

@Injectable()
export class ContactService {
  constructor(
    @InjectModel(ContactSubmission.name)
    private contactModel: Model<ContactSubmissionDocument>,
  ) {}

  async create(dto: CreateContactDto) {
    return this.contactModel.create(dto);
  }

  async findAll() {
    return this.contactModel.find().sort({ createdAt: -1 }).lean();
  }

  async updateStatus(id: string, dto: UpdateContactStatusDto) {
    const contact = await this.contactModel.findByIdAndUpdate(
      id,
      { ...dto },
      { new: true },
    );
    if (!contact) throw new NotFoundException('Contact submission not found');
    return contact;
  }
}
