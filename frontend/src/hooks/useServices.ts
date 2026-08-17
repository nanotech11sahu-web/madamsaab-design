import { useQuery } from '@tanstack/react-query';
import { servicesApi, packagesApi, settingsApi } from '@/services/api';

export const useServices = () =>
  useQuery({ queryKey: ['services'], queryFn: servicesApi.list });

export const usePackages = () =>
  useQuery({ queryKey: ['packages'], queryFn: packagesApi.list });

export const useSettings = () =>
  useQuery({ queryKey: ['settings'], queryFn: settingsApi.get, staleTime: 5 * 60 * 1000 });
