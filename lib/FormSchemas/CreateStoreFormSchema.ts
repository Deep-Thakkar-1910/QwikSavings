import * as z from "zod";

const FAQSchema = z.object({
  question: z.string().min(1, "Question is required"),
  answer: z.string().min(1, "Answer is required"),
});

export const CreateStoreFormScehma = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z
    .string()
    .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Invalid Slug format")
    .min(1, "Slug is required"),
  title: z.string().min(1, "Title for the store is required"),
  logo: z.any().optional(),
  logo_url: z.string().optional(),
  keyToDelete: z.string().optional(),
  ref_link: z.string().url("Reference link must be a valid URL"),
  isFeatured: z.enum(["yes", "no"]).default("no"),
  addToPopularStores: z.enum(["yes", "no"]).default("no"),
  description: z.string().min(1, "Description is required"),
  moreAbout: z.string(),
  hintHeading: z.string(),
  hint: z.string(),
  faq: z.array(FAQSchema), // Assuming faq is a JSON string
  best_offer: z.string().default("0"),
  average_discount: z.string().default("0"),
  similarStores: z.array(z.string()),
  offers: z.number().default(0),
});
