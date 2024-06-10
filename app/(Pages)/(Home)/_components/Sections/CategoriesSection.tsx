"use client";
import Seperator from "@/app/(Pages)/_PageComponents/Seperator";
import Spinner from "@/app/(Pages)/_PageComponents/Spinner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import useGetCategoryCoupons, { Coupon } from "@/hooks/useGetCategoryCoupons";
import Image from "next/image";
import Link from "next/link";

interface CategoriesSectionProps {
  fetchFrom: string;
  title: string;
}
const CategoriesSection = ({ fetchFrom, title }: CategoriesSectionProps) => {
  const { data, error, isLoading } = useGetCategoryCoupons(fetchFrom);
  console.log(data);
  return (
    <section
      className={`w-full px-8 lg:px-16 ${data.coupons?.length === 0 || error ? "hidden" : ""}`}
    >
      <div className="mt-4 flex w-full flex-col items-center px-8 sm:flex-row sm:justify-between lg:px-16">
        <h2 className="mx-auto mb-4 text-center text-2xl font-bold sm:mx-0 sm:text-2xl ">
          {title}
        </h2>
        <Link
          href={`/categories/${data.categoryId}`}
          className="-translate-y-2 text-sm transition-all duration-300 ease-linear hover:text-app-main hover:underline sm:text-base"
        >
          View all{" "}
          <span className="first-letter:uppercase">{fetchFrom} Coupons</span>
        </Link>
      </div>
      {isLoading ? (
        <div className="flex w-full justify-center">
          <Spinner />
        </div>
      ) : error ? (
        <div className="flex w-full justify-center">
          <p className="text-red-500">{error}</p>
        </div>
      ) : (
        <div className="flex min-h-[20vh] w-full snap-x snap-mandatory gap-x-4 overflow-x-auto p-8">
          {data.coupons?.map((coupon: Coupon, index: number) => {
            return (
              <div
                className="flex w-full flex-col items-center gap-4 rounded-xl bg-popover p-4 sm:w-1/2 md:w-1/3 lg:w-1/4"
                key={index}
              >
                <div className="flex w-full items-center justify-center rounded-tl-md rounded-tr-md  pt-6">
                  <Image
                    src={coupon.store.logo_url}
                    alt="Brand logo"
                    width={1920}
                    height={1080}
                    className="size-32 rounded-full object-cover"
                  />
                </div>
                <Seperator />
                <div className="flex w-full items-center justify-between ">
                  <span className="inline text-muted-foreground">
                    {coupon.store.name}
                  </span>
                  {coupon.isVerified && (
                    <Badge className=" bg-blue-400/50 text-black dark:text-slate-200">
                      VERIFIED
                    </Badge>
                  )}
                </div>
                <p className="place-self-start font-semibold first-letter:uppercase">
                  {coupon.title}
                </p>
                <p className="place-self-end text-muted-foreground">
                  {coupon.user_count} Used
                </p>
                <Button size={"lg"} className="w-full">
                  {coupon.type === "Coupon" ? "Reveal Code" : "Get Deal"}
                </Button>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default CategoriesSection;
