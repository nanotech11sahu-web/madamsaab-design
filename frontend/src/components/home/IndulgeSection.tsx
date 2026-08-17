import { Link } from 'react-router-dom';
import { Reveal } from '@/components/common/Reveal';

export function IndulgeSection() {
  return (
    <section className="bg-brand-pink-bg">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-20">
        <Reveal direction="right">
          <h2 className="text-3xl font-extrabold leading-tight text-brand-navy sm:text-4xl">
            Indulge in the Extraordinary
          </h2>
          <p className="mt-5 max-w-lg text-brand-navy/70">
            MadamSaab brings certified women professionals, premium products, and
            hygienic practices to your doorstep. From everyday grooming to
            bridal transformations, every appointment is crafted around you —
            booked in seconds, delivered with genuine care.
          </p>
          <Link
            to="/about"
            className="mt-6 inline-block rounded-pill border border-brand-navy px-6 py-2.5 text-sm font-semibold text-brand-navy transition hover:bg-brand-navy hover:text-white"
          >
            Discover More
          </Link>
        </Reveal>

        <Reveal direction="left" delay={0.1} className="overflow-hidden rounded-card shadow-card">
          <img
            src="https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=900&h=1100&fit=crop&crop=faces&q=80&auto=format"
            alt="Professional hair styling for a woman"
            className="h-80 w-full object-cover sm:h-[420px]"
          />
        </Reveal>
      </div>
    </section>
  );
}
