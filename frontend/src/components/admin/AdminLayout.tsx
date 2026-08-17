import { useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Sparkles,
  Package as PackageIcon,
  CalendarCheck,
  Users,
  Settings as SettingsIcon,
  Mail,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { Logo } from '@/components/common/Logo';
import { useAuthStore } from '@/store/authStore';
import { authApi } from '@/services/adminApi';
import { cn } from '@/lib/cn';

const NAV = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/services', label: 'Services', icon: Sparkles },
  { to: '/admin/packages', label: 'Packages', icon: PackageIcon },
  { to: '/admin/bookings', label: 'Bookings', icon: CalendarCheck },
  { to: '/admin/staff', label: 'Staff', icon: Users },
  { to: '/admin/contact', label: 'Contact Submissions', icon: Mail },
  { to: '/admin/settings', label: 'Business Settings', icon: SettingsIcon },
];

function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav className="flex-1 space-y-1 p-4">
      {NAV.map(({ to, label, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          onClick={onNavigate}
          className={({ isActive }) =>
            cn(
              'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition',
              isActive
                ? 'bg-brand-pink-light text-brand-pink'
                : 'text-brand-navy/70 hover:bg-brand-pink-bg hover:text-brand-navy',
            )
          }
        >
          <Icon size={18} />
          {label}
        </NavLink>
      ))}
    </nav>
  );
}

export function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } catch {
      // ignore — clear local state regardless
    }
    logout();
    navigate('/admin/login');
  };

  const currentLabel = NAV.find((n) => (n.end ? location.pathname === n.to : location.pathname.startsWith(n.to)))?.label ?? 'Admin';

  return (
    <div className="flex min-h-screen bg-brand-pink-bg">
      <aside className="hidden w-64 shrink-0 flex-col border-r border-brand-border bg-white sm:flex">
        <div className="flex h-16 items-center border-b border-brand-border px-6">
          <Logo />
        </div>
        <SidebarNav />
        <div className="border-t border-brand-border p-4">
          <div className="mb-3 px-3 text-xs text-brand-navy/50">
            Signed in as <span className="font-semibold text-brand-navy">{user?.name}</span>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-brand-navy/70 transition hover:bg-brand-pink-bg hover:text-brand-pink"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {drawerOpen && (
        <div className="fixed inset-0 z-50 sm:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setDrawerOpen(false)} />
          <aside className="absolute inset-y-0 left-0 flex w-72 flex-col bg-white shadow-card">
            <div className="flex h-16 items-center justify-between border-b border-brand-border px-4">
              <Logo />
              <button type="button" onClick={() => setDrawerOpen(false)} className="p-1.5 text-brand-navy/60">
                <X size={20} />
              </button>
            </div>
            <SidebarNav onNavigate={() => setDrawerOpen(false)} />
            <div className="border-t border-brand-border p-4">
              <div className="mb-3 px-3 text-xs text-brand-navy/50">
                Signed in as <span className="font-semibold text-brand-navy">{user?.name}</span>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-brand-navy/70 transition hover:bg-brand-pink-bg hover:text-brand-pink"
              >
                <LogOut size={18} />
                Logout
              </button>
            </div>
          </aside>
        </div>
      )}

      <div className="flex-1">
        <header className="flex h-16 items-center gap-3 border-b border-brand-border bg-white px-4 sm:hidden">
          <button type="button" onClick={() => setDrawerOpen(true)} className="p-1.5 text-brand-navy">
            <Menu size={22} />
          </button>
          <span className="text-sm font-bold text-brand-navy">{currentLabel}</span>
        </header>
        <main className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
