import * as z from "zod";

export const CreateCategoryFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  logo: z.any().optional(),
  logo_url: z.string().optional(),
  addToTodaysTopCategories: z.enum(["yes", "no"]).default("no"),
  description: z.string().optional(),
});
