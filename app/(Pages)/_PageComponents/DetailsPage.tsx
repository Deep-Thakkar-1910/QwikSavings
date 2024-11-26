"use client";
import Spinner from "@/app/(Pages)/_PageComponents/Spinner";
import axios from "@/app/api/axios/axios";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/use-toast";
import { useActiveFestival } from "@/hooks/useFestivalActive";
import useGetDetails from "@/hooks/useGetDetails";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import {
  ChevronRight,
  Heart,
  Info,
  Lightbulb,
  Tag,
  ThumbsDown,
  ThumbsUp,
  User,
  Verified,
} from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import {
  notFound,
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { FaExternalLinkAlt, FaQuestionCircle } from "react-icons/fa";
import { PiSmileySadBold } from "react-icons/pi";
import { Link as ScrollLink } from "react-scroll";
import { StarRating } from "../(Store)/_StoreComponent/StarRating";
import Seperator from "./Seperator";

interface DetailsPageProps {
  fetchFrom: "store" | "category";
}

type ReactionType = "LIKE" | "DISLIKE";

interface CouponReaction {
  like_count: number;
  dislike_count: number;
}

const DetailsPage: React.FC<DetailsPageProps> = ({ fetchFrom }) => {
  const router = useRouter();
  const { storename, categoryname } = useParams();
  const { data: session } = useSession();
  const currentUrl = usePathname();
  const name = fetchFrom === "store" ? storename : categoryname;
  // to store popular store data
  const [popularData, setPopularData] = useState<Record<string, any>[]>([]);
  // to store top categories data
  const [topCategories, setTopCategories] = useState<Record<string, any>[]>([]);
  // to show current selected tab
  const [selectedTab, setSelectedTab] = useState<"all" | "coupon" | "deal">(
    "all",
  );

  // state for active festival
  const isActiveFestival = useActiveFestival((state) => state.isActive);

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
  const {
    data: detailsData,
    isLoading,
    error,
    initialCoupon,
  } = useGetDetails({
    fetchFrom,
    name: name as string,
  });

  // success ratio like/dislike count ratio
  const successRatio = (like: number, dislike: number) => {
    like = like;
    dislike = dislike;
    return (
      like === 0 || dislike === 0 ? 0 : (like / (like + dislike)) * 100
    ).toFixed(2); // success ratio in percentage
  };

  if (!detailsData) {
    notFound();
  }

  const commonStyles = "w-full rounded-xl bg-popover p-4 py-6 shadow-lg";

  // NOTE: this is for getting the lengths of  deals and coupons
  const dealsLength =
    detailsData?.coupons?.filter(
      (coupon: Record<string, any>) => coupon.type === "Deal",
    ).length || 0;
  const couponsLength =
    detailsData?.coupons?.filter(
      (coupon: Record<string, any>) => coupon.type === "Coupon",
    ).length || 0;

  const isStore = fetchFrom === "store";
  const editLink = isStore
    ? `/admin/editstore/${name}`
    : `/admin/editcategory/${name}`;
  const editLinkText = isStore ? "Edit Store" : "Edit Category";

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
    const fetchTopCategoriesData = async () => {
      try {
        const response = await axios.get("/gettodaystopcategories");
        setTopCategories(response.data.topCategories);
      } catch (error) {
        console.error("Error fetching popular data:", error);
      }
    };
    fetchPopularStoreData();
    if (!isStore) {
      fetchTopCategoriesData();
    }
  }, [isStore]);

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
      await axios.post("/createbookmarks", { couponId });
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

  // NOTE: this is for handling tab change
  const handleTabChange = (tab: "all" | "coupon" | "deal") => {
    setSelectedTab(tab);
  };

  const [activeCoupons, expiredCoupons] = useMemo(() => {
    const now = new Date();
    return (detailsData?.coupons || []).reduce(
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
  }, [detailsData?.coupons]);

  const filteredActiveCoupons = activeCoupons.filter(
    (coupon: Record<string, any>) => {
      if (selectedTab === "all") return true;
      return coupon.type.toLowerCase() === selectedTab;
    },
  );

  const filteredExpiredCoupons = expiredCoupons.filter(
    (coupon: Record<string, any>) => {
      if (selectedTab === "all") return true;
      return coupon.type.toLowerCase() === selectedTab;
    },
  );

  // NOTE: this is for handling coupon's user count
  useEffect(() => {
    if (detailsData?.coupons) {
      const initialCounts = detailsData.coupons.reduce(
        (acc: Record<number, number>, coupon: Record<string, any>) => {
          acc[coupon.couponId] = coupon.user_count;
          return acc;
        },
        {},
      );
      setCouponUserCounts(initialCounts);
    }
  }, [detailsData]);

  // NOTE: This is for handling coupon use
  useEffect(() => {
    const encodedCouponData = searchParams.get("coupon");

    if (encodedCouponData) {
      let couponData: Record<string, any>;
      try {
        // First, try to parse it as JSON directly
        couponData = JSON.parse(encodedCouponData);
      } catch (e) {
        // If that fails, it's likely URI encoded, so decode and then parse
        couponData = JSON.parse(decodeURIComponent(encodedCouponData));
      }

      setDialogInfo({
        title: couponData.title || "",
        logoUrl: couponData.logo || detailsData?.logo_url || "",
        couponCode: couponData.coupon_code || "",
        couponId: couponData.couponId,
        ref_link: couponData.ref_link || "",
      });

      // Remove the coupon parameter from the URL
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.delete("coupon");
      window.history.replaceState({}, "", newUrl);

      // Open the appropriate dialog
      if (couponData.type === "Deal") {
        setIsDealDialogOpen(true);
      } else {
        // If type is "Coupon" or not specified, open the coupon dialog
        setIsCouponDialogOpen(true);
      }

      // If it's a coupon from home, also open the new window
      if (couponData.isCouponFromHome) {
        setTimeout(() => {
          window.open(couponData.ref_link, "_blank");
        }, 2000);
      }
    }
  }, [searchParams, detailsData?.logo_url]);

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
        logoUrl: detailsData.logo_url,
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
    if (detailsData?.coupons) {
      const initialReactions = detailsData.coupons.reduce(
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
  }, [detailsData]);
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
    <>
      {/* topBar for mobile */}
      <div
        className={`flex w-full ${isStore ? "items-start" : "items-center"} ${isActiveFestival ? "translate-y-8 transition-transform duration-200 ease-linear" : "translate-y-0 transition-transform duration-200 ease-linear"} gap-x-2 rounded-lg bg-popover p-4 px-4 sm:items-center sm:gap-x-4 sm:px-8 lg:hidden lg:px-12`}
      >
        <div className="size-32 rounded-full border border-black bg-popover p-1 transition-shadow duration-200 ease-linear hover:shadow-lg dark:border-slate-200">
          <Image
            src={detailsData?.logo_url ?? "https://via.placeholder.com/600x400"}
            alt={detailsData?.name + " Logo"}
            width={400}
            height={400}
            className="aspect-square w-full rounded-full object-cover"
          />
        </div>
        <div className="flex flex-col items-start gap-y-4">
          <h1 className="ml-6 text-center text-xl font-bold sm:text-2xl">
            {detailsData.name}
          </h1>
          {detailsData.title && (
            <p className="hidden lg:block">{detailsData.title}</p>
          )}
          <p className="hidden lg:block">{detailsData.description}</p>

          <div className="pl-4">
            {isStore && <StarRating storeId={detailsData.storeId} />}
          </div>
        </div>
      </div>
      {/* main components */}
      {isLoading ? (
        <div className="flex size-full h-[70vh] items-center justify-center">
          <Spinner />
        </div>
      ) : error ? (
        <div className="flex size-full h-[70vh] items-center justify-center">
          <p>{error}</p>
        </div>
      ) : (
        <section
          className={`relative mb-6 flex w-full flex-col items-start px-8 pt-10 lg:flex-row lg:gap-x-10 lg:px-12 xl:ml-5 xl:gap-x-14 2xl:ml-7 ${isActiveFestival ? "!mb-14" : "mb-0"}`}
        >
          {/* Edit link only visbible to admins */}
          {session?.user.role === "admin" && (
            <div className="absolute right-4 top-0 flex flex-col gap-y-2 place-self-end lg:right-20 2xl:right-28">
              <Link
                href={editLink}
                className="underline transition-colors duration-300 ease-linear hover:text-app-main"
              >
                {editLinkText}
              </Link>
            </div>
          )}
          {/* sidebar for larger screens */}
          <aside className="hidden flex-col items-center gap-y-8 lg:flex lg:w-1/4 lg:shrink-0 2xl:shrink">
            <div className="size-56 rounded-full border border-black bg-popover p-1 transition-shadow duration-200 ease-linear hover:shadow-lg dark:border-slate-200">
              <Image
                src={
                  detailsData.logo_url
                    ? detailsData.logo_url
                    : "https://via.placeholder.com/600x400"
                }
                alt={`${isStore ? "Store" : "Category"} Logo`}
                width={400}
                height={400}
                className="aspect-square w-full rounded-full"
              />
            </div>
            {isStore && (
              <>
                <Button
                  asChild
                  className="text-lg font-medium text-app-main"
                  variant={"ghost"}
                >
                  <Link href={`${detailsData.ref_link}`} target="_blank">
                    Visit {detailsData.name}
                  </Link>
                </Button>
                <StarRating storeId={detailsData.storeId} />
              </>
            )}

            <div
              className={`${commonStyles} ${detailsData.description ? "" : "hidden"}`}
            >
              <h2 className="mb-2 text-xl font-bold">
                About {isStore && detailsData.name}
              </h2>
              <p>{detailsData.description}</p>
            </div>

            <div className={`${commonStyles}`}>
              <h2 className="mb-2 text-xl font-bold">
                Today&apos;s Top {isStore ? `${detailsData.name}` : ""} Codes
              </h2>
              {detailsData?.coupons && detailsData?.coupons[0] && (
                <p className="my-2 flex gap-x-2 pl-2 font-semibold">
                  <span>&bull;</span>
                  <span>{detailsData.coupons[0].title}</span>
                </p>
              )}
              {detailsData?.coupons && detailsData?.coupons[1] && (
                <p className="my-2 flex gap-x-2 pl-2 font-semibold">
                  <span>&bull;</span>
                  <span>{detailsData.coupons[1].title}</span>
                </p>
              )}
              <div className="flex flex-col gap-y-4 rounded-lg py-4">
                <div className={`flex items-center justify-between`}>
                  <p className="inline-block text-center">Total Offers:</p>
                  <p className="ml-auto inline-block text-center">
                    {detailsData.coupons?.length || 0}
                  </p>
                </div>
                <div className="flex items-center justify-between ">
                  <p>Total Coupons:</p>
                  <p>{couponsLength}</p>
                </div>

                <div className="flex items-center justify-between">
                  <p>Total Deals:</p>
                  <p>{dealsLength}</p>
                </div>
                {isStore && (
                  <>
                    <div className="flex items-center justify-between">
                      <p>Best Offer:</p>
                      <p>{detailsData.best_offer}</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <p>Average Discount:</p>
                      <p>{detailsData.average_discount}</p>
                    </div>
                  </>
                )}
              </div>
            </div>
            {isStore && (
              <div
                className={`${commonStyles} ${isStore &&
                  detailsData?.faq &&
                  !detailsData?.hint &&
                  !detailsData?.moreAbout &&
                  "hidden"
                  }`}
              >
                <h2 className="mb-1 text-xl font-bold">Quick Links</h2>
                <div className="flex flex-col gap-y-2 rounded-lg p-1">
                  <ScrollLink
                    to="faqs"
                    smooth
                    offset={-140}
                    className={`${isStore &&
                      detailsData.faq
                      ? ""
                      : "hidden"
                      } rounded-lg border p-2`}
                  >
                    <div className="flex cursor-pointer items-center justify-between font-semibold">
                      <p>FAQs</p>
                      <FaQuestionCircle className="size-4" />
                    </div>
                  </ScrollLink>

                  <ScrollLink
                    to="hints"
                    smooth
                    offset={-150}
                    className={`${!detailsData.hint && "hidden"} rounded-lg border p-2`}
                  >
                    <div className="flex cursor-pointer items-center justify-between font-semibold">
                      <p>How To Apply</p>
                      <Lightbulb className="size-4" />
                    </div>
                  </ScrollLink>
                  <ScrollLink
                    to="moreabout"
                    smooth
                    offset={-150}
                    className={`${!detailsData.moreAbout && "hidden"} rounded-lg border p-2`}
                  >
                    <div
                      className={`flex cursor-pointer items-center justify-between font-semibold`}
                    >
                      <p className="inline-block text-center font-medium">
                        More About
                      </p>
                      <p className="ml-auto inline-block text-center">
                        <Info className="size-4" />
                      </p>
                    </div>
                  </ScrollLink>
                </div>
              </div>
            )}

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
            {/* Store Related Stores */}
            {detailsData.similarStores?.length > 0 && (
              <PopularItems
                title="Similar Stores"
                items={detailsData.similarStores.map(
                  (store: { storeId: number; name: string }) => ({
                    id: store.storeId,
                    name: store.name,
                  }),
                )}
                isStore
              />
            )}
            {/* Top Categories */}
            {!isStore && topCategories?.length > 0 && (
              <PopularItems
                title="Today's Top Categories"
                items={topCategories.map((category, index) => ({
                  id: index,
                  name: category.name,
                }))}
              />
            )}
            {/* Categories Browse by store */}
            {!isStore && (
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
            )}
          </aside>
          <Separator className="hidden h-auto min-h-[90vh] w-[2px] self-stretch text-muted lg:block" />
          {/* main coupons display */}
          <main className={`flex w-full flex-col items-stretch gap-y-4`}>
            <div className="hidden -translate-y-2 flex-col lg:flex">
              <h1 className="mb-2 text-3xl font-bold xl:text-4xl">
                {isStore ? detailsData?.title : `${detailsData?.name} Coupons`}
              </h1>
              {isStore && initialCoupon && (
                <p className=" text-lg font-semibold">
                  Best {detailsData._count.coupons} Offers Last Validated On{" "}
                  {format(initialCoupon, "MMMM dd, yyyy")}
                </p>
              )}
            </div>
            {/* Tabs */}
            <div className="flex flex-col justify-start gap-y-2 lg:w-[97%] lg:flex-row lg:items-center lg:justify-between">
              <div className="flex justify-start sm:gap-x-4">
                <Button
                  onClick={() => handleTabChange("all")}
                  className={
                    selectedTab === "all"
                      ? " border-b-2 border-b-app-main bg-popover text-app-main hover:bg-popover"
                      : "bg-transparent text-app-main shadow-none hover:bg-popover hover:text-app-main hover:shadow-sm"
                  }
                >
                  All ({detailsData.coupons?.length || 0})
                </Button>
                <Button
                  onClick={() => handleTabChange("coupon")}
                  className={
                    selectedTab === "coupon"
                      ? "border-b-2 border-b-app-main bg-popover text-app-main hover:bg-popover"
                      : "bg-transparent text-app-main shadow-none hover:bg-popover hover:text-app-main hover:shadow-sm"
                  }
                >
                  Coupons ({couponsLength || 0})
                </Button>
                <Button
                  onClick={() => handleTabChange("deal")}
                  className={
                    selectedTab === "deal"
                      ? "border-b-2 border-b-app-main bg-popover text-app-main hover:bg-popover"
                      : "bg-transparent text-app-main shadow-none hover:bg-popover hover:text-app-main hover:shadow-sm"
                  }
                >
                  Deals ({dealsLength || 0})
                </Button>
              </div>
              <Link
                href={"/submit-a-coupon"}
                className="hidden items-center gap-x-1 place-self-end text-app-main underline transition-colors duration-300 ease-linear lg:flex"
              >
                Submit a coupon <Tag className="size-4" />
              </Link>
            </div>
            <Accordion
              type="single"
              collapsible
              className="flex w-full flex-col gap-y-6 xl:w-[97%]"
            >
              {filteredActiveCoupons.map((coupon: Record<string, any>) => {
                // Coupon
                return (
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
                                coupon.store.logo_url ??
                                "https://via.placeholder.com/600x400"
                              }
                              width={400}
                              height={400}
                              className="aspect-square w-full rounded-full object-cover p-2"
                              alt={detailsData.name + " Logo"}
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
                          className={`absolute right-2 top-2 size-5 cursor-pointer text-app-main transition-all duration-300 ease-linear sm:-top-1 ${bookmarkedCoupons.includes(coupon.couponId)
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
                                className={`place-self-end text-base font-semibold uppercase tracking-widest ${!coupon.coupon_code && "min-h-5"
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
                                couponReactions[coupon.couponId]?.like_count ||
                                0,
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
                );
              })}
            </Accordion>
            {filteredExpiredCoupons.length > 0 && (
              <>
                <h2 className="mt-8 text-2xl font-bold">Expired Coupons</h2>
                <Accordion
                  type="single"
                  collapsible
                  className="flex w-full flex-col gap-y-6 xl:w-[97%]"
                >
                  {filteredExpiredCoupons.map((coupon: Record<string, any>) => (
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
                                  coupon.store.logo_url ??
                                  "https://via.placeholder.com/600x400"
                                }
                                width={400}
                                height={400}
                                className="aspect-square w-full rounded-full object-cover p-2 grayscale"
                                alt={detailsData.name + " Logo"}
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
                            className={`absolute right-2 top-2 size-5 cursor-pointer text-app-main transition-all duration-300 ease-linear sm:-top-1 ${bookmarkedCoupons.includes(coupon.couponId)
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
                                {couponUserCounts[coupon.couponId] || 0} Used
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
                                  className={`place-self-end text-base font-semibold uppercase tracking-widest ${!coupon.coupon_code && "min-h-5"
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
                                    userReactions[coupon.couponId] === "LIKE"
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
                                    userReactions[coupon.couponId] === "DISLIKE"
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
                            {format(new Date(coupon.due_date), "dd-MMM-yyy")}
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
              className={`${commonStyles} ${detailsData.description ? "lg:hidden" : "hidden"} border-2 border-neutral-200 dark:border-neutral-700`}
            >
              <h2 className="mb-2 text-xl font-bold">About</h2>
              <p>{detailsData.description}</p>
            </div>

            {isStore &&
              detailsData?.faq?.length > 0 && (
                <section
                  id="faqs"
                  className={`${commonStyles} border-2 border-neutral-200 dark:border-neutral-700 xl:w-[97%]`}
                >
                  <h2 className="mb-4 w-full text-xl font-bold sm:text-2xl lg:text-3xl">
                    FAQS
                  </h2>
                  <Accordion
                    type="single"
                    collapsible
                    className="flex flex-col gap-y-6"
                  >
                    {isStore &&
                      detailsData.faq?.length > 0 &&
                      detailsData?.faq?.map(
                        (
                          faq: { question: string; answer: string },
                          index: number,
                        ) => {
                          return (
                            <AccordionItem
                              value={`${index}`}
                              key={index}
                              className="w-full"
                            >
                              <AccordionTrigger className="w-full text-start font-semibold sm:text-lg lg:text-xl">
                                {faq.question}
                              </AccordionTrigger>
                              <AccordionContent className="p-4 lg:text-lg">
                                {faq.answer}
                              </AccordionContent>
                            </AccordionItem>
                          );
                        },
                      )}
                  </Accordion>
                </section>
              )}
            {isStore && (
              <section
                id="moreabout"
                className={`${commonStyles} ${!detailsData.moreAbout && "hidden"} border-2 border-neutral-200 dark:border-neutral-700 xl:w-[97%]`}
              >
                <div className={`w-full`}>
                  <h2 className="mb-4 text-xl font-bold sm:text-2xl lg:text-3xl">
                    More About
                  </h2>
                  <div
                    dangerouslySetInnerHTML={{ __html: detailsData.moreAbout }}
                    className="w-full"
                  />
                </div>
              </section>
            )}
            {isStore && (
              <section
                id="hints"
                className={`${commonStyles} ${!detailsData.hint && "hidden"} border-2 border-neutral-200 dark:border-neutral-700 xl:w-[97%]`}
              >
                <div className={`w-full`}>
                  <h2 className="mb-4 text-xl font-bold sm:text-2xl lg:text-3xl">
                    {detailsData.hintHeading
                      ? detailsData.hintHeading
                      : "How To Apply"}
                  </h2>
                  <div
                    dangerouslySetInnerHTML={{ __html: detailsData.hint }}
                    className="w-full"
                  />
                </div>
              </section>
            )}
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

            {/* Store Related Stores */}
            {detailsData.similarStores?.length > 0 && (
              <PopularItems
                title="Similar Stores"
                items={detailsData.similarStores.map(
                  (store: { storeId: number; name: string }) => ({
                    id: store.storeId,
                    name: store.name,
                  }),
                )}
                isStore
                isHidden
              />
            )}
            {/* Top Categories for mobile */}
            {!isStore && topCategories?.length > 0 && (
              <PopularItems
                title="Today's Top Categories"
                items={topCategories.map((category, index) => ({
                  id: index,
                  name: category.name,
                }))}
                isHidden
              />
            )}
          </main>
        </section>
      )}
    </>
  );
};

export default DetailsPage;

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
                isStore ? `/stores/${item.name}` : `/categories/${item.name}`
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
              src={logoUrl ?? "https://via.placeholder.com/100x100"}
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
              src={logoUrl ?? "https://via.placeholder.com/100x100"}
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
