import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Package, PackageDocument } from './schemas/package.schema';
import { CreatePackageDto } from './dto/create-package.dto';
import { UpdatePackageDto } from './dto/update-package.dto';
import { slugify } from '../common/utils/slugify';

@Injectable()
export class PackagesService {
  constructor(
    @InjectModel(Package.name) private packageModel: Model<PackageDocument>,
  ) {}

  async findAllPublic() {
    return this.packageModel
      .find({ status: 'ACTIVE' })
      .populate('services')
      .sort({ sortOrder: 1, createdAt: 1 })
      .lean();
  }

  async findAllAdmin() {
    return this.packageModel
      .find()
      .populate('services')
      .sort({ sortOrder: 1, createdAt: 1 })
      .lean();
  }

  async findBySlug(slug: string) {
    const pkg = await this.packageModel
      .findOne({ slug })
      .populate('services')
      .lean();
    if (!pkg) throw new NotFoundException('Package not found');
    return pkg;
  }

  async findByIds(ids: string[]) {
    return this.packageModel
      .find({ _id: { $in: ids }, status: 'ACTIVE' })
      .lean();
  }

  async create(dto: CreatePackageDto) {
    const slug = dto.slug ? slugify(dto.slug) : slugify(dto.name);
    return this.packageModel.create({ ...dto, slug });
  }

  async update(id: string, dto: UpdatePackageDto) {
    const update = { ...dto } as Record<string, unknown>;
    if (dto.slug) update.slug = slugify(dto.slug);
    const pkg = await this.packageModel.findByIdAndUpdate(id, update, {
      new: true,
    });
    if (!pkg) throw new NotFoundException('Package not found');
    return pkg;
  }

  async remove(id: string) {
    const pkg = await this.packageModel.findByIdAndDelete(id);
    if (!pkg) throw new NotFoundException('Package not found');
    return { deleted: true };
  }
}
