interface LogoProps {
  className?: string;
}

export function Logo({ className = '' }: LogoProps) {
  return (
    <span
      className={`select-none text-2xl font-bold tracking-tight ${className}`}
      style={{ fontFamily: 'var(--font-logo)' }}
    >
      <span className="text-brand-blue">Madam</span>
      <span className="text-brand-pink">Saab</span>
    </span>
  );
}
