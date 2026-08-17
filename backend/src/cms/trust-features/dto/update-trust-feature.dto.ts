import { PartialType } from '@nestjs/mapped-types';
import { CreateTrustFeatureDto } from './create-trust-feature.dto';

export class UpdateTrustFeatureDto extends PartialType(CreateTrustFeatureDto) {}
