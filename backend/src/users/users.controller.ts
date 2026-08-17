import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import { UsersService } from './users.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

interface AuthenticatedRequest extends Request {
  user: { userId: string; email: string; role: string };
}

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getMe(@Req() req: AuthenticatedRequest) {
    return this.usersService.getProfile(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me')
  updateMe(@Req() req: AuthenticatedRequest, @Body() dto: UpdateProfileDto) {
    return this.usersService.updateProfile(req.user.userId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('me/addresses')
  addAddress(
    @Req() req: AuthenticatedRequest,
    @Body() dto: CreateAddressDto,
  ) {
    return this.usersService.addAddress(req.user.userId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me/addresses/:index')
  updateAddress(
    @Req() req: AuthenticatedRequest,
    @Param('index') index: string,
    @Body() dto: UpdateAddressDto,
  ) {
    return this.usersService.updateAddress(
      req.user.userId,
      UsersService.parseIndex(index),
      dto,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Delete('me/addresses/:index')
  removeAddress(
    @Req() req: AuthenticatedRequest,
    @Param('index') index: string,
  ) {
    return this.usersService.removeAddress(
      req.user.userId,
      UsersService.parseIndex(index),
    );
  }
}
