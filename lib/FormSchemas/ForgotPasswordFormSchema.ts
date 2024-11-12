import * as z from "zod";

export const ForgotPasswordFormSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email adress"),
});
