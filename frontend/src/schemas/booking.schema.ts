import { z } from 'zod';

export const bookingFormSchema = z.object({
  name: z.string().min(2, 'Enter your full name'),
  phone: z
    .string()
    .regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit mobile number'),
  email: z.string().email('Enter a valid email').optional().or(z.literal('')),
  serviceType: z.enum(['HOME', 'SALON']),
  line1: z.string().optional(),
  line2: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  pincode: z.string().optional(),
  appointmentDate: z.string().min(1, 'Select a date'),
  timeSlot: z.string().min(1, 'Select a time slot'),
  notes: z.string().optional(),
}).superRefine((data, ctx) => {
  if (data.serviceType === 'HOME') {
    if (!data.line1) ctx.addIssue({ code: 'custom', path: ['line1'], message: 'Address is required for home service' });
    if (!data.city) ctx.addIssue({ code: 'custom', path: ['city'], message: 'City is required' });
    if (!data.state) ctx.addIssue({ code: 'custom', path: ['state'], message: 'State is required' });
    if (!data.pincode || !/^\d{6}$/.test(data.pincode)) {
      ctx.addIssue({ code: 'custom', path: ['pincode'], message: 'Enter a valid 6-digit pincode' });
    }
  }
});

export type BookingFormValues = z.infer<typeof bookingFormSchema>;

export const TIME_SLOTS = [
  '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
  '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM', '06:00 PM', '07:00 PM',
];
