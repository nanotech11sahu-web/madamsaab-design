import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { settingsApi } from '@/services/api';
import { adminSettingsApi } from '@/services/adminApi';
import type { Settings } from '@/types';

export function AdminSettings() {
  const queryClient = useQueryClient();
  const { data: settings, isLoading } = useQuery({ queryKey: ['settings'], queryFn: settingsApi.get });

  const { register, handleSubmit, reset } = useForm<Settings>();

  useEffect(() => {
    if (settings) reset(settings);
  }, [settings, reset]);

  const mutation = useMutation({
    mutationFn: adminSettingsApi.update,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['settings'] }),
  });

  if (isLoading || !settings) {
    return <p className="text-sm text-brand-navy/50">Loading...</p>;
  }

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-brand-navy">Business Settings</h1>
      <p className="mt-1 text-sm text-brand-navy/60">
        These values are used across the entire website, including all WhatsApp booking buttons.
      </p>

      {mutation.isSuccess && (
        <p className="mt-4 rounded-lg bg-green-50 p-3 text-sm text-green-700">Settings saved.</p>
      )}

      <form
        onSubmit={handleSubmit((v) => mutation.mutate(v))}
        className="mt-6 max-w-2xl space-y-5 rounded-card border border-brand-border bg-white p-6 shadow-card"
      >
        <div>
          <label className="text-xs font-semibold text-brand-navy/70">WhatsApp Number (with country code, digits only)</label>
          <input {...register('whatsappNumber')} className="input" placeholder="919876543210" />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="text-xs font-semibold text-brand-navy/70">Business Name</label>
            <input {...register('businessName')} className="input" />
          </div>
          <div>
            <label className="text-xs font-semibold text-brand-navy/70">Home Service Fee (₹)</label>
            <input type="number" {...register('homeServiceFee', { valueAsNumber: true })} className="input" />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="text-xs font-semibold text-brand-navy/70">Phone</label>
            <input {...register('phone')} className="input" />
          </div>
          <div>
            <label className="text-xs font-semibold text-brand-navy/70">Email</label>
            <input {...register('email')} className="input" />
          </div>
        </div>
        <div>
          <label className="text-xs font-semibold text-brand-navy/70">Address</label>
          <input {...register('address')} className="input" />
        </div>
        <div>
          <label className="text-xs font-semibold text-brand-navy/70">Google Maps URL</label>
          <input {...register('googleMapsUrl')} className="input" />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="text-xs font-semibold text-brand-navy/70">Opening Time</label>
            <input type="time" {...register('openingTime')} className="input" />
          </div>
          <div>
            <label className="text-xs font-semibold text-brand-navy/70">Closing Time</label>
            <input type="time" {...register('closingTime')} className="input" />
          </div>
        </div>
        <div>
          <label className="text-xs font-semibold text-brand-navy/70">WhatsApp Message Template</label>
          <textarea {...register('whatsappMessageTemplate')} className="input min-h-40 font-mono text-xs" />
          <p className="mt-1 text-[11px] text-brand-navy/50">
            Available placeholders: {'{{bookingNumber}} {{customerName}} {{customerPhone}} {{services}} {{packages}} {{appointmentDate}} {{timeSlot}} {{serviceType}} {{address}} {{totalAmount}}'}
          </p>
        </div>

        <button
          type="submit"
          disabled={mutation.isPending}
          className="rounded-pill bg-brand-pink px-6 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-brand-pink-dark disabled:opacity-60"
        >
          {mutation.isPending ? 'Saving...' : 'Save Settings'}
        </button>
      </form>
    </div>
  );
}
