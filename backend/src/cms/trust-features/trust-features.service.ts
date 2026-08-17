import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TrustFeature, TrustFeatureDocument } from './schemas/trust-feature.schema';
import { CreateTrustFeatureDto } from './dto/create-trust-feature.dto';
import { UpdateTrustFeatureDto } from './dto/update-trust-feature.dto';

@Injectable()
export class TrustFeaturesService {
  constructor(
    @InjectModel(TrustFeature.name)
    private trustFeatureModel: Model<TrustFeatureDocument>,
  ) {}

  async findAllPublic() {
    return this.trustFeatureModel
      .find({ status: 'ACTIVE' })
      .sort({ sortOrder: 1, createdAt: 1 })
      .lean();
  }

  async findAllAdmin() {
    return this.trustFeatureModel
      .find()
      .sort({ sortOrder: 1, createdAt: 1 })
      .lean();
  }

  async findOne(id: string) {
    const feature = await this.trustFeatureModel.findById(id).lean();
    if (!feature) throw new NotFoundException('Trust feature not found');
    return feature;
  }

  async create(dto: CreateTrustFeatureDto) {
    return this.trustFeatureModel.create(dto);
  }

  async update(id: string, dto: UpdateTrustFeatureDto) {
    const feature = await this.trustFeatureModel.findByIdAndUpdate(id, dto, {
      new: true,
    });
    if (!feature) throw new NotFoundException('Trust feature not found');
    return feature;
  }

  async remove(id: string) {
    const feature = await this.trustFeatureModel.findByIdAndDelete(id);
    if (!feature) throw new NotFoundException('Trust feature not found');
    return { deleted: true };
  }
}
