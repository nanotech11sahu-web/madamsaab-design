import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { adminServicesApi } from '@/services/adminApi';
import { Modal } from '@/components/admin/Modal';
import type { Service } from '@/types';

interface FormValues {
  name: string;
  category: string;
  price: number;
  duration: number;
  shortDescription: string;
  homeServiceAvailable: boolean;
  salonServiceAvailable: boolean;
  featured: boolean;
  status: 'ACTIVE' | 'INACTIVE';
}

const EMPTY: FormValues = {
  name: '',
  category: '',
  price: 0,
  duration: 30,
  shortDescription: '',
  homeServiceAvailable: true,
  salonServiceAvailable: true,
  featured: false,
  status: 'ACTIVE',
};

export function AdminServices() {
  const queryClient = useQueryClient();
  const { data: services, isLoading } = useQuery({
    queryKey: ['admin', 'services'],
    queryFn: adminServicesApi.list,
  });
  const [editing, setEditing] = useState<Service | null>(null);
  const [showForm, setShowForm] = useState(false);

  const { register, handleSubmit, reset } = useForm<FormValues>({ defaultValues: EMPTY });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['admin', 'services'] });
    queryClient.invalidateQueries({ queryKey: ['services'] });
  };

  const createMutation = useMutation({
    mutationFn: adminServicesApi.create,
    onSuccess: () => {
      invalidate();
      closeForm();
    },
  });
  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<Service> }) =>
      adminServicesApi.update(id, payload),
    onSuccess: () => {
      invalidate();
      closeForm();
    },
  });
  const removeMutation = useMutation({
    mutationFn: adminServicesApi.remove,
    onSuccess: invalidate,
  });

  const openCreate = () => {
    setEditing(null);
    reset(EMPTY);
    setShowForm(true);
  };

  const openEdit = (service: Service) => {
    setEditing(service);
    reset({
      name: service.name,
      category: service.category,
      price: service.price,
      duration: service.duration,
      shortDescription: service.shortDescription ?? '',
      homeServiceAvailable: service.homeServiceAvailable,
      salonServiceAvailable: service.salonServiceAvailable,
      featured: service.featured,
      status: service.status,
    });
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditing(null);
  };

  const onSubmit = (values: FormValues) => {
    if (editing) {
      updateMutation.mutate({ id: editing._id, payload: values });
    } else {
      createMutation.mutate(values);
    }
  };

  const StatusBadge = ({ status }: { status: Service['status'] }) => (
    <span
      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
        status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
      }`}
    >
      {status}
    </span>
  );

  const RowActions = ({ s }: { s: Service }) => (
    <div className="flex gap-2">
      <button type="button" onClick={() => openEdit(s)} className="rounded-lg p-1.5 text-brand-navy/60 hover:bg-brand-pink-bg hover:text-brand-pink">
        <Pencil size={15} />
      </button>
      <button
        type="button"
        onClick={() => window.confirm(`Delete ${s.name}?`) && removeMutation.mutate(s._id)}
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
          <h1 className="text-2xl font-extrabold text-brand-navy">Services</h1>
          <p className="mt-1 text-sm text-brand-navy/60">Manage services and pricing.</p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="flex items-center gap-2 rounded-pill bg-brand-pink px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-pink-dark"
        >
          <Plus size={16} /> New Service
        </button>
      </div>

      {isLoading && <p className="mt-6 text-sm text-brand-navy/50">Loading...</p>}

      {/* Mobile: stacked cards */}
      <div className="mt-6 space-y-3 sm:hidden">
        {services?.map((s) => (
          <div key={s._id} className="rounded-card border border-brand-border bg-white p-4 shadow-card">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-semibold text-brand-navy">{s.name}</p>
                <p className="text-xs text-brand-navy/60">{s.category} · {s.duration} min</p>
              </div>
              <RowActions s={s} />
            </div>
            <div className="mt-3 flex items-center gap-2">
              <span className="font-bold text-brand-pink">₹{s.price}</span>
              <StatusBadge status={s.status} />
              {s.featured && <span className="rounded-full bg-brand-pink-light px-2 py-0.5 text-xs font-medium text-brand-pink">Featured</span>}
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
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Duration</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Featured</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {services?.map((s) => (
              <tr key={s._id} className="border-b border-brand-border/50">
                <td className="px-4 py-3 font-medium text-brand-navy">{s.name}</td>
                <td className="px-4 py-3 text-brand-navy/70">{s.category}</td>
                <td className="px-4 py-3 font-semibold text-brand-pink">₹{s.price}</td>
                <td className="px-4 py-3 text-brand-navy/70">{s.duration} min</td>
                <td className="px-4 py-3"><StatusBadge status={s.status} /></td>
                <td className="px-4 py-3 text-brand-navy/70">{s.featured ? 'Yes' : 'No'}</td>
                <td className="px-4 py-3">
                  <div className="flex justify-end"><RowActions s={s} /></div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showForm && (
        <Modal title={editing ? 'Edit Service' : 'New Service'} onClose={closeForm}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-brand-navy/70">Name</label>
              <input {...register('name', { required: true })} className="input" />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="text-xs font-semibold text-brand-navy/70">Category</label>
                <input {...register('category', { required: true })} className="input" />
              </div>
              <div>
                <label className="text-xs font-semibold text-brand-navy/70">Short Description</label>
                <input {...register('shortDescription')} className="input" />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="text-xs font-semibold text-brand-navy/70">Price (₹)</label>
                <input type="number" {...register('price', { required: true, valueAsNumber: true })} className="input" />
              </div>
              <div>
                <label className="text-xs font-semibold text-brand-navy/70">Duration (min)</label>
                <input type="number" {...register('duration', { required: true, valueAsNumber: true })} className="input" />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <label className="flex items-center gap-2 text-sm text-brand-navy/80">
                <input type="checkbox" {...register('homeServiceAvailable')} className="accent-brand-pink" />
                Home Service
              </label>
              <label className="flex items-center gap-2 text-sm text-brand-navy/80">
                <input type="checkbox" {...register('salonServiceAvailable')} className="accent-brand-pink" />
                Salon Service
              </label>
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
              {editing ? 'Save Changes' : 'Create Service'}
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
}
