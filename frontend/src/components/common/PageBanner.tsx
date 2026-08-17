interface PageBannerProps {
  eyebrow: string;
  title: string;
  description?: string;
  image: string;
}

export function PageBanner({ eyebrow, title, description, image }: PageBannerProps) {
  return (
    <section className="relative overflow-hidden bg-brand-navy">
      <img
        src={image}
        alt=""
        className="absolute inset-0 h-full w-full object-cover opacity-25"
      />
      <div className="relative mx-auto max-w-7xl px-4 py-14 text-center sm:px-6 lg:px-8">
        <p className="text-sm font-semibold uppercase tracking-wide text-brand-pink">
          {eyebrow}
        </p>
        <h1 className="mt-2 text-3xl font-extrabold text-white sm:text-4xl">{title}</h1>
        {description && (
          <p className="mx-auto mt-3 max-w-xl text-white/70">{description}</p>
        )}
      </div>
    </section>
  );
}
