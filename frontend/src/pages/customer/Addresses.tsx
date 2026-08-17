import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Trash2, Star } from 'lucide-react';
import { profileApi } from '@/services/customerApi';
import { Modal } from '@/components/admin/Modal';
import type { UserAddress } from '@/types';

type FormValues = Omit<UserAddress, 'isDefault'> & { isDefault: boolean };

const EMPTY: FormValues = {
  label: 'Home',
  line1: '',
  line2: '',
  city: '',
  state: '',
  pincode: '',
  isDefault: false,
};

export function Addresses() {
  const queryClient = useQueryClient();
  const { data: profile, isLoading } = useQuery({ queryKey: ['profile'], queryFn: profileApi.get });
  const [showForm, setShowForm] = useState(false);
  const { register, handleSubmit, reset } = useForm<FormValues>({ defaultValues: EMPTY });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['profile'] });

  const addMutation = useMutation({
    mutationFn: profileApi.addAddress,
    onSuccess: () => {
      invalidate();
      setShowForm(false);
      reset(EMPTY);
    },
  });
  const removeMutation = useMutation({
    mutationFn: profileApi.removeAddress,
    onSuccess: invalidate,
  });
  const setDefaultMutation = useMutation({
    mutationFn: (index: number) => profileApi.updateAddress(index, { isDefault: true }),
    onSuccess: invalidate,
  });

  if (isLoading || !profile) {
    return <p className="text-sm text-brand-navy/50">Loading...</p>;
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-brand-navy">Your Addresses</h2>
        <button
          type="button"
          onClick={() => {
            reset(EMPTY);
            setShowForm(true);
          }}
          className="flex items-center gap-2 rounded-pill bg-brand-pink px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-pink-dark"
        >
          <Plus size={15} /> Add Address
        </button>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        {profile.addresses.length === 0 && (
          <p className="text-sm text-brand-navy/50">No saved addresses yet.</p>
        )}
        {profile.addresses.map((addr, i) => (
          <div key={i} className="rounded-card border border-brand-border bg-white p-4 shadow-card">
            <div className="flex items-start justify-between">
              <span className="rounded-full bg-brand-pink-light px-2 py-0.5 text-xs font-semibold text-brand-pink">
                {addr.label}
              </span>
              {addr.isDefault && (
                <span className="flex items-center gap-1 text-xs font-medium text-brand-pink">
                  <Star size={12} className="fill-brand-pink" /> Default
                </span>
              )}
            </div>
            <p className="mt-2 text-sm text-brand-navy/80">
              {addr.line1}
              {addr.line2 ? `, ${addr.line2}` : ''}
              <br />
              {addr.city}, {addr.state} {addr.pincode}
            </p>
            <div className="mt-3 flex gap-3">
              {!addr.isDefault && (
                <button
                  type="button"
                  onClick={() => setDefaultMutation.mutate(i)}
                  className="text-xs font-semibold text-brand-pink hover:underline"
                >
                  Set as default
                </button>
              )}
              <button
                type="button"
                onClick={() => removeMutation.mutate(i)}
                className="flex items-center gap-1 text-xs font-semibold text-brand-navy/50 hover:text-red-600"
              >
                <Trash2 size={12} /> Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <Modal title="Add Address" onClose={() => setShowForm(false)}>
          <form onSubmit={handleSubmit((v) => addMutation.mutate(v))} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-brand-navy/70">Label</label>
              <input {...register('label', { required: true })} className="input" placeholder="Home, Office..." />
            </div>
            <div>
              <label className="text-xs font-semibold text-brand-navy/70">Address Line 1</label>
              <input {...register('line1', { required: true })} className="input" />
            </div>
            <div>
              <label className="text-xs font-semibold text-brand-navy/70">Address Line 2</label>
              <input {...register('line2')} className="input" />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-semibold text-brand-navy/70">City</label>
                <input {...register('city', { required: true })} className="input" />
              </div>
              <div>
                <label className="text-xs font-semibold text-brand-navy/70">State</label>
                <input {...register('state', { required: true })} className="input" />
              </div>
              <div>
                <label className="text-xs font-semibold text-brand-navy/70">Pincode</label>
                <input {...register('pincode', { required: true })} className="input" />
              </div>
            </div>
            <label className="flex items-center gap-2 text-sm text-brand-navy/80">
              <input type="checkbox" {...register('isDefault')} className="accent-brand-pink" />
              Set as default address
            </label>
            <button
              type="submit"
              disabled={addMutation.isPending}
              className="w-full rounded-pill bg-brand-pink px-6 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-brand-pink-dark disabled:opacity-60"
            >
              Save Address
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
}
