import { ShieldCheck, Target, Eye, Sparkles, Users, Clock } from 'lucide-react';
import { Reveal } from '@/components/common/Reveal';
import { ImagePlaceholder } from '@/components/ui/ImagePlaceholder';
import { SEO } from '@/components/common/SEO';

const FEATURES = [
  { icon: ShieldCheck, title: 'Hygiene First', text: 'Sanitized tools and single-use consumables for every appointment.' },
  { icon: Users, title: 'Certified Women Professionals', text: 'Background-verified stylists and therapists, trained on premium brands.' },
  { icon: Sparkles, title: 'Premium Products', text: 'We use only salon-grade, dermatologist-approved products.' },
  { icon: Clock, title: 'On-Time, Every Time', text: 'Your slot is confirmed on WhatsApp and our professional arrives on time.' },
];

const GALLERY = [
  { src: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=600&h=450&fit=crop&crop=faces&q=80&auto=format', alt: 'Makeup application for a client' },
  { src: 'https://images.unsplash.com/photo-1519415387722-a1c3bbef716c?w=600&h=450&fit=crop&crop=faces&q=80&auto=format', alt: 'Eyebrow threading service' },
  { src: 'https://images.unsplash.com/photo-1519014816548-bf5fe059798b?w=600&h=450&fit=crop&q=80&auto=format', alt: 'Nail art detailing' },
];

const TEAM = [
  { role: 'Senior Hair Stylist' },
  { role: 'Makeup Artist' },
  { role: 'Skin & Facial Expert' },
  { role: 'Nail Technician' },
];

export function About() {
  return (
    <div>
      <SEO
        title="About Us"
        description="MadamSaab connects women with certified beauty professionals for premium salon services at home. Learn about our mission, hygiene standards, and team."
      />
      <section className="bg-brand-pink-bg">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:items-center lg:px-8 lg:py-20">
          <Reveal direction="right">
            <p className="text-sm font-semibold uppercase tracking-wide text-brand-pink">
              About Us · For Women
            </p>
            <h1 className="mt-2 text-3xl font-extrabold leading-tight text-brand-navy sm:text-4xl">
              Salon-quality beauty, brought home with care.
            </h1>
            <p className="mt-4 max-w-lg text-brand-navy/70">
              MadamSaab connects women with certified beauty professionals who
              bring premium salon services straight to your doorstep. From quick
              touch-ups to bridal makeovers, we combine hygienic practices,
              quality products, and a seamless WhatsApp booking experience so you
              always feel pampered, never inconvenienced.
            </p>
          </Reveal>
          <Reveal direction="left" delay={0.1} className="overflow-hidden rounded-card shadow-card">
            <img
              src="https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=900&h=650&fit=crop&crop=faces&q=80&auto=format"
              alt="MadamSaab beauty professional at work"
              className="h-72 w-full object-cover sm:h-96"
            />
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-6 sm:grid-cols-2">
          <Reveal className="rounded-card border border-brand-border bg-white p-8 shadow-card">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-pink-light text-brand-pink">
              <Target size={22} />
            </span>
            <h2 className="mt-4 text-lg font-bold text-brand-navy">Our Mission</h2>
            <p className="mt-2 text-sm text-brand-navy/70">
              To make premium, hygienic salon care accessible to every woman at
              home — booked in seconds, delivered with genuine care, no
              compromises.
            </p>
          </Reveal>
          <Reveal delay={0.1} className="rounded-card border border-brand-border bg-white p-8 shadow-card">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-pink-light text-brand-pink">
              <Eye size={22} />
            </span>
            <h2 className="mt-4 text-lg font-bold text-brand-navy">Our Vision</h2>
            <p className="mt-2 text-sm text-brand-navy/70">
              To become India&apos;s most trusted women&apos;s at-home beauty
              brand, known for consistency, professionalism, and a delightfully
              simple booking experience.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="bg-brand-pink-bg py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <h2 className="text-center text-2xl font-extrabold text-brand-navy">
              Why Choose MadamSaab
            </h2>
          </Reveal>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map(({ icon: Icon, title, text }, i) => (
              <Reveal key={title} delay={i * 0.1}>
                <div className="h-full rounded-card border border-brand-border bg-white p-6 text-center shadow-card">
                  <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand-pink-light text-brand-pink">
                    <Icon size={22} />
                  </span>
                  <h3 className="mt-4 text-sm font-bold text-brand-navy">{title}</h3>
                  <p className="mt-2 text-xs text-brand-navy/60">{text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <Reveal>
          <h2 className="text-center text-2xl font-extrabold text-brand-navy">
            A Glimpse Into Our Work
          </h2>
        </Reveal>
        <div className="mt-10 grid gap-5 sm:grid-cols-3">
          {GALLERY.map(({ src, alt }, i) => (
            <Reveal key={src} delay={i * 0.1} className="overflow-hidden rounded-card shadow-card">
              <img src={src} alt={alt} className="h-56 w-full object-cover" />
            </Reveal>
          ))}
        </div>
      </section>

      <section className="bg-brand-pink-bg py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <h2 className="text-center text-2xl font-extrabold text-brand-navy">
              Meet Our Professionals
            </h2>
            <p className="mx-auto mt-2 max-w-lg text-center text-sm text-brand-navy/60">
              Team photos will appear here once added from Admin → Staff.
            </p>
          </Reveal>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {TEAM.map(({ role }, i) => (
              <Reveal key={role} delay={i * 0.1}>
                <div className="rounded-card border border-brand-border bg-white p-5 text-center shadow-card">
                  <ImagePlaceholder className="mx-auto h-24 w-24 rounded-full" />
                  <h3 className="mt-4 text-sm font-bold text-brand-navy">{role}</h3>
                  <p className="mt-1 text-xs text-brand-navy/50">Photo coming soon</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
