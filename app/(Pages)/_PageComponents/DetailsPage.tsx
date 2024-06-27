"use client";
import Spinner from "@/app/(Pages)/_PageComponents/Spinner";
import useGetDetails from "@/hooks/useGetDetails";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { redirect, useParams } from "next/navigation";
import Seperator from "./Seperator";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionTrigger,
  AccordionContent,
  AccordionItem,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import { Heart, Info, Lightbulb, User, Verified } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { StarRating } from "../(Store)/_StoreComponent/StarRating";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import axios from "@/app/api/axios/axios";
import { FaQuestionCircle } from "react-icons/fa";

interface DetailsPageProps {
  fetchFrom: "store" | "category";
}

const DetailsPage: React.FC<DetailsPageProps> = ({ fetchFrom }) => {
  const { storename, categoryname } = useParams();
  const { data: session } = useSession();
  const name = fetchFrom === "store" ? storename : categoryname;
  // to store popular store data
  const [popularData, setPopularData] = useState<Record<string, any>[]>([]);
  // to store top categories data
  const [topCategories, setTopCategories] = useState<Record<string, any>[]>([]);
  // to show current selected tab
  const [selectedTab, setSelectedTab] = useState<"all" | "coupon" | "deal">(
    "all",
  );
  // to get state of bookmarked coupons
  const [bookmarkedCoupons, setBookmarkedCoupons] = useState<number[]>([]);

  // to store coupon user count
  const [couponUserCounts, setCouponUserCounts] = useState<
    Record<number, number>
  >({});

  const {
    data: detailsData,
    isLoading,
    error,
  } = useGetDetails({
    fetchFrom,
    name: name as string,
  });

  const commonStyles = "w-full rounded-lg bg-popover p-4 shadow-md";

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
      // Redirect to login if user is not logged in
      redirect("/signin");
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

  // NOTE: this is for handling tab change
  const handleTabChange = (tab: "all" | "coupon" | "deal") => {
    setSelectedTab(tab);
  };

  // NOTE: this is for filtering coupons based on selected tab
  const filteredCoupons =
    detailsData?.coupons?.filter((coupon: Record<string, any>) => {
      if (selectedTab === "all") return true;
      return coupon.type.toLowerCase() === selectedTab;
    }) || [];

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

  // NOTE: this is for handling coupon use
  const handleCouponUse = async (couponId: number, type: "Coupon" | "Deal") => {
    // Optimistic update
    setCouponUserCounts((prev) => ({
      ...prev,
      [couponId]: (prev[couponId] || 0) + 1,
    }));

    try {
      await axios.post("/updatecouponusercount", { couponId });
      if (type === "Coupon") {
        // Reveal code logic here
      } else if (type === "Deal") {
        // Get deal logic here
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

  return (
    <>
      {/* topBar for mobile */}
      <div className="flex w-full items-start gap-x-2 rounded-lg bg-popover p-4 px-4 sm:items-center sm:gap-x-4 sm:px-8 lg:hidden lg:px-16">
        <Image
          src={detailsData.logo_url ?? "https://via.placeholder.com/600x400"}
          alt={detailsData.name + " Logo"}
          width={400}
          height={400}
          className="size-32 rounded-full object-cover"
        />
        <div className="flex flex-col gap-y-4">
          <h1 className="text-center text-xl font-bold sm:text-2xl">
            {detailsData.name}
          </h1>
          {detailsData.title && (
            <p className="hidden lg:block">{detailsData.title}</p>
          )}
          <p className="hidden lg:block">{detailsData.description}</p>
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
        <section className="relative mb-6 flex w-full flex-col items-start gap-6 px-8 pt-10 lg:flex-row lg:px-16">
          {/* Edit link only visbible to admins */}
          {session?.user.role === "admin" && (
            <Link
              href={editLink}
              className="absolute right-4 top-0 place-self-end  underline transition-colors duration-300 ease-linear hover:text-app-main lg:right-20"
            >
              {editLinkText}
            </Link>
          )}
          {/* sidebar for larger screens */}
          <aside className="hidden flex-col items-center gap-y-8 lg:flex lg:w-1/4">
            <Image
              src={
                detailsData.logo_url
                  ? detailsData.logo_url
                  : "https://via.placeholder.com/600x400"
              }
              alt={`${isStore ? "Store" : "Category"} Logo`}
              width={400}
              height={400}
              className="size-40 rounded-full"
            />
            {isStore && (
              <>
                <Button
                  asChild
                  className="border border-primary bg-popover font-medium text-primary hover:bg-primary hover:text-white"
                >
                  <Link href={`${detailsData.ref_link}`} target="_blank">
                    Visit the {detailsData.name} Store
                  </Link>
                </Button>
                <StarRating storeId={detailsData.storeId} />
              </>
            )}

            <div
              className={`${commonStyles} ${detailsData.description ? "" : "hidden"}`}
            >
              <h2 className="text-xl font-bold">About</h2>
              <p>{detailsData.description}</p>
            </div>

            <div className={`${commonStyles}`}>
              <h2 className="mb-2 text-base font-bold">
                Today&apos;s Top {isStore ? `${detailsData.name}` : ""} Coupon
                Codes
              </h2>
              {detailsData?.coupons && detailsData?.coupons[0] && (
                <p className="my-2">&bull; {detailsData.coupons[0].title}</p>
              )}
              {detailsData?.coupons && detailsData?.coupons[1] && (
                <p className="my-2">&bull; {detailsData.coupons[1].title}</p>
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
                    {detailsData.coupons?.length || 0}
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <p>Best Offer:</p>
                  <p>{detailsData.best_offer} Off</p>
                </div>
                <div className="flex items-center justify-between">
                  <p>Average Discount:</p>
                  <p>{detailsData.average_discount}</p>
                </div>
              </div>
            </div>
            {isStore && (
              <div className={`${commonStyles}`}>
                <h2 className="mb-2 text-base font-bold">Quick Links</h2>
                <div className="flex flex-col gap-y-4 rounded-lg border-2 p-4">
                  <Link href={"#faqs"}>
                    <div className="flex cursor-pointer items-center justify-between">
                      <p>FAQs</p>
                      <FaQuestionCircle className="size-4" />
                    </div>
                  </Link>

                  <Link href={"#hints"}>
                    <div className="flex items-center justify-between">
                      <p>How To Apply</p>
                      <Lightbulb className="size-4" />
                    </div>
                  </Link>
                  <Link href={"#moreabout"}>
                    <div className={`flex items-center justify-between`}>
                      <p className="inline-block text-center font-medium">
                        More About
                      </p>
                      <p className="ml-auto inline-block text-center">
                        <Info className="size-4" />
                      </p>
                    </div>
                  </Link>
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
          </aside>
          <Separator className="hidden h-auto min-h-[90vh] w-[2px] self-stretch text-muted lg:block" />
          {/* main coupons display */}
          <main className="flex w-full flex-col items-stretch gap-y-6">
            <div className="hidden -translate-y-2 flex-col lg:flex">
              <h1 className="text-4xl font-bold">{detailsData.name}</h1>
              <p className=" font-semibold">{detailsData.title}</p>
            </div>
            {/* Tabs */}
            <div className="flex justify-center place-self-start sm:gap-x-4">
              <Button
                onClick={() => handleTabChange("all")}
                className={
                  selectedTab === "all"
                    ? "bg-app-main text-white"
                    : "bg-transparent text-app-main shadow-none hover:bg-app-main hover:text-white"
                }
              >
                All ({detailsData.coupons?.length || 0})
              </Button>
              <Button
                onClick={() => handleTabChange("coupon")}
                className={
                  selectedTab === "coupon"
                    ? "bg-app-main text-white"
                    : "bg-transparent text-app-main shadow-none hover:bg-app-main hover:text-white"
                }
              >
                Coupons ({couponsLength || 0})
              </Button>
              <Button
                onClick={() => handleTabChange("deal")}
                className={
                  selectedTab === "deal"
                    ? "bg-app-main text-white"
                    : "bg-transparent text-app-main shadow-none hover:bg-app-main hover:text-white"
                }
              >
                Deals ({dealsLength || 0})
              </Button>
            </div>
            <Accordion
              type="single"
              collapsible
              className="flex w-full flex-col gap-y-6 lg:w-11/12"
            >
              {filteredCoupons.map((coupon: Record<string, any>) => {
                // Coupon
                return (
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
                            alt={detailsData.name + " Logo"}
                          />
                          <Badge
                            className={cn(
                              coupon.type === "Deal"
                                ? "bg-amber-400"
                                : "bg-blue-400/50",
                              "m-0 text-black dark:text-slate-200",
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
                          className={`absolute right-4 top-4 size-4 cursor-pointer transition-all duration-300 ease-linear ${
                            bookmarkedCoupons.includes(coupon.couponId)
                              ? "fill-app-main text-app-main"
                              : "opacity-0 hover:fill-black group-hover/accordion:opacity-100 dark:hover:fill-slate-200"
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
                        {coupon.type === "Deal" && (
                          <Button
                            size={"lg"}
                            className="w-full border-2 border-dashed text-base font-semibold"
                            onClick={() => {
                              handleCouponUse(coupon.couponId, "Deal");
                            }}
                          >
                            Get Deal
                          </Button>
                        )}
                        {coupon.type === "Coupon" && (
                          <div
                            className="group relative grid min-h-16 w-fit min-w-28 cursor-pointer rounded-md border-2 border-dashed border-app-main bg-app-bg-main p-2 dark:bg-app-dark sm:min-h-fit  sm:min-w-40"
                            onClick={() => {
                              handleCouponUse(coupon.couponId, "Coupon");
                            }}
                          >
                            <p className="translate-x-2 place-self-center text-base font-semibold uppercase tracking-widest">
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
                );
              })}
            </Accordion>
            {isStore && detailsData.faq && (
              <section id="faqs" className={`${commonStyles}`}>
                <h2 className="mb-4 text-xl font-bold sm:text-2xl">FAQS</h2>
                <Accordion
                  type="single"
                  collapsible
                  className="flex w-full flex-col gap-y-6"
                >
                  {JSON.parse(detailsData?.faq).map(
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
                          <AccordionTrigger className="w-full">
                            {faq.question}
                          </AccordionTrigger>
                          <AccordionContent className="p-4">
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
              <section id="hints" className={`${commonStyles}`}>
                <div className={`w-full`}>
                  <h2 className="mb-4 text-xl font-bold sm:text-2xl">
                    How to Apply
                  </h2>
                  <p>{detailsData.hint}</p>
                </div>
              </section>
            )}
            {isStore && (
              <section id="moreabout" className={`${commonStyles}`}>
                <div className={`w-full`}>
                  <h2 className="mb-4 text-xl font-bold sm:text-2xl">
                    More About
                  </h2>
                  <div
                    dangerouslySetInnerHTML={{ __html: detailsData.moreAbout }}
                  />
                </div>
              </section>
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
}

const PopularItems: React.FC<PopularItemProps> = ({
  title,
  items,
  isStore = false,
}) => {
  const commonStyles = "w-full rounded-lg bg-popover p-4 shadow-md";

  return (
    <div className={`${commonStyles}`}>
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
