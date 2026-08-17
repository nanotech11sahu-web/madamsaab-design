import { Module } from '@nestjs/common';
import { HeroModule } from './hero/hero.module';
import { TestimonialsModule } from './testimonials/testimonials.module';
import { FaqModule } from './faq/faq.module';
import { TrustFeaturesModule } from './trust-features/trust-features.module';

@Module({
  imports: [HeroModule, TestimonialsModule, FaqModule, TrustFeaturesModule],
})
export class CmsModule {}
