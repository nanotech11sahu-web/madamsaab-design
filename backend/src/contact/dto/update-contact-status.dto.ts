import { IsIn, IsOptional, IsString } from 'class-validator';

export class UpdateContactStatusDto {
  @IsIn(['NEW', 'READ', 'REPLIED', 'ARCHIVED'])
  status: string;

  @IsOptional()
  @IsString()
  adminNotes?: string;
}
