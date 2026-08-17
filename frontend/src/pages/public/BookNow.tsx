import { useState } from 'react';
import { useServices, usePackages } from '@/hooks/useServices';
import { ServicePriceCard } from '@/components/services/ServicePriceCard';
import { PackageCard } from '@/components/services/PackageCard';
import { PageBanner } from '@/components/common/PageBanner';
import { SEO } from '@/components/common/SEO';
import { cn } from '@/lib/cn';

type Tab = 'SERVICES' | 'PACKAGES';

export function BookNow() {
  const [tab, setTab] = useState<Tab>('SERVICES');
  const { data: services, isLoading: loadingServices } = useServices();
  const { data: packages, isLoading: loadingPackages } = usePackages();

  const categories = Array.from(new Set((services ?? []).map((s) => s.category)));

  return (
    <div>
      <SEO
        title="Book Now"
        description="Choose your services and packages, then confirm your booking on WhatsApp in seconds."
      />
      <PageBanner
        eyebrow="Book Now"
        title="Choose Your Services & Packages"
        description="Pick anything you like — mix individual services with combo packages. You'll review everything before confirming on WhatsApp."
        image="https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=1600&q=80&auto=format&fit=crop"
      />

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto flex w-fit rounded-pill border border-brand-border bg-white p-1 shadow-card">
          <button
            type="button"
            onClick={() => setTab('SERVICES')}
            className={cn(
              'rounded-pill px-6 py-2 text-sm font-semibold transition',
              tab === 'SERVICES' ? 'bg-brand-pink text-white' : 'text-brand-navy/60',
            )}
          >
            Services
          </button>
          <button
            type="button"
            onClick={() => setTab('PACKAGES')}
            className={cn(
              'rounded-pill px-6 py-2 text-sm font-semibold transition',
              tab === 'PACKAGES' ? 'bg-brand-pink text-white' : 'text-brand-navy/60',
            )}
          >
            Packages
          </button>
        </div>

        {tab === 'SERVICES' && (
          <div className="mt-10">
            {loadingServices && (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="h-32 animate-pulse rounded-card bg-brand-pink-light" />
                ))}
              </div>
            )}
            {categories.map((category) => (
              <div key={category} className="mb-10">
                <h2 className="mb-4 text-lg font-bold text-brand-navy">{category}</h2>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                  {services
                    ?.filter((s) => s.category === category)
                    .map((service) => <ServicePriceCard key={service._id} service={service} />)}
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === 'PACKAGES' && (
          <div className="mt-10">
            {loadingPackages && (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-64 animate-pulse rounded-card bg-brand-pink-light" />
                ))}
              </div>
            )}
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {packages?.map((pkg) => <PackageCard key={pkg._id} pkg={pkg} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
