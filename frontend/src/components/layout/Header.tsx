import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, X, User } from 'lucide-react';
import { Logo } from '@/components/common/Logo';
import { BookingCTAButton } from '@/components/ui/BookingCTAButton';
import { useCustomerAuthStore } from '@/store/customerAuthStore';

const NAV_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'Services', to: '/services' },
  { label: 'Packages', to: '/packages' },
  { label: 'About Us', to: '/about' },
  { label: 'How It Works', to: '/#how-it-works' },
  { label: 'Reviews', to: '/#reviews' },
  { label: 'Contact', to: '/contact' },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const customerUser = useCustomerAuthStore((s) => s.user);

  return (
    <header className="sticky top-0 z-40 border-b border-brand-border/60 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="shrink-0">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.label}
              to={link.to}
              className={({ isActive }) =>
                `text-sm font-medium transition hover:text-brand-pink ${
                  isActive ? 'text-brand-pink' : 'text-brand-navy'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-4 lg:flex">
          <Link
            to={customerUser ? '/dashboard' : '/login'}
            className="flex items-center gap-1.5 text-sm font-medium text-brand-navy transition hover:text-brand-pink"
          >
            <User size={16} />
            {customerUser ? customerUser.name.split(' ')[0] : 'Login'}
          </Link>
          <BookingCTAButton />
        </div>

        <button
          type="button"
          className="rounded-lg p-2 text-brand-navy lg:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {open && (
        <div className="border-t border-brand-border/60 bg-white px-4 py-4 lg:hidden">
          <nav className="flex flex-col gap-4">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.label}
                to={link.to}
                onClick={() => setOpen(false)}
                className="text-sm font-medium text-brand-navy"
              >
                {link.label}
              </NavLink>
            ))}
            <Link
              to={customerUser ? '/dashboard' : '/login'}
              onClick={() => setOpen(false)}
              className="flex items-center gap-1.5 text-sm font-medium text-brand-navy"
            >
              <User size={16} />
              {customerUser ? `Hi, ${customerUser.name.split(' ')[0]}` : 'Login / Register'}
            </Link>
            <BookingCTAButton className="w-full justify-center" />
          </nav>
        </div>
      )}
    </header>
  );
}
