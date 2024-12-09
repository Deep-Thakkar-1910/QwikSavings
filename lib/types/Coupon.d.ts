export interface Coupon {
  id: number;
  title: string;
  description: string | null;
  couponCode: string | null;
  thumbnailUrl: string | null;
  type: "Coupon" | "Deal";
  refLink: string;
  dueDate: string;
  userCount: number;
  likeCount: number;
  dislikeCount: number;
  storeName: string;
  storeSlug: string;
  storeLogo: string | null;
  categoryName: string;
}
