import {
  BadRequestException,
  Body,
  Controller,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MediaService } from './media.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

const DEFAULT_FOLDER = 'madamsaab';

@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @UseGuards(JwtAuthGuard)
  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
  async upload(
    @UploadedFile() file: Express.Multer.File,
    @Query('folder') folderQuery?: string,
    @Body('folder') folderBody?: string,
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }
    if (!file.mimetype || !file.mimetype.startsWith('image/')) {
      throw new BadRequestException('Only image files are allowed');
    }

    const rawFolder = folderQuery || folderBody || DEFAULT_FOLDER;
    const folder = this.sanitizeFolder(rawFolder);

    return this.mediaService.upload(file.buffer, folder);
  }

  private sanitizeFolder(folder: string): string {
    const sanitized = folder.replace(/[^a-zA-Z0-9\-/]/g, '');
    return sanitized || DEFAULT_FOLDER;
  }
}
