import { CalendarCheck, MessageCircleHeart, Sparkles, ThumbsUp } from 'lucide-react';
import { Reveal } from '@/components/common/Reveal';

const STEPS = [
  { icon: Sparkles, title: 'Pick Services', text: 'Choose services or packages and see the price instantly.' },
  { icon: CalendarCheck, title: 'Choose Slot', text: 'Select your preferred date, time, and home or salon visit.' },
  { icon: MessageCircleHeart, title: 'Confirm on WhatsApp', text: 'Send your booking details and confirm payment on WhatsApp.' },
  { icon: ThumbsUp, title: 'Relax & Enjoy', text: 'Our professional arrives on time with everything needed.' },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="scroll-mt-20">
      <Reveal>
        <h2 className="text-center text-2xl font-extrabold text-brand-navy">How It Works</h2>
        <p className="mx-auto mt-2 max-w-lg text-center text-sm text-brand-navy/60">
          Booking a salon appointment has never been this simple.
        </p>
      </Reveal>

      <div className="mt-10 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
        {STEPS.map(({ icon: Icon, title, text }, i) => (
          <Reveal key={title} delay={i * 0.1}>
            <div className="relative h-full rounded-card border border-brand-border bg-white p-4 text-center shadow-card sm:p-6">
              <span className="absolute -top-3 left-1/2 flex h-7 w-7 -translate-x-1/2 items-center justify-center rounded-full bg-brand-navy text-xs font-bold text-white">
                {i + 1}
              </span>
              <span className="mx-auto mt-3 flex h-11 w-11 items-center justify-center rounded-full bg-brand-pink-light text-brand-pink sm:h-12 sm:w-12">
                <Icon size={20} />
              </span>
              <h3 className="mt-4 text-xs font-bold text-brand-navy sm:text-sm">{title}</h3>
              <p className="mt-2 text-[11px] text-brand-navy/60 sm:text-xs">{text}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
