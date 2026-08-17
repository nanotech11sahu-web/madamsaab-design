import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Pencil, Trash2, ChevronDown } from 'lucide-react';
import { faqApi } from '@/services/cmsApi';
import { Modal } from '@/components/admin/Modal';
import type { Faq } from '@/types';

interface FormValues {
  question: string;
  answer: string;
  category: string;
  sortOrder: number;
  status: 'ACTIVE' | 'INACTIVE';
}

const EMPTY: FormValues = { question: '', answer: '', category: 'General', sortOrder: 0, status: 'ACTIVE' };

export function AdminFaq() {
  const queryClient = useQueryClient();
  const { data: faqs, isLoading } = useQuery({ queryKey: ['admin', 'faq'], queryFn: () => faqApi.list(true) });
  const [editing, setEditing] = useState<Faq | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);

  const { register, handleSubmit, reset } = useForm<FormValues>({ defaultValues: EMPTY });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['admin', 'faq'] });
    queryClient.invalidateQueries({ queryKey: ['faq'] });
  };

  const createMutation = useMutation({
    mutationFn: faqApi.create,
    onSuccess: () => {
      invalidate();
      closeForm();
    },
  });
  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<Faq> }) => faqApi.update(id, payload),
    onSuccess: () => {
      invalidate();
      closeForm();
    },
  });
  const removeMutation = useMutation({ mutationFn: faqApi.remove, onSuccess: invalidate });

  const openCreate = () => {
    setEditing(null);
    reset(EMPTY);
    setShowForm(true);
  };
  const openEdit = (f: Faq) => {
    setEditing(f);
    reset({ question: f.question, answer: f.answer, category: f.category, sortOrder: f.sortOrder, status: f.status });
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
          <h1 className="text-2xl font-extrabold text-brand-navy">FAQs</h1>
          <p className="mt-1 text-sm text-brand-navy/60">Manage frequently asked questions.</p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="flex items-center gap-2 rounded-pill bg-brand-pink px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-pink-dark"
        >
          <Plus size={16} /> New FAQ
        </button>
      </div>

      {isLoading && <p className="mt-6 text-sm text-brand-navy/50">Loading...</p>}

      <div className="mt-6 space-y-3">
        {faqs?.map((f) => (
          <div key={f._id} className="rounded-card border border-brand-border bg-white shadow-card">
            <button
              type="button"
              onClick={() => setExpanded(expanded === f._id ? null : f._id)}
              className="flex w-full items-center justify-between gap-3 p-4 text-left"
            >
              <div>
                <p className="text-sm font-semibold text-brand-navy">{f.question}</p>
                <span className="mt-1 inline-block rounded-full bg-brand-pink-light px-2 py-0.5 text-[11px] font-medium text-brand-pink">
                  {f.category}
                </span>
              </div>
              <ChevronDown size={16} className={`shrink-0 text-brand-navy/50 transition-transform ${expanded === f._id ? 'rotate-180' : ''}`} />
            </button>
            {expanded === f._id && (
              <div className="border-t border-brand-border px-4 py-3">
                <p className="text-sm text-brand-navy/70">{f.answer}</p>
                <div className="mt-3 flex gap-3">
                  <button type="button" onClick={() => openEdit(f)} className="flex items-center gap-1 text-xs font-semibold text-brand-pink hover:underline">
                    <Pencil size={12} /> Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => window.confirm('Delete this FAQ?') && removeMutation.mutate(f._id)}
                    className="flex items-center gap-1 text-xs font-semibold text-red-600 hover:underline"
                  >
                    <Trash2 size={12} /> Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {showForm && (
        <Modal title={editing ? 'Edit FAQ' : 'New FAQ'} onClose={closeForm}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-brand-navy/70">Question</label>
              <input {...register('question', { required: true })} className="input" />
            </div>
            <div>
              <label className="text-xs font-semibold text-brand-navy/70">Answer</label>
              <textarea {...register('answer', { required: true })} className="input min-h-28" />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <label className="text-xs font-semibold text-brand-navy/70">Category</label>
                <input {...register('category')} className="input" />
              </div>
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
              {editing ? 'Save Changes' : 'Create FAQ'}
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
}
