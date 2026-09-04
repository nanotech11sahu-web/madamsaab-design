import axios from 'axios';

export const API_BASE_URL = import.meta.env.VITE_API_URL || '/api/v1';

export const api = axios.create({
  baseURL: API_BASE_URL,
});

type AuthNamespace = 'admin' | 'customer';

function currentNamespace(): AuthNamespace {
  return window.location.pathname.startsWith('/admin') ? 'admin' : 'customer';
}

function tokenKey(ns: AuthNamespace): string {
  return ns === 'admin' ? 'admin_accessToken' : 'customer_accessToken';
}

function storeKey(ns: AuthNamespace): string {
  return ns === 'admin' ? 'madamsaab-admin-auth' : 'madamsaab-customer-auth';
}

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(tokenKey(currentNamespace()));
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

function clearAuthAndRedirect() {
  const ns = currentNamespace();
  localStorage.removeItem(tokenKey(ns));
  localStorage.removeItem(storeKey(ns));
  const loginPath = ns === 'admin' ? '/admin/login' : '/login';
  if (window.location.pathname !== loginPath) {
    window.location.href = loginPath;
  }
}

function getRefreshToken(): string | null {
  const raw = localStorage.getItem(storeKey(currentNamespace()));
  if (!raw) return null;
  try {
    return JSON.parse(raw)?.state?.refreshToken ?? null;
  } catch {
    return null;
  }
}

function persistNewTokens(accessToken: string, refreshToken: string) {
  const ns = currentNamespace();
  localStorage.setItem(tokenKey(ns), accessToken);
  const raw = localStorage.getItem(storeKey(ns));
  if (!raw) return;
  try {
    const parsed = JSON.parse(raw);
    parsed.state.accessToken = accessToken;
    parsed.state.refreshToken = refreshToken;
    localStorage.setItem(storeKey(ns), JSON.stringify(parsed));
  } catch {
    // ignore malformed state
  }
}

let refreshPromise: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return null;

  if (!refreshPromise) {
    refreshPromise = axios
      .post(`${API_BASE_URL}/auth/refresh`, { refreshToken })
      .then((res) => {
        const { accessToken, refreshToken: newRefreshToken } = res.data;
        persistNewTokens(accessToken, newRefreshToken);
        return accessToken as string;
      })
      .catch(() => null)
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry && originalRequest.url !== '/auth/refresh') {
      originalRequest._retry = true;
      const newToken = await refreshAccessToken();
      if (newToken) {
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      }
      clearAuthAndRedirect();
    }

    return Promise.reject(error);
  },
);
