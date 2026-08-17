import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Staff, StaffDocument } from './schemas/staff.schema';
import { CreateStaffDto } from './dto/create-staff.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';

@Injectable()
export class StaffService {
  constructor(
    @InjectModel(Staff.name) private staffModel: Model<StaffDocument>,
  ) {}

  async findAllPublic() {
    return this.staffModel.find({ status: 'ACTIVE' }).sort({ name: 1 }).lean();
  }

  async findAllAdmin() {
    return this.staffModel.find().sort({ name: 1 }).lean();
  }

  async findOne(id: string) {
    const staff = await this.staffModel.findById(id).lean();
    if (!staff) throw new NotFoundException('Staff not found');
    return staff;
  }

  async create(dto: CreateStaffDto) {
    return this.staffModel.create(dto);
  }

  async update(id: string, dto: UpdateStaffDto) {
    const staff = await this.staffModel.findByIdAndUpdate(id, dto, {
      new: true,
    });
    if (!staff) throw new NotFoundException('Staff not found');
    return staff;
  }

  async remove(id: string) {
    const staff = await this.staffModel.findByIdAndDelete(id);
    if (!staff) throw new NotFoundException('Staff not found');
    return { deleted: true };
  }
}
