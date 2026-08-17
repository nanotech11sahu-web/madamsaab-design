import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CloudinaryProvider } from './cloudinary.provider';

@Injectable()
export class MediaService {
  constructor(
    private readonly cloudinaryProvider: CloudinaryProvider,
    private readonly configService: ConfigService,
  ) {}

  async upload(buffer: Buffer, folder: string) {
    this.assertConfigured();

    try {
      return await this.cloudinaryProvider.uploadBuffer(buffer, folder);
    } catch (err) {
      if (this.isCloudinaryConfigError(err)) {
        throw new BadRequestException(
          'Cloudinary is not configured — set real credentials in backend/.env',
        );
      }
      throw err;
    }
  }

  private assertConfigured() {
    const cloudName = this.configService.get<string>('CLOUDINARY_CLOUD_NAME');
    const apiKey = this.configService.get<string>('CLOUDINARY_API_KEY');
    const apiSecret = this.configService.get<string>('CLOUDINARY_API_SECRET');

    if (
      !cloudName ||
      !apiKey ||
      !apiSecret ||
      cloudName === 'change_me' ||
      apiKey === 'change_me' ||
      apiSecret === 'change_me'
    ) {
      throw new BadRequestException(
        'Cloudinary is not configured — set real credentials in backend/.env',
      );
    }
  }

  private isCloudinaryConfigError(err: unknown): boolean {
    if (!err || typeof err !== 'object') return false;
    const message = (err as { message?: string }).message ?? '';
    return (
      message.toLowerCase().includes('cloud_name') ||
      message.toLowerCase().includes('api_key') ||
      message.toLowerCase().includes('api_secret') ||
      message.toLowerCase().includes('invalid') ||
      message.toLowerCase().includes('must supply')
    );
  }
}
