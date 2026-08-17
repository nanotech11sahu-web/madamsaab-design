import { useEffect, useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'framer-motion';
import { Star, User, ChevronLeft, ChevronRight } from 'lucide-react';
import { Reveal } from '@/components/common/Reveal';
import { testimonialsApi } from '@/services/cmsApi';

export function Testimonials() {
  const [index, setIndex] = useState(0);
  const { data: reviews } = useQuery({
    queryKey: ['testimonials'],
    queryFn: () => testimonialsApi.list(),
  });

  const count = reviews?.length ?? 0;

  const next = useCallback(() => setIndex((i) => (count ? (i + 1) % count : 0)), [count]);
  const prev = () => setIndex((i) => (count ? (i - 1 + count) % count : 0));

  useEffect(() => {
    if (!count) return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next, count]);

  if (!reviews || reviews.length === 0) return null;

  const review = reviews[index] ?? reviews[0];

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
            key={review._id}
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
              {review.image ? (
                <img src={review.image} alt={review.name} className="h-9 w-9 rounded-full object-cover" />
              ) : (
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-pink-light text-brand-pink">
                  <User size={16} />
                </span>
              )}
              <span className="text-sm font-semibold text-brand-navy">{review.name}</span>
            </div>
          </motion.div>
        </AnimatePresence>

        {reviews.length > 1 && (
          <>
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
              {reviews.map((r, i) => (
                <button
                  key={r._id}
                  type="button"
                  onClick={() => setIndex(i)}
                  aria-label={`Go to review ${i + 1}`}
                  className={`h-1.5 rounded-full transition-all ${
                    i === index ? 'w-6 bg-brand-pink' : 'w-1.5 bg-brand-border'
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
