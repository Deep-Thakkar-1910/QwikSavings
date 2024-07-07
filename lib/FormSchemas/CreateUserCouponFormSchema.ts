import * as z from "zod";

export const CreateUserCouponFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  coupon_code: z.string().optional(),
  ref_link: z.string().url("Invalid URL").min(1, "Referral link is required"),
  type: z.enum(["Deal", "Coupon"]),
  category_id: z.string(),
  store_id: z.string(),
  due_date: z.date(),
});
