import { z } from 'zod';

export const contactFormSchema = z.object({
  name: z.string().min(2, 'Enter your name'),
  email: z.string().email('Enter a valid email'),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit mobile number'),
  subject: z.string().optional(),
  message: z.string().min(10, 'Message should be at least 10 characters'),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;
