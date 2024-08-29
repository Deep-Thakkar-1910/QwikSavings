"use client";
import axios from "@/app/api/axios/axios";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import useGetCategoryCoupons, { Coupon } from "@/hooks/useGetCategoryCoupons";
import { format } from "date-fns";
import { ThumbsDown, ThumbsUp } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { FaExternalLinkAlt } from "react-icons/fa";

interface CategoriesSectionProps {
  fetchFrom: string;
  title: string;
}

type ReactionType = "LIKE" | "DISLIKE";

const CategoriesSection: React.FC<CategoriesSectionProps> = ({
  fetchFrom,
  title,
}) => {
  const { data, error, isLoading } = useGetCategoryCoupons(fetchFrom);
  const [isCouponDialogOpen, setIsCouponDialogOpen] = useState(false);
  const [isDealDialogOpen, setIsDealDialogOpen] = useState(false);
  const [dialogInfo, setDialogInfo] = useState({
    title: "",
    logoUrl: "",
    couponCode: "",
    couponId: 0,
    ref_link: "",
  });
  const [couponUserCounts, setCouponUserCounts] = useState<
    Record<number, number>
  >({});
  const [userReactions, setUserReactions] = useState<
    Record<number, "LIKE" | "DISLIKE" | null>
  >({});

  const processedCouponRef = useRef<string | null>(null);

  // NOTE: this is for handling coupon's user count
  useEffect(() => {
    if (data?.coupons) {
      const initialCounts = data.coupons.reduce(
        (acc: Record<number, number>, coupon: Record<string, any>) => {
          acc[coupon.couponId] = coupon.user_count;
          return acc;
        },
        {},
      );
      setCouponUserCounts(initialCounts);
    }
  }, [data]);

  const handleCouponUse = async (coupon: Coupon) => {
    // Optimistic update
    setCouponUserCounts((prev) => ({
      ...prev,
      [coupon.couponId]: (prev[coupon.couponId] || 0) + 1,
    }));

    try {
      await axios.post("/updatecouponusercount", { couponId: coupon.couponId });
      setDialogInfo({
        logoUrl: coupon.store.logo_url,
        couponCode: coupon.coupon_code,
        couponId: coupon.couponId,
        ref_link: coupon.ref_link,
        title: coupon.title,
      });
      if (coupon.type === "Deal") {
        setIsDealDialogOpen(true);
      } else if (coupon.type === "Coupon") {
        setIsCouponDialogOpen(true);
      }
      setTimeout(() => {
        window.open(coupon.ref_link, "_blank");
      }, 500);
    } catch (error) {
      // Revert optimistic update on error
      setCouponUserCounts((prev) => ({
        ...prev,
        [coupon.couponId]: (prev[coupon.couponId] || 1) - 1,
      }));
      console.error("Error updating coupon use count:", error);
    }
  };

  const handleReaction = async (
    couponId: number,
    reaction: "LIKE" | "DISLIKE",
  ) => {
    // Implement reaction logic here
    setUserReactions((prev) => ({ ...prev, [couponId]: reaction }));
    // You might want to send this reaction to your backend
  };

  return (
    <section
      className={`mx-auto w-full max-w-screen-xl overflow-x-hidden ${data.coupons?.length === 0 || isLoading || error ? "hidden" : ""}`}
    >
      <div className="flex w-full flex-col items-center sm:flex-row sm:justify-between sm:px-10 lg:px-12 xl:px-6 2xl:px-0">
        <h2 className="mx-auto place-self-center text-2xl font-bold sm:mx-0 sm:place-self-start lg:text-3xl">
          {title}
        </h2>
        <Link
          href={`/categories/${fetchFrom}`}
          className="place-self-center text-end text-sm font-medium hover:underline sm:-translate-y-2 sm:place-self-end sm:text-base"
        >
          View all{" "}
          <span className="first-letter:uppercase">{fetchFrom} Coupons</span>
        </Link>
      </div>
      <div className="flex flex-nowrap place-items-center items-center justify-start gap-x-8 gap-y-6 overflow-x-auto p-8 sm:px-10 md:grid-cols-2 lg:grid lg:grid-cols-4 lg:px-12 xl:px-6 2xl:px-0">
        {data.coupons?.map((coupon: Coupon, index: number) => (
          <div
            className="flex w-full max-w-72 shrink-0 flex-col items-center rounded-xl bg-popover shadow-lg sm:max-w-80 lg:max-w-full"
            key={index}
          >
            <div className="flex w-full items-center justify-center rounded-tl-md rounded-tr-md">
              {coupon.thumbnail_url ? (
                <Image
                  src={coupon.thumbnail_url}
                  width={1920}
                  height={1080}
                  alt="Logo"
                  className="aspect-video h-36 rounded-tl-xl rounded-tr-xl object-cover lg:h-28 xl:h-32"
                />
              ) : (
                <div className="aspect-video h-36 rounded-tl-xl rounded-tr-xl bg-popover lg:h-28 xl:h-32" />
              )}
            </div>

            <div className="flex w-full flex-col gap-y-0 p-4 xl:gap-y-1">
              <div className="flex w-full items-center justify-between ">
                <div className="-translate-x-3 -translate-y-2/3 rounded-full bg-white p-1 dark:bg-app-dark-navbar">
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
                <Badge className="-translate-y-2/3 bg-blue-400/50 text-black hover:bg-blue-400/50 dark:text-slate-200">
                  VERIFIED
                </Badge>
              </div>
              <p className=" -translate-y-8 place-self-start font-semibold first-letter:uppercase">
                {coupon.title}
              </p>
              <div className="flex w-full -translate-y-4 items-center justify-between text-muted-foreground">
                <Link
                  href={`/stores/${coupon.store.name}`}
                  className="flex items-start gap-x-4"
                >
                  <span className="w-4/5">{coupon.store.name}</span>
                </Link>
                <span>
                  {couponUserCounts[coupon.couponId] || coupon.user_count} Used
                </span>
              </div>
              {coupon.type === "Deal" && (
                <Button
                  size={"lg"}
                  className="w-full rounded-xl bg-app-main text-base font-semibold text-white dark:text-slate-200"
                  onClick={() => handleCouponUse(coupon)}
                >
                  Get Deal
                </Button>
              )}
              {coupon.type === "Coupon" && (
                <div
                  className="group relative grid min-h-10 w-full min-w-28 cursor-pointer overflow-hidden rounded-md bg-app-bg-main p-2 text-black dark:bg-app-dark dark:text-slate-200 sm:min-h-fit sm:min-w-40"
                  onClick={() => {
                    handleCouponUse(coupon);
                  }}
                >
                  <p
                    className={`place-self-end text-base font-semibold uppercase tracking-widest ${
                      !coupon.coupon_code && "min-h-5"
                    }`}
                  >
                    {coupon.coupon_code}
                  </p>
                  {/* wrapper */}
                  <div className="absolute left-0 top-0 h-full w-full">
                    <div className="polygon-clip h-full w-full rounded-xl bg-app-main transition-all duration-200 ease-linear group-hover:w-11/12">
                      <p className="absolute inset-0 grid place-items-center text-sm font-semibold text-slate-200">
                        Get code
                      </p>
                    </div>
                  </div>
                  {/* Border overlay */}
                  <div className="pointer-events-none absolute inset-0 rounded-xl border-2 border-dashed border-app-main" />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      <Dialog open={isCouponDialogOpen} onOpenChange={setIsCouponDialogOpen}>
        <CouponDialog
          logoUrl={dialogInfo.logoUrl}
          title={dialogInfo.title}
          couponCode={dialogInfo.couponCode}
          couponId={dialogInfo.couponId}
          expiry={format(new Date(), "dd-MMM-yyyy")} // You might want to get the actual expiry from the coupon
          ref_link={dialogInfo.ref_link}
          handleReaction={handleReaction}
          userReaction={userReactions[dialogInfo.couponId]}
        />
      </Dialog>
      <Dialog open={isDealDialogOpen} onOpenChange={setIsDealDialogOpen}>
        <DealDialog
          logoUrl={dialogInfo.logoUrl}
          title={dialogInfo.title}
          couponId={dialogInfo.couponId}
          expiry={format(new Date(), "dd-MMM-yyyy")} // You might want to get the actual expiry from the coupon
          ref_link={dialogInfo.ref_link}
          handleReaction={handleReaction}
          userReaction={userReactions[dialogInfo.couponId]}
        />
      </Dialog>
    </section>
  );
};

export default CategoriesSection;

const CouponDialog: React.FC<{
  logoUrl: string;
  title: string;
  couponCode: string;
  couponId: number;
  ref_link: string;
  expiry: string;
  handleReaction: (couponId: number, reaction: ReactionType) => void;
  userReaction: ReactionType | null;
}> = ({
  logoUrl,
  title,
  couponCode,
  couponId,
  expiry,
  ref_link,
  handleReaction,
  userReaction,
}) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(couponCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <DialogContent className="w-11/12 !bg-app-bg-main sm:w-full">
      <DialogHeader>
        <DialogTitle>Coupon Details</DialogTitle>
      </DialogHeader>
      <div className="flex flex-col items-center gap-4">
        <Image
          src={logoUrl ?? "https://via.placeholder.com/100x100"}
          width={400}
          height={400}
          alt="Store logo"
          className="size-28 rounded-full"
        />
        <p className="text-sm font-medium">{title}</p>
        <p className="text-sm font-medium text-muted-foreground">
          Ends on {expiry}
        </p>
        <div className="flex min-w-24 items-center gap-x-2 rounded-full border border-app-main pl-2 ">
          <span className="">{couponCode}</span>
          <Button
            size="sm"
            className="rounded-full rounded-bl-none rounded-tl-none bg-app-main p-3"
            onClick={copyToClipboard}
          >
            {copied ? "Copied!" : "Copy"}
          </Button>
        </div>
        <p className="flex items-center gap-x-1 text-center text-emerald-500">
          Copy and Paste Coupon code at{" "}
          <Link href={ref_link} target="_blank">
            <span className="flex items-center gap-x-1 text-app-main underline">
              Product <FaExternalLinkAlt className="size-3" />
            </span>
          </Link>
        </p>
        <div className="flex items-center gap-4">
          <button
            onClick={() => handleReaction(couponId, "LIKE")}
            className="flex items-center gap-2"
          >
            <ThumbsUp
              className={
                userReaction === "LIKE"
                  ? "size-4 fill-emerald-500 text-emerald-500"
                  : "size-4 text-emerald-500 transition-colors duration-200 ease-linear hover:fill-emerald-500"
              }
            />
          </button>
          <button
            onClick={() => handleReaction(couponId, "DISLIKE")}
            className="flex items-center gap-2"
          >
            <ThumbsDown
              className={
                userReaction === "DISLIKE"
                  ? "size-4 fill-app-main text-app-main"
                  : "size-4 text-app-main transition-colors duration-300 ease-linear hover:fill-app-main"
              }
            />
          </button>
        </div>
      </div>
    </DialogContent>
  );
};

const DealDialog: React.FC<{
  logoUrl: string;
  title: string;
  couponId: number;
  ref_link: string;
  expiry: string;
  handleReaction: (couponId: number, reaction: ReactionType) => void;
  userReaction: ReactionType | null;
}> = ({
  logoUrl,
  title,
  couponId,
  expiry,
  ref_link,
  handleReaction,
  userReaction,
}) => {
  return (
    <DialogContent className="w-11/12 !bg-app-bg-main sm:w-full">
      <DialogHeader>
        <DialogTitle>About Deal</DialogTitle>
      </DialogHeader>
      <div className="flex flex-col items-center gap-4">
        <Image
          src={logoUrl ?? "https://via.placeholder.com/100x100"}
          width={400}
          height={400}
          alt="Store logo"
          className="size-28 rounded-full"
        />
        <p className="text-sm font-medium">{title}</p>
        <p className="text-sm font-medium text-muted-foreground">
          Ends on {expiry}
        </p>
        <Link href={ref_link} target="_blank">
          <Button className="bg-app-main">Go to Deal</Button>
        </Link>
        <div className="flex items-center gap-4">
          <button
            onClick={() => handleReaction(couponId, "LIKE")}
            className="flex items-center gap-2"
          >
            <ThumbsUp
              className={
                userReaction === "LIKE"
                  ? "size-4 fill-emerald-500 text-emerald-500"
                  : "size-4 text-emerald-500 transition-colors duration-200 ease-linear hover:fill-emerald-500"
              }
            />
          </button>
          <button
            onClick={() => handleReaction(couponId, "DISLIKE")}
            className="flex items-center gap-2"
          >
            <ThumbsDown
              className={
                userReaction === "DISLIKE"
                  ? "size-4 fill-app-main text-app-main"
                  : "size-4 text-app-main transition-colors duration-300 ease-linear hover:fill-app-main"
              }
            />
          </button>
        </div>
      </div>
    </DialogContent>
  );
};
