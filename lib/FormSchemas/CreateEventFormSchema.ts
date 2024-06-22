import * as z from "zod";

export const CreateEventFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  title: z.string().optional(),
  description: z.string().optional(),
  logo_url: z.any().optional(),
  cover_url: z.any().optional(),
  logoUrl: z.string().optional(),
  coverUrl: z.string().optional(),
});
