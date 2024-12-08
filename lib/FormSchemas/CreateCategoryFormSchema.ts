import * as z from "zod";

export const CreateCategoryFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z
    .string()
    .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Invalid Slug format")
    .min(1, "Slug is required"),
  logo: z.any().optional(),
  keyToDelete: z.string().optional(),
  logo_url: z.string().optional(),
  addToTodaysTopCategories: z.enum(["yes", "no"]).default("no"),
  description: z.string().min(1, "Description is required"),
});
