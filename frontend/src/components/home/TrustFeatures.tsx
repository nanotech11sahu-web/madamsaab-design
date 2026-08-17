import { useQuery } from '@tanstack/react-query';
import { trustFeaturesApi } from '@/services/cmsApi';
import { getLucideIcon } from '@/utils/iconRegistry';

export function TrustFeatures() {
  const { data: features } = useQuery({
    queryKey: ['trust-features'],
    queryFn: () => trustFeaturesApi.list(),
  });

  if (!features || features.length === 0) return null;

  return (
    <div className="grid grid-cols-2 divide-y divide-brand-border sm:grid-cols-4 sm:divide-x sm:divide-y-0">
      {features.map(({ _id, icon, label }) => {
        const Icon = getLucideIcon(icon);
        return (
          <div
            key={_id}
            className="flex flex-col items-center gap-2 px-3 py-4 text-center first:pt-0 sm:py-0"
          >
            <Icon size={22} className="text-brand-pink" />
            <span className="text-xs font-semibold text-brand-navy/80">{label}</span>
          </div>
        );
      })}
    </div>
  );
}
