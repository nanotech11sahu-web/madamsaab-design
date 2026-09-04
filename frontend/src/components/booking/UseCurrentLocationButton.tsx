import { LocateFixed, Loader2 } from 'lucide-react';

interface UseCurrentLocationButtonProps {
  locating: boolean;
  onClick: () => void;
  className?: string;
}

export function UseCurrentLocationButton({ locating, onClick, className = '' }: UseCurrentLocationButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={locating}
      className={`flex items-center gap-1.5 rounded-pill border border-brand-pink px-4 py-2 text-xs font-semibold text-brand-pink transition hover:bg-brand-pink-light disabled:opacity-60 ${className}`}
    >
      {locating ? <Loader2 size={13} className="animate-spin" /> : <LocateFixed size={13} />}
      {locating ? 'Detecting your location...' : 'Use Current Location'}
    </button>
  );
}
