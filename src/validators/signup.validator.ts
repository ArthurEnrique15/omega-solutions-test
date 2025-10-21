import { z } from 'zod';

export const signupSchema = z.object({
  name: z.string().min(3, 'Name should be at least 3 characters').max(255, 'Name must be at most 255 characters'),
  email: z.string().email('Invalid email format').max(255, 'Email must be at most 255 characters'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .max(20, 'Password must be at most 20 characters')
    .regex(/[0-9]/, 'Password must contain at least 1 number')
    .regex(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least 1 special character')
    .regex(/[A-Z]/, 'Password must contain at least 1 uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least 1 lowercase letter'),
});

export type SignupDTO = z.infer<typeof signupSchema>;
