import { Home, Store } from 'lucide-react';
import { useBookingStore, type ServiceMode } from '@/store/bookingStore';
import { cn } from '@/lib/cn';

export function ModeTogglePill({ className = '' }: { className?: string }) {
  const serviceMode = useBookingStore((s) => s.serviceMode);
  const changeServiceMode = useBookingStore((s) => s.changeServiceMode);
  const itemCount = useBookingStore((s) => s.itemCount());

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
    <div className={cn('flex w-fit overflow-hidden rounded-pill bg-brand-pink-bg p-1', className)}>
      <button
        type="button"
        onClick={() => handleSwitchMode('HOME')}
        className={cn(
          'flex items-center gap-2 rounded-pill px-4 py-2 text-sm font-semibold transition',
          serviceMode === 'HOME' ? 'bg-brand-pink text-white shadow-sm' : 'text-brand-navy/60 hover:text-brand-navy',
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
          serviceMode === 'SALON' ? 'bg-brand-pink text-white shadow-sm' : 'text-brand-navy/60 hover:text-brand-navy',
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
  );
}
