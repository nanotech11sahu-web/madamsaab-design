import { ImageCarousel } from '@/components/common/ImageCarousel';

const SLIDES = [
  {
    src: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1920&h=500&fit=crop&q=80&auto=format',
    alt: 'Stylist blow-drying a client\'s hair in the salon',
  },
  {
    src: 'https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=1920&h=500&fit=crop&q=80&auto=format',
    alt: 'Relaxing facial treatment at the salon',
  },
  {
    src: 'https://images.unsplash.com/photo-1596178065887-1198b6148b2b?w=1920&h=500&fit=crop&q=80&auto=format',
    alt: 'Manicure and nail care session',
  },
  {
    src: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=1920&h=500&fit=crop&crop=faces&q=80&auto=format',
    alt: 'Professional makeup application',
  },
];

export function FullBleedImage() {
  return <ImageCarousel images={SLIDES} className="h-56 w-full sm:h-72 lg:h-96" intervalMs={5000} />;
}
