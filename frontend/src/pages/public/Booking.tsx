import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { X } from 'lucide-react';
import { useBookingStore } from '@/store/bookingStore';
import { useSettings } from '@/hooks/useServices';
import { bookingsApi } from '@/services/api';
import { bookingFormSchema, TIME_SLOTS, type BookingFormValues } from '@/schemas/booking.schema';
import type { CreateBookingResponse } from '@/types';
import { SEO } from '@/components/common/SEO';

export function Booking() {
  const navigate = useNavigate();
  const { selectedServices, selectedPackages, toggleService, togglePackage, subtotal, clear } =
    useBookingStore();
  const { data: settings } = useSettings();
  const [result, setResult] = useState<CreateBookingResponse | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<BookingFormValues>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: { serviceType: 'HOME' },
  });

  const serviceType = watch('serviceType');
  const homeServiceFee = serviceType === 'HOME' ? (settings?.homeServiceFee ?? 0) : 0;
  const total = subtotal() + homeServiceFee;

  const mutation = useMutation({
    mutationFn: bookingsApi.create,
    onSuccess: (data) => {
      setResult(data);
      clear();
    },
  });

  const onSubmit = (values: BookingFormValues) => {
    if (selectedServices.length === 0 && selectedPackages.length === 0) return;
    mutation.mutate({
      customer: { name: values.name, phone: values.phone, email: values.email || undefined },
      serviceIds: selectedServices.map((s) => s._id),
      packageIds: selectedPackages.map((p) => p._id),
      serviceType: values.serviceType,
      address:
        values.serviceType === 'HOME'
          ? {
              line1: values.line1!,
              line2: values.line2,
              city: values.city!,
              state: values.state!,
              pincode: values.pincode!,
            }
          : undefined,
      appointmentDate: values.appointmentDate,
      timeSlot: values.timeSlot,
      notes: values.notes,
    });
  };

  if (result) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16 text-center sm:px-6">
        <h1 className="text-2xl font-extrabold text-brand-navy">Booking Created!</h1>
        <p className="mt-2 text-brand-navy/70">
          Booking Number: <span className="font-bold text-brand-pink">{result.booking.bookingNumber}</span>
        </p>
        <p className="mt-4 text-sm text-brand-navy/60">
          Tap below to open WhatsApp and send your booking details to confirm and arrange payment.
        </p>
        <a
          href={result.whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex items-center gap-2 rounded-pill bg-brand-pink px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-brand-pink-dark"
        >
          BOOK NOW ON WHATSAPP
        </a>
        <div className="mt-8">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="text-sm font-medium text-brand-navy/60 hover:text-brand-pink"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  if (selectedServices.length === 0 && selectedPackages.length === 0) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16 text-center sm:px-6">
        <h1 className="text-xl font-bold text-brand-navy">Your booking is empty</h1>
        <p className="mt-2 text-brand-navy/60">Select services or packages to get started.</p>
        <button
          type="button"
          onClick={() => navigate('/services')}
          className="mt-6 rounded-pill bg-brand-pink px-6 py-2.5 text-sm font-semibold text-white"
        >
          Browse Services
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <SEO title="Complete Your Booking" noindex />
      <h1 className="text-2xl font-extrabold text-brand-navy sm:text-3xl">Complete Your Booking</h1>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <fieldset className="rounded-card border border-brand-border bg-white p-5">
            <legend className="px-1 text-sm font-bold text-brand-navy">Customer Details</legend>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-xs font-semibold text-brand-navy/70">Full Name</label>
                <input {...register('name')} className="input" placeholder="Your name" />
                {errors.name && <p className="err">{errors.name.message}</p>}
              </div>
              <div>
                <label className="text-xs font-semibold text-brand-navy/70">Phone</label>
                <input {...register('phone')} className="input" placeholder="10-digit mobile number" />
                {errors.phone && <p className="err">{errors.phone.message}</p>}
              </div>
              <div className="sm:col-span-2">
                <label className="text-xs font-semibold text-brand-navy/70">Email (optional)</label>
                <input {...register('email')} className="input" placeholder="you@example.com" />
                {errors.email && <p className="err">{errors.email.message}</p>}
              </div>
            </div>
          </fieldset>

          <fieldset className="rounded-card border border-brand-border bg-white p-5">
            <legend className="px-1 text-sm font-bold text-brand-navy">Service Type</legend>
            <div className="flex gap-3">
              <label className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg border border-brand-border p-3 text-sm font-medium has-[:checked]:border-brand-pink has-[:checked]:bg-brand-pink-light">
                <input type="radio" value="HOME" {...register('serviceType')} className="accent-brand-pink" />
                Home Service
              </label>
              <label className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg border border-brand-border p-3 text-sm font-medium has-[:checked]:border-brand-pink has-[:checked]:bg-brand-pink-light">
                <input type="radio" value="SALON" {...register('serviceType')} className="accent-brand-pink" />
                Salon Visit
              </label>
            </div>
          </fieldset>

          {serviceType === 'HOME' && (
            <fieldset className="rounded-card border border-brand-border bg-white p-5">
              <legend className="px-1 text-sm font-bold text-brand-navy">Address</legend>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-brand-navy/70">Address Line 1</label>
                  <input {...register('line1')} className="input" placeholder="House no, street" />
                  {errors.line1 && <p className="err">{errors.line1.message}</p>}
                </div>
                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-brand-navy/70">Address Line 2</label>
                  <input {...register('line2')} className="input" placeholder="Landmark (optional)" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-brand-navy/70">City</label>
                  <input {...register('city')} className="input" />
                  {errors.city && <p className="err">{errors.city.message}</p>}
                </div>
                <div>
                  <label className="text-xs font-semibold text-brand-navy/70">State</label>
                  <input {...register('state')} className="input" />
                  {errors.state && <p className="err">{errors.state.message}</p>}
                </div>
                <div>
                  <label className="text-xs font-semibold text-brand-navy/70">Pincode</label>
                  <input {...register('pincode')} className="input" />
                  {errors.pincode && <p className="err">{errors.pincode.message}</p>}
                </div>
              </div>
            </fieldset>
          )}

          <fieldset className="rounded-card border border-brand-border bg-white p-5">
            <legend className="px-1 text-sm font-bold text-brand-navy">Date &amp; Time</legend>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-xs font-semibold text-brand-navy/70">Appointment Date</label>
                <input
                  type="date"
                  min={new Date().toISOString().split('T')[0]}
                  {...register('appointmentDate')}
                  className="input"
                />
                {errors.appointmentDate && <p className="err">{errors.appointmentDate.message}</p>}
              </div>
              <div>
                <label className="text-xs font-semibold text-brand-navy/70">Preferred Time</label>
                <select {...register('timeSlot')} className="input">
                  <option value="">Select a time</option>
                  {TIME_SLOTS.map((slot) => (
                    <option key={slot} value={slot}>{slot}</option>
                  ))}
                </select>
                {errors.timeSlot && <p className="err">{errors.timeSlot.message}</p>}
              </div>
            </div>
          </fieldset>

          <fieldset className="rounded-card border border-brand-border bg-white p-5">
            <legend className="px-1 text-sm font-bold text-brand-navy">Notes (optional)</legend>
            <textarea {...register('notes')} className="input min-h-20" placeholder="Any special instructions" />
          </fieldset>

          {mutation.isError && (
            <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
              Something went wrong creating your booking. Please try again.
            </p>
          )}

          <button
            type="submit"
            disabled={mutation.isPending}
            className="w-full rounded-pill bg-brand-pink px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-brand-pink-dark disabled:opacity-60"
          >
            {mutation.isPending ? 'Booking...' : 'BOOK NOW ON WHATSAPP'}
          </button>
        </form>

        <aside className="h-fit rounded-card border border-brand-border bg-white p-5 shadow-card">
          <h2 className="text-sm font-bold text-brand-navy">Booking Summary</h2>
          <ul className="mt-4 space-y-2">
            {selectedServices.map((s) => (
              <li key={s._id} className="flex items-center justify-between text-sm">
                <span className="text-brand-navy/80">{s.name}</span>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-brand-navy">₹{s.price}</span>
                  <button type="button" onClick={() => toggleService(s)} aria-label={`Remove ${s.name}`}>
                    <X size={14} className="text-brand-navy/40 hover:text-brand-pink" />
                  </button>
                </div>
              </li>
            ))}
            {selectedPackages.map((p) => (
              <li key={p._id} className="flex items-center justify-between text-sm">
                <span className="text-brand-navy/80">{p.name}</span>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-brand-navy">₹{p.packagePrice}</span>
                  <button type="button" onClick={() => togglePackage(p)} aria-label={`Remove ${p.name}`}>
                    <X size={14} className="text-brand-navy/40 hover:text-brand-pink" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-4 space-y-1 border-t border-brand-border pt-4 text-sm">
            <div className="flex justify-between text-brand-navy/70">
              <span>Subtotal</span>
              <span>₹{subtotal()}</span>
            </div>
            <div className="flex justify-between text-brand-navy/70">
              <span>Home Service Fee</span>
              <span>₹{homeServiceFee}</span>
            </div>
            <div className="flex justify-between pt-2 text-base font-bold text-brand-navy">
              <span>Total</span>
              <span className="text-brand-pink">₹{total}</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
