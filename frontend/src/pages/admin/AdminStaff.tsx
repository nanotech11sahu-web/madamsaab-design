import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { adminStaffApi } from '@/services/adminApi';
import { Modal } from '@/components/admin/Modal';
import type { Staff } from '@/types';

interface FormValues {
  name: string;
  phone: string;
  email: string;
  skills: string;
  workingDaysStr: string;
  startTime: string;
  endTime: string;
  status: 'ACTIVE' | 'INACTIVE';
}

const EMPTY: FormValues = {
  name: '',
  phone: '',
  email: '',
  skills: '',
  workingDaysStr: 'MON,TUE,WED,THU,FRI,SAT',
  startTime: '09:00',
  endTime: '19:00',
  status: 'ACTIVE',
};

export function AdminStaff() {
  const queryClient = useQueryClient();
  const { data: staff, isLoading } = useQuery({ queryKey: ['admin', 'staff'], queryFn: adminStaffApi.list });
  const [editing, setEditing] = useState<Staff | null>(null);
  const [showForm, setShowForm] = useState(false);

  const { register, handleSubmit, reset } = useForm<FormValues>({ defaultValues: EMPTY });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['admin', 'staff'] });

  const createMutation = useMutation({
    mutationFn: adminStaffApi.create,
    onSuccess: () => {
      invalidate();
      closeForm();
    },
  });
  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<Staff> }) => adminStaffApi.update(id, payload),
    onSuccess: () => {
      invalidate();
      closeForm();
    },
  });
  const removeMutation = useMutation({
    mutationFn: adminStaffApi.remove,
    onSuccess: invalidate,
  });

  const openCreate = () => {
    setEditing(null);
    reset(EMPTY);
    setShowForm(true);
  };

  const openEdit = (s: Staff) => {
    setEditing(s);
    reset({
      name: s.name,
      phone: s.phone,
      email: s.email ?? '',
      skills: s.skills.join(', '),
      workingDaysStr: s.workingDays.join(','),
      startTime: s.workingHours?.start ?? '09:00',
      endTime: s.workingHours?.end ?? '19:00',
      status: s.status,
    });
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditing(null);
  };

  const toPayload = (v: FormValues) => ({
    name: v.name,
    phone: v.phone,
    email: v.email || undefined,
    skills: v.skills.split(',').map((s) => s.trim()).filter(Boolean),
    workingDays: v.workingDaysStr.split(',').map((s) => s.trim()).filter(Boolean),
    workingHours: { start: v.startTime, end: v.endTime },
    status: v.status,
  });

  const onSubmit = (values: FormValues) => {
    if (editing) {
      updateMutation.mutate({ id: editing._id, payload: toPayload(values) });
    } else {
      createMutation.mutate(toPayload(values));
    }
  };

  const StatusBadge = ({ status }: { status: Staff['status'] }) => (
    <span
      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
        status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
      }`}
    >
      {status}
    </span>
  );

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-brand-navy">Staff</h1>
          <p className="mt-1 text-sm text-brand-navy/60">Manage salon professionals.</p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="flex items-center gap-2 rounded-pill bg-brand-pink px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-pink-dark"
        >
          <Plus size={16} /> New Staff
        </button>
      </div>

      {isLoading && <p className="mt-6 text-sm text-brand-navy/50">Loading...</p>}

      {/* Mobile: stacked cards */}
      <div className="mt-6 space-y-3 sm:hidden">
        {staff?.map((s) => (
          <div key={s._id} className="rounded-card border border-brand-border bg-white p-4 shadow-card">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-semibold text-brand-navy">{s.name}</p>
                <p className="text-xs text-brand-navy/60">{s.phone}</p>
                <p className="mt-1 text-xs text-brand-navy/60">{s.skills.join(', ') || '—'}</p>
                <p className="mt-1 text-xs text-brand-navy/50">
                  {s.workingHours?.start} – {s.workingHours?.end}
                </p>
              </div>
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
            </div>
            <div className="mt-3">
              <StatusBadge status={s.status} />
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
              <th className="px-4 py-3">Phone</th>
              <th className="px-4 py-3">Skills</th>
              <th className="px-4 py-3">Hours</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {staff?.map((s) => (
              <tr key={s._id} className="border-b border-brand-border/50">
                <td className="px-4 py-3 font-medium text-brand-navy">{s.name}</td>
                <td className="px-4 py-3 text-brand-navy/70">{s.phone}</td>
                <td className="px-4 py-3 text-brand-navy/70">{s.skills.join(', ') || '—'}</td>
                <td className="px-4 py-3 text-brand-navy/70">
                  {s.workingHours?.start} – {s.workingHours?.end}
                </td>
                <td className="px-4 py-3"><StatusBadge status={s.status} /></td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
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
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showForm && (
        <Modal title={editing ? 'Edit Staff' : 'New Staff'} onClose={closeForm}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="text-xs font-semibold text-brand-navy/70">Name</label>
                <input {...register('name', { required: true })} className="input" />
              </div>
              <div>
                <label className="text-xs font-semibold text-brand-navy/70">Phone</label>
                <input {...register('phone', { required: true })} className="input" />
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-brand-navy/70">Email</label>
              <input {...register('email')} className="input" />
            </div>
            <div>
              <label className="text-xs font-semibold text-brand-navy/70">Skills (comma separated)</label>
              <input {...register('skills')} className="input" placeholder="Haircut, Facial, Makeup" />
            </div>
            <div>
              <label className="text-xs font-semibold text-brand-navy/70">Working Days (comma separated)</label>
              <input {...register('workingDaysStr')} className="input" placeholder="MON,TUE,WED" />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="text-xs font-semibold text-brand-navy/70">Start Time</label>
                <input type="time" {...register('startTime')} className="input" />
              </div>
              <div>
                <label className="text-xs font-semibold text-brand-navy/70">End Time</label>
                <input type="time" {...register('endTime')} className="input" />
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-brand-navy/70">Status</label>
              <select {...register('status')} className="input">
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
              </select>
            </div>
            <button
              type="submit"
              disabled={createMutation.isPending || updateMutation.isPending}
              className="w-full rounded-pill bg-brand-pink px-6 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-brand-pink-dark disabled:opacity-60"
            >
              {editing ? 'Save Changes' : 'Create Staff'}
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
}
