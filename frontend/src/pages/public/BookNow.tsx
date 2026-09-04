import { useState } from 'react';
import { Home, Store, ArrowRight, Sparkles } from 'lucide-react';
import { useServices, usePackages } from '@/hooks/useServices';
import { ServicePriceCard } from '@/components/services/ServicePriceCard';
import { PackageCard } from '@/components/services/PackageCard';
import { PageBanner } from '@/components/common/PageBanner';
import { SEO } from '@/components/common/SEO';
import { useBookingStore, type ServiceMode } from '@/store/bookingStore';
import { cn } from '@/lib/cn';

type Tab = 'SERVICES' | 'PACKAGES';

function ModeSelect({ onSelect }: { onSelect: (mode: ServiceMode) => void }) {
  return (
    <div>
      <SEO
        title="Book Now"
        description="Choose home service or a salon visit, then pick your services and packages."
      />
      <PageBanner
        eyebrow="Book Now"
        title="How Would You Like Your Service?"
        description="Choose home service or a salon visit — we'll show you services available for that option."
        image="https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=1600&q=80&auto=format&fit=crop"
      />
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-5 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => onSelect('HOME')}
            className="group relative flex flex-col items-center gap-4 overflow-hidden rounded-card border border-brand-border bg-white p-8 text-center shadow-card transition hover:-translate-y-1 hover:border-brand-pink hover:shadow-card-hover"
          >
            <span className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-brand-pink to-brand-pink-dark text-white shadow-lg shadow-brand-pink/30 transition-transform group-hover:scale-110">
              <Home size={34} strokeWidth={2} />
            </span>
            <div>
              <span className="text-xl font-extrabold text-brand-navy">At Home</span>
              <p className="mt-1.5 text-sm text-brand-navy/60">
                Our professional comes to your doorstep at a time that suits you.
              </p>
            </div>
          </button>
          <button
            type="button"
            onClick={() => onSelect('SALON')}
            className="group relative flex flex-col items-center gap-4 overflow-hidden rounded-card border border-brand-border bg-white p-8 text-center shadow-card transition hover:-translate-y-1 hover:border-brand-pink hover:shadow-card-hover"
          >
            <span className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-brand-blue to-brand-navy text-white shadow-lg shadow-brand-navy/30 transition-transform group-hover:scale-110">
              <Store size={34} strokeWidth={2} />
            </span>
            <div>
              <span className="text-xl font-extrabold text-brand-navy">At Salon</span>
              <p className="mt-1.5 text-sm text-brand-navy/60">
                Visit our salon and enjoy the full in-studio experience.
              </p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

export function BookNow() {
  const [tab, setTab] = useState<Tab>('SERVICES');
  const serviceMode = useBookingStore((s) => s.serviceMode);
  const setServiceMode = useBookingStore((s) => s.setServiceMode);
  const changeServiceMode = useBookingStore((s) => s.changeServiceMode);
  const itemCount = useBookingStore((s) => s.itemCount());

  const { data: services, isLoading: loadingServices } = useServices();
  const { data: packages, isLoading: loadingPackages } = usePackages();

  if (!serviceMode) {
    return <ModeSelect onSelect={setServiceMode} />;
  }

  const availableServices = (services ?? []).filter((s) =>
    serviceMode === 'HOME' ? s.homeServiceAvailable : s.salonServiceAvailable,
  );
  const categories = Array.from(new Set(availableServices.map((s) => s.category)));

  const handleSwitchMode = (mode: ServiceMode) => {
    if (mode === serviceMode) return;
    if (itemCount > 0) {
      const confirmed = window.confirm(
        'Switching mode will clear your current selection. Continue?',
      );
      if (!confirmed) return;
    }
    changeServiceMode(mode);
  };

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
          <div className="flex overflow-hidden rounded-pill bg-brand-pink-bg p-1">
            <button
              type="button"
              onClick={() => handleSwitchMode('HOME')}
              className={cn(
                'flex items-center gap-2 rounded-pill px-4 py-2 text-sm font-semibold transition',
                serviceMode === 'HOME'
                  ? 'bg-brand-pink text-white shadow-sm'
                  : 'text-brand-navy/60 hover:text-brand-navy',
              )}
            >
              <span
                className={cn(
                  'flex h-6 w-6 items-center justify-center rounded-full',
                  serviceMode === 'HOME' ? 'bg-white/20' : 'bg-white text-brand-pink',
                )}
              >
                <Home size={13} />
              </span>
              At Home
            </button>
            <button
              type="button"
              onClick={() => handleSwitchMode('SALON')}
              className={cn(
                'flex items-center gap-2 rounded-pill px-4 py-2 text-sm font-semibold transition',
                serviceMode === 'SALON'
                  ? 'bg-brand-pink text-white shadow-sm'
                  : 'text-brand-navy/60 hover:text-brand-navy',
              )}
            >
              <span
                className={cn(
                  'flex h-6 w-6 items-center justify-center rounded-full',
                  serviceMode === 'SALON' ? 'bg-white/20' : 'bg-white text-brand-pink',
                )}
              >
                <Store size={13} />
              </span>
              At Salon
            </button>
          </div>

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
