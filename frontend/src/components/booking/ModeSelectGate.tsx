import { Home, Store } from 'lucide-react';
import { PageBanner } from '@/components/common/PageBanner';
import { SEO } from '@/components/common/SEO';
import type { ServiceMode } from '@/store/bookingStore';

interface ModeSelectGateProps {
  onSelect: (mode: ServiceMode) => void;
  seoTitle?: string;
  title?: string;
  description?: string;
}

export function ModeSelectGate({
  onSelect,
  seoTitle = 'Book Now',
  title = 'How Would You Like Your Service?',
  description = "Choose home service or a salon visit — we'll show you what's available for that option.",
}: ModeSelectGateProps) {
  return (
    <div>
      <SEO title={seoTitle} description={description} />
      <PageBanner
        eyebrow="Book Now"
        title={title}
        description={description}
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
