import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { adminCouponsApi } from '@/services/adminApi';
import { Modal } from '@/components/admin/Modal';
import type { Coupon } from '@/types';

interface FormValues {
  code: string;
  description: string;
  type: 'PERCENTAGE' | 'FLAT';
  value: number;
  isActive: boolean;
  minOrderAmount: number;
  maxDiscountAmount: number | '';
  usageLimit: number | '';
  validFrom: string;
  validUntil: string;
}

const EMPTY: FormValues = {
  code: '',
  description: '',
  type: 'PERCENTAGE',
  value: 10,
  isActive: true,
  minOrderAmount: 0,
  maxDiscountAmount: '',
  usageLimit: '',
  validFrom: '',
  validUntil: '',
};

export function AdminCoupons() {
  const queryClient = useQueryClient();
  const { data: coupons, isLoading } = useQuery({
    queryKey: ['admin', 'coupons'],
    queryFn: adminCouponsApi.list,
  });
  const [editing, setEditing] = useState<Coupon | null>(null);
  const [showForm, setShowForm] = useState(false);

  const { register, handleSubmit, reset } = useForm<FormValues>({ defaultValues: EMPTY });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['admin', 'coupons'] });

  const createMutation = useMutation({
    mutationFn: adminCouponsApi.create,
    onSuccess: () => {
      invalidate();
      closeForm();
    },
  });
  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<Coupon> }) =>
      adminCouponsApi.update(id, payload),
    onSuccess: () => {
      invalidate();
      closeForm();
    },
  });
  const removeMutation = useMutation({
    mutationFn: adminCouponsApi.remove,
    onSuccess: invalidate,
  });

  const openCreate = () => {
    setEditing(null);
    reset(EMPTY);
    setShowForm(true);
  };

  const openEdit = (coupon: Coupon) => {
    setEditing(coupon);
    reset({
      code: coupon.code,
      description: coupon.description ?? '',
      type: coupon.type,
      value: coupon.value,
      isActive: coupon.isActive,
      minOrderAmount: coupon.minOrderAmount,
      maxDiscountAmount: coupon.maxDiscountAmount ?? '',
      usageLimit: coupon.usageLimit ?? '',
      validFrom: coupon.validFrom ? coupon.validFrom.slice(0, 10) : '',
      validUntil: coupon.validUntil ? coupon.validUntil.slice(0, 10) : '',
    });
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditing(null);
  };

  const onSubmit = (values: FormValues) => {
    const payload: Partial<Coupon> = {
      code: values.code,
      description: values.description,
      type: values.type,
      value: Number(values.value),
      isActive: values.isActive,
      minOrderAmount: Number(values.minOrderAmount) || 0,
      maxDiscountAmount: values.maxDiscountAmount === '' ? undefined : Number(values.maxDiscountAmount),
      usageLimit: values.usageLimit === '' ? undefined : Number(values.usageLimit),
      validFrom: values.validFrom || undefined,
      validUntil: values.validUntil || undefined,
    };
    if (editing) {
      updateMutation.mutate({ id: editing._id, payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const StatusBadge = ({ active }: { active: boolean }) => (
    <span
      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
        active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
      }`}
    >
      {active ? 'Active' : 'Inactive'}
    </span>
  );

  const RowActions = ({ c }: { c: Coupon }) => (
    <div className="flex gap-2">
      <button type="button" onClick={() => openEdit(c)} className="rounded-lg p-1.5 text-brand-navy/60 hover:bg-brand-pink-bg hover:text-brand-pink">
        <Pencil size={15} />
      </button>
      <button
        type="button"
        onClick={() => window.confirm(`Delete coupon ${c.code}?`) && removeMutation.mutate(c._id)}
        className="rounded-lg p-1.5 text-brand-navy/60 hover:bg-red-50 hover:text-red-600"
      >
        <Trash2 size={15} />
      </button>
    </div>
  );

  const valueLabel = (c: Coupon) => (c.type === 'PERCENTAGE' ? `${c.value}%` : `₹${c.value}`);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-brand-navy">Coupons</h1>
          <p className="mt-1 text-sm text-brand-navy/60">Create and manage discount coupons for checkout.</p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="flex items-center gap-2 rounded-pill bg-brand-pink px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-pink-dark"
        >
          <Plus size={16} /> New Coupon
        </button>
      </div>

      {isLoading && <p className="mt-6 text-sm text-brand-navy/50">Loading...</p>}
      {!isLoading && coupons?.length === 0 && (
        <p className="mt-6 text-sm text-brand-navy/50">No coupons yet. Create your first one.</p>
      )}

      {/* Mobile: stacked cards */}
      <div className="mt-6 space-y-3 sm:hidden">
        {coupons?.map((c) => (
          <div key={c._id} className="rounded-card border border-brand-border bg-white p-4 shadow-card">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-semibold text-brand-navy">{c.code}</p>
                <p className="text-xs text-brand-navy/60">
                  {valueLabel(c)} off · min ₹{c.minOrderAmount} · used {c.usedCount}
                  {c.usageLimit ? `/${c.usageLimit}` : ''}
                </p>
              </div>
              <RowActions c={c} />
            </div>
            <div className="mt-3">
              <StatusBadge active={c.isActive} />
            </div>
          </div>
        ))}
      </div>

      {/* Desktop: table */}
      <div className="mt-6 hidden overflow-x-auto rounded-card border border-brand-border bg-white shadow-card sm:block">
        <table className="w-full min-w-[700px] text-left text-sm">
          <thead>
            <tr className="border-b border-brand-border text-xs uppercase text-brand-navy/50">
              <th className="px-4 py-3">Code</th>
              <th className="px-4 py-3">Discount</th>
              <th className="px-4 py-3">Min Order</th>
              <th className="px-4 py-3">Usage</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {coupons?.map((c) => (
              <tr key={c._id} className="border-b border-brand-border/50">
                <td className="px-4 py-3 font-medium text-brand-navy">{c.code}</td>
                <td className="px-4 py-3 font-semibold text-brand-pink">{valueLabel(c)}</td>
                <td className="px-4 py-3 text-brand-navy/70">₹{c.minOrderAmount}</td>
                <td className="px-4 py-3 text-brand-navy/70">
                  {c.usedCount}
                  {c.usageLimit ? `/${c.usageLimit}` : ''}
                </td>
                <td className="px-4 py-3"><StatusBadge active={c.isActive} /></td>
                <td className="px-4 py-3">
                  <div className="flex justify-end"><RowActions c={c} /></div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showForm && (
        <Modal title={editing ? 'Edit Coupon' : 'New Coupon'} onClose={closeForm}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="text-xs font-semibold text-brand-navy/70">Coupon Code</label>
                <input {...register('code', { required: true })} className="input uppercase" placeholder="WELCOME10" />
              </div>
              <div>
                <label className="text-xs font-semibold text-brand-navy/70">Type</label>
                <select {...register('type')} className="input">
                  <option value="PERCENTAGE">Percentage (%)</option>
                  <option value="FLAT">Flat (₹)</option>
                </select>
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-brand-navy/70">Description</label>
              <input {...register('description')} className="input" placeholder="Optional note for admin reference" />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="text-xs font-semibold text-brand-navy/70">Value</label>
                <input type="number" step="0.01" {...register('value', { required: true, valueAsNumber: true })} className="input" />
              </div>
              <div>
                <label className="text-xs font-semibold text-brand-navy/70">Max Discount Cap (₹, optional)</label>
                <input type="number" {...register('maxDiscountAmount')} className="input" placeholder="For percentage coupons" />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="text-xs font-semibold text-brand-navy/70">Minimum Order (₹)</label>
                <input type="number" {...register('minOrderAmount', { valueAsNumber: true })} className="input" />
              </div>
              <div>
                <label className="text-xs font-semibold text-brand-navy/70">Usage Limit (optional)</label>
                <input type="number" {...register('usageLimit')} className="input" placeholder="Unlimited" />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="text-xs font-semibold text-brand-navy/70">Valid From (optional)</label>
                <input type="date" {...register('validFrom')} className="input" />
              </div>
              <div>
                <label className="text-xs font-semibold text-brand-navy/70">Valid Until (optional)</label>
                <input type="date" {...register('validUntil')} className="input" />
              </div>
            </div>
            <label className="flex items-center gap-2 text-sm text-brand-navy/80">
              <input type="checkbox" {...register('isActive')} className="accent-brand-pink" />
              Active
            </label>
            <button
              type="submit"
              disabled={createMutation.isPending || updateMutation.isPending}
              className="w-full rounded-pill bg-brand-pink px-6 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-brand-pink-dark disabled:opacity-60"
            >
              {editing ? 'Save Changes' : 'Create Coupon'}
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
}
