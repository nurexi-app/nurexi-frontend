import { z } from "zod";

export const signupSchema = z
  .object({
    fullName: z.string().min(2, "Full name must be at least 2 characters"),

    email: z.string().email("Please enter a valid email address"),

    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),

    confirmPassword: z.string(),

    rememberMe: z.boolean().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),

  password: z.string().max(35),
  rememberMe: z.boolean().optional(),
});

export const resetPasswordSchema = z.object({
  email: z.email("Please enter a valid email address"),
});

export type ResetPasswordSchema = z.infer<typeof resetPasswordSchema>;
export const updatePasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(35, "Password must not be more than 35 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),

    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export type UpdatePasswordSchema = z.infer<typeof updatePasswordSchema>;
