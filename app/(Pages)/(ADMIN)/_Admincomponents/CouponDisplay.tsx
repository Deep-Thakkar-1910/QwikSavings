import { Badge } from "@/components/ui/badge";
import Spinner from "../../_PageComponents/Spinner";
import { format } from "date-fns";
import Link from "next/link";
interface CouponDisplayProps {
  data: Record<string, any>[];
  isLoading: boolean;
  error: string | undefined;
  emptyMessage: string | undefined;
}

const CouponDisplay = ({
  data,
  error,
  isLoading,
  emptyMessage,
}: CouponDisplayProps) => {
  return (
    <div className="my-6 min-h-[40vh] w-full bg-popover p-8 px-4 sm:px-8 lg:px-16 lg:py-16">
      {isLoading ? (
        <div className="flex h-[40vh] w-full items-center justify-center">
          <Spinner />
        </div>
      ) : error ? (
        <div className="flex h-[40vh] w-full items-center justify-center">
          <p>{error}</p>
        </div>
      ) : data.length === 0 ? (
        <div className="flex h-[40vh] w-full items-center justify-center">
          <p>{emptyMessage}</p>
        </div>
      ) : (
        <div className="grid auto-rows-fr grid-cols-1 gap-x-6  gap-y-4 sm:grid-cols-2 md:gap-x-8 lg:grid-cols-4 lg:gap-x-12">
          {data.map((coupon) => (
            <Link
              key={coupon.couponId}
              href={`/admin/editcoupon/${coupon.couponId}`}
            >
              <div className="flex cursor-pointer flex-col items-center gap-4 rounded-lg bg-accent p-4 dark:bg-background">
                <Badge className="grid w-20 place-items-center bg-blue-400/50 text-black dark:text-slate-200">
                  {coupon.type}
                </Badge>
                <p>Title: {coupon.title}</p>
                <p>Category: {coupon.category.name}</p>
                <p>Store: {coupon.store.name}</p>
                {coupon.type === "Coupon" && (
                  <p>Coupon Code: {coupon.coupon_code}</p>
                )}
                <p>Description: {coupon.description}</p>
                <p>Due Date: {format(coupon.due_date, "dd-MMM-yyyy")}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default CouponDisplay;
