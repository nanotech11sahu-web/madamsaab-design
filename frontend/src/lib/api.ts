import axios from 'axios';

export const api = axios.create({
  baseURL: '/api/v1',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

function clearAuthAndRedirect() {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('madamsaab-admin-auth');
  const loginPath = window.location.pathname.startsWith('/admin') ? '/admin/login' : '/login';
  if (window.location.pathname !== loginPath) {
    window.location.href = loginPath;
  }
}

function getRefreshToken(): string | null {
  const raw = localStorage.getItem('madamsaab-admin-auth');
  if (!raw) return null;
  try {
    return JSON.parse(raw)?.state?.refreshToken ?? null;
  } catch {
    return null;
  }
}

function persistNewTokens(accessToken: string, refreshToken: string) {
  localStorage.setItem('accessToken', accessToken);
  const raw = localStorage.getItem('madamsaab-admin-auth');
  if (!raw) return;
  try {
    const parsed = JSON.parse(raw);
    parsed.state.accessToken = accessToken;
    parsed.state.refreshToken = refreshToken;
    localStorage.setItem('madamsaab-admin-auth', JSON.stringify(parsed));
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
      .post('/api/v1/auth/refresh', { refreshToken })
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
