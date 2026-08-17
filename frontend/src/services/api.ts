import { api } from '@/lib/api';
import type {
  Service,
  Package,
  Settings,
  CreateBookingPayload,
  CreateBookingResponse,
} from '@/types';

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

export const contactApi = {
  submit: async (payload: {
    name: string;
    email: string;
    phone: string;
    subject?: string;
    message: string;
  }) => (await api.post('/contact', payload)).data,
};
