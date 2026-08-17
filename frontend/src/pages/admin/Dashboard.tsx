import { useQuery } from '@tanstack/react-query';
import {
  CalendarDays,
  CalendarCheck,
  Clock,
  MessageCircleQuestion,
  CheckCircle2,
  XCircle,
  Users,
  Wallet,
} from 'lucide-react';
import { adminDashboardApi } from '@/services/adminApi';
import { BarChartCard } from '@/components/admin/BarChartCard';
import { StatusPieChart } from '@/components/admin/StatusPieChart';

const STAT_CARDS = [
  { key: 'totalBookings', label: 'Total Bookings', icon: CalendarDays },
  { key: 'todaysBookings', label: "Today's Bookings", icon: Clock },
  { key: 'upcomingBookings', label: 'Upcoming Bookings', icon: CalendarCheck },
  { key: 'pendingWhatsappConfirmations', label: 'Pending WhatsApp Confirmation', icon: MessageCircleQuestion },
  { key: 'confirmedBookings', label: 'Confirmed', icon: CheckCircle2 },
  { key: 'completedBookings', label: 'Completed', icon: CheckCircle2 },
  { key: 'cancelledBookings', label: 'Cancelled', icon: XCircle },
  { key: 'totalCustomers', label: 'Total Customers', icon: Users },
] as const;

export function Dashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'dashboard'],
    queryFn: adminDashboardApi.get,
  });

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-brand-navy">Dashboard</h1>
      <p className="mt-1 text-sm text-brand-navy/60">Overview of your salon's bookings.</p>

      {isLoading && (
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-24 animate-pulse rounded-card bg-brand-pink-light" />
          ))}
        </div>
      )}

      {data && (
        <>
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {STAT_CARDS.map(({ key, label, icon: Icon }) => (
              <div key={key} className="rounded-card border border-brand-border bg-white p-4 shadow-card">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-pink-light text-brand-pink">
                  <Icon size={18} />
                </span>
                <p className="mt-3 text-2xl font-extrabold text-brand-navy">{data[key]}</p>
                <p className="mt-0.5 text-xs text-brand-navy/60">{label}</p>
              </div>
            ))}
            <div className="rounded-card border border-brand-border bg-white p-4 shadow-card">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-pink-light text-brand-pink">
                <Wallet size={18} />
              </span>
              <p className="mt-3 text-2xl font-extrabold text-brand-navy">₹{data.totalBookingValue}</p>
              <p className="mt-0.5 text-xs text-brand-navy/60">Total Booking Value</p>
            </div>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            <StatusPieChart
              data={[
                { name: 'Pending', value: data.pendingWhatsappConfirmations },
                { name: 'Confirmed', value: data.confirmedBookings },
                { name: 'Completed', value: data.completedBookings },
                { name: 'Cancelled', value: data.cancelledBookings },
              ]}
            />
            <BarChartCard title="Popular Services" data={data.popularServices} />
            <BarChartCard title="Popular Packages" data={data.popularPackages} />
          </div>

          <div className="mt-8 rounded-card border border-brand-border bg-white p-5 shadow-card">
            <h2 className="text-sm font-bold text-brand-navy">Recent Bookings</h2>

            {data.recentBookings.length === 0 && (
              <p className="mt-4 text-sm text-brand-navy/50">No bookings yet.</p>
            )}

            {/* Mobile: stacked cards */}
            <div className="mt-4 space-y-3 sm:hidden">
              {data.recentBookings.map((b) => (
                <div key={b._id} className="rounded-lg border border-brand-border/60 p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-brand-navy">{b.bookingNumber}</span>
                    <span className="font-semibold text-brand-navy">₹{b.totalAmount}</span>
                  </div>
                  <p className="mt-1 text-xs text-brand-navy/70">{b.customer.name} · {b.appointmentDate}</p>
                  <span className="mt-2 inline-block rounded-full bg-brand-pink-light px-2 py-0.5 text-xs font-medium text-brand-pink">
                    {b.bookingStatus.replaceAll('_', ' ')}
                  </span>
                </div>
              ))}
            </div>

            {/* Desktop: table */}
            {data.recentBookings.length > 0 && (
              <div className="mt-4 hidden overflow-x-auto sm:block">
                <table className="w-full min-w-[600px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-brand-border text-xs uppercase text-brand-navy/50">
                      <th className="pb-2 pr-4">Booking #</th>
                      <th className="pb-2 pr-4">Customer</th>
                      <th className="pb-2 pr-4">Date</th>
                      <th className="pb-2 pr-4">Status</th>
                      <th className="pb-2">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.recentBookings.map((b) => (
                      <tr key={b._id} className="border-b border-brand-border/50">
                        <td className="py-2 pr-4 font-medium text-brand-navy">{b.bookingNumber}</td>
                        <td className="py-2 pr-4 text-brand-navy/80">{b.customer.name}</td>
                        <td className="py-2 pr-4 text-brand-navy/60">{b.appointmentDate}</td>
                        <td className="py-2 pr-4">
                          <span className="rounded-full bg-brand-pink-light px-2 py-0.5 text-xs font-medium text-brand-pink">
                            {b.bookingStatus.replaceAll('_', ' ')}
                          </span>
                        </td>
                        <td className="py-2 font-semibold text-brand-navy">₹{b.totalAmount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
