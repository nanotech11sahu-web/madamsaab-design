import { usePackages } from '@/hooks/useServices';
import { PackageCard } from '@/components/services/PackageCard';
import { PageBanner } from '@/components/common/PageBanner';
import { Reveal } from '@/components/common/Reveal';
import { TrustFeatures } from '@/components/home/TrustFeatures';
import { ContactCTA } from '@/components/home/ContactCTA';
import { SEO } from '@/components/common/SEO';
import { ModeSelectGate } from '@/components/booking/ModeSelectGate';
import { ModeTogglePill } from '@/components/booking/ModeTogglePill';
import { useBookingStore } from '@/store/bookingStore';

export function Packages() {
  const { data: packages, isLoading } = usePackages();
  const serviceMode = useBookingStore((s) => s.serviceMode);
  const setServiceMode = useBookingStore((s) => s.setServiceMode);

  if (!serviceMode) {
    return <ModeSelectGate onSelect={setServiceMode} seoTitle="Combo Packages" />;
  }

  return (
    <div>
      <SEO
        title="Combo Packages"
        description="Save with bundled salon service packages — facial, cleanup, hair spa, bridal-ready and more. Book instantly on WhatsApp."
      />
      <PageBanner
        eyebrow="Our Packages"
        title="Combo Packages, Special Prices"
        description="Bundled services at a special price. Select one or more."
        image="https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=1600&q=80&auto=format&fit=crop"
      />

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <ModeTogglePill className="mb-8" />

        {isLoading && (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-64 animate-pulse rounded-card bg-brand-pink-light" />
            ))}
          </div>
        )}

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {packages?.map((pkg) => <PackageCard key={pkg._id} pkg={pkg} />)}
        </div>

        <Reveal className="mt-16 rounded-card border border-brand-border bg-white p-5 shadow-card">
          <TrustFeatures />
        </Reveal>

        <Reveal className="mt-10">
          <ContactCTA />
        </Reveal>
      </div>
    </div>
  );
}
