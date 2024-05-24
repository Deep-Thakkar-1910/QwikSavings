import * as z from "zod";
export const ResetPasswordFormSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be atleast 8 characters long")
      .max(32, "Password must be atmost 32 characters long")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+{};:,<.>]).{8,32}$/,
        "Password must contain at least one lowercase letter(a-z),\none uppercase letter(A-Z),\none number and one special character",
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
