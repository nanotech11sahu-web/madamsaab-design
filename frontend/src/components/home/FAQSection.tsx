import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ChevronDown } from 'lucide-react';
import { faqApi } from '@/services/cmsApi';
import { Reveal } from '@/components/common/Reveal';

export function FAQSection() {
  const { data: faqs } = useQuery({ queryKey: ['faq'], queryFn: () => faqApi.list() });
  const [openId, setOpenId] = useState<string | null>(null);

  if (!faqs || faqs.length === 0) return null;

  return (
    <section id="faq" className="scroll-mt-20">
      <Reveal>
        <h2 className="text-center text-2xl font-extrabold text-brand-navy">
          Frequently Asked Questions
        </h2>
        <p className="mx-auto mt-2 max-w-lg text-center text-sm text-brand-navy/60">
          Everything you need to know before booking.
        </p>
      </Reveal>

      <div className="mx-auto mt-8 max-w-2xl space-y-3">
        {faqs.map((f, i) => (
          <Reveal key={f._id} delay={i * 0.05}>
            <div className="rounded-card border border-brand-border bg-white shadow-card">
              <button
                type="button"
                onClick={() => setOpenId(openId === f._id ? null : f._id)}
                className="flex w-full items-center justify-between gap-3 p-4 text-left"
              >
                <span className="text-sm font-semibold text-brand-navy">{f.question}</span>
                <ChevronDown
                  size={16}
                  className={`shrink-0 text-brand-pink transition-transform ${openId === f._id ? 'rotate-180' : ''}`}
                />
              </button>
              {openId === f._id && (
                <div className="border-t border-brand-border px-4 py-3">
                  <p className="text-sm text-brand-navy/70">{f.answer}</p>
                </div>
              )}
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
