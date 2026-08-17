import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { trustFeaturesApi } from '@/services/cmsApi';
import { Modal } from '@/components/admin/Modal';
import { getLucideIcon, ICON_NAME_OPTIONS } from '@/utils/iconRegistry';
import type { TrustFeature } from '@/types';

interface FormValues {
  icon: string;
  label: string;
  sortOrder: number;
  status: 'ACTIVE' | 'INACTIVE';
}

const EMPTY: FormValues = { icon: 'ShieldCheck', label: '', sortOrder: 0, status: 'ACTIVE' };

export function AdminTrustFeatures() {
  const queryClient = useQueryClient();
  const { data: features, isLoading } = useQuery({
    queryKey: ['admin', 'trust-features'],
    queryFn: () => trustFeaturesApi.list(true),
  });
  const [editing, setEditing] = useState<TrustFeature | null>(null);
  const [showForm, setShowForm] = useState(false);

  const { register, handleSubmit, reset } = useForm<FormValues>({ defaultValues: EMPTY });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['admin', 'trust-features'] });
    queryClient.invalidateQueries({ queryKey: ['trust-features'] });
  };

  const createMutation = useMutation({
    mutationFn: trustFeaturesApi.create,
    onSuccess: () => {
      invalidate();
      closeForm();
    },
  });
  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<TrustFeature> }) =>
      trustFeaturesApi.update(id, payload),
    onSuccess: () => {
      invalidate();
      closeForm();
    },
  });
  const removeMutation = useMutation({ mutationFn: trustFeaturesApi.remove, onSuccess: invalidate });

  const openCreate = () => {
    setEditing(null);
    reset(EMPTY);
    setShowForm(true);
  };
  const openEdit = (f: TrustFeature) => {
    setEditing(f);
    reset({ icon: f.icon, label: f.label, sortOrder: f.sortOrder, status: f.status });
    setShowForm(true);
  };
  const closeForm = () => {
    setShowForm(false);
    setEditing(null);
  };

  const onSubmit = (values: FormValues) => {
    if (editing) updateMutation.mutate({ id: editing._id, payload: values });
    else createMutation.mutate(values);
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-brand-navy">Trust Features</h1>
          <p className="mt-1 text-sm text-brand-navy/60">Shown as trust badges across the site.</p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="flex items-center gap-2 rounded-pill bg-brand-pink px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-pink-dark"
        >
          <Plus size={16} /> New Feature
        </button>
      </div>

      {isLoading && <p className="mt-6 text-sm text-brand-navy/50">Loading...</p>}

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {features?.map((f) => {
          const Icon = getLucideIcon(f.icon);
          return (
            <div key={f._id} className="rounded-card border border-brand-border bg-white p-4 text-center shadow-card">
              <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-brand-pink-light text-brand-pink">
                <Icon size={20} />
              </span>
              <p className="mt-2 text-sm font-semibold text-brand-navy">{f.label}</p>
              <span
                className={`mt-2 inline-block rounded-full px-2 py-0.5 text-[11px] font-medium ${
                  f.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                }`}
              >
                {f.status}
              </span>
              <div className="mt-2 flex justify-center gap-2">
                <button type="button" onClick={() => openEdit(f)} className="rounded-lg p-1.5 text-brand-navy/60 hover:bg-brand-pink-bg hover:text-brand-pink">
                  <Pencil size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => window.confirm(`Delete ${f.label}?`) && removeMutation.mutate(f._id)}
                  className="rounded-lg p-1.5 text-brand-navy/60 hover:bg-red-50 hover:text-red-600"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {showForm && (
        <Modal title={editing ? 'Edit Feature' : 'New Feature'} onClose={closeForm}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-brand-navy/70">Icon</label>
              <select {...register('icon', { required: true })} className="input">
                {ICON_NAME_OPTIONS.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-brand-navy/70">Label</label>
              <input {...register('label', { required: true })} className="input" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-brand-navy/70">Sort Order</label>
                <input type="number" {...register('sortOrder', { valueAsNumber: true })} className="input" />
              </div>
              <div>
                <label className="text-xs font-semibold text-brand-navy/70">Status</label>
                <select {...register('status')} className="input">
                  <option value="ACTIVE">Active</option>
                  <option value="INACTIVE">Inactive</option>
                </select>
              </div>
            </div>
            <button
              type="submit"
              disabled={createMutation.isPending || updateMutation.isPending}
              className="w-full rounded-pill bg-brand-pink px-6 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-brand-pink-dark disabled:opacity-60"
            >
              {editing ? 'Save Changes' : 'Create Feature'}
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
}
