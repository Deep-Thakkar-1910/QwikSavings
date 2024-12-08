import * as z from "zod";

export const CreateBlogFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  thumbnail: z.any().optional(),
  thumbnail_url: z.string().optional(),
  category_id: z.string(),
  keyToDelete: z.string().optional(),
  content: z.string().min(1, "Content is required"),
});
