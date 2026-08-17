import { NestFactory } from '@nestjs/core';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { AppModule } from './app.module';
import { Service, ServiceDocument } from './services/schemas/service.schema';
import { Package, PackageDocument } from './packages/schemas/package.schema';
import { Settings, SettingsDocument } from './settings/schemas/settings.schema';
import { User, UserDocument } from './users/schemas/user.schema';
import { slugify } from './common/utils/slugify';

const SERVICES = [
  {
    name: 'Haircut',
    price: 199,
    category: 'Hair',
    duration: 30,
    homeServiceAvailable: true,
  },
  {
    name: 'Facial',
    price: 499,
    category: 'Skin',
    duration: 45,
  },
  {
    name: 'Cleanup',
    price: 299,
    category: 'Skin',
    duration: 30,
  },
  {
    name: 'Waxing',
    price: 249,
    category: 'Body',
    duration: 30,
    shortDescription: 'Full Arms',
  },
  {
    name: 'Hair Spa',
    price: 399,
    category: 'Hair',
    duration: 60,
  },
  {
    name: 'Korean Glow Facial',
    price: 899,
    category: 'Skin',
    duration: 60,
    featured: true,
  },
  {
    name: 'Bridal Makeup',
    price: 2299,
    category: 'Makeup',
    duration: 120,
    featured: true,
  },
  {
    name: 'Nail Extension',
    price: 699,
    category: 'Nails',
    duration: 45,
  },
];

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const serviceModel = app.get<Model<ServiceDocument>>(
    getModelToken(Service.name),
  );
  const packageModel = app.get<Model<PackageDocument>>(
    getModelToken(Package.name),
  );
  const settingsModel = app.get<Model<SettingsDocument>>(
    getModelToken(Settings.name),
  );
  const userModel = app.get<Model<UserDocument>>(getModelToken(User.name));

  console.log('Seeding services...');
  const serviceDocs: Record<string, ServiceDocument> = {};
  for (const svc of SERVICES) {
    const slug = slugify(svc.name);
    const doc = await serviceModel.findOneAndUpdate(
      { slug },
      { ...svc, slug },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );
    serviceDocs[svc.name] = doc;
    console.log(`  upserted service: ${svc.name}`);
  }

  console.log('Seeding packages...');
  const packages = [
    {
      name: 'Glow Package',
      description: 'Facial, Cleanup and Hair Spa combo for a fresh glow.',
      shortDescription: 'Facial + Cleanup + Hair Spa',
      services: ['Facial', 'Cleanup', 'Hair Spa'],
      packagePrice: 999,
      originalPrice: 1197,
      duration: 135,
    },
    {
      name: 'Bridal Ready Package',
      description: 'Everything you need to look your best on the big day.',
      shortDescription: 'Bridal Makeup + Facial + Hair Spa',
      services: ['Bridal Makeup', 'Facial', 'Hair Spa'],
      packagePrice: 2999,
      originalPrice: 3597,
      duration: 225,
    },
    {
      name: 'Quick Refresh Package',
      description: 'Haircut and Waxing for a quick touch-up.',
      shortDescription: 'Haircut + Waxing',
      services: ['Haircut', 'Waxing'],
      packagePrice: 399,
      originalPrice: 448,
      duration: 60,
    },
  ];

  for (const pkg of packages) {
    const slug = slugify(pkg.name);
    const serviceIds = pkg.services
      .map((name) => serviceDocs[name]?._id)
      .filter(Boolean);
    await packageModel.findOneAndUpdate(
      { slug },
      {
        name: pkg.name,
        slug,
        description: pkg.description,
        shortDescription: pkg.shortDescription,
        services: serviceIds,
        packagePrice: pkg.packagePrice,
        originalPrice: pkg.originalPrice,
        duration: pkg.duration,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );
    console.log(`  upserted package: ${pkg.name}`);
  }

  console.log('Seeding settings...');
  await settingsModel.findOneAndUpdate(
    {},
    {
      businessName: 'MadamSaab',
      homeServiceFee: 99,
      whatsappNumber: process.env.WHATSAPP_NUMBER || '919999999999',
      openingTime: '09:00',
      closingTime: '20:00',
      workingDays: ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'],
    },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  );
  console.log('  settings upserted');

  console.log('Seeding admin user...');
  const adminPasswordHash = await bcrypt.hash('Admin@123', 10);
  await userModel.findOneAndUpdate(
    { email: 'admin@madamsaab.com' },
    {
      $set: {
        name: 'Admin',
        phone: '9999999999',
        role: 'ADMIN',
      },
      $setOnInsert: {
        email: 'admin@madamsaab.com',
        password: adminPasswordHash,
      },
    },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  );
  console.log('Seeded admin user: admin@madamsaab.com / Admin@123');

  console.log('Seed complete.');
  await app.close();
}

seed()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Seed failed:', err);
    process.exit(1);
  });
