import {
  ShieldCheck,
  BadgeCheck,
  Sparkles,
  Clock,
  Heart,
  Star,
  Award,
  ThumbsUp,
  Users,
  Smile,
  Leaf,
  Gem,
  type LucideIcon,
} from 'lucide-react';

const ICON_MAP: Record<string, LucideIcon> = {
  ShieldCheck,
  BadgeCheck,
  Sparkles,
  Clock,
  Heart,
  Star,
  Award,
  ThumbsUp,
  Users,
  Smile,
  Leaf,
  Gem,
};

export const ICON_NAME_OPTIONS = Object.keys(ICON_MAP);

export function getLucideIcon(name: string): LucideIcon {
  return ICON_MAP[name] ?? Sparkles;
}
