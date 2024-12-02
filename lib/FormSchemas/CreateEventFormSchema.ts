import * as z from "zod";

export const CreateEventFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z
    .string()
    .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Invalid Slug format")
    .min(1, "Slug is required"),
  title: z.string().optional(),
  description: z.string().min(1, "Description is required"),
  logo_url: z.any().optional(),
  cover_url: z.any().optional(),
  logoUrl: z.string().optional(),
  coverUrl: z.string().optional(),
});
