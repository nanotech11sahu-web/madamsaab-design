import { motion } from 'framer-motion';
import { ImageCarousel } from '@/components/common/ImageCarousel';
import { PopularServicesCard } from '@/components/services/PopularServicesCard';
import { BookingCTAButton } from '@/components/ui/BookingCTAButton';

const SLIDES = [
  {
    src: 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=1600&h=650&fit=crop&crop=faces&q=80&auto=format',
    alt: 'Professional hair styling service for a woman',
  },
  {
    src: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=1600&h=650&fit=crop&crop=faces&q=80&auto=format',
    alt: 'Facial and eyebrow treatment for a woman',
  },
  {
    src: 'https://images.unsplash.com/photo-1633681926022-84c23e8cb2d6?w=1600&h=650&fit=crop&q=80&auto=format',
    alt: "Premium women's salon interior",
  },
];

export function Hero() {
  return (
    <div className="relative">
      <ImageCarousel
        images={SLIDES}
        className="h-[420px] rounded-card shadow-card sm:h-[480px] lg:h-[600px]"
      >
        <div className="absolute inset-0 z-[5] flex flex-col justify-center px-6 sm:px-10 lg:px-14">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-pink-light/90 sm:text-sm"
          >
            Exclusively for Women
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-2 max-w-md text-3xl font-extrabold leading-tight text-white sm:text-4xl lg:text-5xl"
          >
            Women&apos;s Salon,
            <br />
            Delivered Home.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-3 max-w-sm text-sm text-white/85 sm:text-base"
          >
            Certified women professionals, premium products, and a hygienic
            experience — booked in seconds.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-6"
          >
            <BookingCTAButton />
          </motion.div>
        </div>
      </ImageCarousel>

      <div className="mt-4 sm:absolute sm:-bottom-10 sm:left-6 sm:right-6 sm:mt-0 lg:left-8 lg:right-8">
        <PopularServicesCard />
      </div>
    </div>
  );
}
