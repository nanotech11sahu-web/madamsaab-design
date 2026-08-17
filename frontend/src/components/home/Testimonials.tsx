import { useEffect, useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Star, User, ChevronLeft, ChevronRight } from 'lucide-react';
import { Reveal } from '@/components/common/Reveal';

const REVIEWS = [
  { name: 'Priya S.', rating: 5, text: 'The at-home facial was so relaxing and the professional was right on time. Booking on WhatsApp made everything so easy!' },
  { name: 'Ananya R.', rating: 5, text: 'Loved my bridal makeup trial. Premium products, super hygienic, and the artist was incredibly talented.' },
  { name: 'Kavya M.', rating: 4, text: 'Quick and convenient haircut at home. Will definitely book the Glow Package next time.' },
  { name: 'Riya T.', rating: 5, text: 'Eyebrow threading and cleanup were done so neatly. Feels like a proper salon experience at home.' },
];

export function Testimonials() {
  const [index, setIndex] = useState(0);

  const next = useCallback(() => setIndex((i) => (i + 1) % REVIEWS.length), []);
  const prev = () => setIndex((i) => (i - 1 + REVIEWS.length) % REVIEWS.length);

  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next]);

  const review = REVIEWS[index];

  return (
    <section id="reviews" className="scroll-mt-20">
      <Reveal>
        <h2 className="text-center text-2xl font-extrabold text-brand-navy">
          What Our Customers Say
        </h2>
        <p className="mx-auto mt-2 max-w-lg text-center text-sm text-brand-navy/60">
          Real experiences from real MadamSaab customers.
        </p>
      </Reveal>

      <div className="relative mx-auto mt-10 max-w-2xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={review.name}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="rounded-card border border-brand-border bg-white p-8 text-center shadow-card"
          >
            <div className="flex justify-center gap-0.5">
              {Array.from({ length: 5 }).map((_, idx) => (
                <Star
                  key={idx}
                  size={16}
                  className={idx < review.rating ? 'fill-brand-pink text-brand-pink' : 'text-brand-border'}
                />
              ))}
            </div>
            <p className="mx-auto mt-4 max-w-md text-sm text-brand-navy/70">&ldquo;{review.text}&rdquo;</p>
            <div className="mt-5 flex items-center justify-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-pink-light text-brand-pink">
                <User size={16} />
              </span>
              <span className="text-sm font-semibold text-brand-navy">{review.name}</span>
            </div>
          </motion.div>
        </AnimatePresence>

        <button
          type="button"
          onClick={prev}
          aria-label="Previous review"
          className="absolute left-0 top-1/2 hidden -translate-x-4 -translate-y-1/2 items-center justify-center rounded-full bg-white p-2 text-brand-navy shadow-card transition hover:text-brand-pink sm:flex"
        >
          <ChevronLeft size={18} />
        </button>
        <button
          type="button"
          onClick={next}
          aria-label="Next review"
          className="absolute right-0 top-1/2 hidden translate-x-4 -translate-y-1/2 items-center justify-center rounded-full bg-white p-2 text-brand-navy shadow-card transition hover:text-brand-pink sm:flex"
        >
          <ChevronRight size={18} />
        </button>

        <div className="mt-5 flex justify-center gap-2">
          {REVIEWS.map((r, i) => (
            <button
              key={r.name}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Go to review ${i + 1}`}
              className={`h-1.5 rounded-full transition-all ${
                i === index ? 'w-6 bg-brand-pink' : 'w-1.5 bg-brand-border'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
