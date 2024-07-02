import { z } from "zod";

export const CreateCouponFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  store_id: z.string(),
  thumbnail_url: z.any().optional(),
  flipperImage_url: z.any().optional(),
  carouselPosterUrl: z.any().optional(),
  thumbnailUrl: z.string().optional(),
  flipperImageUrl: z.string().optional(),
  carouselPoster_url: z.string().optional(),
  addToHomePage: z.enum(["yes", "no"]).default("no"),
  addToCarousel: z.enum(["yes", "no"]).default("no"),
  addToFlipper: z.enum(["yes", "no"]).default("no"),
  type: z.enum(["Deal", "Coupon"]),
  category_id: z.string(),
  coupon_code: z.string().optional(),
  ref_link: z.string().min(1, "Reference link is required"),
  due_date: z.date({ message: "Expiry date is required" }).default(new Date()),
  events: z.array(z.string()),
  description: z.string().optional(),
});
