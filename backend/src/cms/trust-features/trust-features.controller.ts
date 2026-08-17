import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { TrustFeaturesService } from './trust-features.service';
import { CreateTrustFeatureDto } from './dto/create-trust-feature.dto';
import { UpdateTrustFeatureDto } from './dto/update-trust-feature.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@Controller('cms/trust-features')
export class TrustFeaturesController {
  constructor(private readonly trustFeaturesService: TrustFeaturesService) {}

  @Get()
  findAll(@Query('admin') admin?: string) {
    return admin === 'true'
      ? this.trustFeaturesService.findAllAdmin()
      : this.trustFeaturesService.findAllPublic();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.trustFeaturesService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Post()
  create(@Body() dto: CreateTrustFeatureDto) {
    return this.trustFeaturesService.create(dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateTrustFeatureDto) {
    return this.trustFeaturesService.update(id, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.trustFeaturesService.remove(id);
  }
}
