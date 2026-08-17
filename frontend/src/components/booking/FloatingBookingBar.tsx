import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import { useBookingStore } from '@/store/bookingStore';

export function FloatingBookingBar() {
  const itemCount = useBookingStore((s) => s.itemCount());
  const subtotal = useBookingStore((s) => s.subtotal());

  if (itemCount === 0) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-brand-border bg-white/95 px-4 py-3 shadow-[0_-8px_24px_-8px_rgba(26,27,71,0.15)] backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 text-sm text-brand-navy">
          <ShoppingBag size={18} className="text-brand-pink" />
          <span className="font-semibold">{itemCount} selected</span>
          <span className="text-brand-navy/50">·</span>
          <span className="font-bold text-brand-pink">₹{subtotal}</span>
        </div>
        <Link
          to="/booking"
          className="rounded-pill bg-brand-pink px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-pink-dark"
        >
          Continue Booking
        </Link>
      </div>
    </div>
  );
}
