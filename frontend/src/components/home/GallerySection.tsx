import { ImageCarousel } from '@/components/common/ImageCarousel';
import { Reveal } from '@/components/common/Reveal';

const GALLERY_SLIDES = [
  { src: 'https://images.unsplash.com/photo-1519014816548-bf5fe059798b?w=1400&h=550&fit=crop&q=80&auto=format', alt: 'Nail art detailing' },
  { src: 'https://images.unsplash.com/photo-1571875257727-256c39da42af?w=1400&h=550&fit=crop&q=80&auto=format', alt: 'Premium makeup products' },
  { src: 'https://images.unsplash.com/photo-1607779097040-26e80aa78e66?w=1400&h=550&fit=crop&q=80&auto=format', alt: 'Manicure detailing' },
  { src: 'https://images.unsplash.com/photo-1600948836101-f9ffda59d250?w=1400&h=550&fit=crop&q=80&auto=format', alt: "Women's salon interior" },
];

export function GallerySection() {
  return (
    <section>
      <Reveal>
        <h2 className="text-center text-2xl font-extrabold text-brand-navy">Our Gallery</h2>
        <p className="mx-auto mt-2 max-w-lg text-center text-sm text-brand-navy/60">
          A glimpse of the work our professionals do every day.
        </p>
      </Reveal>

      <Reveal delay={0.1} className="mt-10">
        <ImageCarousel images={GALLERY_SLIDES} className="h-64 rounded-card shadow-card sm:h-80 lg:h-96" />
      </Reveal>
    </section>
  );
}
