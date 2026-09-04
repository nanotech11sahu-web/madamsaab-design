import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { User, MapPin, CalendarDays, Star, LogOut } from 'lucide-react';
import { useCustomerAuthStore } from '@/store/customerAuthStore';
import { customerAuthApi } from '@/services/customerApi';
import { cn } from '@/lib/cn';

const TABS = [
  { to: '/dashboard', label: 'Profile', icon: User, end: true },
  { to: '/dashboard/addresses', label: 'Addresses', icon: MapPin },
  { to: '/dashboard/bookings', label: 'My Bookings', icon: CalendarDays },
  { to: '/dashboard/reviews', label: 'My Reviews', icon: Star },
];

export function CustomerDashboardLayout() {
  const navigate = useNavigate();
  const user = useCustomerAuthStore((s) => s.user);
  const logout = useCustomerAuthStore((s) => s.logout);

  const handleLogout = async () => {
    try {
      await customerAuthApi.logout();
    } catch {
      // ignore
    }
    logout();
    navigate('/');
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-brand-navy">Hi, {user?.name?.split(' ')[0]}</h1>
        <p className="mt-1 text-sm text-brand-navy/60">Manage your profile, addresses, and bookings.</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[220px_1fr]">
        <nav className="flex gap-2 overflow-x-auto lg:flex-col lg:overflow-visible">
          {TABS.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                cn(
                  'flex shrink-0 items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition',
                  isActive
                    ? 'bg-brand-pink-light text-brand-pink'
                    : 'text-brand-navy/70 hover:bg-brand-pink-bg',
                )
              }
            >
              <Icon size={16} />
              {label}
            </NavLink>
          ))}
          <button
            type="button"
            onClick={handleLogout}
            className="flex shrink-0 items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium text-brand-navy/70 transition hover:bg-brand-pink-bg hover:text-brand-pink"
          >
            <LogOut size={16} />
            Logout
          </button>
        </nav>

        <div>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
