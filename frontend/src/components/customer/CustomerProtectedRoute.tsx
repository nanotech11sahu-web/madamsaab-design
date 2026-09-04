import { Navigate, Outlet } from 'react-router-dom';
import { useCustomerAuthStore } from '@/store/customerAuthStore';

export function CustomerProtectedRoute() {
  const user = useCustomerAuthStore((s) => s.user);
  const accessToken = useCustomerAuthStore((s) => s.accessToken);

  if (!user || !accessToken) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
