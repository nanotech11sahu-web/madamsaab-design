import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Service, ServiceDocument } from './schemas/service.schema';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { slugify } from '../common/utils/slugify';

@Injectable()
export class ServicesService {
  constructor(
    @InjectModel(Service.name) private serviceModel: Model<ServiceDocument>,
  ) {}

  async findAllPublic() {
    return this.serviceModel
      .find({ status: 'ACTIVE' })
      .sort({ sortOrder: 1, createdAt: 1 })
      .lean();
  }

  async findAllAdmin() {
    return this.serviceModel.find().sort({ sortOrder: 1, createdAt: 1 }).lean();
  }

  async findBySlug(slug: string) {
    const service = await this.serviceModel.findOne({ slug }).lean();
    if (!service) throw new NotFoundException('Service not found');
    return service;
  }

  async findByIds(ids: string[]) {
    return this.serviceModel
      .find({ _id: { $in: ids }, status: 'ACTIVE' })
      .lean();
  }

  async create(dto: CreateServiceDto) {
    const slug = dto.slug ? slugify(dto.slug) : slugify(dto.name);
    return this.serviceModel.create({ ...dto, slug });
  }

  async update(id: string, dto: UpdateServiceDto) {
    const update = { ...dto } as Record<string, unknown>;
    if (dto.slug) update.slug = slugify(dto.slug);
    const service = await this.serviceModel.findByIdAndUpdate(id, update, {
      new: true,
    });
    if (!service) throw new NotFoundException('Service not found');
    return service;
  }

  async remove(id: string) {
    const service = await this.serviceModel.findByIdAndDelete(id);
    if (!service) throw new NotFoundException('Service not found');
    return { deleted: true };
  }
}
