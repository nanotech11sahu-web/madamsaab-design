import { useServices } from '@/hooks/useServices';
import { ServicePriceCard } from '@/components/services/ServicePriceCard';
import { SectionHeading } from '@/components/ui/SectionHeading';

export function ServicesPricingGrid() {
  const { data: services, isLoading } = useServices();

  return (
    <div>
      <SectionHeading className="mb-5 justify-start lg:justify-center">
        Our Services &amp; Prices
      </SectionHeading>

      {isLoading && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-32 animate-pulse rounded-card bg-brand-pink-light" />
          ))}
        </div>
      )}

      {services && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {services.map((service) => (
            <ServicePriceCard key={service._id} service={service} />
          ))}
        </div>
      )}
    </div>
  );
}
