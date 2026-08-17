import { ImageIcon } from 'lucide-react';
import { cn } from '@/lib/cn';

interface ImagePlaceholderProps {
  className?: string;
  label?: string;
}

export function ImagePlaceholder({ className = '', label }: ImagePlaceholderProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-1.5 bg-brand-pink-light text-brand-pink/60',
        className,
      )}
    >
      <ImageIcon size={28} strokeWidth={1.5} />
      {label && <span className="text-[11px] font-medium">{label}</span>}
    </div>
  );
}
