import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TrustFeature, TrustFeatureSchema } from './schemas/trust-feature.schema';
import { TrustFeaturesController } from './trust-features.controller';
import { TrustFeaturesService } from './trust-features.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TrustFeature.name, schema: TrustFeatureSchema },
    ]),
  ],
  controllers: [TrustFeaturesController],
  providers: [TrustFeaturesService],
  exports: [TrustFeaturesService],
})
export class TrustFeaturesModule {}
