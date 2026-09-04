import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AdminUser } from '@/types';

interface CustomerAuthState {
  user: AdminUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  setAuth: (user: AdminUser, accessToken: string, refreshToken: string) => void;
  logout: () => void;
}

export const useCustomerAuthStore = create<CustomerAuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      setAuth: (user, accessToken, refreshToken) => {
        localStorage.setItem('customer_accessToken', accessToken);
        set({ user, accessToken, refreshToken });
      },
      logout: () => {
        localStorage.removeItem('customer_accessToken');
        set({ user: null, accessToken: null, refreshToken: null });
      },
    }),
    { name: 'madamsaab-customer-auth' },
  ),
);
