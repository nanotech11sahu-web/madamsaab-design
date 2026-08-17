import { Hero } from '@/components/home/Hero';
import { ServicesPricingGrid } from '@/components/home/ServicesPricingGrid';
import { PromoBanner } from '@/components/home/PromoBanner';
import { TrustFeatures } from '@/components/home/TrustFeatures';
import { ContactCTA } from '@/components/home/ContactCTA';
import { HowItWorks } from '@/components/home/HowItWorks';
import { Testimonials } from '@/components/home/Testimonials';
import { GallerySection } from '@/components/home/GallerySection';
import { IndulgeSection } from '@/components/home/IndulgeSection';
import { FullBleedImage } from '@/components/home/FullBleedImage';
import { Reveal } from '@/components/common/Reveal';

export function Home() {
  return (
    <div>
      <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
        <Hero />
      </div>

      <div className="mt-16 sm:mt-20">
        <IndulgeSection />
      </div>

      <div className="mx-auto max-w-7xl px-4 pb-12 pt-16 sm:px-6 sm:pt-20 lg:px-8">
        <Reveal>
          <ServicesPricingGrid />
        </Reveal>

        <Reveal delay={0.1} className="mt-12">
          <PromoBanner />
        </Reveal>

        <Reveal delay={0.1} className="mt-10 rounded-card border border-brand-border bg-white p-5 shadow-card">
          <TrustFeatures />
        </Reveal>

        <div className="mt-20">
          <HowItWorks />
        </div>
      </div>

      <div className="mt-20">
        <FullBleedImage />
      </div>

      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <GallerySection />

        <div className="mt-20">
          <Testimonials />
        </div>

        <Reveal className="mt-20">
          <ContactCTA />
        </Reveal>
      </div>
    </div>
  );
}
