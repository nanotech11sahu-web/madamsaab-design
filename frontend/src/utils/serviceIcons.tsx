import {
  Scissors,
  Sparkles,
  Droplets,
  Hand,
  Gem,
  Wand2,
  Flower2,
  type LucideIcon,
} from 'lucide-react';

const ICON_MAP: Record<string, LucideIcon> = {
  haircut: Scissors,
  facial: Sparkles,
  cleanup: Droplets,
  waxing: Hand,
  'hair-spa': Flower2,
  'korean-glow-facial': Sparkles,
  'bridal-makeup': Wand2,
  'nail-extension': Gem,
};

export function getServiceIcon(slug: string): LucideIcon {
  return ICON_MAP[slug] ?? Sparkles;
}
