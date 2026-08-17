import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { profileApi } from '@/services/customerApi';

interface FormValues {
  name: string;
  phone: string;
}

export function Profile() {
  const queryClient = useQueryClient();
  const { data: profile, isLoading } = useQuery({ queryKey: ['profile'], queryFn: profileApi.get });

  const { register, handleSubmit, reset } = useForm<FormValues>();

  useEffect(() => {
    if (profile) reset({ name: profile.name, phone: profile.phone });
  }, [profile, reset]);

  const mutation = useMutation({
    mutationFn: profileApi.update,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['profile'] }),
  });

  if (isLoading || !profile) {
    return <p className="text-sm text-brand-navy/50">Loading...</p>;
  }

  return (
    <div className="rounded-card border border-brand-border bg-white p-6 shadow-card">
      <h2 className="text-lg font-bold text-brand-navy">Your Profile</h2>

      {mutation.isSuccess && (
        <p className="mt-4 rounded-lg bg-green-50 p-3 text-sm text-green-700">Profile updated.</p>
      )}

      <form onSubmit={handleSubmit((v) => mutation.mutate(v))} className="mt-5 max-w-sm space-y-4">
        <div>
          <label className="text-xs font-semibold text-brand-navy/70">Full Name</label>
          <input {...register('name', { required: true })} className="input" />
        </div>
        <div>
          <label className="text-xs font-semibold text-brand-navy/70">Email</label>
          <input value={profile.email} disabled className="input opacity-60" />
        </div>
        <div>
          <label className="text-xs font-semibold text-brand-navy/70">Phone</label>
          <input {...register('phone', { required: true })} className="input" />
        </div>
        <button
          type="submit"
          disabled={mutation.isPending}
          className="rounded-pill bg-brand-pink px-6 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-brand-pink-dark disabled:opacity-60"
        >
          {mutation.isPending ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
}
