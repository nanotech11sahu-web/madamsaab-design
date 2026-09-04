import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findByEmail(email: string, withPassword = false) {
    const query = this.userModel.findOne({ email: email.toLowerCase() });
    if (withPassword) query.select('+password');
    return query.exec();
  }

  async findByIdentifier(identifier: string, withPassword = false) {
    const query = this.userModel.findOne({
      $or: [{ email: identifier.toLowerCase() }, { username: identifier }],
    });
    if (withPassword) query.select('+password');
    return query.exec();
  }

  async findAllCustomers(params: { search?: string; page?: number; limit?: number }) {
    const page = Math.max(1, params.page ?? 1);
    const limit = Math.min(100, Math.max(1, params.limit ?? 20));
    const filter: Record<string, unknown> = { role: 'CUSTOMER' };

    if (params.search) {
      const regex = new RegExp(params.search, 'i');
      filter.$or = [{ name: regex }, { email: regex }, { phone: regex }];
    }

    const [items, total] = await Promise.all([
      this.userModel
        .find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      this.userModel.countDocuments(filter),
    ]);

    return { items, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findById(id: string) {
    return this.userModel.findById(id).exec();
  }

  async findByIdWithRefreshHash(id: string) {
    return this.userModel.findById(id).select('+refreshTokenHash').exec();
  }

  async create(data: {
    name: string;
    email: string;
    phone: string;
    password: string;
    role?: string;
  }) {
    return this.userModel.create({
      ...data,
      email: data.email.toLowerCase(),
    });
  }

  async updateRefreshTokenHash(id: string, hash: string | null) {
    const user = await this.userModel.findByIdAndUpdate(
      id,
      { refreshTokenHash: hash },
      { new: true },
    );
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async getProfile(id: string) {
    const user = await this.userModel.findById(id).exec();
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async updateProfile(id: string, dto: UpdateProfileDto) {
    const user = await this.userModel.findByIdAndUpdate(
      id,
      { $set: dto },
      { new: true },
    );
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async addAddress(id: string, dto: CreateAddressDto) {
    const user = await this.userModel.findById(id).exec();
    if (!user) throw new NotFoundException('User not found');

    if (dto.isDefault) {
      user.addresses.forEach((addr) => {
        addr.isDefault = false;
      });
    }

    user.addresses.push({
      label: dto.label,
      line1: dto.line1,
      line2: dto.line2 ?? '',
      city: dto.city,
      state: dto.state,
      pincode: dto.pincode,
      isDefault: dto.isDefault ?? false,
    });

    await user.save();
    return user;
  }

  async updateAddress(id: string, index: number, dto: UpdateAddressDto) {
    const user = await this.userModel.findById(id).exec();
    if (!user) throw new NotFoundException('User not found');

    if (index < 0 || index >= user.addresses.length) {
      throw new NotFoundException('Address not found');
    }

    if (dto.isDefault) {
      user.addresses.forEach((addr) => {
        addr.isDefault = false;
      });
    }

    const address = user.addresses[index];
    if (dto.label !== undefined) address.label = dto.label;
    if (dto.line1 !== undefined) address.line1 = dto.line1;
    if (dto.line2 !== undefined) address.line2 = dto.line2;
    if (dto.city !== undefined) address.city = dto.city;
    if (dto.state !== undefined) address.state = dto.state;
    if (dto.pincode !== undefined) address.pincode = dto.pincode;
    if (dto.isDefault !== undefined) address.isDefault = dto.isDefault;

    await user.save();
    return user;
  }

  async removeAddress(id: string, index: number) {
    const user = await this.userModel.findById(id).exec();
    if (!user) throw new NotFoundException('User not found');

    if (index < 0 || index >= user.addresses.length) {
      throw new NotFoundException('Address not found');
    }

    user.addresses.splice(index, 1);
    await user.save();
    return user;
  }

  static parseIndex(raw: string): number {
    const index = parseInt(raw, 10);
    if (isNaN(index)) {
      throw new BadRequestException('Invalid address index');
    }
    return index;
  }
}
