import { usePackages } from '@/hooks/useServices';
import { PackageCard } from '@/components/services/PackageCard';
import { PageBanner } from '@/components/common/PageBanner';
import { Reveal } from '@/components/common/Reveal';
import { TrustFeatures } from '@/components/home/TrustFeatures';
import { ContactCTA } from '@/components/home/ContactCTA';

export function Packages() {
  const { data: packages, isLoading } = usePackages();

  return (
    <div>
      <PageBanner
        eyebrow="Our Packages"
        title="Combo Packages, Special Prices"
        description="Bundled services at a special price. Select one or more."
        image="https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=1600&q=80&auto=format&fit=crop"
      />

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
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
