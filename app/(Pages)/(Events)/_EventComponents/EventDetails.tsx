"use client";
import useGetEventDetails from "@/hooks/useGetEventDetails";
import Spinner from "../../_PageComponents/Spinner";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Heart, Tag, ThumbsDown, ThumbsUp, User, Verified } from "lucide-react";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { useEffect, useMemo, useState } from "react";
import axios from "@/app/api/axios/axios";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Seperator from "../../_PageComponents/Seperator";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PiSmileySadBold } from "react-icons/pi";
import { toast } from "@/components/ui/use-toast";

type ReactionType = "LIKE" | "DISLIKE";

interface CouponReaction {
  like_count: number;
  dislike_count: number;
}

const EventDetails = () => {
  const router = useRouter();
  const commonStyles = "w-full rounded-lg bg-popover p-4 shadow-md";
  const { eventName } = useParams();
  const { data: session } = useSession();
  const { data, isLoading, error, initialCoupon } = useGetEventDetails(
    eventName as string,
  );

  const dealsLength =
    data?.coupons?.filter(
      (coupon: Record<string, any>) => coupon.type === "Deal",
    ).length || 0;
  const couponsLength =
    data?.coupons?.filter(
      (coupon: Record<string, any>) => coupon.type === "Coupon",
    ).length || 0;

  // To store popular data
  const [popularData, setPopularData] = useState<Record<string, any>[]>([]);

  const blocks = "abcdefghijklmnopqrstuvwxyz".split("");

  // to get state of bookmarked coupons
  const [bookmarkedCoupons, setBookmarkedCoupons] = useState<number[]>([]);

  // to store coupon user count
  const [couponUserCounts, setCouponUserCounts] = useState<
    Record<number, number>
  >({});
  // to store user reaction
  const [userReactions, setUserReactions] = useState<
    Record<number, ReactionType | null>
  >({});

  // to store like and dislike count of a coupon

  // to get search params
  const searchParams = useSearchParams();

  const [isCouponDialogOpen, setIsCouponDialogOpen] = useState(false);
  const [isDealDialogOpen, setIsDealDialogOpen] = useState(false);

  const [dialogInfo, setDialogInfo] = useState({
    title: "",
    logoUrl: "",
    couponCode: "",
    couponId: 0,
    ref_link: "",
  });

  // to store like and dislike count of a coupon
  const [couponReactions, setCouponReactions] = useState<
    Record<number, CouponReaction>
  >({});

  //  NOTE: this is for fetching popular stores and top categories
  useEffect(() => {
    const fetchPopularStoreData = async () => {
      try {
        const response = await axios.get("/getpopularstores");
        setPopularData(response.data.popularStores);
      } catch (error) {
        console.error("Error fetching popular data:", error);
      }
    };
    fetchPopularStoreData();
  }, []);

  // NOTE: this is for fetching bookmarked coupons
  useEffect(() => {
    if (session?.user) {
      // Fetch user's bookmarked coupons
      axios.get(`/bookmarks`).then((response) => {
        setBookmarkedCoupons(response.data.bookmarkedCoupons);
      });
    }
  }, [session]);

  // NOTE: this is for handling bookmarking of coupons
  const handleBookmark = async (couponId: number) => {
    if (!session?.user) {
      // Redirect to login if user is not logged in
      router.push("/signin");
      toast({
        title: "Uh Oh!",
        description: "You must be signed in to bookmark coupons",
        variant: "destructive",
      });
      return;
    }

    // Optimistic update
    setBookmarkedCoupons((prev) =>
      prev.includes(couponId)
        ? prev.filter((id) => id !== couponId)
        : [...prev, couponId],
    );

    try {
      await axios.post("createbookmarks", { couponId });
    } catch (error) {
      // Revert optimistic update on error
      setBookmarkedCoupons((prev) =>
        prev.includes(couponId)
          ? prev.filter((id) => id !== couponId)
          : [...prev, couponId],
      );
      console.error("Error bookmarking coupon:", error);
    }
  };

  const [activeCoupons, expiredCoupons] = useMemo(() => {
    const now = new Date();
    return (data?.coupons || []).reduce(
      (
        acc: [Record<string, any>[], Record<string, any>[]],
        coupon: Record<string, any>,
      ) => {
        if (new Date(coupon.due_date) > now) {
          acc[0].push(coupon);
        } else {
          acc[1].push(coupon);
        }
        return acc;
      },
      [[], []],
    );
  }, [data?.coupons]);

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

  // NOTE: this is for handling coupon use
  useEffect(() => {
    const encodedCouponData = searchParams.get("coupon");

    if (encodedCouponData) {
      let couponData;
      try {
        // First, try to parse it as JSON directly
        couponData = JSON.parse(encodedCouponData);
      } catch (e) {
        // If that fails, it's likely URI encoded, so decode and then parse
        couponData = JSON.parse(decodeURIComponent(encodedCouponData));
      }

      setDialogInfo({
        title: couponData.title || "",
        logoUrl: couponData.logo || data?.logo_url || "",
        couponCode: couponData.coupon_code || "",
        couponId: couponData.couponId,
        ref_link: couponData.ref_link || "",
      });

      if (couponData.type === "Deal") {
        setIsDealDialogOpen(true);
      } else {
        // If type is "Coupon" or not specified, open the coupon dialog
        setIsCouponDialogOpen(true);
      }

      // Remove the coupon parameter from the URL
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.delete("coupon");
      window.history.replaceState({}, "", newUrl);
    }
  }, [searchParams, data?.logo_url]);

  const handleDeal = (coupon: Record<string, any>) => {
    setTimeout(() => {
      window.open(coupon.ref_link, "_blank");
    }, 1000);
  };

  const handleCoupon = (coupon: Record<string, any>) => {
    // Encode coupon data in URL
    const encodedCoupon = encodeURIComponent(
      JSON.stringify({
        couponId: coupon.couponId,
        coupon_code: coupon.coupon_code,
      }),
    );
    const currentUrl = new URL(window.location.href);
    currentUrl.searchParams.set("coupon", encodedCoupon);

    // Open a new window with the current URL including coupon data
    window.open(currentUrl.toString(), "_blank");

    // Redirect the current window after a short delay
    setTimeout(() => {
      window.location.href = coupon.ref_link;
    }, 100);
  };

  const handleCouponUse = async (
    couponId: number,
    type: "Coupon" | "Deal",
    coupon: Record<string, any>,
  ) => {
    // Optimistic update
    setCouponUserCounts((prev) => ({
      ...prev,
      [couponId]: (prev[couponId] || 0) + 1,
    }));

    try {
      await axios.post("/updatecouponusercount", { couponId });
      setDialogInfo({
        logoUrl: data?.logo_url,
        couponCode: coupon.coupon_code,
        couponId: coupon.couponId,
        ref_link: coupon.ref_link,
        title: coupon.title,
      });
      if (type === "Coupon") {
        setIsCouponDialogOpen(true);
        handleCoupon(coupon);
      } else if (type === "Deal") {
        setIsDealDialogOpen(true);
        handleDeal(coupon);
      }
    } catch (error) {
      // Revert optimistic update on error
      setCouponUserCounts((prev) => ({
        ...prev,
        [couponId]: (prev[couponId] || 1) - 1,
      }));
      console.error("Error updating coupon use count:", error);
    }
  };

  // NOTE: this is for handling the like dislike functionality for coupons
  useEffect(() => {
    if (data?.coupons) {
      const initialReactions = data.coupons.reduce(
        (acc: Record<number, CouponReaction>, coupon: Record<string, any>) => {
          acc[coupon.couponId] = {
            like_count: coupon.like_count,
            dislike_count: coupon.dislike_count,
          };
          return acc;
        },
        {},
      );
      setCouponReactions(initialReactions);
    }
  }, [data]);
  const handleReaction = async (couponId: number, reaction: ReactionType) => {
    const reactionKey = reaction === "LIKE" ? "like_count" : "dislike_count";
    const oppositeReactionKey =
      reaction === "LIKE" ? "dislike_count" : "like_count";

    // Check if the user is changing their reaction
    const isChangingReaction =
      userReactions[couponId] && userReactions[couponId] !== reaction;
    const isRemovingReaction = userReactions[couponId] === reaction;

    // Determine increment or decrement
    let increment = isRemovingReaction ? -1 : 1;

    // Optimistic update
    setCouponReactions((prev) => ({
      ...prev,
      [couponId]: {
        ...prev[couponId],
        [reactionKey]: Math.max(
          (prev[couponId]?.[reactionKey] || 0) + increment,
          0,
        ),
        ...(isChangingReaction && {
          [oppositeReactionKey]: Math.max(
            (prev[couponId]?.[oppositeReactionKey] || 0) - 1,
            0,
          ),
        }),
      },
    }));

    // Update user reactions
    setUserReactions((prev) => ({
      ...prev,
      [couponId]: isRemovingReaction ? null : reaction,
    }));

    try {
      const response = await axios.put("/updatecouponreaction", {
        couponId,
        reactionKey,
        isChangingReaction,
        increment,
      });

      // Update with actual server response
      setCouponReactions((prev) => ({
        ...prev,
        [couponId]: {
          like_count: response.data.like_count,
          dislike_count: response.data.dislike_count,
        },
      }));
    } catch (error) {
      // Revert optimistic update on error
      setCouponReactions((prev) => ({
        ...prev,
        [couponId]: {
          ...prev[couponId],
          [reactionKey]: Math.max(
            (prev[couponId]?.[reactionKey] || 0) - increment,
            0,
          ),
          ...(isChangingReaction && {
            [oppositeReactionKey]:
              (prev[couponId]?.[oppositeReactionKey] || 0) + 1,
          }),
        },
      }));
      setUserReactions((prev) => ({
        ...prev,
        [couponId]: isRemovingReaction
          ? reaction
          : prev[couponId] === reaction
            ? null
            : prev[couponId],
      }));
      console.error("Error updating coupon reaction:", error);
    }
  };

  return (
    <div className="min-h-[40vh] w-full  p-8 lg:px-16 lg:py-16">
      {isLoading ? (
        <div className="flex h-[40vh] w-full items-center justify-center">
          <Spinner />
        </div>
      ) : error ? (
        <div className="flex h-[40vh] w-full items-center justify-center">
          <p>{error}</p>
        </div>
      ) : data?.length === 0 ? (
        <div className="flex h-[40vh] w-full items-center justify-center">
          <p>No Events Found</p>
        </div>
      ) : (
        <div className="relative w-full">
          {session?.user.role === "admin" ? (
            <Link
              href={`/admin/editevent/${eventName}`}
              className="absolute right-4 top-0 -translate-y-8 cursor-pointer place-self-end  underline transition-colors duration-300 ease-linear hover:text-app-main lg:right-20"
            >
              Edit Event
            </Link>
          ) : (
            <Link
              href={`/submitcoupon`}
              className="absolute right-4 top-0 flex -translate-y-8 cursor-pointer items-center place-self-end  underline transition-colors duration-300 ease-linear hover:text-app-main lg:right-20"
            >
              Submit a coupon <Tag className="size-4" />
            </Link>
          )}
          {data?.cover_url && (
            <Image
              src={data?.cover_url}
              alt="Event Cover url"
              width={1920}
              height={1080}
              className="h-32 w-full rounded-md object-fill"
            />
          )}
          {/* Topbar for mobile */}
          <div className="mt-4 flex w-full items-center gap-x-4 rounded-lg bg-popover p-4 px-4  sm:px-8 lg:hidden lg:px-16">
            <Image
              src={data?.logo_url ?? "https://via.placeholder.com/600x400"}
              alt={data?.name + " Logo"}
              width={400}
              height={400}
              className="size-32 rounded-full object-cover"
            />
            <h1 className="text-start text-base font-bold sm:text-2xl">
              {data?.name}
            </h1>
          </div>
          <section className="relative mb-6 flex w-full flex-col items-start gap-6 px-0 pt-10 sm:px-8 lg:flex-row lg:px-16">
            <aside className="hidden flex-col items-center gap-y-8 lg:flex lg:w-1/4">
              <Image
                src={
                  data?.logo_url
                    ? data?.logo_url
                    : "https://via.placeholder.com/600x400"
                }
                alt={`Event Logo`}
                width={400}
                height={400}
                className="size-40 rounded-full"
              />
              <div
                className={`${commonStyles} ${data?.description ? "" : "hidden"}`}
              >
                <h2 className="text-xl font-bold">About</h2>
                <p>{data?.description}</p>
              </div>
              <div className={`${commonStyles}`}>
                <h2 className="mb-2 text-base font-bold">
                  Today&apos;s Top Shopping Events
                </h2>
                {data?.coupons && data?.coupons[0] && (
                  <p className="my-2">&bull; {data?.coupons[0].title}</p>
                )}
                {data?.coupons && data?.coupons[1] && (
                  <p className="my-2">&bull; {data?.coupons[1].title}</p>
                )}
                <div className="flex flex-col gap-y-4 rounded-lg border-2 p-4">
                  <div className="flex items-center justify-between ">
                    <p>Total Coupons:</p>
                    <p>{couponsLength}</p>
                  </div>

                  <div className="flex items-center justify-between">
                    <p>Total Deals:</p>
                    <p>{dealsLength}</p>
                  </div>
                  <div className={`flex items-center justify-between`}>
                    <p className="inline-block text-center font-medium">
                      Total Offers:
                    </p>
                    <p className="ml-auto inline-block text-center">
                      {data?.coupons?.length || 0}
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p>Best Offer:</p>
                    <p>{data?.best_offer} Off</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p>Average Discount:</p>
                    <p>{data?.average_discount}</p>
                  </div>
                </div>
              </div>
              {/* Popular Stores */}
              {popularData?.length > 0 && (
                <PopularItems
                  title="Popular Stores"
                  items={popularData.map((store, index) => ({
                    id: index,
                    name: store.name,
                  }))}
                  isStore
                />
              )}
              {/* Categories Browse by store */}
              <div className={`${commonStyles}`}>
                <h2 className="mb-2 font-medium">Browse by Stores</h2>
                <div className="flex flex-wrap gap-2">
                  {blocks.map((block) => (
                    <Button
                      key={block}
                      className="!size-4 border border-primary bg-app-main text-xs"
                      asChild
                    >
                      <Link href={`/stores?like=${block}`}>
                        {block.charAt(0).toUpperCase()}
                      </Link>
                    </Button>
                  ))}
                </div>
              </div>
            </aside>
            <Separator className="hidden h-auto min-h-[90vh] w-[2px] self-stretch text-muted lg:block" />
            <main className="flex w-full flex-col items-stretch gap-y-6">
              <div className="hidden -translate-y-2 flex-col lg:flex">
                <h1 className="mb-2 text-4xl font-bold">{data?.name}</h1>
                {initialCoupon && (
                  <p className="font-semibold">
                    Best Offers Last Validated On{" "}
                    {format(initialCoupon, "dd-MMM-yyyy")}
                  </p>
                )}
              </div>

              {/* Active Coupons */}
              <Accordion
                type="single"
                collapsible
                className="flex w-full flex-col gap-y-6 lg:w-11/12"
              >
                {activeCoupons.map((coupon: any) => (
                  <AccordionItem
                    key={coupon.couponId}
                    value={coupon.couponId}
                    className="rounded-lg bg-popover shadow-md"
                  >
                    <div className="group/accordion relative flex w-full items-center justify-between gap-x-6 gap-y-4 p-6">
                      <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
                        {/* Coupon image */}
                        <div>
                          <Image
                            src={
                              coupon.store.logo_url ??
                              "https://via.placeholder.com/600x400"
                            }
                            width={400}
                            height={400}
                            className="size-16 rounded-md border object-contain"
                            alt={data?.name + " Logo"}
                          />
                          <Badge
                            className={cn(
                              coupon.type === "Deal"
                                ? "bg-amber-500 hover:bg-amber-600"
                                : "bg-blue-400/50 hover:bg-blue-500/50",
                              "mt-1 grid w-full place-items-center text-black dark:text-slate-200 ",
                            )}
                          >
                            {coupon.type}
                          </Badge>
                        </div>
                        {/* Coupon title */}
                        <div className="flex flex-col">
                          <p className="mb-2 text-base font-semibold tracking-wide first-letter:uppercase">
                            {coupon.title}
                          </p>
                          <AccordionTrigger className="[&[data-state=open]>svg]:text-white [&[data-state=open]]:bg-app-main [&[data-state=open]]:text-white ">
                            Details
                          </AccordionTrigger>
                        </div>
                      </div>

                      {/* Coupon code users and bookmark */}
                      <div className="flex flex-col items-end justify-between gap-4">
                        <Heart
                          className={`absolute right-2 top-2 size-4 cursor-pointer text-app-main transition-all duration-300 ease-linear ${
                            bookmarkedCoupons.includes(coupon.couponId)
                              ? "fill-app-main text-app-main"
                              : "opacity-100 hover:fill-app-main group-hover/accordion:opacity-100 lg:opacity-0"
                          }`}
                          onClick={() => handleBookmark(coupon.couponId)}
                        />
                        <div className=" flex flex-col items-center gap-x-4 sm:flex-row">
                          <p className="flex w-fit items-center gap-x-2 text-sm text-emerald-500">
                            <Verified className="inline-flex size-4 text-emerald-500" />
                            Verified
                          </p>
                          <p className="flex items-center gap-x-2 tabular-nums text-muted-foreground">
                            <User className="size-4" />
                            {couponUserCounts[coupon.couponId] || 0} Used
                          </p>
                        </div>
                        <Dialog
                          open={isCouponDialogOpen}
                          onOpenChange={setIsCouponDialogOpen}
                        >
                          <CouponDialog
                            logoUrl={dialogInfo.logoUrl}
                            title={coupon.title}
                            couponCode={dialogInfo.couponCode}
                            couponId={dialogInfo.couponId}
                            expiry={format(coupon.due_date, "dd-MMM-yyyy")}
                            ref_link={coupon.ref_link}
                            handleReaction={handleReaction}
                            userReaction={userReactions[dialogInfo.couponId]}
                          />
                        </Dialog>
                        <Dialog
                          open={isDealDialogOpen}
                          onOpenChange={setIsDealDialogOpen}
                        >
                          <DealDialog
                            logoUrl={dialogInfo.logoUrl}
                            title={dialogInfo.title}
                            couponId={dialogInfo.couponId}
                            expiry={format(coupon.due_date, "dd-MMM-yyyy")}
                            ref_link={coupon.ref_link}
                            handleReaction={handleReaction}
                            userReaction={userReactions[dialogInfo.couponId]}
                          />
                        </Dialog>
                        {coupon.type === "Deal" && (
                          <Button
                            className="min-h-10 w-full border-2 border-dashed bg-app-main  text-base font-semibold"
                            onClick={() => {
                              handleCouponUse(coupon.couponId, "Deal", coupon);
                            }}
                          >
                            Get Deal
                          </Button>
                        )}
                        {coupon.type === "Coupon" && (
                          <div
                            className="group relative grid min-h-10 w-full min-w-28 cursor-pointer rounded-md border-2 border-dashed border-app-main bg-app-bg-main p-2 dark:bg-app-dark sm:min-h-fit  sm:min-w-40"
                            onClick={() => {
                              handleCouponUse(
                                coupon.couponId,
                                "Coupon",
                                coupon,
                              );
                            }}
                          >
                            <p
                              className={`translate-x-2 place-self-center text-base font-semibold uppercase tracking-widest ${!coupon.coupon_code && "min-h-5"}`}
                            >
                              {coupon.coupon_code}
                            </p>
                            {/* wrapper */}
                            <div className="polygon-clip absolute left-0 top-0 grid h-full w-full place-items-center bg-app-main  transition-all duration-200 ease-linear group-hover:w-8/12 ">
                              <p className="text-sm font-semibold text-slate-200">
                                Reveal code
                              </p>
                            </div>
                          </div>
                        )}
                        <div className="flex items-center gap-x-4">
                          <button
                            onClick={() =>
                              handleReaction(coupon.couponId, "LIKE")
                            }
                            className="flex items-center gap-x-2"
                          >
                            <ThumbsUp
                              className={
                                userReactions[coupon.couponId] === "LIKE"
                                  ? "size-4 fill-emerald-500 text-emerald-500"
                                  : "size-4 text-emerald-500 transition-colors duration-200 ease-linear hover:fill-emerald-500"
                              }
                            />
                            <span className="text-muted-foreground">
                              {couponReactions[coupon.couponId]?.like_count ||
                                0}
                            </span>
                          </button>
                          <button
                            onClick={() =>
                              handleReaction(coupon.couponId, "DISLIKE")
                            }
                            className="flex items-center gap-x-2"
                          >
                            <ThumbsDown
                              className={
                                userReactions[coupon.couponId] === "DISLIKE"
                                  ? "size-4 fill-app-main text-app-main"
                                  : "size-4 text-app-main transition-colors duration-300 ease-linear hover:fill-app-main"
                              }
                            />
                            <span className="text-muted-foreground">
                              {couponReactions[coupon.couponId]
                                ?.dislike_count || 0}
                            </span>
                          </button>
                        </div>
                      </div>
                    </div>
                    <AccordionContent className="relative p-6">
                      <Seperator />
                      {coupon.description}

                      <p className="absolute bottom-2 right-2 text-muted-foreground">
                        Expires on:{" "}
                        {format(new Date(coupon.due_date), "dd-MMM-yyy")}
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>

              {/* Expired Coupons */}
              {expiredCoupons.length > 0 && (
                <>
                  <h2 className="mt-8 text-2xl font-bold">Expired Coupons</h2>
                  <Accordion
                    type="single"
                    collapsible
                    className="flex w-full flex-col gap-y-6 lg:w-11/12"
                  >
                    {expiredCoupons.map((coupon: any) => (
                      <AccordionItem
                        key={coupon.couponId}
                        value={coupon.couponId.toString()}
                        className="rounded-lg bg-popover shadow-md"
                      >
                        <div className="group/accordion relative flex w-full items-center justify-between gap-x-6 gap-y-4 p-6 text-muted-foreground">
                          <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
                            {/* Coupon image */}
                            <div>
                              <Image
                                src={
                                  coupon.store.logo_url ??
                                  "https://via.placeholder.com/600x400"
                                }
                                width={400}
                                height={400}
                                className="size-16 rounded-md border object-contain grayscale"
                                alt={data?.name + " Logo"}
                              />
                              <Badge
                                className={
                                  "m-0 mt-1 grid w-full place-items-center bg-neutral-500 text-black hover:bg-neutral-500 dark:text-slate-200"
                                }
                              >
                                {coupon.type}
                              </Badge>
                            </div>
                            {/* Coupon title */}
                            <div className="flex flex-col">
                              <p className="mb-2 text-base font-semibold tracking-wide first-letter:uppercase">
                                {coupon.title}
                              </p>
                              <AccordionTrigger className="[&[data-state=open]>svg]:text-white [&[data-state=open]]:bg-neutral-500 [&[data-state=open]]:text-white ">
                                Details
                              </AccordionTrigger>
                            </div>
                          </div>

                          {/* Coupon code users and bookmark */}
                          <div className="flex flex-col items-end justify-between gap-4">
                            <Heart
                              className={`absolute right-2 top-2 size-4 cursor-pointer text-app-main transition-all duration-300 ease-linear ${
                                bookmarkedCoupons.includes(coupon.couponId)
                                  ? "fill-app-main text-app-main"
                                  : "opacity-100 hover:fill-app-main group-hover/accordion:opacity-100 lg:opacity-0"
                              }`}
                              onClick={() => handleBookmark(coupon.couponId)}
                            />
                            <div className=" flex flex-col items-center gap-x-4 sm:flex-row">
                              <p className="flex w-fit items-center gap-x-2 text-sm text-emerald-500">
                                <Verified className="inline-flex size-4 text-emerald-500" />
                                Verified
                              </p>
                              <p className="flex items-center gap-x-2 tabular-nums text-muted-foreground">
                                <User className="size-4" />
                                {couponUserCounts[coupon.couponId] || 0} Used
                              </p>
                            </div>
                            <Dialog
                              open={isCouponDialogOpen}
                              onOpenChange={setIsCouponDialogOpen}
                            >
                              <CouponDialog
                                logoUrl={dialogInfo.logoUrl}
                                title={coupon.title}
                                couponCode={dialogInfo.couponCode}
                                couponId={dialogInfo.couponId}
                                expiry={format(coupon.due_date, "dd-MMM-yyyy")}
                                ref_link={coupon.ref_link}
                                handleReaction={handleReaction}
                                userReaction={
                                  userReactions[dialogInfo.couponId]
                                }
                              />
                            </Dialog>
                            <Dialog
                              open={isDealDialogOpen}
                              onOpenChange={setIsDealDialogOpen}
                            >
                              <DealDialog
                                logoUrl={dialogInfo.logoUrl}
                                title={dialogInfo.title}
                                couponId={dialogInfo.couponId}
                                expiry={format(coupon.due_date, "dd-MMM-yyyy")}
                                ref_link={coupon.ref_link}
                                handleReaction={handleReaction}
                                userReaction={
                                  userReactions[dialogInfo.couponId]
                                }
                              />
                            </Dialog>
                            {coupon.type === "Deal" && (
                              <Button
                                className="min-h-10 w-full border-2 border-dashed bg-app-main  text-base font-semibold"
                                onClick={() => {
                                  handleCouponUse(
                                    coupon.couponId,
                                    "Deal",
                                    coupon,
                                  );
                                }}
                              >
                                Get Deal
                              </Button>
                            )}
                            {coupon.type === "Coupon" && (
                              <div
                                className="group relative grid min-h-10 w-full min-w-28 cursor-pointer rounded-md border-2 border-dashed border-app-main bg-app-bg-main p-2 dark:bg-app-dark sm:min-h-fit  sm:min-w-40"
                                onClick={() => {
                                  handleCouponUse(
                                    coupon.couponId,
                                    "Coupon",
                                    coupon,
                                  );
                                }}
                              >
                                <p
                                  className={`translate-x-2 place-self-center text-base font-semibold uppercase tracking-widest ${!coupon.coupon_code && "min-h-5"}`}
                                >
                                  {coupon.coupon_code}
                                </p>
                                {/* wrapper */}
                                <div className="polygon-clip absolute left-0 top-0 grid h-full w-full place-items-center bg-app-main  transition-all duration-200 ease-linear group-hover:w-8/12 ">
                                  <p className="text-sm font-semibold text-slate-200">
                                    Reveal code
                                  </p>
                                </div>
                              </div>
                            )}
                            <div className="flex items-center gap-x-4">
                              <button
                                onClick={() =>
                                  handleReaction(coupon.couponId, "LIKE")
                                }
                                className="flex items-center gap-x-2"
                              >
                                <ThumbsUp
                                  className={
                                    userReactions[coupon.couponId] === "LIKE"
                                      ? "size-4 fill-emerald-500 text-emerald-500"
                                      : "size-4 text-emerald-500 transition-colors duration-200 ease-linear hover:fill-emerald-500"
                                  }
                                />
                                <span className="text-muted-foreground">
                                  {couponReactions[coupon.couponId]
                                    ?.like_count || 0}
                                </span>
                              </button>
                              <button
                                onClick={() =>
                                  handleReaction(coupon.couponId, "DISLIKE")
                                }
                                className="flex items-center gap-x-2"
                              >
                                <ThumbsDown
                                  className={
                                    userReactions[coupon.couponId] === "DISLIKE"
                                      ? "size-4 fill-app-main text-app-main"
                                      : "size-4 text-app-main transition-colors duration-300 ease-linear hover:fill-app-main"
                                  }
                                />
                                <span className="text-muted-foreground">
                                  {couponReactions[coupon.couponId]
                                    ?.dislike_count || 0}
                                </span>
                              </button>
                            </div>
                          </div>
                        </div>
                        <AccordionContent className="relative p-6">
                          <Seperator />
                          {coupon.description}
                          <p className="absolute bottom-2 right-2 text-muted-foreground">
                            Expired on:{" "}
                            {format(new Date(coupon.due_date), "dd-MMM-yyy")}
                          </p>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </>
              )}

              {/* About for mobile */}
              <div
                className={`${commonStyles} ${data?.description ? "lg:hidden" : "hidden"}`}
              >
                <h2 className="text-xl font-bold">About</h2>
                <p>{data?.description}</p>
              </div>

              {/* Popular Stores for mobile */}
              {popularData?.length > 0 && (
                <PopularItems
                  title="Popular Stores"
                  items={popularData.map((store, index) => ({
                    id: index,
                    name: store.name,
                  }))}
                  isHidden
                  isStore
                />
              )}
            </main>
          </section>
        </div>
      )}
    </div>
  );
};

export default EventDetails;

// Popular Items Component

interface PopularItemProps {
  title: string;
  items: Record<string, any>[];
  isStore?: boolean;
  isHidden?: boolean;
}

const PopularItems: React.FC<PopularItemProps> = ({
  title,
  items,
  isStore = false,
  isHidden,
}) => {
  const commonStyles = "w-full rounded-lg bg-popover p-4 shadow-md";

  return (
    <div className={`${commonStyles} ${isHidden ? "lg:hidden" : ""}`}>
      <h2 className="text-base font-semibold">{title}</h2>
      <div className={`mt-4 flex flex-wrap gap-4`}>
        {items.map((item) => {
          return (
            <Link
              href={
                isStore ? `/stores/${item.name}` : `/categories/${item.name}`
              }
              key={item.id}
            >
              <Badge className="bg-app-main/90 dark:bg-app-main/50">
                {item.name}
              </Badge>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

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
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Coupon Details</DialogTitle>
      </DialogHeader>
      <div className="flex flex-col items-center gap-4">
        <Image
          src={logoUrl ?? "https://via.placeholder.com/100x100"}
          width={100}
          height={100}
          alt="Store logo"
          className="rounded-full"
        />
        <p className="text-sm font-medium">{title}</p>
        <p className="text-sm font-medium text-muted-foreground">
          Ends on {expiry}
        </p>
        <div className="flex min-w-24 items-center gap-x-2 rounded-full border border-app-main pl-2 ">
          <span className="">{couponCode}</span>
          <Button
            size="sm"
            className="ml-auto min-w-16 rounded-full rounded-bl-none rounded-tl-none bg-app-main p-3"
            onClick={copyToClipboard}
          >
            {copied ? "Copied!" : "Copy"}
          </Button>
        </div>
        <p className="flex items-center gap-x-1 text-emerald-500">
          Copy and Paste Coupon code at{" "}
          <Link href={ref_link}>
            <span className="text-app-main underline">Product</span>
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
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>About Deal</DialogTitle>
      </DialogHeader>
      <div className="flex flex-col items-center gap-4">
        <Image
          src={logoUrl ?? "https://via.placeholder.com/100x100"}
          width={100}
          height={100}
          alt="Store logo"
          className="rounded-full"
        />
        <p className="text-sm font-medium">{title}</p>
        <p className="text-sm font-medium text-muted-foreground">
          Ends on {expiry}
        </p>
        <Link href={ref_link}>
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
