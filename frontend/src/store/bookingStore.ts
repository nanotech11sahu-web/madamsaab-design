import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Service, Package } from '@/types';

interface BookingState {
  selectedServices: Service[];
  selectedPackages: Package[];
  toggleService: (service: Service) => void;
  togglePackage: (pkg: Package) => void;
  clear: () => void;
  subtotal: () => number;
  itemCount: () => number;
}

export const useBookingStore = create<BookingState>()(
  persist(
    (set, get) => ({
      selectedServices: [],
      selectedPackages: [],
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
      clear: () => set({ selectedServices: [], selectedPackages: [] }),
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
