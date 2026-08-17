import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { Star } from 'lucide-react';
import { myBookingsApi, myReviewsApi } from '@/services/customerApi';
import { Modal } from '@/components/admin/Modal';
import type { Booking } from '@/types';

const CANCELLABLE = ['PENDING_WHATSAPP_CONFIRMATION', 'CONFIRMED', 'ASSIGNED'];

function ReviewForm({ booking, onDone }: { booking: Booking; onDone: () => void }) {
  const queryClient = useQueryClient();
  const [rating, setRating] = useState(5);
  const { register, handleSubmit } = useForm<{ comment: string }>();

  const mutation = useMutation({
    mutationFn: (comment: string) => myReviewsApi.submit({ bookingId: booking._id, rating, comment }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-reviews'] });
      onDone();
    },
  });

  return (
    <form onSubmit={handleSubmit((v) => mutation.mutate(v.comment))} className="space-y-4">
      <div className="flex justify-center gap-1">
        {[1, 2, 3, 4, 5].map((n) => (
          <button key={n} type="button" onClick={() => setRating(n)}>
            <Star size={26} className={n <= rating ? 'fill-brand-pink text-brand-pink' : 'text-brand-border'} />
          </button>
        ))}
      </div>
      <div>
        <label className="text-xs font-semibold text-brand-navy/70">Your Review</label>
        <textarea {...register('comment', { required: true })} className="input min-h-24" />
      </div>
      {mutation.isError && <p className="err">Could not submit review. It may already exist.</p>}
      <button
        type="submit"
        disabled={mutation.isPending}
        className="w-full rounded-pill bg-brand-pink px-6 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-brand-pink-dark disabled:opacity-60"
      >
        Submit Review
      </button>
    </form>
  );
}

export function MyBookings() {
  const queryClient = useQueryClient();
  const { data: bookings, isLoading } = useQuery({ queryKey: ['my-bookings'], queryFn: myBookingsApi.list });
  const [reviewFor, setReviewFor] = useState<Booking | null>(null);

  const cancelMutation = useMutation({
    mutationFn: myBookingsApi.cancel,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['my-bookings'] }),
  });

  return (
    <div>
      <h2 className="text-lg font-bold text-brand-navy">My Bookings</h2>

      <div className="mt-5 space-y-4">
        {isLoading && <p className="text-sm text-brand-navy/50">Loading...</p>}
        {bookings?.length === 0 && <p className="text-sm text-brand-navy/50">No bookings yet.</p>}

        {bookings?.map((b) => (
          <div key={b._id} className="rounded-card border border-brand-border bg-white p-5 shadow-card">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-bold text-brand-navy">{b.bookingNumber}</p>
                <p className="mt-1 text-xs text-brand-navy/50">
                  {b.appointmentDate} · {b.timeSlot} · {b.serviceType === 'HOME' ? 'Home Service' : 'Salon Visit'}
                </p>
              </div>
              <div className="text-right">
                <p className="text-lg font-extrabold text-brand-pink">₹{b.totalAmount}</p>
                <span className="mt-1 inline-block rounded-full bg-brand-pink-light px-2 py-0.5 text-xs font-medium text-brand-pink">
                  {b.bookingStatus.replaceAll('_', ' ')}
                </span>
              </div>
            </div>

            <div className="mt-3 flex flex-wrap gap-2 text-xs text-brand-navy/70">
              {b.services.map((s) => (
                <span key={s.refId} className="rounded-full bg-brand-pink-bg px-2 py-0.5">
                  {s.name}
                </span>
              ))}
              {b.packages.map((p) => (
                <span key={p.refId} className="rounded-full bg-brand-pink-bg px-2 py-0.5">
                  {p.name}
                </span>
              ))}
            </div>

            <div className="mt-4 flex gap-3 border-t border-brand-border pt-4">
              {CANCELLABLE.includes(b.bookingStatus) && (
                <button
                  type="button"
                  onClick={() => window.confirm('Cancel this booking?') && cancelMutation.mutate(b._id)}
                  className="text-xs font-semibold text-red-600 hover:underline"
                >
                  Cancel Booking
                </button>
              )}
              {b.bookingStatus === 'COMPLETED' && (
                <button
                  type="button"
                  onClick={() => setReviewFor(b)}
                  className="text-xs font-semibold text-brand-pink hover:underline"
                >
                  Leave a Review
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {reviewFor && (
        <Modal title={`Review: ${reviewFor.bookingNumber}`} onClose={() => setReviewFor(null)}>
          <ReviewForm booking={reviewFor} onDone={() => setReviewFor(null)} />
        </Modal>
      )}
    </div>
  );
}
