import { useState } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useServices, usePackages } from '@/hooks/useServices';
import { ServicePriceCard } from '@/components/services/ServicePriceCard';
import { PackageCard } from '@/components/services/PackageCard';
import { PageBanner } from '@/components/common/PageBanner';
import { SEO } from '@/components/common/SEO';
import { ModeSelectGate } from '@/components/booking/ModeSelectGate';
import { ModeTogglePill } from '@/components/booking/ModeTogglePill';
import { useBookingStore } from '@/store/bookingStore';
import { cn } from '@/lib/cn';

type Tab = 'SERVICES' | 'PACKAGES';

export function BookNow() {
  const [tab, setTab] = useState<Tab>('SERVICES');
  const serviceMode = useBookingStore((s) => s.serviceMode);
  const setServiceMode = useBookingStore((s) => s.setServiceMode);

  const { data: services, isLoading: loadingServices } = useServices();
  const { data: packages, isLoading: loadingPackages } = usePackages();

  if (!serviceMode) {
    return <ModeSelectGate onSelect={setServiceMode} />;
  }

  const availableServices = (services ?? []).filter((s) =>
    serviceMode === 'HOME' ? s.homeServiceAvailable : s.salonServiceAvailable,
  );
  const categories = Array.from(new Set(availableServices.map((s) => s.category)));

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
        <div className="flex flex-col gap-4 rounded-card border border-brand-border bg-white p-3 shadow-card sm:flex-row sm:items-center sm:justify-between">
          <ModeTogglePill />

          <div className="flex overflow-hidden rounded-pill border border-brand-border p-1">
            <button
              type="button"
              onClick={() => setTab('SERVICES')}
              className={cn(
                'flex items-center gap-1.5 rounded-pill px-5 py-2 text-sm font-semibold transition',
                tab === 'SERVICES' ? 'bg-brand-navy text-white' : 'text-brand-navy/60',
              )}
            >
              <Sparkles size={13} /> Services
            </button>
            <button
              type="button"
              onClick={() => setTab('PACKAGES')}
              className={cn(
                'flex items-center gap-1.5 rounded-pill px-5 py-2 text-sm font-semibold transition',
                tab === 'PACKAGES' ? 'bg-brand-navy text-white' : 'text-brand-navy/60',
              )}
            >
              <ArrowRight size={13} /> Packages
            </button>
          </div>
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
            {!loadingServices && categories.length === 0 && (
              <p className="py-10 text-center text-sm text-brand-navy/60">
                No services are currently available for {serviceMode === 'HOME' ? 'home service' : 'salon visits'}.
              </p>
            )}
            {categories.map((category) => (
              <div key={category} className="mb-10">
                <h2 className="mb-4 text-lg font-bold text-brand-navy">{category}</h2>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                  {availableServices
                    .filter((s) => s.category === category)
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
