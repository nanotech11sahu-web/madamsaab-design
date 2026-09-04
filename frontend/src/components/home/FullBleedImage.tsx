import { ImageCarousel } from '@/components/common/ImageCarousel';

const SLIDES = [
  {
    src: 'https://images.unsplash.com/photo-1600948836101-f9ffda59d250?w=1600&h=500&fit=crop&q=80&auto=format',
    alt: 'Salon interior with mirrors and styling stations',
  },
  {
    src: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=1600&h=500&fit=crop&q=80&auto=format',
    alt: 'Empty styling chairs in a premium salon interior',
  },
  {
    src: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=1600&h=500&fit=crop&q=80&auto=format',
    alt: 'Premium beauty and makeup products',
  },
  {
    src: 'https://images.unsplash.com/photo-1522336284037-91f7da073525?w=1600&h=500&fit=crop&q=80&auto=format',
    alt: 'Hair styling tools and accessories',
  },
];

export function FullBleedImage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <ImageCarousel
        images={SLIDES}
        className="h-56 w-full rounded-card shadow-card sm:h-72 lg:h-96"
        intervalMs={5000}
      />
    </div>
  );
}
