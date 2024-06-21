"use client";
import Spinner from "@/app/(Pages)/_PageComponents/Spinner";
import useGetDetails from "@/hooks/useGetDetails";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import Seperator from "./Seperator";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionTrigger,
  AccordionContent,
  AccordionItem,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import { Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DetailsPageProps {
  fetchFrom: "store" | "category";
}

const DetailsPage: React.FC<DetailsPageProps> = ({ fetchFrom }) => {
  const { storename, categoryname } = useParams();
  const { data: session } = useSession();
  const name = fetchFrom === "store" ? storename : categoryname;

  const {
    data: detailsData,
    isLoading,
    error,
  } = useGetDetails({
    fetchFrom,
    name: name as string,
  });
  const commonStyles = "w-full rounded-lg bg-popover p-4 shadow-md";

  // getting the lengths of  deals and coupons
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
        <section className="relative flex w-full flex-col items-start gap-10 px-8 pt-10 lg:flex-row lg:px-16">
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
            <div
              className={`flex flex-col items-center justify-center gap-y-4 ${commonStyles}`}
            >
              <Image
                src={
                  detailsData.logo_url
                    ? detailsData.logo_url
                    : "https://via.placeholder.com/600x400"
                }
                alt={`${isStore ? "Store" : "Category"} Logo`}
                width={400}
                height={400}
                className="size-20 rounded-full"
              />
              <h1 className="text-xl font-bold">{detailsData.name}</h1>
            </div>

            <div
              className={`${commonStyles} ${detailsData.description ? "" : "hidden"}`}
            >
              <h2 className="text-xl font-bold">Description</h2>
              <p>{detailsData.description}</p>
            </div>

            <div className="w-full">
              <div
                className={`${commonStyles} rounded-bl-none rounded-br-none`}
              >
                <h2 className="mb-2 text-base font-bold">
                  Today&apos;s Hand Tested Discount Code
                </h2>
                <div className="mb-4 flex items-center justify-between">
                  <p>Coupon Codes:</p>
                  <p>{couponsLength}</p>
                </div>
                <Seperator />
                <div className="flex items-center justify-between">
                  <p>Deals:</p>
                  <p>{dealsLength}</p>
                </div>
              </div>
              <div
                className={`${commonStyles} flex items-center justify-between rounded-tl-none rounded-tr-none !bg-app-main/50 dark:bg-app-main/50`}
              >
                <p className="inline-block text-center font-medium">
                  Total Offers:
                </p>
                <p className="ml-auto inline-block text-center">
                  {detailsData.coupons?.length || 0}
                </p>
              </div>
            </div>
            {/* Store Related Stores */}
            {detailsData.similarStores?.length > 0 && (
              <RelatedItems
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

            {/* Category Related Stores */}
            {detailsData.stores?.length > 0 && (
              <RelatedItems
                title="Similar Stores"
                items={detailsData.stores.map(
                  (store: { storeId: number; name: string }) => ({
                    id: store.storeId,
                    name: store.name,
                  }),
                )}
                isStore
              />
            )}

            {/* Store Related Categories */}
            {detailsData.categories?.length > 0 && (
              <RelatedItems
                title="Similar Categories"
                items={detailsData.categories.map(
                  (category: { categoryId: number; name: string }) => ({
                    id: category.categoryId,
                    name: category.name,
                  }),
                )}
              />
            )}

            {/* Category Related Categories */}
            {detailsData.similarCategories?.length > 0 && (
              <RelatedItems
                title="Related Categories"
                items={detailsData.similarCategories.map(
                  (category: { categoryId: number; name: string }) => ({
                    id: category.categoryId,
                    name: category.name,
                  }),
                )}
              />
            )}
          </aside>

          {/* main coupons display */}
          <main className="flex w-full flex-col gap-y-6 lg:w-2/3">
            <Accordion
              type="single"
              collapsible
              className="flex w-full flex-col gap-y-20"
            >
              {detailsData.coupons?.map((coupon: Record<string, any>) => {
                // Coupon
                return (
                  <AccordionItem
                    key={coupon.couponId}
                    value={coupon.couponId}
                    className="group relative flex w-full flex-col items-center justify-between gap-x-6 gap-y-4 rounded-lg bg-popover p-6 shadow-md sm:flex-row"
                  >
                    <div className="flex flex-col items-center gap-6 sm:flex-row">
                      {/* Coupon image */}
                      <div>
                        <Image
                          src={
                            coupon.store.logo_url ??
                            "https://via.placeholder.com/600x400"
                          }
                          width={400}
                          height={400}
                          className="size-16 rounded-md border border-b-0 object-contain"
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
                        {coupon.isVerified && (
                          <Badge className="bg-app-main">Verified</Badge>
                        )}
                        <p className="mb-2 text-base font-semibold tracking-wide first-letter:uppercase">
                          {coupon.title}
                        </p>
                        <AccordionTrigger>
                          <button>Details</button>
                        </AccordionTrigger>
                        <AccordionContent className="absolute -bottom-20 left-0 z-20 w-full rounded-bl-lg rounded-br-lg bg-popover p-6 shadow-md lg:-bottom-16">
                          <Seperator />
                          {coupon.description}
                        </AccordionContent>
                      </div>
                    </div>

                    {/* Coupon code users and bookmark */}
                    <div className="flex flex-col items-end justify-between gap-4">
                      <Bookmark className="absolute right-4 top-4 size-4 opacity-0 transition-opacity duration-300 ease-linear group-hover:opacity-100 sm:right-4 sm:top-2" />
                      <Button
                        size={"lg"}
                        className="my-2 bg-app-main/90"
                        onClick={() => {
                          if (coupon.type === "Coupon") {
                            // Open a new tab to the right
                            const newWindow = window.open(
                              coupon.ref_link,
                              "_blank",
                              "noopener,noreferrer",
                            );
                            // Check if the new window was opened successfully
                            if (newWindow) {
                              newWindow.opener = null;
                              newWindow.blur();
                              window.focus();
                            }
                          } else if (coupon.type === "Deal") {
                            // Open a new tab to the right
                            const newWindow = window.open(
                              coupon.ref_link,
                              "_blank",
                              "noopener,noreferrer",
                            );
                          }
                        }}
                      >
                        {coupon.type === "Deal" ? "Get Deal" : "Reveal Code"}
                      </Button>
                      <p className="absolute right-2 top-5 tabular-nums text-muted-foreground">
                        {coupon.user_count} Used
                      </p>
                    </div>
                  </AccordionItem>
                );
              })}
            </Accordion>
          </main>
        </section>
      )}
    </>
  );
};

export default DetailsPage;

// Related Items Component

interface RelatedItemsProps {
  title: string;
  items: { id: number; name: string }[];
  isStore?: boolean;
}

const RelatedItems: React.FC<RelatedItemsProps> = ({
  title,
  items,
  isStore = false,
}) => {
  const commonStyles = "w-full rounded-lg bg-popover p-4 shadow-md";

  return (
    <div className={`${commonStyles}`}>
      <h2 className="text-base font-semibold">{title}</h2>
      <div className={`flex flex-wrap gap-4`}>
        {items.map((item) => (
          <Link
            href={isStore ? `/stores/${item.name}` : `/categories/${item.name}`}
            key={item.id}
          >
            <Badge className="bg-app-main/90 dark:bg-app-main/50">
              {item.name}
            </Badge>
          </Link>
        ))}
      </div>
    </div>
  );
};
