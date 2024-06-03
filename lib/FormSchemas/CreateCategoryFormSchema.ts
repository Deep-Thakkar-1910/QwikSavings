import * as z from "zod";

export const CreateCategoryFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  logo: z.any().optional(),
  description: z.string().optional(),
  stores: z.array(z.string()),
  similarCategories: z.array(z.string()),
});
