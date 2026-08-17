import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { adminPackagesApi, adminServicesApi } from '@/services/adminApi';
import { Modal } from '@/components/admin/Modal';
import type { Package, Service } from '@/types';

interface FormValues {
  name: string;
  shortDescription: string;
  packagePrice: number;
  originalPrice: number;
  duration: number;
  serviceIds: string[];
  featured: boolean;
  status: 'ACTIVE' | 'INACTIVE';
}

const EMPTY: FormValues = {
  name: '',
  shortDescription: '',
  packagePrice: 0,
  originalPrice: 0,
  duration: 60,
  serviceIds: [],
  featured: false,
  status: 'ACTIVE',
};

export function AdminPackages() {
  const queryClient = useQueryClient();
  const { data: packages, isLoading } = useQuery({
    queryKey: ['admin', 'packages'],
    queryFn: adminPackagesApi.list,
  });
  const { data: services } = useQuery({ queryKey: ['admin', 'services'], queryFn: adminServicesApi.list });

  const [editing, setEditing] = useState<Package | null>(null);
  const [showForm, setShowForm] = useState(false);

  const { register, handleSubmit, reset, control } = useForm<FormValues>({ defaultValues: EMPTY });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['admin', 'packages'] });
    queryClient.invalidateQueries({ queryKey: ['packages'] });
  };

  const createMutation = useMutation({
    mutationFn: (v: FormValues) => adminPackagesApi.create({ ...v, services: v.serviceIds }),
    onSuccess: () => {
      invalidate();
      closeForm();
    },
  });
  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Record<string, unknown> }) =>
      adminPackagesApi.update(id, payload),
    onSuccess: () => {
      invalidate();
      closeForm();
    },
  });
  const removeMutation = useMutation({
    mutationFn: adminPackagesApi.remove,
    onSuccess: invalidate,
  });

  const openCreate = () => {
    setEditing(null);
    reset(EMPTY);
    setShowForm(true);
  };

  const openEdit = (pkg: Package) => {
    setEditing(pkg);
    const svcIds = (pkg.services as Service[]).map((s) => (typeof s === 'string' ? s : s._id));
    reset({
      name: pkg.name,
      shortDescription: pkg.shortDescription ?? '',
      packagePrice: pkg.packagePrice,
      originalPrice: pkg.originalPrice ?? 0,
      duration: pkg.duration,
      serviceIds: svcIds,
      featured: pkg.featured,
      status: pkg.status,
    });
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditing(null);
  };

  const onSubmit = (values: FormValues) => {
    if (editing) {
      updateMutation.mutate({ id: editing._id, payload: { ...values, services: values.serviceIds } });
    } else {
      createMutation.mutate(values);
    }
  };

  const servicesOf = (p: Package) =>
    (p.services as Service[]).map((s) => (typeof s === 'string' ? s : s.name)).join(', ');

  const StatusBadge = ({ status }: { status: Package['status'] }) => (
    <span
      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
        status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
      }`}
    >
      {status}
    </span>
  );

  const RowActions = ({ p }: { p: Package }) => (
    <div className="flex gap-2">
      <button type="button" onClick={() => openEdit(p)} className="rounded-lg p-1.5 text-brand-navy/60 hover:bg-brand-pink-bg hover:text-brand-pink">
        <Pencil size={15} />
      </button>
      <button
        type="button"
        onClick={() => window.confirm(`Delete ${p.name}?`) && removeMutation.mutate(p._id)}
        className="rounded-lg p-1.5 text-brand-navy/60 hover:bg-red-50 hover:text-red-600"
      >
        <Trash2 size={15} />
      </button>
    </div>
  );

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-brand-navy">Packages</h1>
          <p className="mt-1 text-sm text-brand-navy/60">Manage combo packages.</p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="flex items-center gap-2 rounded-pill bg-brand-pink px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-pink-dark"
        >
          <Plus size={16} /> New Package
        </button>
      </div>

      {isLoading && <p className="mt-6 text-sm text-brand-navy/50">Loading...</p>}

      {/* Mobile: stacked cards */}
      <div className="mt-6 space-y-3 sm:hidden">
        {packages?.map((p) => (
          <div key={p._id} className="rounded-card border border-brand-border bg-white p-4 shadow-card">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-semibold text-brand-navy">{p.name}</p>
                <p className="mt-0.5 text-xs text-brand-navy/60">{servicesOf(p)}</p>
              </div>
              <RowActions p={p} />
            </div>
            <div className="mt-3 flex items-center gap-2">
              <span className="font-bold text-brand-pink">₹{p.packagePrice}</span>
              <StatusBadge status={p.status} />
            </div>
          </div>
        ))}
      </div>

      {/* Desktop: table */}
      <div className="mt-6 hidden overflow-x-auto rounded-card border border-brand-border bg-white shadow-card sm:block">
        <table className="w-full min-w-[700px] text-left text-sm">
          <thead>
            <tr className="border-b border-brand-border text-xs uppercase text-brand-navy/50">
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Services</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {packages?.map((p) => (
              <tr key={p._id} className="border-b border-brand-border/50">
                <td className="px-4 py-3 font-medium text-brand-navy">{p.name}</td>
                <td className="px-4 py-3 text-brand-navy/70">{servicesOf(p)}</td>
                <td className="px-4 py-3 font-semibold text-brand-pink">₹{p.packagePrice}</td>
                <td className="px-4 py-3"><StatusBadge status={p.status} /></td>
                <td className="px-4 py-3">
                  <div className="flex justify-end"><RowActions p={p} /></div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showForm && (
        <Modal title={editing ? 'Edit Package' : 'New Package'} onClose={closeForm}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-brand-navy/70">Name</label>
              <input {...register('name', { required: true })} className="input" />
            </div>
            <div>
              <label className="text-xs font-semibold text-brand-navy/70">Short Description</label>
              <input {...register('shortDescription')} className="input" />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <label className="text-xs font-semibold text-brand-navy/70">Price (₹)</label>
                <input type="number" {...register('packagePrice', { required: true, valueAsNumber: true })} className="input" />
              </div>
              <div>
                <label className="text-xs font-semibold text-brand-navy/70">Original Price (₹)</label>
                <input type="number" {...register('originalPrice', { valueAsNumber: true })} className="input" />
              </div>
              <div>
                <label className="text-xs font-semibold text-brand-navy/70">Duration (min)</label>
                <input type="number" {...register('duration', { required: true, valueAsNumber: true })} className="input" />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-brand-navy/70">Included Services</label>
              <Controller
                control={control}
                name="serviceIds"
                render={({ field }) => (
                  <div className="mt-2 max-h-40 space-y-1.5 overflow-y-auto rounded-lg border border-brand-border p-3">
                    {services?.map((s) => (
                      <label key={s._id} className="flex items-center gap-2 text-sm text-brand-navy/80">
                        <input
                          type="checkbox"
                          checked={field.value.includes(s._id)}
                          onChange={(e) => {
                            field.onChange(
                              e.target.checked
                                ? [...field.value, s._id]
                                : field.value.filter((id) => id !== s._id),
                            );
                          }}
                          className="accent-brand-pink"
                        />
                        {s.name} (₹{s.price})
                      </label>
                    ))}
                  </div>
                )}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <label className="flex items-center gap-2 text-sm text-brand-navy/80">
                <input type="checkbox" {...register('featured')} className="accent-brand-pink" />
                Featured
              </label>
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
              {editing ? 'Save Changes' : 'Create Package'}
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
}
