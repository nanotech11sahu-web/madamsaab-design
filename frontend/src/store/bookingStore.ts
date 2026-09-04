import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Service, Package } from '@/types';

export type ServiceMode = 'HOME' | 'SALON';

interface BookingState {
  serviceMode: ServiceMode | null;
  selectedServices: Service[];
  selectedPackages: Package[];
  couponCode: string | null;
  discountAmount: number;
  setServiceMode: (mode: ServiceMode) => void;
  changeServiceMode: (mode: ServiceMode) => void;
  setCoupon: (code: string | null, discountAmount: number) => void;
  toggleService: (service: Service) => void;
  togglePackage: (pkg: Package) => void;
  clear: () => void;
  subtotal: () => number;
  itemCount: () => number;
}

export const useBookingStore = create<BookingState>()(
  persist(
    (set, get) => ({
      serviceMode: null,
      selectedServices: [],
      selectedPackages: [],
      couponCode: null,
      discountAmount: 0,
      setServiceMode: (mode) => set({ serviceMode: mode }),
      changeServiceMode: (mode) =>
        set({
          serviceMode: mode,
          selectedServices: [],
          selectedPackages: [],
          couponCode: null,
          discountAmount: 0,
        }),
      setCoupon: (code, discountAmount) => set({ couponCode: code, discountAmount }),
      toggleService: (service) =>
        set((state) => {
          const exists = state.selectedServices.some((s) => s._id === service._id);
          return {
            selectedServices: exists
              ? state.selectedServices.filter((s) => s._id !== service._id)
              : [...state.selectedServices, service],
          };
        }),
      togglePackage: (pkg) =>
        set((state) => {
          const exists = state.selectedPackages.some((p) => p._id === pkg._id);
          return {
            selectedPackages: exists
              ? state.selectedPackages.filter((p) => p._id !== pkg._id)
              : [...state.selectedPackages, pkg],
          };
        }),
      clear: () =>
        set({ selectedServices: [], selectedPackages: [], couponCode: null, discountAmount: 0 }),
      subtotal: () => {
        const { selectedServices, selectedPackages } = get();
        return (
          selectedServices.reduce((sum, s) => sum + s.price, 0) +
          selectedPackages.reduce((sum, p) => sum + p.packagePrice, 0)
        );
      },
      itemCount: () => {
        const { selectedServices, selectedPackages } = get();
        return selectedServices.length + selectedPackages.length;
      },
    }),
    { name: 'madamsaab-booking-cart' },
  ),
);
