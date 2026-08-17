import { useQuery } from '@tanstack/react-query';
import { Star } from 'lucide-react';
import { myReviewsApi } from '@/services/customerApi';

const STATUS_LABEL: Record<string, string> = {
  PENDING: 'Pending Approval',
  PUBLISHED: 'Published',
  REJECTED: 'Not Approved',
};

export function MyReviews() {
  const { data: reviews, isLoading } = useQuery({ queryKey: ['my-reviews'], queryFn: myReviewsApi.list });

  return (
    <div>
      <h2 className="text-lg font-bold text-brand-navy">My Reviews</h2>
      <p className="mt-1 text-sm text-brand-navy/60">
        Reviews you've submitted for completed bookings.
      </p>

      <div className="mt-5 space-y-4">
        {isLoading && <p className="text-sm text-brand-navy/50">Loading...</p>}
        {reviews?.length === 0 && (
          <p className="text-sm text-brand-navy/50">
            No reviews yet. You can leave a review from a completed booking.
          </p>
        )}
        {reviews?.map((r) => (
          <div key={r._id} className="rounded-card border border-brand-border bg-white p-5 shadow-card">
            <div className="flex items-center justify-between">
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={14} className={i < r.rating ? 'fill-brand-pink text-brand-pink' : 'text-brand-border'} />
                ))}
              </div>
              <span className="rounded-full bg-brand-pink-light px-2 py-0.5 text-xs font-medium text-brand-pink">
                {STATUS_LABEL[r.status]}
              </span>
            </div>
            <p className="mt-3 text-sm text-brand-navy/70">{r.comment}</p>
            <p className="mt-2 text-[11px] text-brand-navy/40">
              {new Date(r.createdAt).toLocaleDateString('en-IN')}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
