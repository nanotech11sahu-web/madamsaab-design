import { Controller, Get, ServiceUnavailableException } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

@Controller('health')
export class HealthController {
  constructor(@InjectConnection() private readonly connection: Connection) {}

  @Get()
  check() {
    const dbConnected = this.connection.readyState === 1;

    const payload = {
      status: dbConnected ? 'ok' : 'degraded',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      db: dbConnected ? 'connected' : 'disconnected',
    };

    if (!dbConnected) {
      throw new ServiceUnavailableException(payload);
    }
    return payload;
  }
}
