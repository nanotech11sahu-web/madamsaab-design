import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { MessageCircle } from 'lucide-react';
import { adminBookingsApi, adminStaffApi } from '@/services/adminApi';
import { buildWhatsappLink } from '@/utils/whatsappLink';

const STATUSES = [
  'PENDING_WHATSAPP_CONFIRMATION',
  'CONFIRMED',
  'ASSIGNED',
  'IN_PROGRESS',
  'COMPLETED',
  'CANCELLED',
  'NO_SHOW',
];

export function AdminBookings() {
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');

  const { data: bookings, isLoading } = useQuery({
    queryKey: ['admin', 'bookings', statusFilter, search],
    queryFn: () => adminBookingsApi.list({ status: statusFilter || undefined, search: search || undefined }),
  });
  const { data: staff } = useQuery({ queryKey: ['admin', 'staff'], queryFn: adminStaffApi.list });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => adminBookingsApi.updateStatus(id, status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'bookings'] }),
  });

  const assignMutation = useMutation({
    mutationFn: ({ id, staffId }: { id: string; staffId: string }) => adminBookingsApi.assignStaff(id, staffId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'bookings'] }),
  });

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-brand-navy">Bookings</h1>
      <p className="mt-1 text-sm text-brand-navy/60">View and manage all customer bookings.</p>

      <div className="mt-6 flex flex-wrap gap-3">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, phone, or booking #"
          className="input w-full sm:max-w-xs"
        />
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="input w-full sm:max-w-xs">
          <option value="">All Statuses</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s.replaceAll('_', ' ')}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-6 space-y-4">
        {isLoading && <p className="text-sm text-brand-navy/50">Loading...</p>}
        {bookings?.length === 0 && <p className="text-sm text-brand-navy/50">No bookings found.</p>}

        {bookings?.map((b) => (
          <div key={b._id} className="rounded-card border border-brand-border bg-white p-5 shadow-card">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-bold text-brand-navy">{b.bookingNumber}</p>
                <p className="mt-1 text-sm text-brand-navy/70">
                  {b.customer.name} · {b.customer.phone}
                </p>
                <p className="mt-1 text-xs text-brand-navy/50">
                  {b.appointmentDate} · {b.timeSlot} · {b.serviceType === 'HOME' ? 'Home Service' : 'Salon Visit'}
                </p>
              </div>
              <div className="text-right">
                <p className="text-lg font-extrabold text-brand-pink">₹{b.totalAmount}</p>
                <a
                  href={buildWhatsappLink(b.customer.phone, `Hi ${b.customer.name}, this is regarding your booking ${b.bookingNumber}.`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-brand-pink hover:underline"
                >
                  <MessageCircle size={12} /> Contact on WhatsApp
                </a>
              </div>
            </div>

            <div className="mt-3 flex flex-wrap gap-2 text-xs text-brand-navy/70">
              {b.services.map((s) => (
                <span key={s.refId} className="rounded-full bg-brand-pink-light px-2 py-0.5">
                  {s.name} · ₹{s.price}
                </span>
              ))}
              {b.packages.map((p) => (
                <span key={p.refId} className="rounded-full bg-brand-pink-light px-2 py-0.5">
                  {p.name} (Package) · ₹{p.price}
                </span>
              ))}
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-brand-border pt-4">
              <div>
                <label className="mr-2 text-xs font-semibold text-brand-navy/60">Status</label>
                <select
                  value={b.bookingStatus}
                  onChange={(e) => statusMutation.mutate({ id: b._id, status: e.target.value })}
                  className="rounded-lg border border-brand-border px-2 py-1.5 text-xs"
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s.replaceAll('_', ' ')}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mr-2 text-xs font-semibold text-brand-navy/60">Assign Staff</label>
                <select
                  defaultValue=""
                  onChange={(e) => e.target.value && assignMutation.mutate({ id: b._id, staffId: e.target.value })}
                  className="rounded-lg border border-brand-border px-2 py-1.5 text-xs"
                >
                  <option value="">Unassigned</option>
                  {staff?.map((s) => (
                    <option key={s._id} value={s._id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
