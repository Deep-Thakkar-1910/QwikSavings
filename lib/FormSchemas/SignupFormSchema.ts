import * as z from "zod";

// Signup schema for form validation

export const SignUpFormSchema = z
  .object({
    name: z
      .string()
      .min(2, "Name must be atleast 2 characters long")
      .max(100, "Name must be atmost 100 characters long"),
    email: z.string().email("Invalid email address"),
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

// to check email and password follow validation shema during signup for backend validation;
export const SignupValidationSchema = {
  emailSchema: z.string().min(1).email(),
  passwordSchema: z
    .string()
    .min(8)
    .max(32)
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+{};:,<.>]).{8,32}$/,
    ),
};
