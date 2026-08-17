import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HeroContent, HeroContentSchema } from './schemas/hero-content.schema';
import { HeroController } from './hero.controller';
import { HeroService } from './hero.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: HeroContent.name, schema: HeroContentSchema },
    ]),
  ],
  controllers: [HeroController],
  providers: [HeroService],
  exports: [HeroService],
})
export class HeroModule {}
