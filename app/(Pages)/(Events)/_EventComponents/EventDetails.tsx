"use client";
import useGetEventDetails from "@/hooks/useGetEventDetails";
import Spinner from "../../_PageComponents/Spinner";
import {
  notFound,
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import Link from "next/link";
import { useSession } from "next-auth/react";
import {
  ChevronRight,
  Heart,
  Tag,
  ThumbsDown,
  ThumbsUp,
  User,
  Verified,
} from "lucide-react";
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
  DialogOverlay,
  DialogTitle,
} from "@/components/ui/dialog";
import { PiSmileySadBold } from "react-icons/pi";
import { toast } from "@/components/ui/use-toast";
import { useActiveFestival } from "@/hooks/useFestivalActive";
import { FaExternalLinkAlt } from "react-icons/fa";
import { constructS3Url } from "@/lib/utilities/AwsConfig";

type ReactionType = "LIKE" | "DISLIKE";

interface CouponReaction {
  like_count: number;
  dislike_count: number;
}

const EventDetails = () => {
  const router = useRouter();
  const commonStyles = "w-full rounded-xl bg-popover p-4 py-6 shadow-md";
  const { eventslug } = useParams();
  const { data: session } = useSession();
  const currentUrl = usePathname();
  const { data, isLoading, error, initialCoupon } = useGetEventDetails(
    eventslug as string,
  );

  if (!data) {
    notFound();
  }

  console.log(data);

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

  // state for active festival
  const isActiveFestival = useActiveFestival((state) => state.isActive);
  const isAdmin = session?.user?.role === "admin";

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

  // success ratio like/dislike count ratio
  const successRatio = (like: number, dislike: number) => {
    like = like;
    dislike = dislike;
    return (
      like === 0 || dislike === 0 ? 0 : (like / (like + dislike)) * 100
    ).toFixed(2); // success ratio in percentage
  };

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
      router.push(`/signin?callbackUrl=${currentUrl}`);
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
    const now = new Date().getDate();
    return (data?.coupons || []).reduce(
      (
        acc: [Record<string, any>[], Record<string, any>[]],
        coupon: Record<string, any>,
      ) => {
        if (new Date(coupon.due_date).getDate() >= now) {
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
    <div className="min-h-[40vh] w-full">
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
          {session?.user.role === "admin" && (
            <Link
              href={`/admin/editevent/${eventslug}`}
              className="absolute right-4 top-0 z-50 cursor-pointer place-self-end underline transition-colors duration-300 ease-linear hover:text-app-main lg:-top-1 lg:right-16 xl:right-20"
            >
              Edit Event
            </Link>
          )}
          {/* Topbar for mobile */}
          <div
            className={`mt-4 ${isActiveFestival && !isAdmin ? "translate-y-4 transition-transform duration-200 ease-linear" : "translate-y-0 transition-transform duration-200 ease-linear"} flex w-full items-center gap-x-4 rounded-lg bg-popover p-4 px-4  sm:px-8 lg:hidden lg:px-12`}
          >
            <div className="size-32 rounded-full border border-black bg-popover p-1 transition-shadow duration-200 ease-linear hover:shadow-lg dark:border-slate-200">
              <Image
                src={
                  constructS3Url(data?.logo_url) ??
                  "https://via.placeholder.com/600x400"
                }
                alt={data?.name + " Logo"}
                width={400}
                height={400}
                className="aspect-square w-full rounded-full object-cover"
              />
            </div>
            <h1 className="text-start text-base font-bold sm:text-2xl">
              {data?.name}
            </h1>
          </div>
          <section
            className={`mb-6 flex w-full flex-col items-start px-4 sm:px-8 lg:px-12 xl:ml-5 2xl:ml-7 ${isActiveFestival ? "!mb-14" : ""}`}
          >
            {data?.cover_url && (
              <Image
                src={constructS3Url(data?.cover_url)!}
                alt="Event Cover url"
                width={1920}
                height={1080}
                className="mb-4 mt-6 h-32 w-full rounded-md object-cover lg:h-40 xl:w-[98%]"
              />
            )}
            <div className="relative flex w-full flex-col items-start lg:flex-row lg:gap-x-10 lg:pt-10 xl:gap-x-14">
              <aside className="hidden flex-col items-center gap-y-8 lg:flex lg:w-1/4 lg:shrink-0 2xl:shrink">
                <div className="size-56 rounded-full border border-black bg-popover p-1 dark:border-slate-200">
                  <Image
                    src={
                      constructS3Url(data.logo_url) ??
                      "https://via.placeholder.com/600x400"
                    }
                    alt={`Event Logo`}
                    width={400}
                    height={400}
                    className="aspect-square w-full rounded-full"
                  />
                </div>
                <div
                  className={`${commonStyles} ${data?.description ? "" : "hidden"}`}
                >
                  <h2 className="mb-2 text-xl font-bold">About</h2>
                  <p>{data?.description}</p>
                </div>
                <div className={`${commonStyles}`}>
                  <h2 className="mb-2 text-lg font-bold">
                    Today&apos;s Top Shopping Events
                  </h2>
                  {data?.coupons && data?.coupons[0] && (
                    <p className="my-2 flex gap-x-2 pl-2 font-semibold">
                      <span>&bull;</span>
                      <span>{data?.coupons[0].title}</span>
                    </p>
                  )}
                  {data?.coupons && data?.coupons[1] && (
                    <p className="my-2 flex gap-x-2 pl-2 font-semibold">
                      <span>&bull;</span>
                      <span>{data?.coupons[1].title}</span>
                    </p>
                  )}
                  <div className="flex flex-col gap-y-4 py-4">
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
                      <p>{data?.best_offer}</p>
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
                  <h2 className="mb-2 font-semibold">Browse by Stores</h2>
                  <div className="flex flex-wrap gap-2">
                    {blocks.map((block) => (
                      <Button
                        key={block}
                        className="!size-4 bg-neutral-400/40 text-xs font-semibold text-black hover:bg-neutral-400/40 dark:text-slate-200"
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
                <div className="hidden w-full -translate-y-2 flex-col lg:flex xl:w-[97%]">
                  <h1 className="mb-2 text-4xl font-bold">{data?.name}</h1>
                  <Link
                    href={"/submit-a-coupon"}
                    className="flex items-center gap-x-1 place-self-end text-app-main underline"
                  >
                    Submit a coupon <Tag className="size-4" />
                  </Link>
                </div>

                {/* Active Coupons */}
                <Accordion
                  type="single"
                  collapsible
                  className="flex w-full flex-col gap-y-6 xl:w-[97%]"
                >
                  {activeCoupons.map((coupon: any) => (
                    <AccordionItem
                      key={coupon.couponId}
                      value={coupon.couponId}
                      className="min-h-40 rounded-xl border-2 border-neutral-200 bg-popover shadow-sm dark:border-neutral-700 sm:min-h-56 sm:pt-4"
                    >
                      <div className="group/accordion relative flex w-full items-center justify-between gap-x-6 gap-y-4 px-2 pb-2 pt-3 sm:px-6">
                        <div className="flex items-start gap-x-2 sm:gap-x-6">
                          {/* Coupon image */}
                          <div className="flex flex-col items-start gap-y-2 sm:gap-y-6">
                            <div className="flex w-16 flex-col items-center border sm:w-24">
                              <Image
                                src={
                                  constructS3Url(coupon.store.logo_url) ??
                                  "https://via.placeholder.com/600x400"
                                }
                                width={400}
                                height={400}
                                className="aspect-square w-full rounded-full object-cover p-2"
                                alt={data.name + " Logo"}
                              />
                              <Badge
                                className={cn(
                                  coupon.type === "Deal"
                                    ? "bg-amber-500 hover:bg-amber-600"
                                    : "bg-blue-400/50 hover:bg-blue-500/50",
                                  "grid w-full place-items-center text-black dark:text-slate-200 ",
                                )}
                              >
                                {coupon.type === "Coupon" ? "Code" : "Deal"}
                              </Badge>
                            </div>
                            <AccordionTrigger className="px-1 text-sm sm:px-3 sm:text-base [&[data-state=open]>svg]:text-white [&[data-state=open]]:bg-app-main [&[data-state=open]]:text-white ">
                              Details
                            </AccordionTrigger>
                          </div>
                          {/* Coupon title */}

                          <p className="max-w-36 translate-y-4 font-semibold tracking-tight first-letter:uppercase sm:max-w-full sm:translate-y-6 sm:text-lg sm:tracking-wide lg:text-xl">
                            {coupon.title}
                          </p>
                        </div>

                        {/* Coupon code users and bookmark */}
                        <div className="flex flex-col items-end gap-5">
                          <Heart
                            className={`absolute right-2 top-2 size-5 cursor-pointer text-app-main transition-all duration-300 ease-linear sm:-top-1 ${
                              bookmarkedCoupons.includes(coupon.couponId)
                                ? "fill-app-main text-app-main"
                                : "opacity-100 group-hover/accordion:opacity-100 lg:opacity-0 lg:hover:fill-app-main"
                            }`}
                            onClick={() => handleBookmark(coupon.couponId)}
                          />
                          <p className="absolute bottom-2 right-2 text-sm tabular-nums text-muted-foreground sm:hidden">
                            {couponUserCounts[coupon.couponId] || 0} Used
                          </p>
                          <div className="hidden w-full items-center justify-between gap-x-8 sm:flex sm:text-base md:gap-x-16 lg:text-lg">
                            <p className="flex w-full items-center gap-x-1 text-emerald-900 sm:text-lg">
                              <Verified className="inline-flex size-4 text-emerald-900 md:size-5" />
                              Verified
                            </p>
                            <p className="flex w-full items-center gap-x-1 text-muted-foreground sm:text-lg md:text-xl">
                              <User className="size-4 md:size-5" />
                              <span>
                                {couponUserCounts[coupon.couponId] || 0}
                              </span>
                              <span>Used</span>
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
                            <>
                              <Button
                                className="hidden min-h-12 w-56 rounded-xl bg-app-main text-base font-semibold text-white dark:text-slate-200 sm:block md:w-64"
                                onClick={() => {
                                  handleCouponUse(
                                    coupon.couponId,
                                    "Deal",
                                    coupon,
                                  );
                                }}
                              >
                                GET DEAL
                              </Button>
                              <ChevronRight
                                onClick={() => {
                                  handleCouponUse(
                                    coupon.couponId,
                                    "Deal",
                                    coupon,
                                  );
                                }}
                                className="size-6  text-app-main  sm:hidden"
                              />
                            </>
                          )}
                          {coupon.type === "Coupon" && (
                            <>
                              <div
                                className="group relative hidden !min-h-12 w-56 cursor-pointer overflow-hidden rounded-xl bg-app-bg-main p-2 dark:bg-app-dark sm:grid sm:min-h-fit md:w-64"
                                onClick={() => {
                                  handleCouponUse(
                                    coupon.couponId,
                                    "Coupon",
                                    coupon,
                                  );
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
                                  <div className="polygon-clip h-full w-full rounded-xl bg-app-main font-semibold transition-all duration-200 ease-linear group-hover:w-11/12">
                                    <p className="absolute inset-0 grid place-items-center font-semibold text-white dark:text-slate-200">
                                      GET CODE
                                    </p>
                                  </div>
                                </div>
                                {/* Border overlay */}
                                <div className="pointer-events-none absolute inset-0 rounded-xl border-2 border-dashed border-app-main" />
                              </div>
                              <ChevronRight
                                onClick={() => {
                                  handleCouponUse(
                                    coupon.couponId,
                                    "Coupon",
                                    coupon,
                                  );
                                }}
                                className="size-6  text-app-main  sm:hidden"
                              />
                            </>
                          )}
                          <div className=" hidden w-full translate-x-1 justify-between place-self-start text-sm sm:flex md:text-base lg:text-lg">
                            <p className="whitespace-nowrap text-sm text-muted-foreground md:text-base">
                              <span className="tabular-nums">
                                {successRatio(
                                  couponReactions[coupon.couponId]
                                    ?.like_count || 0,
                                  couponReactions[coupon.couponId]
                                    ?.dislike_count || 0,
                                )}
                              </span>
                              <span>% Success</span>
                            </p>
                            <div className="hidden -translate-x-1 items-center gap-x-2 place-self-center sm:flex">
                              <button
                                onClick={() =>
                                  handleReaction(coupon.couponId, "LIKE")
                                }
                                className="flex items-center gap-x-2"
                              >
                                <ThumbsUp
                                  className={
                                    userReactions[coupon.couponId] === "LIKE"
                                      ? "size-4 fill-emerald-900 text-emerald-900"
                                      : "size-4 text-emerald-900 transition-colors duration-200 ease-linear hover:fill-emerald-900"
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
                      </div>
                      <AccordionContent className="px-2 pb-5 pt-2 sm:px-6 sm:pb-6 sm:pt-4">
                        <Seperator />
                        <div className="flex flex-col items-start sm:flex-row sm:justify-between ">
                          <p className="mb-2">{coupon.description}</p>
                          <p className="text-muted-foreground">
                            Expires on:{" "}
                            {format(new Date(coupon.due_date), "dd-MMM-yyy")}
                          </p>
                        </div>
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
                      className="flex w-full flex-col gap-y-6 xl:w-[97%]"
                    >
                      {expiredCoupons.map((coupon: any) => (
                        <AccordionItem
                          key={coupon.couponId}
                          value={coupon.couponId}
                          className="min-h-40 rounded-xl border-2 border-neutral-200 bg-popover shadow-sm dark:border-neutral-700 sm:min-h-56 sm:pt-4"
                        >
                          <div className="group/accordion relative flex w-full items-center justify-between gap-x-6 gap-y-4 px-2 pb-2 pt-3 text-muted-foreground sm:px-6">
                            <div className="flex items-start gap-6 sm:flex-row">
                              {/* Coupon image */}
                              <div className="flex flex-col items-start gap-y-2 sm:items-center sm:gap-y-6">
                                <div className="flex w-16 flex-col items-center border sm:w-24">
                                  <Image
                                    src={
                                      constructS3Url(coupon.store.logo_url) ??
                                      "https://via.placeholder.com/600x400"
                                    }
                                    width={400}
                                    height={400}
                                    className="aspect-square w-full rounded-full object-cover p-2 grayscale"
                                    alt={data.name + " Logo"}
                                  />
                                  <Badge
                                    className={
                                      "grid w-full place-items-center bg-neutral-500 text-black hover:bg-neutral-500 dark:text-slate-200"
                                    }
                                  >
                                    {coupon.type === "Coupon" ? "Code" : "Deal"}
                                  </Badge>
                                </div>
                                <AccordionTrigger className="px-1 sm:px-3 [&[data-state=open]>svg]:text-white [&[data-state=open]]:bg-neutral-500 [&[data-state=open]]:text-white">
                                  Details
                                </AccordionTrigger>
                              </div>
                              {/* Coupon title */}
                              <p className="mb-2 max-w-36 translate-y-4 break-words text-base font-semibold tracking-wide first-letter:uppercase sm:max-w-full">
                                {coupon.title}
                              </p>
                            </div>

                            {/* Coupon code users and bookmark */}
                            <div className="flex flex-col items-end gap-4">
                              <Heart
                                className={`absolute right-2 top-2 size-5 cursor-pointer text-app-main transition-all duration-300 ease-linear sm:-top-1 ${
                                  bookmarkedCoupons.includes(coupon.couponId)
                                    ? "fill-app-main text-app-main"
                                    : "opacity-100 group-hover/accordion:opacity-100 lg:opacity-0 lg:hover:fill-app-main"
                                }`}
                                onClick={() => handleBookmark(coupon.couponId)}
                              />
                              <p className="absolute bottom-2 right-2 text-sm tabular-nums text-muted-foreground sm:hidden">
                                {couponUserCounts[coupon.couponId] || 0} Used
                              </p>
                              <div className=" hidden w-full items-center justify-between gap-x-6 sm:flex sm:text-base md:gap-x-16 lg:text-lg">
                                <p className="flex w-fit items-center gap-x-1 sm:text-lg">
                                  <PiSmileySadBold className="inline-flex size-5 text-app-main" />
                                  Expired
                                </p>
                                <p className="flex items-center gap-x-1 tabular-nums text-muted-foreground sm:text-lg md:text-xl">
                                  <span>
                                    <User className="size-5" />
                                  </span>
                                  <span>
                                    {couponUserCounts[coupon.couponId] || 0}{" "}
                                    Used
                                  </span>
                                </p>
                              </div>
                              {coupon.type === "Deal" && (
                                <>
                                  <Button
                                    onClick={() => {
                                      handleCouponUse(
                                        coupon.couponId,
                                        "Deal",
                                        coupon,
                                      );
                                    }}
                                    className="hidden min-h-12 w-56 cursor-pointer rounded-xl bg-neutral-500 text-base font-semibold hover:bg-neutral-500 sm:block md:w-64"
                                  >
                                    Get Deal
                                  </Button>
                                  <ChevronRight
                                    className="size-6 w-full cursor-pointer text-neutral-500  sm:hidden"
                                    onClick={() => {
                                      handleCouponUse(
                                        coupon.couponId,
                                        "Deal",
                                        coupon,
                                      );
                                    }}
                                  />
                                </>
                              )}
                              {coupon.type === "Coupon" && (
                                <>
                                  <div
                                    onClick={() => {
                                      handleCouponUse(
                                        coupon.couponId,
                                        "Coupon",
                                        coupon,
                                      );
                                    }}
                                    className="group relative hidden !min-h-12 w-56 cursor-pointer overflow-hidden rounded-md bg-app-bg-main p-2 dark:bg-app-dark sm:grid md:w-64"
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
                                      <div className="polygon-clip h-full w-full rounded-xl bg-neutral-500 transition-all duration-200 ease-linear hover:bg-neutral-500 group-hover:w-11/12">
                                        <p className="absolute inset-0 grid place-items-center font-semibold text-slate-200">
                                          GET CODE
                                        </p>
                                      </div>
                                    </div>
                                    {/* Border overlay */}
                                    <div className="pointer-events-none absolute inset-0 rounded-xl border-2 border-dashed border-neutral-500" />
                                  </div>
                                  <ChevronRight
                                    className="size-6 w-full cursor-pointer text-neutral-500  sm:hidden"
                                    onClick={() => {
                                      handleCouponUse(
                                        coupon.couponId,
                                        "Coupon",
                                        coupon,
                                      );
                                    }}
                                  />
                                </>
                              )}
                              <div className="hidden w-full translate-x-1 justify-between place-self-start text-sm sm:flex md:text-base lg:text-lg">
                                <p className="whitespace-nowrap text-sm text-muted-foreground md:text-base">
                                  <span className="tabular-nums">
                                    {successRatio(
                                      couponReactions[coupon.couponId]
                                        ?.like_count || 0,
                                      couponReactions[coupon.couponId]
                                        ?.dislike_count || 0,
                                    )}
                                  </span>
                                  <span>% Success</span>
                                </p>
                                <div className="hidden -translate-x-1 items-center gap-x-4 place-self-center sm:flex">
                                  <button className="flex items-center gap-x-2">
                                    <ThumbsUp
                                      className={
                                        userReactions[coupon.couponId] ===
                                        "LIKE"
                                          ? "size-4 text-neutral-500"
                                          : "size-4 text-neutral-500"
                                      }
                                    />
                                    <span className="text-muted-foreground">
                                      {couponReactions[coupon.couponId]
                                        ?.like_count || 0}
                                    </span>
                                  </button>
                                  <button className="flex items-center gap-x-2">
                                    <ThumbsDown
                                      className={
                                        userReactions[coupon.couponId] ===
                                        "DISLIKE"
                                          ? "size-4 text-neutral-500"
                                          : "size-4 text-neutral-500"
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
                          </div>
                          <AccordionContent className="px-2 pb-5 pt-2 sm:px-6 sm:pb-6 sm:pt-4">
                            <Seperator />
                            <div className="flex flex-col items-start sm:flex-row sm:justify-between ">
                              <p className="mb-2">{coupon.description}</p>
                              <p className="text-muted-foreground">
                                Expired on:{" "}
                                {format(
                                  new Date(coupon.due_date),
                                  "dd-MMM-yyy",
                                )}
                              </p>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </>
                )}

                {/* About for mobile */}
                <div
                  className={`${commonStyles} ${data?.description ? "lg:hidden" : "hidden"} border-2 border-neutral-200 dark:border-neutral-700`}
                >
                  <h2 className="mb-2 text-xl font-bold">About</h2>
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
            </div>
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
  const commonStyles =
    "w-full rounded-lg bg-popover p-4 shadow-lg border-2 border-neutral-200 dark:border-neutral-700 lg:border-0 rounded-xl";

  return (
    <div className={`${commonStyles} ${isHidden ? "lg:hidden" : ""}`}>
      <h2 className="text-lg font-bold lg:text-xl">{title}</h2>
      <div className={`mt-1 flex flex-wrap gap-2`}>
        {items.map((item) => {
          return (
            <Link
              href={
                isStore ? `/store/${item.slug}` : `/categories/${item.slug}`
              }
              key={item.id}
            >
              <Badge className="bg-neutral-400/40 font-medium text-black hover:bg-neutral-400/40 dark:text-slate-200">
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
    <DialogContent className="w-11/12 !bg-app-bg-main sm:w-full">
      <DialogHeader>
        <DialogTitle>Coupon Details</DialogTitle>
      </DialogHeader>
      <div className="flex flex-col items-center gap-4">
        <div className="grid size-44 place-items-center rounded-full border border-black bg-popover p-1 dark:border-neutral-700">
          <Image
            src={
              constructS3Url(logoUrl) ?? "https://via.placeholder.com/100x100"
            }
            width={400}
            height={400}
            alt="Store logo"
            className="aspect-square size-full rounded-full"
          />
        </div>
        <p className="text-lg font-medium">{title}</p>
        <p className="text font-medium text-muted-foreground">
          Ends on {expiry}
        </p>
        <div className="flex w-full min-w-24 items-center justify-between gap-x-2 rounded-full border border-app-main px-5 py-3 sm:w-1/2">
          <span className="">{couponCode}</span>
          <Button
            size="sm"
            className="rounded-full bg-app-main p-3 py-5"
            onClick={copyToClipboard}
          >
            {copied ? "Copied!" : "Copy"}
          </Button>
        </div>
        <p className="flex items-center gap-x-1 text-center text-sm text-emerald-900">
          Copy and Paste Coupon code at{" "}
          <Link href={ref_link} target="_blank">
            <span className="flex items-center gap-x-1 text-app-main underline">
              Product <FaExternalLinkAlt className="size-3" />
            </span>
          </Link>
        </p>
        <div className="flex w-full min-w-24 items-center justify-between gap-x-2 rounded-full border border-app-main px-5 py-3 sm:w-2/3">
          <p className="font-medium">Did this work for you? </p>
          <div className="flex gap-x-2">
            <div className="rounded-lg border border-app-main p-2">
              <button
                onClick={() => handleReaction(couponId, "LIKE")}
                className="flex items-center gap-2"
              >
                <ThumbsUp
                  className={
                    userReaction === "LIKE"
                      ? "size-5 fill-emerald-900 text-emerald-900"
                      : "size-5 text-emerald-900 transition-colors duration-200 ease-linear hover:fill-emerald-900"
                  }
                />
              </button>
            </div>
            <div className="rounded-lg border border-app-main p-2">
              <button
                onClick={() => handleReaction(couponId, "DISLIKE")}
                className="flex items-center gap-2"
              >
                <ThumbsDown
                  className={
                    userReaction === "DISLIKE"
                      ? "size-5 fill-app-main text-app-main"
                      : "size-5 text-app-main transition-colors duration-300 ease-linear hover:fill-app-main"
                  }
                />
              </button>
            </div>
          </div>
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
        <div className="grid size-44 place-items-center rounded-full border border-black bg-popover p-1 dark:border-neutral-700">
          <Image
            src={
              constructS3Url(logoUrl) ?? "https://via.placeholder.com/100x100"
            }
            width={400}
            height={400}
            alt="Store logo"
            className="aspect-square size-full rounded-full"
          />
        </div>
        <p className="text-lg font-medium">{title}</p>
        <p className="font-medium text-muted-foreground">Ends on {expiry}</p>
        <Button className="min-w-40 bg-app-main py-6" asChild>
          <Link href={ref_link} target="_blank">
            Go to Deal
          </Link>
        </Button>
        <div className="flex w-full min-w-24 items-center justify-between gap-x-2 rounded-full border border-app-main px-5 py-3 sm:w-2/3">
          <p className="font-medium">Did this work for you? </p>
          <div className="flex gap-x-2">
            <div className="rounded-lg border border-app-main p-2">
              <button
                onClick={() => handleReaction(couponId, "LIKE")}
                className="flex items-center gap-2"
              >
                <ThumbsUp
                  className={
                    userReaction === "LIKE"
                      ? "size-5 fill-emerald-900 text-emerald-900"
                      : "size-5 text-emerald-900 transition-colors duration-200 ease-linear hover:fill-emerald-900"
                  }
                />
              </button>
            </div>
            <div className="rounded-lg border border-app-main p-2">
              <button
                onClick={() => handleReaction(couponId, "DISLIKE")}
                className="flex items-center gap-2"
              >
                <ThumbsDown
                  className={
                    userReaction === "DISLIKE"
                      ? "size-5 fill-app-main text-app-main"
                      : "size-5 text-app-main transition-colors duration-300 ease-linear hover:fill-app-main"
                  }
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </DialogContent>
  );
};
