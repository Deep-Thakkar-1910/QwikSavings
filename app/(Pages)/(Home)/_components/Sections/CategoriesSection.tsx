"use client";
import axios from "@/app/api/axios/axios";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import useGetCategoryCoupons, { Coupon } from "@/hooks/useGetCategoryCoupons";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface CategoriesSectionProps {
  fetchFrom: string;
  title: string;
}
const CategoriesSection = ({ fetchFrom, title }: CategoriesSectionProps) => {
  const { data, error, isLoading } = useGetCategoryCoupons(fetchFrom);
  const router = useRouter();
  const handleCouponUse = async (coupon: Coupon) => {
    try {
      await axios.post("/updatecouponusercount", { couponId: coupon.couponId });
      const encodedCoupon = encodeURIComponent(
        JSON.stringify({
          couponId: coupon.couponId,
          coupon_code: coupon.coupon_code,
          logo: coupon.store.logo_url,
          type: coupon.type,
          title: coupon.title,
        }),
      );
      const storeUrl = `/stores/${coupon.store.name}?coupon=${encodedCoupon}`;
      router.push(storeUrl);
    } catch (error) {
      console.error("Error updating coupon use count:", error);
    }
  };
  return (
    <section
      className={`mx-auto w-full max-w-screen-xl overflow-x-hidden py-6 sm:p-10 ${data.coupons?.length === 0 || error || isLoading ? "hidden" : ""}`}
    >
      <div className="mt-4 flex w-full flex-col items-center sm:flex-row sm:justify-between sm:px-8 lg:px-16 xl:px-0 2xl:px-0">
        <h2 className="mx-auto mb-4 place-self-center text-2xl font-bold sm:mx-0 sm:place-self-start lg:text-3xl">
          {title}
        </h2>
        <Link
          href={`/categories/${fetchFrom}`}
          className="place-self-center text-end text-sm font-medium hover:underline sm:-translate-y-5 sm:place-self-end  sm:text-base "
        >
          View all{" "}
          <span className="first-letter:uppercase">{fetchFrom} Coupons</span>
        </Link>
      </div>
      {error ? (
        <div className="flex w-full justify-center">
          <p className="text-red-500">{error}</p>
        </div>
      ) : (
        <div className="flex flex-nowrap place-items-center items-center justify-start gap-x-8 gap-y-6 overflow-x-auto p-8 md:grid-cols-2 lg:grid lg:grid-cols-3 lg:px-16 xl:grid-cols-4 xl:px-2 2xl:px-0">
          {data.coupons?.map((coupon: Coupon, index: number) => {
            return (
              <div
                className="flex w-full max-w-72 shrink-0 flex-col flex-wrap items-center rounded-lg bg-popover shadow-lg sm:max-w-80 lg:max-w-full"
                key={index}
              >
                <div className="flex w-full items-center justify-center rounded-tl-md rounded-tr-md">
                  {coupon.thumbnail_url ? (
                    <Image
                      src={coupon.thumbnail_url}
                      width={1920}
                      height={1080}
                      alt="Logo"
                      className="aspect-video h-36 rounded-tl-lg rounded-tr-lg object-cover"
                    />
                  ) : (
                    <div className="aspect-video h-36 bg-popover" />
                  )}
                </div>

                <div className="flex w-full flex-col gap-y-1 p-4">
                  <div className="flex w-full items-center justify-between ">
                    <div className="-translate-y-2/3 rounded-full bg-white p-1 dark:bg-app-dark-navbar">
                      {coupon.store.logo_url ? (
                        <Link href={`/stores/${coupon.store.name}`}>
                          <Image
                            src={coupon.store.logo_url}
                            alt="Brand logo"
                            width={400}
                            height={400}
                            className="size-14 cursor-pointer rounded-full object-cover"
                          />
                        </Link>
                      ) : (
                        <div className="size-14 rounded-full bg-popover" />
                      )}
                    </div>
                    <Badge className=" -translate-y-2/3 bg-blue-400/50 text-black dark:text-slate-200">
                      VERIFIED
                    </Badge>
                  </div>
                  <p className=" -translate-y-8 place-self-start font-semibold first-letter:uppercase">
                    {coupon.title}
                  </p>
                  <div className="flex w-full -translate-y-4 items-center justify-between text-muted-foreground">
                    <span>{coupon.store.name}</span>
                    <span>{coupon.user_count} Used</span>
                  </div>
                  {coupon.type === "Deal" && (
                    <Button
                      size={"lg"}
                      className="w-full border-2 border-dashed bg-app-main text-base font-semibold"
                      onClick={() => {
                        handleCouponUse(coupon);
                      }}
                    >
                      Get Deal
                    </Button>
                  )}

                  {coupon.type === "Coupon" && (
                    <div
                      className="group relative grid w-full cursor-pointer rounded-md border-2 border-dashed border-app-main bg-app-bg-main p-2 dark:bg-app-dark"
                      onClick={() => {
                        handleCouponUse(coupon);
                      }}
                    >
                      <p className="translate-x-4 place-self-center text-base font-semibold uppercase tracking-widest">
                        {coupon.coupon_code}
                      </p>
                      {/* wrapper */}
                      <div className="polygon-clip absolute left-0 top-0 grid h-full w-full place-items-center bg-app-main  transition-all duration-200 ease-linear group-hover:w-8/12 ">
                        <p className="font-semibold text-slate-200">
                          Reveal code
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default CategoriesSection;
