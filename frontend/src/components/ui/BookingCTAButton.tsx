import { useNavigate } from 'react-router-dom';
import { useBookingStore } from '@/store/bookingStore';
import { cn } from '@/lib/cn';
import { WhatsAppLogo } from '@/components/common/WhatsAppLogo';

interface BookingCTAButtonProps {
  className?: string;
  children?: React.ReactNode;
}

export function BookingCTAButton({ className = '', children }: BookingCTAButtonProps) {
  const navigate = useNavigate();
  const itemCount = useBookingStore((s) => s.itemCount());

  const handleClick = () => {
    navigate(itemCount > 0 ? '/booking' : '/book');
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn(
        'inline-flex items-center gap-2 rounded-pill bg-brand-pink px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-pink-dark',
        className,
      )}
    >
      <WhatsAppLogo size={16} />
      {children ?? 'BOOK NOW'}
    </button>
  );
}
