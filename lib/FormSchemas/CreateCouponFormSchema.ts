import { z } from "zod";

export const CreateCouponFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  store_id: z.string(),
  type: z.enum(["Deal", "Offer"]),
  category_id: z.string(),
  coupon_code: z.string().optional(),
  ref_link: z.string().min(1, "Reference link is required"),
  due_date: z.date({ message: "Expiry date is required" }).default(new Date()),
  description: z.string().optional(),
});
