import { api } from '@/lib/api';
import type {
  AuthResponse,
  Service,
  Package,
  Booking,
  Staff,
  Settings,
  ContactSubmission,
  DashboardStats,
} from '@/types';

export const authApi = {
  login: async (email: string, password: string): Promise<AuthResponse> =>
    (await api.post('/auth/login', { email, password })).data,
  logout: async (): Promise<void> => {
    await api.post('/auth/logout');
  },
};

export const adminDashboardApi = {
  get: async (): Promise<DashboardStats> => (await api.get('/admin/dashboard')).data,
};

export const adminServicesApi = {
  list: async (): Promise<Service[]> => (await api.get('/services?admin=true')).data,
  create: async (payload: Partial<Service>): Promise<Service> =>
    (await api.post('/services', payload)).data,
  update: async (id: string, payload: Partial<Service>): Promise<Service> =>
    (await api.patch(`/services/${id}`, payload)).data,
  remove: async (id: string): Promise<void> => {
    await api.delete(`/services/${id}`);
  },
};

export const adminPackagesApi = {
  list: async (): Promise<Package[]> => (await api.get('/packages?admin=true')).data,
  create: async (payload: Record<string, unknown>): Promise<Package> =>
    (await api.post('/packages', payload)).data,
  update: async (id: string, payload: Record<string, unknown>): Promise<Package> =>
    (await api.patch(`/packages/${id}`, payload)).data,
  remove: async (id: string): Promise<void> => {
    await api.delete(`/packages/${id}`);
  },
};

export const adminBookingsApi = {
  list: async (params?: { status?: string; search?: string }): Promise<Booking[]> =>
    (await api.get('/bookings', { params: { ...params, limit: '100' } })).data.items,
  updateStatus: async (id: string, bookingStatus: string): Promise<Booking> =>
    (await api.patch(`/bookings/${id}/status`, { bookingStatus })).data,
  assignStaff: async (id: string, staffId: string): Promise<Booking> =>
    (await api.patch(`/bookings/${id}/assign-staff`, { staffId })).data,
};

export const adminStaffApi = {
  list: async (): Promise<Staff[]> => (await api.get('/staff?admin=true')).data,
  create: async (payload: Partial<Staff>): Promise<Staff> =>
    (await api.post('/staff', payload)).data,
  update: async (id: string, payload: Partial<Staff>): Promise<Staff> =>
    (await api.patch(`/staff/${id}`, payload)).data,
  remove: async (id: string): Promise<void> => {
    await api.delete(`/staff/${id}`);
  },
};

export const adminSettingsApi = {
  update: async (payload: Partial<Settings>): Promise<Settings> =>
    (await api.patch('/settings', payload)).data,
};

export const adminContactApi = {
  list: async (): Promise<ContactSubmission[]> => (await api.get('/contact')).data,
  updateStatus: async (id: string, status: string): Promise<ContactSubmission> =>
    (await api.patch(`/contact/${id}/status`, { status })).data,
};
