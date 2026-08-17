interface SectionHeadingProps {
  children: React.ReactNode;
  className?: string;
}

export function SectionHeading({ children, className = '' }: SectionHeadingProps) {
  return (
    <div className={`flex items-center justify-center gap-3 ${className}`}>
      <span className="h-px w-8 bg-brand-pink/50 sm:w-14" />
      <h2 className="text-center text-lg font-bold tracking-wide text-brand-navy sm:text-xl">
        {children}
      </h2>
      <span className="h-px w-8 bg-brand-pink/50 sm:w-14" />
    </div>
  );
}
