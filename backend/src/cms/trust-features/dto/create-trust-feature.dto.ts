import { IsIn, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateTrustFeatureDto {
  @IsString()
  icon: string;

  @IsString()
  label: string;

  @IsOptional()
  @IsNumber()
  sortOrder?: number;

  @IsOptional()
  @IsIn(['ACTIVE', 'INACTIVE'])
  status?: string;
}
