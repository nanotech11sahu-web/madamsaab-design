import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, X, MapPin, CalendarDays } from 'lucide-react';
import { adminCustomersApi, adminBookingsApi } from '@/services/adminApi';
import { Modal } from '@/components/admin/Modal';
import type { Profile } from '@/types';

function CustomerDetail({ customer, onClose }: { customer: Profile; onClose: () => void }) {
  const { data: bookings, isLoading } = useQuery({
    queryKey: ['admin', 'customer-bookings', customer.phone],
    queryFn: () => adminBookingsApi.list({ search: customer.phone }),
  });

  return (
    <Modal title={customer.name} onClose={onClose}>
      <div className="space-y-5">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-xs font-semibold text-brand-navy/50">Email</p>
            <p className="text-brand-navy">{customer.email}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-brand-navy/50">Phone</p>
            <p className="text-brand-navy">{customer.phone}</p>
          </div>
          {customer.dateOfBirth && (
            <div>
              <p className="text-xs font-semibold text-brand-navy/50">Date of Birth</p>
              <p className="text-brand-navy">{customer.dateOfBirth}</p>
            </div>
          )}
          {customer.gender && (
            <div>
              <p className="text-xs font-semibold text-brand-navy/50">Gender</p>
              <p className="text-brand-navy">{customer.gender}</p>
            </div>
          )}
        </div>

        {customer.addresses.length > 0 && (
          <div>
            <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-brand-navy/50">
              <MapPin size={13} /> Addresses
            </p>
            <div className="space-y-2">
              {customer.addresses.map((a, i) => (
                <div key={i} className="rounded-lg border border-brand-border p-2.5 text-xs text-brand-navy/80">
                  <span className="font-semibold text-brand-navy">{a.label}</span>
                  {a.isDefault && <span className="ml-1.5 rounded-full bg-brand-pink-light px-1.5 py-0.5 text-[10px] font-medium text-brand-pink">Default</span>}
                  <p className="mt-0.5">{[a.line1, a.line2, a.city, a.state, a.pincode].filter(Boolean).join(', ')}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div>
          <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-brand-navy/50">
            <CalendarDays size={13} /> Recent Bookings
          </p>
          {isLoading && <p className="text-xs text-brand-navy/50">Loading...</p>}
          {!isLoading && (bookings?.length ?? 0) === 0 && (
            <p className="text-xs text-brand-navy/50">No bookings yet.</p>
          )}
          <div className="space-y-2">
            {bookings?.slice(0, 5).map((b) => (
              <div key={b._id} className="flex items-center justify-between rounded-lg border border-brand-border p-2.5 text-xs">
                <div>
                  <p className="font-semibold text-brand-navy">{b.bookingNumber}</p>
                  <p className="text-brand-navy/50">{b.appointmentDate} · {b.timeSlot}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-brand-pink">₹{b.totalAmount}</p>
                  <p className="text-brand-navy/50">{b.bookingStatus.replace(/_/g, ' ')}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
}

export function AdminCustomers() {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Profile | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'customers', search],
    queryFn: () => adminCustomersApi.list({ search: search || undefined }),
  });

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-brand-navy">Customers</h1>
          <p className="mt-1 text-sm text-brand-navy/60">View customer profiles and their booking history.</p>
        </div>
      </div>

      <div className="relative mt-6 max-w-sm">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-navy/40" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input pl-9"
          placeholder="Search by name, email or phone"
        />
        {search && (
          <button type="button" onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-navy/40">
            <X size={14} />
          </button>
        )}
      </div>

      {isLoading && <p className="mt-6 text-sm text-brand-navy/50">Loading...</p>}
      {!isLoading && data?.items.length === 0 && (
        <p className="mt-6 text-sm text-brand-navy/50">No customers found.</p>
      )}

      {/* Mobile: stacked cards */}
      <div className="mt-6 space-y-3 sm:hidden">
        {data?.items.map((c) => (
          <button
            key={c._id}
            type="button"
            onClick={() => setSelected(c)}
            className="w-full rounded-card border border-brand-border bg-white p-4 text-left shadow-card"
          >
            <p className="font-semibold text-brand-navy">{c.name}</p>
            <p className="text-xs text-brand-navy/60">{c.email} · {c.phone}</p>
          </button>
        ))}
      </div>

      {/* Desktop: table */}
      <div className="mt-6 hidden overflow-x-auto rounded-card border border-brand-border bg-white shadow-card sm:block">
        <table className="w-full min-w-[600px] text-left text-sm">
          <thead>
            <tr className="border-b border-brand-border text-xs uppercase text-brand-navy/50">
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Phone</th>
              <th className="px-4 py-3">Addresses</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {data?.items.map((c) => (
              <tr key={c._id} className="border-b border-brand-border/50">
                <td className="px-4 py-3 font-medium text-brand-navy">{c.name}</td>
                <td className="px-4 py-3 text-brand-navy/70">{c.email}</td>
                <td className="px-4 py-3 text-brand-navy/70">{c.phone}</td>
                <td className="px-4 py-3 text-brand-navy/70">{c.addresses.length}</td>
                <td className="px-4 py-3 text-right">
                  <button
                    type="button"
                    onClick={() => setSelected(c)}
                    className="rounded-pill border border-brand-pink px-3 py-1 text-xs font-semibold text-brand-pink hover:bg-brand-pink-light"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selected && <CustomerDetail customer={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
