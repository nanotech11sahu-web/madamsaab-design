import { useSettings } from '@/hooks/useServices';
import { WhatsAppLogo } from '@/components/common/WhatsAppLogo';
import { useBookingStore } from '@/store/bookingStore';
import { cn } from '@/lib/cn';

const DEFAULT_MESSAGE = 'Hello, I would like to know more about your salon services.';

export function FloatingWhatsAppIcon() {
  const { data: settings } = useSettings();
  const hasBookingBar = useBookingStore((s) => s.itemCount() > 0);

  const handleClick = () => {
    if (!settings?.whatsappNumber) return;
    const digits = settings.whatsappNumber.replace(/\D/g, '');
    window.open(
      `https://wa.me/${digits}?text=${encodeURIComponent(DEFAULT_MESSAGE)}`,
      '_blank',
      'noopener',
    );
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={!settings?.whatsappNumber}
      aria-label="Chat on WhatsApp"
      className={cn(
        'fixed right-4 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition hover:scale-105 disabled:cursor-not-allowed disabled:opacity-60',
        hasBookingBar ? 'bottom-28 sm:bottom-24' : 'bottom-20 sm:bottom-6',
      )}
    >
      <WhatsAppLogo size={26} className="text-white" />
    </button>
  );
}
