import { useServices } from '@/hooks/useServices';
import { ServicePriceCard } from '@/components/services/ServicePriceCard';
import { PageBanner } from '@/components/common/PageBanner';
import { Reveal } from '@/components/common/Reveal';
import { TrustFeatures } from '@/components/home/TrustFeatures';
import { ContactCTA } from '@/components/home/ContactCTA';
import { SEO } from '@/components/common/SEO';

export function Services() {
  const { data: services, isLoading } = useServices();

  const categories = Array.from(new Set((services ?? []).map((s) => s.category)));

  return (
    <div>
      <SEO
        title="Our Services"
        description="Browse haircuts, facials, waxing, hair spa, bridal makeup, nail extensions and more — with live pricing. Select and book instantly on WhatsApp."
      />
      <PageBanner
        eyebrow="Our Services"
        title="Every Service, At Your Doorstep"
        description="Select one or more services. Continue to booking when you're ready."
        image="https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1600&q=80&auto=format&fit=crop"
      />

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {isLoading && (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-32 animate-pulse rounded-card bg-brand-pink-light" />
            ))}
          </div>
        )}

        {categories.map((category) => (
          <div key={category} className="mt-2 mb-10 first:mt-0">
            <Reveal>
              <h2 className="mb-4 text-lg font-bold text-brand-navy">{category}</h2>
            </Reveal>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {services
                ?.filter((s) => s.category === category)
                .map((service) => <ServicePriceCard key={service._id} service={service} />)}
            </div>
          </div>
        ))}

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
