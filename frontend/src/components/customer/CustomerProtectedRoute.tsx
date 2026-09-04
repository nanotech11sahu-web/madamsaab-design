import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useCustomerAuthStore } from '@/store/customerAuthStore';

export function CustomerProtectedRoute() {
  const user = useCustomerAuthStore((s) => s.user);
  const accessToken = useCustomerAuthStore((s) => s.accessToken);
  const location = useLocation();

  if (!user || !accessToken) {
    const redirect = `${location.pathname}${location.search}`;
    return <Navigate to={`/login?redirect=${encodeURIComponent(redirect)}`} replace />;
  }

  return <Outlet />;
}
