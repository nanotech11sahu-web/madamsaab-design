import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { X, Home, Store, Tag, CheckCircle2 } from 'lucide-react';
import { useBookingStore } from '@/store/bookingStore';
import { useCustomerAuthStore } from '@/store/customerAuthStore';
import { useSettings } from '@/hooks/useServices';
import { useCurrentLocation } from '@/hooks/useCurrentLocation';
import { bookingsApi, couponsApi, paymentsApi } from '@/services/api';
import { profileApi, customerAuthApi } from '@/services/customerApi';
import { buildBookingFormSchema, TIME_SLOTS, type BookingFormValues } from '@/schemas/booking.schema';
import type { CreateBookingResponse } from '@/types';
import { SEO } from '@/components/common/SEO';
import { UseCurrentLocationButton } from '@/components/booking/UseCurrentLocationButton';

function extractErrorMessage(err: unknown): string {
  if (err && typeof err === 'object' && 'response' in err) {
    const response = (err as { response?: { data?: { message?: string } } }).response;
    if (response?.data?.message) return response.data.message;
  }
  return 'Something went wrong. Please try again.';
}

export function Booking() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const {
    serviceMode,
    selectedServices,
    selectedPackages,
    toggleService,
    togglePackage,
    subtotal,
    couponCode,
    discountAmount,
    setCoupon,
    clear,
  } = useBookingStore();
  const { data: settings } = useSettings();
  const customerUser = useCustomerAuthStore((s) => s.user);
  const setAuth = useCustomerAuthStore((s) => s.setAuth);
  const isLoggedIn = !!customerUser;
  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: profileApi.get,
    enabled: isLoggedIn,
  });

  const [result, setResult] = useState<CreateBookingResponse | null>(null);
  const [paymentState, setPaymentState] = useState<'idle' | 'processing' | 'paid' | 'failed'>('idle');
  const [couponInput, setCouponInput] = useState('');
  const [couponMessage, setCouponMessage] = useState<{ ok: boolean; text: string } | null>(null);
  const [accountError, setAccountError] = useState('');
  const { locating, locationError, detect } = useCurrentLocation();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<BookingFormValues>({
    resolver: zodResolver(buildBookingFormSchema(!isLoggedIn)),
    defaultValues: { serviceType: serviceMode ?? 'HOME' },
  });

  useEffect(() => {
    if (!profile) return;
    setValue('name', profile.name);
    setValue('phone', profile.phone);
    if (profile.email) setValue('email', profile.email);

    if (serviceMode === 'HOME' && profile.addresses.length) {
      const defaultAddress = profile.addresses.find((a) => a.isDefault) ?? profile.addresses[0];
      setValue('line1', defaultAddress.line1);
      setValue('line2', defaultAddress.line2 ?? '');
      setValue('city', defaultAddress.city);
      setValue('state', defaultAddress.state);
      setValue('pincode', defaultAddress.pincode);
    }
  }, [profile, serviceMode, setValue]);

  const homeServiceFee = serviceMode === 'HOME' ? (settings?.homeServiceFee ?? 0) : 0;
  const total = Math.max(0, subtotal() - discountAmount + homeServiceFee);

  const handleUseCurrentLocation = () => {
    detect((address) => {
      if (address.line1) setValue('line1', address.line1);
      if (address.line2) setValue('line2', address.line2);
      if (address.city) setValue('city', address.city);
      if (address.state) setValue('state', address.state);
      if (address.pincode) setValue('pincode', address.pincode);
    });
  };

  const couponMutation = useMutation({
    mutationFn: () => couponsApi.apply(couponInput.trim(), subtotal()),
    onSuccess: (data) => {
      if (data.valid) {
        setCoupon(couponInput.trim().toUpperCase(), data.discountAmount);
        setCouponMessage({ ok: true, text: data.message });
      } else {
        setCoupon(null, 0);
        setCouponMessage({ ok: false, text: data.message });
      }
    },
    onError: () => {
      setCoupon(null, 0);
      setCouponMessage({ ok: false, text: 'Could not apply coupon. Please try again.' });
    },
  });

  const mutation = useMutation({
    mutationFn: bookingsApi.create,
    onSuccess: (data, variables) => {
      setResult(data);
      clear();

      // Save the address used for this home booking to the account, so it's
      // there next time (in Addresses and prefilled at checkout) — unless an
      // identical one is already saved.
      if (variables.serviceType === 'HOME' && variables.address) {
        const addr = variables.address;
        const alreadySaved = profile?.addresses.some(
          (a) =>
            a.line1.trim().toLowerCase() === addr.line1.trim().toLowerCase() &&
            a.pincode === addr.pincode,
        );
        if (!alreadySaved) {
          profileApi
            .addAddress({
              label: 'Home',
              line1: addr.line1,
              line2: addr.line2,
              city: addr.city,
              state: addr.state,
              pincode: addr.pincode,
              isDefault: (profile?.addresses.length ?? 0) === 0,
            })
            .then(() => queryClient.invalidateQueries({ queryKey: ['profile'] }))
            .catch(() => {
              // Non-critical — the booking itself already succeeded.
            });
        }
      }
    },
  });

  const registerMutation = useMutation({ mutationFn: customerAuthApi.register });

  const payMutation = useMutation({
    mutationFn: async () => {
      if (!result) return;
      setPaymentState('processing');
      const order = await paymentsApi.createOrder(result.booking._id);
      return new Promise<void>((resolve, reject) => {
        try {
          const rzp = new window.Razorpay({
            key: order.keyId,
            amount: order.amount,
            currency: order.currency,
            name: 'MadamSaab',
            description: `Booking ${result.booking.bookingNumber}`,
            order_id: order.orderId,
            prefill: {
              name: result.booking.customer.name,
              email: result.booking.customer.email,
              contact: result.booking.customer.phone,
            },
            theme: { color: '#ec2f77' },
            handler: (response) => {
              paymentsApi
                .verify({
                  bookingId: result.booking._id,
                  razorpayOrderId: response.razorpay_order_id,
                  razorpayPaymentId: response.razorpay_payment_id,
                  razorpaySignature: response.razorpay_signature,
                })
                .then(() => {
                  setPaymentState('paid');
                  resolve();
                })
                .catch(() => {
                  setPaymentState('failed');
                  reject(new Error('verification failed'));
                });
            },
            modal: {
              ondismiss: () => {
                setPaymentState('idle');
                resolve();
              },
            },
          });
          rzp.open();
        } catch {
          setPaymentState('failed');
          reject(new Error('razorpay unavailable'));
        }
      });
    },
  });

  const onSubmit = async (values: BookingFormValues) => {
    if (selectedServices.length === 0 && selectedPackages.length === 0) return;
    setAccountError('');

    if (!isLoggedIn) {
      try {
        const auth = await registerMutation.mutateAsync({
          name: values.name,
          email: values.email,
          phone: values.phone,
          password: values.password!,
        });
        setAuth(auth.user, auth.accessToken, auth.refreshToken);
      } catch (err) {
        setAccountError(extractErrorMessage(err));
        return;
      }
    }

    mutation.mutate({
      customer: { name: values.name, phone: values.phone, email: values.email },
      serviceIds: selectedServices.map((s) => s._id),
      packageIds: selectedPackages.map((p) => p._id),
      serviceType: values.serviceType,
      address:
        values.serviceType === 'HOME'
          ? {
              line1: values.line1!,
              line2: values.line2,
              city: values.city!,
              state: values.state!,
              pincode: values.pincode!,
            }
          : undefined,
      appointmentDate: values.appointmentDate,
      timeSlot: values.timeSlot,
      notes: values.notes,
      couponCode: couponCode ?? undefined,
    });
  };

  if (!serviceMode) {
    navigate('/book');
    return null;
  }

  if (result) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16 text-center sm:px-6">
        <SEO title="Booking Received" noindex />
        <h1 className="text-2xl font-extrabold text-brand-navy">Booking Created!</h1>
        <p className="mt-2 text-brand-navy/70">
          Booking Number: <span className="font-bold text-brand-pink">{result.booking.bookingNumber}</span>
        </p>

        {paymentState === 'paid' ? (
          <div className="mt-6 flex flex-col items-center gap-2 rounded-card border border-green-200 bg-green-50 p-5">
            <CheckCircle2 className="text-green-600" size={28} />
            <p className="text-sm font-semibold text-green-700">Payment successful! Your booking is confirmed.</p>
          </div>
        ) : (
          <>
            <p className="mt-4 text-sm text-brand-navy/60">
              Pay securely online now, or confirm and arrange payment on WhatsApp.
            </p>
            <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <button
                type="button"
                onClick={() => payMutation.mutate()}
                disabled={paymentState === 'processing'}
                className="w-full rounded-pill bg-brand-pink px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-brand-pink-dark disabled:opacity-60 sm:w-auto"
              >
                {paymentState === 'processing' ? 'Opening payment...' : `Pay Now ₹${result.booking.totalAmount}`}
              </button>
              <a
                href={result.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full rounded-pill border border-brand-pink px-6 py-3 text-sm font-bold text-brand-pink shadow-sm transition hover:bg-brand-pink-light sm:w-auto"
              >
                Confirm via WhatsApp
              </a>
            </div>
            {paymentState === 'failed' && (
              <p className="mt-3 text-sm text-red-600">Payment could not be completed. Please try again.</p>
            )}
          </>
        )}

        <div className="mt-8">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="text-sm font-medium text-brand-navy/60 hover:text-brand-pink"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  if (selectedServices.length === 0 && selectedPackages.length === 0) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16 text-center sm:px-6">
        <h1 className="text-xl font-bold text-brand-navy">Your booking is empty</h1>
        <p className="mt-2 text-brand-navy/60">Select services or packages to get started.</p>
        <button
          type="button"
          onClick={() => navigate('/book')}
          className="mt-6 rounded-pill bg-brand-pink px-6 py-2.5 text-sm font-semibold text-white"
        >
          Browse Services
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <SEO title="Complete Your Booking" noindex />
      <h1 className="text-2xl font-extrabold text-brand-navy sm:text-3xl">Complete Your Booking</h1>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <fieldset className="rounded-card border border-brand-border bg-white p-5">
            <legend className="px-1 text-sm font-bold text-brand-navy">Customer Details</legend>
            {!isLoggedIn && (
              <p className="mb-4 text-xs text-brand-navy/50">
                New here? These details also create your MadamSaab account, so you can track this booking
                afterward. Already have an account?{' '}
                <Link to="/login" className="font-semibold text-brand-pink hover:underline">
                  Log in
                </Link>{' '}
                first.
              </p>
            )}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-xs font-semibold text-brand-navy/70">Full Name</label>
                <input {...register('name')} className="input" placeholder="Your name" />
                {errors.name && <p className="err">{errors.name.message}</p>}
              </div>
              <div>
                <label className="text-xs font-semibold text-brand-navy/70">Phone</label>
                <input {...register('phone')} className="input" placeholder="10-digit mobile number" />
                {errors.phone && <p className="err">{errors.phone.message}</p>}
              </div>
              <div className={isLoggedIn ? 'sm:col-span-2' : ''}>
                <label className="text-xs font-semibold text-brand-navy/70">Email</label>
                <input {...register('email')} className="input" placeholder="you@example.com" />
                {errors.email && <p className="err">{errors.email.message}</p>}
              </div>
              {!isLoggedIn && (
                <div>
                  <label className="text-xs font-semibold text-brand-navy/70">Create Password</label>
                  <input
                    type="password"
                    {...register('password')}
                    className="input"
                    placeholder="At least 6 characters"
                  />
                  {errors.password && <p className="err">{errors.password.message}</p>}
                </div>
              )}
            </div>
            {accountError && (
              <p className="err mt-2">
                {accountError}
                {accountError.toLowerCase().includes('already') && (
                  <>
                    {' '}
                    <Link to="/login" className="font-semibold underline">
                      Log in instead
                    </Link>
                    .
                  </>
                )}
              </p>
            )}
          </fieldset>

          <fieldset className="rounded-card border border-brand-border bg-white p-5">
            <legend className="px-1 text-sm font-bold text-brand-navy">Service Type</legend>
            <input type="hidden" {...register('serviceType')} />
            <div className="flex items-center justify-between gap-3 rounded-lg border border-brand-pink bg-brand-pink-light p-3">
              <span className="flex items-center gap-2 text-sm font-semibold text-brand-navy">
                {serviceMode === 'HOME' ? <Home size={16} /> : <Store size={16} />}
                {serviceMode === 'HOME' ? 'Home Service' : 'Salon Visit'}
              </span>
              <Link to="/book" className="text-xs font-semibold text-brand-pink hover:underline">
                Change
              </Link>
            </div>
          </fieldset>

          {serviceMode === 'HOME' && (
            <fieldset className="rounded-card border border-brand-border bg-white p-5">
              <legend className="px-1 text-sm font-bold text-brand-navy">Address</legend>
              {isLoggedIn && (profile?.addresses.length ?? 0) > 0 && (
                <p className="mb-3 text-xs text-brand-navy/50">
                  Prefilled from your saved address. Edit below or{' '}
                  <Link to="/dashboard/addresses" className="font-semibold text-brand-pink hover:underline">
                    manage addresses
                  </Link>
                  .
                </p>
              )}

              <UseCurrentLocationButton locating={locating} onClick={handleUseCurrentLocation} className="mb-4" />
              {locationError && <p className="err mb-3">{locationError}</p>}

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-brand-navy/70">Address Line 1</label>
                  <input {...register('line1')} className="input" placeholder="House no, street" />
                  {errors.line1 && <p className="err">{errors.line1.message}</p>}
                </div>
                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-brand-navy/70">Address Line 2</label>
                  <input {...register('line2')} className="input" placeholder="Landmark (optional)" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-brand-navy/70">City</label>
                  <input {...register('city')} className="input" />
                  {errors.city && <p className="err">{errors.city.message}</p>}
                </div>
                <div>
                  <label className="text-xs font-semibold text-brand-navy/70">State</label>
                  <input {...register('state')} className="input" />
                  {errors.state && <p className="err">{errors.state.message}</p>}
                </div>
                <div>
                  <label className="text-xs font-semibold text-brand-navy/70">Pincode</label>
                  <input {...register('pincode')} className="input" />
                  {errors.pincode && <p className="err">{errors.pincode.message}</p>}
                </div>
              </div>
            </fieldset>
          )}

          <fieldset className="rounded-card border border-brand-border bg-white p-5">
            <legend className="px-1 text-sm font-bold text-brand-navy">Date &amp; Time</legend>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-xs font-semibold text-brand-navy/70">Appointment Date</label>
                <input
                  type="date"
                  min={new Date().toISOString().split('T')[0]}
                  {...register('appointmentDate')}
                  className="input"
                />
                {errors.appointmentDate && <p className="err">{errors.appointmentDate.message}</p>}
              </div>
              <div>
                <label className="text-xs font-semibold text-brand-navy/70">Preferred Time</label>
                <select {...register('timeSlot')} className="input">
                  <option value="">Select a time</option>
                  {TIME_SLOTS.map((slot) => (
                    <option key={slot} value={slot}>{slot}</option>
                  ))}
                </select>
                {errors.timeSlot && <p className="err">{errors.timeSlot.message}</p>}
              </div>
            </div>
          </fieldset>

          <fieldset className="rounded-card border border-brand-border bg-white p-5">
            <legend className="px-1 text-sm font-bold text-brand-navy">Notes (optional)</legend>
            <textarea {...register('notes')} className="input min-h-20" placeholder="Any special instructions" />
          </fieldset>

          {mutation.isError && (
            <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
              Something went wrong creating your booking. Please try again.
            </p>
          )}

          <button
            type="submit"
            disabled={mutation.isPending || registerMutation.isPending}
            className="w-full rounded-pill bg-brand-pink px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-brand-pink-dark disabled:opacity-60"
          >
            {registerMutation.isPending
              ? 'Creating your account...'
              : mutation.isPending
                ? 'Booking...'
                : isLoggedIn
                  ? 'Continue to Confirm'
                  : 'Create Account & Book'}
          </button>
        </form>

        <aside className="h-fit rounded-card border border-brand-border bg-white p-5 shadow-card">
          <h2 className="text-sm font-bold text-brand-navy">Booking Summary</h2>
          <ul className="mt-4 space-y-2">
            {selectedServices.map((s) => (
              <li key={s._id} className="flex items-center justify-between text-sm">
                <span className="text-brand-navy/80">{s.name}</span>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-brand-navy">₹{s.price}</span>
                  <button type="button" onClick={() => toggleService(s)} aria-label={`Remove ${s.name}`}>
                    <X size={14} className="text-brand-navy/40 hover:text-brand-pink" />
                  </button>
                </div>
              </li>
            ))}
            {selectedPackages.map((p) => (
              <li key={p._id} className="flex items-center justify-between text-sm">
                <span className="text-brand-navy/80">{p.name}</span>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-brand-navy">₹{p.packagePrice}</span>
                  <button type="button" onClick={() => togglePackage(p)} aria-label={`Remove ${p.name}`}>
                    <X size={14} className="text-brand-navy/40 hover:text-brand-pink" />
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-4 border-t border-brand-border pt-4">
            <label className="text-xs font-semibold text-brand-navy/70">Coupon Code</label>
            <div className="mt-1.5 flex gap-2">
              <input
                value={couponInput}
                onChange={(e) => {
                  setCouponInput(e.target.value);
                  setCouponMessage(null);
                }}
                className="input flex-1"
                placeholder="Enter code"
              />
              <button
                type="button"
                onClick={() => couponInput.trim() && couponMutation.mutate()}
                disabled={!couponInput.trim() || couponMutation.isPending}
                className="flex items-center gap-1 rounded-lg border border-brand-pink px-3 text-xs font-bold text-brand-pink transition hover:bg-brand-pink-light disabled:opacity-50"
              >
                <Tag size={12} />
                Apply
              </button>
            </div>
            {couponMessage && (
              <p className={`mt-1.5 text-xs ${couponMessage.ok ? 'text-green-600' : 'text-red-600'}`}>
                {couponMessage.text}
              </p>
            )}
          </div>

          <div className="mt-4 space-y-1 border-t border-brand-border pt-4 text-sm">
            <div className="flex justify-between text-brand-navy/70">
              <span>Subtotal</span>
              <span>₹{subtotal()}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Coupon ({couponCode})</span>
                <span>-₹{discountAmount}</span>
              </div>
            )}
            <div className="flex justify-between text-brand-navy/70">
              <span>Home Service Fee</span>
              <span>₹{homeServiceFee}</span>
            </div>
            <div className="flex justify-between pt-2 text-base font-bold text-brand-navy">
              <span>Total</span>
              <span className="text-brand-pink">₹{total}</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
