import { Link } from 'react-router-dom';
import { Mail } from 'lucide-react';

export function ContactCTA() {
  return (
    <div className="relative overflow-hidden rounded-card bg-brand-navy px-6 py-10 text-center shadow-card sm:px-10">
      <img
        src="https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=1200&q=80&auto=format&fit=crop"
        alt="MadamSaab professional at work"
        className="absolute inset-0 h-full w-full object-cover opacity-20"
      />
      <div className="relative">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white">
          <Mail size={22} />
        </span>
        <h2 className="mt-4 text-xl font-bold text-white">Have a Question?</h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-white/70">
          Reach out to our team for custom packages, bulk bookings, or anything
          else you&apos;d like to know.
        </p>
        <Link
          to="/contact"
          className="mt-5 inline-flex items-center gap-2 rounded-pill bg-brand-pink px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-pink-dark"
        >
          Contact Us
        </Link>
      </div>
    </div>
  );
}
