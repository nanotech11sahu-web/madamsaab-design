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
import { HeroContent, HeroContentDocument } from './cms/hero/schemas/hero-content.schema';
import { Testimonial, TestimonialDocument } from './cms/testimonials/schemas/testimonial.schema';
import { Faq, FaqDocument } from './cms/faq/schemas/faq.schema';
import { TrustFeature, TrustFeatureDocument } from './cms/trust-features/schemas/trust-feature.schema';

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
  const heroModel = app.get<Model<HeroContentDocument>>(
    getModelToken(HeroContent.name),
  );
  const testimonialModel = app.get<Model<TestimonialDocument>>(
    getModelToken(Testimonial.name),
  );
  const faqModel = app.get<Model<FaqDocument>>(getModelToken(Faq.name));
  const trustFeatureModel = app.get<Model<TrustFeatureDocument>>(
    getModelToken(TrustFeature.name),
  );

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

  console.log('Seeding hero content...');
  await heroModel.findOneAndUpdate(
    {},
    {
      heading: "Women's Salon, Delivered Home.",
      subheading:
        'Certified women professionals, premium products, and a hygienic experience — booked in seconds.',
      ctaText: 'BOOK NOW',
      ctaLink: '/book',
      image: '',
    },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  );
  console.log('  hero content upserted');

  console.log('Seeding testimonials...');
  const testimonials = [
    {
      name: 'Priya S.',
      rating: 5,
      text: 'The at-home facial was so relaxing and the professional was right on time. Booking on WhatsApp made everything so easy!',
      sortOrder: 1,
    },
    {
      name: 'Ananya R.',
      rating: 5,
      text: 'Loved my bridal makeup trial. Premium products, super hygienic, and the artist was incredibly talented.',
      sortOrder: 2,
    },
    {
      name: 'Kavya M.',
      rating: 4,
      text: 'Quick and convenient haircut at home. Will definitely book the Glow Package next time.',
      sortOrder: 3,
    },
    {
      name: 'Riya T.',
      rating: 5,
      text: 'Eyebrow threading and cleanup were done so neatly. Feels like a proper salon experience at home.',
      sortOrder: 4,
    },
  ];
  for (const t of testimonials) {
    await testimonialModel.findOneAndUpdate(
      { name: t.name },
      t,
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );
    console.log(`  upserted testimonial: ${t.name}`);
  }

  console.log('Seeding FAQs...');
  const faqs = [
    {
      question: 'How do I book an appointment?',
      answer:
        'Simply select the services or packages you want, choose a date and time, and confirm your booking. You will be redirected to WhatsApp to complete the confirmation with our team.',
      category: 'Booking',
      sortOrder: 1,
    },
    {
      question: 'How do I pay for my booking?',
      answer:
        'Payments are confirmed over WhatsApp after your booking request is submitted. We accept UPI, cards, and cash on service depending on availability.',
      category: 'Payments',
      sortOrder: 2,
    },
    {
      question: 'Can I cancel or reschedule my appointment?',
      answer:
        'Yes, you can cancel or reschedule by messaging us on WhatsApp at least a few hours before your scheduled appointment time.',
      category: 'Cancellation',
      sortOrder: 3,
    },
    {
      question: 'Do you provide services at home?',
      answer:
        'Yes, most of our services are available at your home within our serviceable areas. A small home service fee applies and is shown at checkout.',
      category: 'Home Service',
      sortOrder: 4,
    },
    {
      question: 'What safety and hygiene practices do you follow?',
      answer:
        'All our professionals use sanitized tools and premium, hygienic products. Fresh disposable essentials are used wherever applicable for every appointment.',
      category: 'Hygiene',
      sortOrder: 5,
    },
    {
      question: 'How is pricing determined for services and packages?',
      answer:
        'Each service is individually priced and shown upfront. Packages bundle multiple services together at a discounted combined price compared to booking them separately.',
      category: 'Pricing',
      sortOrder: 6,
    },
    {
      question: 'Are your beauty professionals verified?',
      answer:
        'Yes, every professional on our platform is background-verified, trained, and experienced in delivering a premium salon experience.',
      category: 'General',
      sortOrder: 7,
    },
  ];
  for (const f of faqs) {
    await faqModel.findOneAndUpdate(
      { question: f.question },
      f,
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );
    console.log(`  upserted FAQ: ${f.question}`);
  }

  console.log('Seeding trust features...');
  const trustFeatures = [
    { icon: 'ShieldCheck', label: '100% Hygienic', sortOrder: 1 },
    { icon: 'BadgeCheck', label: 'Verified Professionals', sortOrder: 2 },
    { icon: 'Sparkles', label: 'Premium Products', sortOrder: 3 },
    { icon: 'Clock', label: 'On-time Service', sortOrder: 4 },
  ];
  for (const tf of trustFeatures) {
    await trustFeatureModel.findOneAndUpdate(
      { label: tf.label },
      tf,
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );
    console.log(`  upserted trust feature: ${tf.label}`);
  }

  console.log('Seeding superadmin user...');
  const adminPasswordHash = await bcrypt.hash('jyotsna@2002', 10);
  const existingAdmin = await userModel.findOne({
    $or: [{ username: 'jyotsna04' }, { email: 'admin@madamsaab.com' }],
  });
  if (existingAdmin) {
    existingAdmin.name = 'Jyotsna';
    existingAdmin.phone = existingAdmin.phone || '9999999999';
    existingAdmin.role = 'ADMIN';
    existingAdmin.username = 'jyotsna04';
    existingAdmin.password = adminPasswordHash;
    await existingAdmin.save();
  } else {
    await userModel.create({
      name: 'Jyotsna',
      email: 'admin@madamsaab.com',
      phone: '9999999999',
      role: 'ADMIN',
      username: 'jyotsna04',
      password: adminPasswordHash,
    });
  }
  console.log('Seeded superadmin user: jyotsna04 / jyotsna@2002');

  console.log('Seed complete.');
  await app.close();
}

seed()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Seed failed:', err);
    process.exit(1);
  });
