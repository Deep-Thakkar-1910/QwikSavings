"use client";
import { Button } from "@/components/ui/button";
import { Coupon } from "@/lib/types/Coupon";
import { Heart, ThumbsDown, ThumbsUp } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Image from "next/image";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/use-toast";
import axios from "@/app/api/axios/axios";

interface CouponCardProps {
  coupon: Coupon;
  expired?: boolean;
  isBookmarked: boolean;
  onBookmarkToggle: (couponId: number, isBookmarked: boolean) => void;
}

const CouponCard = ({
  coupon,
  expired = false,
  isBookmarked,
  onBookmarkToggle,
}: CouponCardProps) => {
  const [isBookmarkedState, setIsBookmarkedState] = useState(isBookmarked);
  const { data: session } = useSession();
  const router = useRouter();

  const handleCardGetClick = async (coupon: Coupon) => {
    try {
      console.log(coupon);
      // Update coupon user count
      await axios.post("/updatecouponusercount", { couponId: coupon.id });

      // Encode coupon data
      const encodedCoupon = encodeURIComponent(
        JSON.stringify({
          couponId: coupon.id,
          coupon_code: coupon.couponCode,
          logo: coupon.storeLogo,
          type: coupon.type,
          title: coupon.title,
        }),
      );

      // Construct store URL with encoded coupon data
      const storeUrl = `/stores/${coupon.storeName}?coupon=${encodedCoupon}`;

      // Redirect to the store page
      router.push(storeUrl);
    } catch (error) {
      console.error("Error handling image click:", error);
    }
  };

  const handleBookmark = async () => {
    if (!session?.user) {
      router.push("/signin");
      toast({
        title: "Uh Oh!",
        description: "You must be signed in to bookmark coupons",
        variant: "destructive",
      });
      return;
    }

    setIsBookmarkedState(!isBookmarkedState);
    onBookmarkToggle(coupon.id, !isBookmarkedState);

    try {
      await axios.post("/createbookmarks", { couponId: coupon.id });
    } catch (error) {
      console.error("Error toggling bookmark:", error);
      setIsBookmarkedState(isBookmarkedState);
      onBookmarkToggle(coupon.id, isBookmarkedState);
      toast({
        title: "Error",
        description: "Failed to update bookmark. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div
      className={`relative rounded-lg border p-4 ${expired ? "opacity-60" : ""} flex flex-col items-start justify-between`}
    >
      <Heart
        className={`absolute right-2 top-2 size-4 cursor-pointer text-app-main transition-all duration-300 ease-linear ${
          isBookmarkedState
            ? "fill-app-main text-app-main"
            : "opacity-0 hover:fill-app-main group-hover/accordion:opacity-100"
        }`}
        onClick={handleBookmark}
      />
      <div className="mb-4 flex items-center">
        {coupon.storeLogo && (
          <Image
            src={coupon.storeLogo}
            alt={coupon.storeName}
            width={64}
            height={64}
            className={`size-20 rounded-full ${expired ? "grayscale" : ""}`}
          />
        )}
        <h3 className="ml-4 text-base font-semibold first-letter:uppercase">
          {coupon.title}
        </h3>
      </div>
      <p className="mb-2 text-sm text-muted-foreground">{coupon.description}</p>
      <p className="mb-2 text-sm ">Type: {coupon.type}</p>
      {coupon.couponCode && (
        <p className="mb-2 text-sm">Code: {coupon.couponCode}</p>
      )}
      <p className="mb-2 text-sm  first-letter:uppercase">
        Store: {coupon.storeName}
      </p>
      <p className="mb-2 text-sm">
        Expires: {new Date(coupon.dueDate).toLocaleDateString()}
      </p>
      <p className="text-sm">Category: {coupon.categoryName}</p>
      <div className="mt-4 flex w-full flex-col items-start justify-between gap-y-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-x-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="mr-2 flex items-center gap-x-1 text-sm">
                    <ThumbsUp className="size-4 text-emerald-500" />
                    {coupon.likeCount}
                  </span>
                </TooltipTrigger>
                <TooltipContent className="bg-popover text-muted-foreground">
                  <p>Likes</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="flex items-center gap-x-1 text-sm">
                    <ThumbsDown className="size-4 text-app-main" />
                    {coupon.dislikeCount}
                  </span>
                </TooltipTrigger>
                <TooltipContent className="bg-popover text-muted-foreground">
                  <p>Dislikes</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        <Button
          className={`place-self-end ${
            expired
              ? "cursor-not-allowed bg-neutral-500 hover:bg-neutral-400"
              : "bg-app-main/80 hover:bg-app-main"
          }`}
          onClick={() => {
            if (!expired) handleCardGetClick(coupon);
          }}
        >
          {expired ? "Expired" : "Use Coupon"}
        </Button>
      </div>
    </div>
  );
};

export default CouponCard;
