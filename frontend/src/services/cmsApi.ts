import { api } from '@/lib/api';
import type { HeroContent, Testimonial, Faq, TrustFeature } from '@/types';

export const heroApi = {
  get: async (): Promise<HeroContent> => (await api.get('/cms/hero')).data,
  update: async (payload: Partial<HeroContent>): Promise<HeroContent> =>
    (await api.patch('/cms/hero', payload)).data,
};

export const testimonialsApi = {
  list: async (admin = false): Promise<Testimonial[]> =>
    (await api.get(`/cms/testimonials${admin ? '?admin=true' : ''}`)).data,
  create: async (payload: Partial<Testimonial>): Promise<Testimonial> =>
    (await api.post('/cms/testimonials', payload)).data,
  update: async (id: string, payload: Partial<Testimonial>): Promise<Testimonial> =>
    (await api.patch(`/cms/testimonials/${id}`, payload)).data,
  remove: async (id: string): Promise<void> => {
    await api.delete(`/cms/testimonials/${id}`);
  },
};

export const faqApi = {
  list: async (admin = false): Promise<Faq[]> =>
    (await api.get(`/cms/faq${admin ? '?admin=true' : ''}`)).data,
  create: async (payload: Partial<Faq>): Promise<Faq> => (await api.post('/cms/faq', payload)).data,
  update: async (id: string, payload: Partial<Faq>): Promise<Faq> =>
    (await api.patch(`/cms/faq/${id}`, payload)).data,
  remove: async (id: string): Promise<void> => {
    await api.delete(`/cms/faq/${id}`);
  },
};

export const trustFeaturesApi = {
  list: async (admin = false): Promise<TrustFeature[]> =>
    (await api.get(`/cms/trust-features${admin ? '?admin=true' : ''}`)).data,
  create: async (payload: Partial<TrustFeature>): Promise<TrustFeature> =>
    (await api.post('/cms/trust-features', payload)).data,
  update: async (id: string, payload: Partial<TrustFeature>): Promise<TrustFeature> =>
    (await api.patch(`/cms/trust-features/${id}`, payload)).data,
  remove: async (id: string): Promise<void> => {
    await api.delete(`/cms/trust-features/${id}`);
  },
};

export const mediaApi = {
  upload: async (file: File, folder = 'madamsaab'): Promise<{ url: string; publicId: string }> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);
    const res = await api.post('/media/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },
};
