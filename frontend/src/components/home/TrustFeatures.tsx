import { ShieldCheck, BadgeCheck, Sparkles, Clock } from 'lucide-react';

const FEATURES = [
  { icon: ShieldCheck, label: '100% Hygienic' },
  { icon: BadgeCheck, label: 'Verified Professionals' },
  { icon: Sparkles, label: 'Premium Products' },
  { icon: Clock, label: 'On-time Service' },
];

export function TrustFeatures() {
  return (
    <div className="grid grid-cols-2 divide-y divide-brand-border sm:grid-cols-4 sm:divide-x sm:divide-y-0">
      {FEATURES.map(({ icon: Icon, label }) => (
        <div
          key={label}
          className="flex flex-col items-center gap-2 px-3 py-4 text-center first:pt-0 sm:py-0"
        >
          <Icon size={22} className="text-brand-pink" />
          <span className="text-xs font-semibold text-brand-navy/80">{label}</span>
        </div>
      ))}
    </div>
  );
}
