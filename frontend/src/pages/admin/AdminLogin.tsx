import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { Logo } from '@/components/common/Logo';
import { authApi } from '@/services/adminApi';
import { useAuthStore } from '@/store/authStore';

const loginSchema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});

type LoginValues = z.infer<typeof loginSchema>;

export function AdminLogin() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValues>({ resolver: zodResolver(loginSchema) });

  const mutation = useMutation({
    mutationFn: (values: LoginValues) => authApi.login(values.email, values.password),
    onSuccess: (data) => {
      if (data.user.role !== 'ADMIN') {
        setError('This account does not have admin access.');
        return;
      }
      setAuth(data.user, data.accessToken, data.refreshToken);
      navigate('/admin');
    },
    onError: () => setError('Invalid email or password.'),
  });

  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-pink-bg px-4">
      <div className="w-full max-w-sm rounded-card border border-brand-border bg-white p-8 shadow-card">
        <div className="flex justify-center">
          <Logo />
        </div>
        <h1 className="mt-6 text-center text-lg font-bold text-brand-navy">Admin Login</h1>
        <p className="mt-1 text-center text-sm text-brand-navy/60">
          Sign in to manage your salon.
        </p>

        <form
          onSubmit={handleSubmit((v) => {
            setError('');
            mutation.mutate(v);
          })}
          className="mt-6 space-y-4"
        >
          <div>
            <label className="text-xs font-semibold text-brand-navy/70">Email</label>
            <input {...register('email')} className="input" placeholder="admin@madamsaab.com" />
            {errors.email && <p className="err">{errors.email.message}</p>}
          </div>
          <div>
            <label className="text-xs font-semibold text-brand-navy/70">Password</label>
            <input type="password" {...register('password')} className="input" />
            {errors.password && <p className="err">{errors.password.message}</p>}
          </div>

          {error && <p className="err">{error}</p>}

          <button
            type="submit"
            disabled={mutation.isPending}
            className="w-full rounded-pill bg-brand-pink px-6 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-brand-pink-dark disabled:opacity-60"
          >
            {mutation.isPending ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
