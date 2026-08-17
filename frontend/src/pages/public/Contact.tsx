import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';
import { contactApi } from '@/services/api';
import { useSettings } from '@/hooks/useServices';
import { contactFormSchema, type ContactFormValues } from '@/schemas/contact.schema';
import { PageBanner } from '@/components/common/PageBanner';

export function Contact() {
  const { data: settings } = useSettings();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormValues>({ resolver: zodResolver(contactFormSchema) });

  const mutation = useMutation({
    mutationFn: contactApi.submit,
    onSuccess: () => reset(),
  });

  return (
    <div>
      <PageBanner
        eyebrow="Get in Touch"
        title="Contact Us"
        description="Questions about a service, a booking, or a partnership? Send us a message or reach out directly on WhatsApp."
        image="https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=1600&q=80&auto=format&fit=crop"
      />

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr]">
          <div>
            <div className="overflow-hidden rounded-card shadow-card">
              <img
                src="https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=800&q=80&auto=format&fit=crop"
                alt="MadamSaab professional preparing for an appointment"
                className="h-56 w-full object-cover"
              />
            </div>

            <div className="mt-6 space-y-4">
              <div className="flex items-start gap-3 rounded-card border border-brand-border bg-white p-4 shadow-card">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-pink-light text-brand-pink">
                  <Phone size={18} />
                </span>
                <div>
                  <p className="text-xs font-semibold uppercase text-brand-navy/50">Phone</p>
                  <p className="text-sm font-medium text-brand-navy">
                    {settings?.phone || 'Available after setup in Admin Settings'}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-card border border-brand-border bg-white p-4 shadow-card">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-pink-light text-brand-pink">
                  <Mail size={18} />
                </span>
                <div>
                  <p className="text-xs font-semibold uppercase text-brand-navy/50">Email</p>
                  <p className="text-sm font-medium text-brand-navy">
                    {settings?.email || 'Available after setup in Admin Settings'}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-card border border-brand-border bg-white p-4 shadow-card">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-pink-light text-brand-pink">
                  <MapPin size={18} />
                </span>
                <div>
                  <p className="text-xs font-semibold uppercase text-brand-navy/50">Address</p>
                  <p className="text-sm font-medium text-brand-navy">
                    {settings?.address || 'Available after setup in Admin Settings'}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-card border border-brand-border bg-white p-4 shadow-card">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-pink-light text-brand-pink">
                  <Clock size={18} />
                </span>
                <div>
                  <p className="text-xs font-semibold uppercase text-brand-navy/50">Hours</p>
                  <p className="text-sm font-medium text-brand-navy">
                    {settings ? `${settings.openingTime} – ${settings.closingTime}` : '—'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-card border border-brand-border bg-white p-6 shadow-card sm:p-8">
            <h2 className="text-lg font-bold text-brand-navy">Send a Message</h2>
            <p className="mt-1 text-sm text-brand-navy/60">
              We usually reply within a few hours.
            </p>

            {mutation.isSuccess ? (
              <p className="mt-8 rounded-card border border-brand-pink/25 bg-brand-pink-light p-4 text-sm font-medium text-brand-navy">
                Thanks! We&apos;ve received your message and will get back to you soon.
              </p>
            ) : (
              <form onSubmit={handleSubmit((v) => mutation.mutate(v))} className="mt-6 space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="text-xs font-semibold text-brand-navy/70">Name</label>
                    <input {...register('name')} className="input" />
                    {errors.name && <p className="err">{errors.name.message}</p>}
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-brand-navy/70">Phone</label>
                    <input {...register('phone')} className="input" />
                    {errors.phone && <p className="err">{errors.phone.message}</p>}
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-brand-navy/70">Email</label>
                  <input {...register('email')} className="input" />
                  {errors.email && <p className="err">{errors.email.message}</p>}
                </div>
                <div>
                  <label className="text-xs font-semibold text-brand-navy/70">Subject</label>
                  <input {...register('subject')} className="input" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-brand-navy/70">Message</label>
                  <textarea {...register('message')} className="input min-h-28" />
                  {errors.message && <p className="err">{errors.message.message}</p>}
                </div>
                <button
                  type="submit"
                  disabled={mutation.isPending}
                  className="w-full rounded-pill bg-brand-pink px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-brand-pink-dark disabled:opacity-60"
                >
                  {mutation.isPending ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
