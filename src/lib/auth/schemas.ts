import { z } from "zod";
import { isValidEmail } from "@/lib/validation/rules";

export const signupSchema = z
  .object({
    email: z.string().refine(isValidEmail, "Enter a valid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const loginSchema = z.object({
  email: z.string().refine(isValidEmail, "Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export type SignupData = z.infer<typeof signupSchema>;
export type LoginData = z.infer<typeof loginSchema>;
