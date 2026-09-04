import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Share2, AtSign } from 'lucide-react';
import { Logo } from '@/components/common/Logo';
import { useSettings } from '@/hooks/useServices';

export function Footer() {
  const { data: settings } = useSettings();

  return (
    <footer className="border-t border-brand-border/60 bg-brand-pink-bg">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-x-6 gap-y-8 px-4 py-10 sm:px-6 sm:py-14 lg:grid-cols-4 lg:gap-10 lg:px-8">
        <div className="col-span-2 lg:col-span-1">
          <Logo />
          <p className="mt-4 max-w-xs text-sm text-brand-navy/70">
            Premium salon services for women, at your doorstep or in-salon.
            Book instantly on WhatsApp — hassle-free, no app needed.
          </p>
          <div className="mt-4 flex gap-3">
            <a
              href="#"
              className="rounded-full bg-white p-2 text-brand-pink shadow-sm transition hover:bg-brand-pink hover:text-white"
              aria-label="Instagram"
            >
              <AtSign size={18} />
            </a>
            <a
              href="#"
              className="rounded-full bg-white p-2 text-brand-pink shadow-sm transition hover:bg-brand-pink hover:text-white"
              aria-label="Facebook"
            >
              <Share2 size={18} />
            </a>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-brand-navy">Quick Links</h3>
          <ul className="mt-4 space-y-2 text-sm text-brand-navy/70">
            <li><Link to="/services" className="hover:text-brand-pink">Services</Link></li>
            <li><Link to="/packages" className="hover:text-brand-pink">Packages</Link></li>
            <li><Link to="/about" className="hover:text-brand-pink">About Us</Link></li>
            <li><Link to="/contact" className="hover:text-brand-pink">Contact Us</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-brand-navy">Company</h3>
          <ul className="mt-4 space-y-2 text-sm text-brand-navy/70">
            <li><Link to="/dashboard" className="hover:text-brand-pink">My Bookings</Link></li>
            <li><Link to="/login" className="hover:text-brand-pink">Login</Link></li>
            <li><Link to="/register" className="hover:text-brand-pink">Register</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-brand-navy">Contact</h3>
          <ul className="mt-4 space-y-3 text-sm text-brand-navy/70">
            {settings?.phone && (
              <li className="flex items-center gap-2">
                <Phone size={16} className="text-brand-pink" /> {settings.phone}
              </li>
            )}
            {settings?.email && (
              <li className="flex items-center gap-2">
                <Mail size={16} className="text-brand-pink" /> {settings.email}
              </li>
            )}
            {settings?.address && (
              <li className="flex items-start gap-2">
                <MapPin size={16} className="mt-0.5 shrink-0 text-brand-pink" />{' '}
                {settings.address}
              </li>
            )}
          </ul>
        </div>
      </div>

      <div className="border-t border-brand-border/60 py-5 text-center text-xs text-brand-navy/60">
        © {new Date().getFullYear()} {settings?.businessName ?? 'MadamSaab'}. All
        rights reserved.
      </div>
    </footer>
  );
}
