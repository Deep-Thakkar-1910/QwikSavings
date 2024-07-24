import * as z from "zod";

export const CreateFestivalFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  title: z.string().min(1, "Title is required"),
  store_id: z.string().min(1, "Adding Store Reference is Mandatory"),
});
