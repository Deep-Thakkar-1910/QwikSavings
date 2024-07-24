"use client";

import { cn } from "@/lib/utils";
import { Dispatch, SetStateAction } from "react";

interface StoreFilterForCouponProps {
  stores: { storeId: number; name: string }[];
  like: string | null;
  setLike: Dispatch<SetStateAction<string | null>>;
  isCoupon?: boolean;
}
const StoreFilterForCoupon = ({
  stores,
  like,
  setLike,
  isCoupon,
}: StoreFilterForCouponProps) => {
  const activeBlockStyle =
    "bg-zinc-900 text-white dark:bg-slate-200 dark:text-black";
  ("bg-zinc-900 text-white dark:bg-slate-200 dark:text-black");

  const commonBlockStyle = `flex cursor-pointer items-center justify-center border border-muted-foreground p-2 
  flex cursor-pointer items-center justify-center border border-muted-foreground p-2 font-semibold
  font-semibold hover:bg-zinc-900 hover:text-white dark:hover:bg-slate-200 dark:hover:text-black transition-colors duration-300 ease-in-out`;

  return (
    <div className="w-full p-4 sm:px-8 lg:px-16">
      <div className="flex flex-col items-center gap-4 border border-muted-foreground p-4 lg:items-start  2xl:pb-6">
        <h3 className="mx-auto text-center text-xl text-secondary-foreground/40 sm:text-2xl">
          Browse {isCoupon ? "Coupons" : "Festivals"} by{" "}
          <span className="first-letter:uppercase">Stores</span>
        </h3>
        <div className="flex flex-wrap gap-2 place-self-center text-lg sm:text-xl lg:place-self-start">
          {
            <>
              {stores.map((store) => {
                return (
                  <div
                    key={store.name}
                    className={cn(
                      `${commonBlockStyle} `,
                      like === store.name && activeBlockStyle,
                    )}
                    onClick={() => {
                      setLike(store.name);
                    }}
                  >
                    <p>{store.name}</p>
                  </div>
                );
              })}
            </>
          }
        </div>
      </div>
    </div>
  );
};

export default StoreFilterForCoupon;
