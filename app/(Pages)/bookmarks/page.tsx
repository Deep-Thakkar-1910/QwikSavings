"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Coupon } from "@/lib/types/Coupon";
import CouponCard from "./_BookmarkComponents/CouponCard";
import axios from "@/app/api/axios/axios";
import Spinner from "../_PageComponents/Spinner";

const BookmarksPage = () => {
  const { data: session } = useSession();
  const [bookmarkedCoupons, setBookmarkedCoupons] = useState<Coupon[]>([]);
  const [expiredCoupons, setExpiredCoupons] = useState<Coupon[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchBookmarks();
  }, [session]);

  const fetchBookmarks = async () => {
    if (session?.user) {
      try {
        setIsLoading(true);
        const response = await axios.get("/bookmarkedcoupons");
        const coupons = response.data.bookmarkedCoupons;

        const currentDate = new Date();
        const active = coupons.filter(
          (coupon: Coupon) => new Date(coupon.dueDate) > currentDate,
        );
        const expired = coupons.filter(
          (coupon: Coupon) => new Date(coupon.dueDate) <= currentDate,
        );

        setBookmarkedCoupons(active);
        setExpiredCoupons(expired);
      } catch (err) {
        console.error("Error fetching bookmarked coupons:", err);
        setError("Failed to fetch bookmarked coupons. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleBookmarkToggle = (couponId: number, isBookmarked: boolean) => {
    const updateCoupons = (coupons: Coupon[]) =>
      coupons.filter((coupon) => coupon.id !== couponId);

    if (!isBookmarked) {
      setBookmarkedCoupons((prev) => updateCoupons(prev));
      setExpiredCoupons((prev) => updateCoupons(prev));
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[40vh] w-full items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return <div className="py-8 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold">My Bookmarked Coupons</h1>

      {bookmarkedCoupons.length === 0 && expiredCoupons.length === 0 ? (
        <p className="py-8 text-center">
          You haven't bookmarked any coupons yet.
        </p>
      ) : (
        <>
          {bookmarkedCoupons.length > 0 && (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {bookmarkedCoupons.map((coupon) => (
                <CouponCard
                  key={coupon.id}
                  coupon={coupon}
                  isBookmarked={true}
                  onBookmarkToggle={handleBookmarkToggle}
                />
              ))}
            </div>
          )}

          {expiredCoupons.length > 0 && (
            <>
              <h2 className="mb-6 mt-12 text-2xl font-bold">Expired Coupons</h2>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {expiredCoupons.map((coupon) => (
                  <CouponCard
                    key={coupon.id}
                    coupon={coupon}
                    expired
                    isBookmarked={true}
                    onBookmarkToggle={handleBookmarkToggle}
                  />
                ))}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default BookmarksPage;
