import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import type { Package, Service } from '@/types';
import { useBookingStore } from '@/store/bookingStore';
import { ImagePlaceholder } from '@/components/ui/ImagePlaceholder';

interface PackageCardProps {
  pkg: Package;
}

export function PackageCard({ pkg }: PackageCardProps) {
  const isSelected = useBookingStore((s) =>
    s.selectedPackages.some((item) => item._id === pkg._id),
  );
  const togglePackage = useBookingStore((s) => s.togglePackage);
  const services = pkg.services as Service[];
  const savings = pkg.originalPrice ? pkg.originalPrice - pkg.packagePrice : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      whileHover={{ y: -6 }}
      className={`relative overflow-hidden rounded-card border bg-white shadow-card transition-shadow hover:shadow-card-hover ${
        isSelected ? 'border-brand-pink ring-1 ring-brand-pink' : 'border-brand-border'
      }`}
    >
      {pkg.image ? (
        <img src={pkg.image} alt={pkg.name} className="h-36 w-full object-cover" />
      ) : (
        <ImagePlaceholder className="h-36 w-full" label={pkg.name} />
      )}

      <div className="p-6">
      {pkg.featured && (
        <span className="absolute left-6 top-32 rounded-pill bg-brand-pink px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-white shadow-sm">
          Popular
        </span>
      )}
      <h3 className="text-lg font-bold text-brand-navy">{pkg.name}</h3>
      {pkg.shortDescription && (
        <p className="mt-1 text-sm text-brand-navy/60">{pkg.shortDescription}</p>
      )}

      {Array.isArray(services) && services.length > 0 && (
        <ul className="mt-4 space-y-1.5">
          {services.map((s) => (
            <li key={typeof s === 'string' ? s : s._id} className="flex items-center gap-2 text-sm text-brand-navy/80">
              <Check size={14} className="text-brand-pink" />
              {typeof s === 'string' ? s : s.name}
            </li>
          ))}
        </ul>
      )}

      <div className="mt-5 flex items-end gap-2">
        <span className="text-2xl font-extrabold text-brand-pink">₹{pkg.packagePrice}</span>
        {pkg.originalPrice ? (
          <span className="text-sm text-brand-navy/40 line-through">₹{pkg.originalPrice}</span>
        ) : null}
        {savings > 0 && (
          <span className="ml-auto rounded-full bg-brand-pink-light px-2 py-0.5 text-xs font-semibold text-brand-pink">
            Save ₹{savings}
          </span>
        )}
      </div>

      <button
        type="button"
        onClick={() => togglePackage(pkg)}
        className={`mt-5 w-full rounded-pill px-4 py-2.5 text-sm font-semibold transition ${
          isSelected
            ? 'bg-brand-pink-light text-brand-pink'
            : 'bg-brand-pink text-white hover:bg-brand-pink-dark'
        }`}
      >
        {isSelected ? 'Selected' : 'Select Package'}
      </button>
      </div>
    </motion.div>
  );
}
