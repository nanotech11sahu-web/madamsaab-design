import { api } from '@/lib/api';
import type { AuthResponse, Profile, UserAddress, Booking, Review } from '@/types';

export const customerAuthApi = {
  register: async (payload: { name: string; email: string; phone: string; password: string }): Promise<AuthResponse> =>
    (await api.post('/auth/register', payload)).data,
  login: async (identifier: string, password: string): Promise<AuthResponse> =>
    (await api.post('/auth/login', { identifier, password })).data,
  logout: async (): Promise<void> => {
    await api.post('/auth/logout');
  },
};

export const profileApi = {
  get: async (): Promise<Profile> => (await api.get('/users/me')).data,
  update: async (payload: {
    name?: string;
    phone?: string;
    dateOfBirth?: string;
    gender?: string;
    profilePhoto?: string;
  }): Promise<Profile> =>
    (await api.patch('/users/me', payload)).data,
  addAddress: async (payload: Omit<UserAddress, 'isDefault'> & { isDefault?: boolean }): Promise<Profile> =>
    (await api.post('/users/me/addresses', payload)).data,
  updateAddress: async (index: number, payload: Partial<UserAddress>): Promise<Profile> =>
    (await api.patch(`/users/me/addresses/${index}`, payload)).data,
  removeAddress: async (index: number): Promise<Profile> =>
    (await api.delete(`/users/me/addresses/${index}`)).data,
};

export const myBookingsApi = {
  list: async (): Promise<Booking[]> => (await api.get('/bookings/my')).data,
  cancel: async (id: string): Promise<Booking> => (await api.patch(`/bookings/${id}/cancel`)).data,
};

export const myReviewsApi = {
  list: async (): Promise<Review[]> => (await api.get('/reviews/my')).data,
  submit: async (payload: { bookingId: string; rating: number; comment: string }): Promise<Review> =>
    (await api.post('/reviews', payload)).data,
};
