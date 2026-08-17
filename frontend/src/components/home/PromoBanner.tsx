import { BookingCTAButton } from '@/components/ui/BookingCTAButton';

export function PromoBanner() {
  return (
    <div className="rounded-card border border-brand-pink/25 bg-brand-pink-light px-6 py-6 text-center sm:px-10">
      <p className="text-sm font-extrabold uppercase tracking-wide text-brand-pink">
        First Home Service Offer
      </p>
      <p className="mt-1 text-base font-semibold text-brand-navy">
        Flat 20% OFF on your first booking
      </p>
      <div className="mt-4 flex justify-center">
        <BookingCTAButton className="border border-brand-pink bg-white text-brand-pink hover:bg-brand-pink hover:text-white">
          Book Now to Claim
        </BookingCTAButton>
      </div>
    </div>
  );
}
