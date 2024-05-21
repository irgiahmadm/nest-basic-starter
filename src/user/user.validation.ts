import { z, ZodType } from 'zod';

export class UserValidation {
  static readonly REGISTER: ZodType = z.object({
    fullName: z.string().min(1).max(100),
    email: z.string().min(1).max(100),
    password: z.string().min(1),
    role: z.string().optional(),
  });

  static readonly LOGIN: ZodType = z.object({
    email: z.string().max(100),
    password: z.string().min(1).max(100),
  });
}
