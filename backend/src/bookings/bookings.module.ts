import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Booking, BookingSchema } from './schemas/booking.schema';
import { Service, ServiceSchema } from '../services/schemas/service.schema';
import { Package, PackageSchema } from '../packages/schemas/package.schema';
import { Settings, SettingsSchema } from '../settings/schemas/settings.schema';
import { Staff, StaffSchema } from '../staff/schemas/staff.schema';
import { BookingsController } from './bookings.controller';
import { BookingsService } from './bookings.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Booking.name, schema: BookingSchema },
      { name: Service.name, schema: ServiceSchema },
      { name: Package.name, schema: PackageSchema },
      { name: Settings.name, schema: SettingsSchema },
      { name: Staff.name, schema: StaffSchema },
    ]),
  ],
  controllers: [BookingsController],
  providers: [BookingsService],
  exports: [BookingsService],
})
export class BookingsModule {}
