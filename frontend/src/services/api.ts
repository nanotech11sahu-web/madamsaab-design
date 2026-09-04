import { api } from '@/lib/api';
import type {
  Service,
  Package,
  Settings,
  CreateBookingPayload,
  CreateBookingResponse,
} from '@/types';

interface ApplyCouponResponse {
  valid: boolean;
  message: string;
  discountAmount: number;
}

interface CreatePaymentOrderResponse {
  orderId: string;
  amount: number;
  currency: string;
  keyId: string;
}

export const servicesApi = {
  list: async (): Promise<Service[]> => (await api.get('/services')).data,
  bySlug: async (slug: string): Promise<Service> =>
    (await api.get(`/services/${slug}`)).data,
};

export const packagesApi = {
  list: async (): Promise<Package[]> => (await api.get('/packages')).data,
  bySlug: async (slug: string): Promise<Package> =>
    (await api.get(`/packages/${slug}`)).data,
};

export const settingsApi = {
  get: async (): Promise<Settings> => (await api.get('/settings')).data,
};

export const bookingsApi = {
  create: async (
    payload: CreateBookingPayload,
  ): Promise<CreateBookingResponse> =>
    (await api.post('/bookings', payload)).data,
};

export const couponsApi = {
  apply: async (code: string, subtotal: number): Promise<ApplyCouponResponse> =>
    (await api.post('/coupons/apply', { code, subtotal })).data,
};

export const paymentsApi = {
  createOrder: async (bookingId: string): Promise<CreatePaymentOrderResponse> =>
    (await api.post('/payments/order', { bookingId })).data,
  verify: async (payload: {
    bookingId: string;
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
  }): Promise<{ success: boolean }> => (await api.post('/payments/verify', payload)).data,
};

export const contactApi = {
  submit: async (payload: {
    name: string;
    email: string;
    phone: string;
    subject?: string;
    message: string;
  }) => (await api.post('/contact', payload)).data,
};
