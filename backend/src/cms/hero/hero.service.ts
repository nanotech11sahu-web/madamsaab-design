import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { HeroContent, HeroContentDocument } from './schemas/hero-content.schema';
import { UpdateHeroDto } from './dto/update-hero.dto';

const DEFAULTS = {
  heading: "Women's Salon, Delivered Home.",
  subheading:
    'Certified women professionals, premium products, and a hygienic experience — booked in seconds.',
  image: '',
  ctaText: 'Book Now',
  ctaLink: '/book',
};

@Injectable()
export class HeroService {
  constructor(
    @InjectModel(HeroContent.name)
    private heroModel: Model<HeroContentDocument>,
  ) {}

  async get() {
    let hero = await this.heroModel.findOne();
    if (!hero) {
      hero = await this.heroModel.create(DEFAULTS);
    }
    return hero;
  }

  async update(dto: UpdateHeroDto) {
    const hero = await this.heroModel.findOneAndUpdate({}, dto, {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true,
    });
    return hero;
  }
}
