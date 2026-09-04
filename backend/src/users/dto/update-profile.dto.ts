import { IsIn, IsOptional, IsString } from 'class-validator';

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  dateOfBirth?: string;

  @IsOptional()
  @IsIn(['FEMALE', 'MALE', 'OTHER'])
  gender?: string;

  @IsOptional()
  @IsString()
  profilePhoto?: string;
}
