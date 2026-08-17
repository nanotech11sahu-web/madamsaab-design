import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { customerAuthApi } from '@/services/customerApi';
import { useAuthStore } from '@/store/authStore';
import { SEO } from '@/components/common/SEO';

const schema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});
type Values = z.infer<typeof schema>;

export function Login() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Values>({ resolver: zodResolver(schema) });

  const mutation = useMutation({
    mutationFn: (v: Values) => customerAuthApi.login(v.email, v.password),
    onSuccess: (data) => {
      setAuth(data.user, data.accessToken, data.refreshToken);
      navigate('/dashboard');
    },
  });

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-sm flex-col justify-center px-4 py-16 sm:px-6">
      <SEO title="Log In" noindex />
      <h1 className="text-2xl font-extrabold text-brand-navy">Welcome Back</h1>
      <p className="mt-1 text-sm text-brand-navy/60">Log in to manage your bookings.</p>

      <form onSubmit={handleSubmit((v) => mutation.mutate(v))} className="mt-6 space-y-4">
        <div>
          <label className="text-xs font-semibold text-brand-navy/70">Email</label>
          <input {...register('email')} className="input" />
          {errors.email && <p className="err">{errors.email.message}</p>}
        </div>
        <div>
          <label className="text-xs font-semibold text-brand-navy/70">Password</label>
          <input type="password" {...register('password')} className="input" />
          {errors.password && <p className="err">{errors.password.message}</p>}
        </div>

        {mutation.isError && <p className="err">Invalid email or password.</p>}

        <button
          type="submit"
          disabled={mutation.isPending}
          className="w-full rounded-pill bg-brand-pink px-6 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-brand-pink-dark disabled:opacity-60"
        >
          {mutation.isPending ? 'Signing in...' : 'Sign In'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-brand-navy/60">
        Don&apos;t have an account?{' '}
        <Link to="/register" className="font-semibold text-brand-pink hover:underline">
          Register
        </Link>
      </p>
    </div>
  );
}
