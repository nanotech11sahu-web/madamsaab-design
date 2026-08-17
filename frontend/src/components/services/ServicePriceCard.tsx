import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import type { Service } from '@/types';
import { getServiceIcon } from '@/utils/serviceIcons';
import { useBookingStore } from '@/store/bookingStore';

interface ServicePriceCardProps {
  service: Service;
}

export function ServicePriceCard({ service }: ServicePriceCardProps) {
  const Icon = getServiceIcon(service.slug);
  const isSelected = useBookingStore((s) =>
    s.selectedServices.some((item) => item._id === service._id),
  );
  const toggleService = useBookingStore((s) => s.toggleService);

  return (
    <motion.button
      type="button"
      onClick={() => toggleService(service)}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.97 }}
      className={`group relative flex flex-col items-center gap-1.5 rounded-card border bg-white p-4 text-center shadow-card transition-shadow hover:shadow-card-hover ${
        isSelected ? 'border-brand-pink ring-1 ring-brand-pink' : 'border-brand-border'
      }`}
    >
      {isSelected && (
        <span className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-brand-pink text-white">
          <Check size={12} strokeWidth={3} />
        </span>
      )}
      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-pink-light text-brand-blue transition-transform group-hover:scale-110">
        <Icon size={20} />
      </span>
      <span className="text-sm font-semibold text-brand-navy">{service.name}</span>
      {service.shortDescription && (
        <span className="text-[11px] text-brand-navy/50">{service.shortDescription}</span>
      )}
      <span className="text-base font-bold text-brand-pink">₹{service.price}</span>
    </motion.button>
  );
}
