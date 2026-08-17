import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminContactApi } from '@/services/adminApi';

const STATUS_OPTIONS = ['NEW', 'READ', 'REPLIED', 'ARCHIVED'];

export function AdminContact() {
  const queryClient = useQueryClient();
  const { data: submissions, isLoading } = useQuery({
    queryKey: ['admin', 'contact'],
    queryFn: adminContactApi.list,
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => adminContactApi.updateStatus(id, status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'contact'] }),
  });

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-brand-navy">Contact Submissions</h1>
      <p className="mt-1 text-sm text-brand-navy/60">Messages submitted via the Contact Us form.</p>

      <div className="mt-6 space-y-4">
        {isLoading && <p className="text-sm text-brand-navy/50">Loading...</p>}
        {submissions?.length === 0 && <p className="text-sm text-brand-navy/50">No submissions yet.</p>}

        {submissions?.map((c) => (
          <div key={c._id} className="rounded-card border border-brand-border bg-white p-5 shadow-card">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-bold text-brand-navy">{c.name}</p>
                <p className="mt-0.5 text-xs text-brand-navy/50">
                  {c.email} · {c.phone}
                </p>
                {c.subject && <p className="mt-1 text-sm font-medium text-brand-navy/80">{c.subject}</p>}
              </div>
              <select
                value={c.status}
                onChange={(e) => statusMutation.mutate({ id: c._id, status: e.target.value })}
                className="rounded-lg border border-brand-border px-2 py-1.5 text-xs"
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <p className="mt-3 text-sm text-brand-navy/70">{c.message}</p>
            <p className="mt-3 text-[11px] text-brand-navy/40">
              {new Date(c.createdAt).toLocaleString('en-IN')}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
