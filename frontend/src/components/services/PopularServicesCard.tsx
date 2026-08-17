import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Scissors, Droplets, Flower2, Wand2, Gem } from 'lucide-react';

const POPULAR = [
  { label: 'Cleanup', icon: Droplets, to: '/services' },
  { label: 'Waxing', icon: Scissors, to: '/services' },
  { label: 'Hair Spa', icon: Flower2, to: '/services' },
  { label: 'Bridal Makeup', icon: Wand2, to: '/services' },
  { label: 'Nails', icon: Gem, to: '/services' },
];

export function PopularServicesCard() {
  return (
    <div className="rounded-card border border-brand-border bg-white p-5 shadow-card sm:p-6">
      <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-brand-navy">
        Our Popular Services
      </h3>
      <div className="flex flex-wrap justify-between gap-4 sm:flex-nowrap">
        {POPULAR.map(({ label, icon: Icon, to }) => (
          <Link
            key={label}
            to={to}
            className="group flex w-[calc(50%-8px)] flex-col items-center gap-2 text-center sm:w-auto sm:flex-1"
          >
            <motion.span
              whileHover={{ scale: 1.12 }}
              whileTap={{ scale: 0.95 }}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-pink-light text-brand-pink transition-colors group-hover:bg-brand-pink group-hover:text-white"
            >
              <Icon size={22} />
            </motion.span>
            <span className="text-xs font-medium text-brand-navy/80">{label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
