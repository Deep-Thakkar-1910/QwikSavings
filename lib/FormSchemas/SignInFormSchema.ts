import * as z from "zod";

// Signin schema for form validation
export const SignInFormSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});
