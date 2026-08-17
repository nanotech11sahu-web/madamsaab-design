import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { HeroService } from './hero.service';
import { UpdateHeroDto } from './dto/update-hero.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@Controller('cms/hero')
export class HeroController {
  constructor(private readonly heroService: HeroService) {}

  @Get()
  get() {
    return this.heroService.get();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Patch()
  update(@Body() dto: UpdateHeroDto) {
    return this.heroService.update(dto);
  }
}
