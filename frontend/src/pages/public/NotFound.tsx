import { Link } from 'react-router-dom';

export function NotFound() {
  return (
    <div className="mx-auto max-w-md px-4 py-24 text-center sm:px-6">
      <h1 className="text-3xl font-extrabold text-brand-navy">404</h1>
      <p className="mt-2 text-brand-navy/60">Page not found.</p>
      <Link to="/" className="mt-6 inline-block rounded-pill bg-brand-pink px-6 py-2.5 text-sm font-semibold text-white">
        Back to Home
      </Link>
    </div>
  );
}
