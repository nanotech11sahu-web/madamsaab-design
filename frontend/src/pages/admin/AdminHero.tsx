import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { heroApi } from '@/services/cmsApi';
import { ImageUpload } from '@/components/admin/ImageUpload';

interface FormValues {
  heading: string;
  subheading: string;
  image: string;
  ctaText: string;
  ctaLink: string;
  status: 'ACTIVE' | 'INACTIVE';
}

export function AdminHero() {
  const queryClient = useQueryClient();
  const { data: hero, isLoading } = useQuery({ queryKey: ['cms', 'hero'], queryFn: heroApi.get });

  const { register, handleSubmit, reset, control } = useForm<FormValues>();

  useEffect(() => {
    if (hero) {
      reset({
        heading: hero.heading,
        subheading: hero.subheading,
        image: hero.image,
        ctaText: hero.ctaText,
        ctaLink: hero.ctaLink,
        status: hero.status,
      });
    }
  }, [hero, reset]);

  const mutation = useMutation({
    mutationFn: heroApi.update,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cms', 'hero'] }),
  });

  if (isLoading || !hero) {
    return <p className="text-sm text-brand-navy/50">Loading...</p>;
  }

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-brand-navy">Homepage Hero</h1>
      <p className="mt-1 text-sm text-brand-navy/60">
        This content can optionally replace the default hero carousel with a single custom image.
      </p>

      {mutation.isSuccess && (
        <p className="mt-4 rounded-lg bg-green-50 p-3 text-sm text-green-700">Hero updated.</p>
      )}

      <form
        onSubmit={handleSubmit((v) => mutation.mutate(v))}
        className="mt-6 max-w-xl space-y-5 rounded-card border border-brand-border bg-white p-6 shadow-card"
      >
        <div>
          <label className="text-xs font-semibold text-brand-navy/70">Heading</label>
          <input {...register('heading', { required: true })} className="input" />
        </div>
        <div>
          <label className="text-xs font-semibold text-brand-navy/70">Subheading</label>
          <textarea {...register('subheading')} className="input min-h-20" />
        </div>
        <Controller
          control={control}
          name="image"
          render={({ field }) => (
            <ImageUpload value={field.value} onChange={field.onChange} folder="madamsaab/hero" label="Hero Image (optional)" />
          )}
        />
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-brand-navy/70">CTA Button Text</label>
            <input {...register('ctaText')} className="input" />
          </div>
          <div>
            <label className="text-xs font-semibold text-brand-navy/70">CTA Link</label>
            <input {...register('ctaLink')} className="input" placeholder="/book" />
          </div>
        </div>
        <div>
          <label className="text-xs font-semibold text-brand-navy/70">Status</label>
          <select {...register('status')} className="input">
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={mutation.isPending}
          className="rounded-pill bg-brand-pink px-6 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-brand-pink-dark disabled:opacity-60"
        >
          {mutation.isPending ? 'Saving...' : 'Save Hero'}
        </button>
      </form>
    </div>
  );
}
