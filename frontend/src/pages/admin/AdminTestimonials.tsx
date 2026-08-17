import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Pencil, Trash2, Star } from 'lucide-react';
import { testimonialsApi } from '@/services/cmsApi';
import { Modal } from '@/components/admin/Modal';
import { ImageUpload } from '@/components/admin/ImageUpload';
import type { Testimonial } from '@/types';

interface FormValues {
  name: string;
  image: string;
  rating: number;
  text: string;
  sortOrder: number;
  status: 'ACTIVE' | 'INACTIVE';
}

const EMPTY: FormValues = { name: '', image: '', rating: 5, text: '', sortOrder: 0, status: 'ACTIVE' };

export function AdminTestimonials() {
  const queryClient = useQueryClient();
  const { data: testimonials, isLoading } = useQuery({
    queryKey: ['admin', 'testimonials'],
    queryFn: () => testimonialsApi.list(true),
  });
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [showForm, setShowForm] = useState(false);

  const { register, handleSubmit, reset, control } = useForm<FormValues>({ defaultValues: EMPTY });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['admin', 'testimonials'] });
    queryClient.invalidateQueries({ queryKey: ['testimonials'] });
  };

  const createMutation = useMutation({
    mutationFn: testimonialsApi.create,
    onSuccess: () => {
      invalidate();
      closeForm();
    },
  });
  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<Testimonial> }) =>
      testimonialsApi.update(id, payload),
    onSuccess: () => {
      invalidate();
      closeForm();
    },
  });
  const removeMutation = useMutation({ mutationFn: testimonialsApi.remove, onSuccess: invalidate });

  const openCreate = () => {
    setEditing(null);
    reset(EMPTY);
    setShowForm(true);
  };
  const openEdit = (t: Testimonial) => {
    setEditing(t);
    reset({ name: t.name, image: t.image ?? '', rating: t.rating, text: t.text, sortOrder: t.sortOrder, status: t.status });
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
          <h1 className="text-2xl font-extrabold text-brand-navy">Testimonials</h1>
          <p className="mt-1 text-sm text-brand-navy/60">Shown in the homepage testimonials carousel.</p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="flex items-center gap-2 rounded-pill bg-brand-pink px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-pink-dark"
        >
          <Plus size={16} /> New Testimonial
        </button>
      </div>

      {isLoading && <p className="mt-6 text-sm text-brand-navy/50">Loading...</p>}

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {testimonials?.map((t) => (
          <div key={t._id} className="rounded-card border border-brand-border bg-white p-4 shadow-card">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                {t.image ? (
                  <img src={t.image} alt={t.name} className="h-9 w-9 rounded-full object-cover" />
                ) : (
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-pink-light text-xs font-bold text-brand-pink">
                    {t.name.charAt(0)}
                  </span>
                )}
                <div>
                  <p className="text-sm font-semibold text-brand-navy">{t.name}</p>
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={11} className={i < t.rating ? 'fill-brand-pink text-brand-pink' : 'text-brand-border'} />
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex gap-1">
                <button type="button" onClick={() => openEdit(t)} className="rounded-lg p-1.5 text-brand-navy/60 hover:bg-brand-pink-bg hover:text-brand-pink">
                  <Pencil size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => window.confirm(`Delete testimonial from ${t.name}?`) && removeMutation.mutate(t._id)}
                  className="rounded-lg p-1.5 text-brand-navy/60 hover:bg-red-50 hover:text-red-600"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
            <p className="mt-2 text-xs text-brand-navy/70">{t.text}</p>
            <span
              className={`mt-2 inline-block rounded-full px-2 py-0.5 text-[11px] font-medium ${
                t.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
              }`}
            >
              {t.status}
            </span>
          </div>
        ))}
      </div>

      {showForm && (
        <Modal title={editing ? 'Edit Testimonial' : 'New Testimonial'} onClose={closeForm}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-brand-navy/70">Customer Name</label>
              <input {...register('name', { required: true })} className="input" />
            </div>
            <Controller
              control={control}
              name="image"
              render={({ field }) => (
                <ImageUpload value={field.value} onChange={field.onChange} folder="madamsaab/testimonials" label="Photo (optional)" />
              )}
            />
            <div>
              <label className="text-xs font-semibold text-brand-navy/70">Rating</label>
              <select {...register('rating', { valueAsNumber: true })} className="input">
                {[5, 4, 3, 2, 1].map((n) => (
                  <option key={n} value={n}>
                    {n} Star{n > 1 ? 's' : ''}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-brand-navy/70">Review Text</label>
              <textarea {...register('text', { required: true })} className="input min-h-24" />
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
              {editing ? 'Save Changes' : 'Create Testimonial'}
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
}
