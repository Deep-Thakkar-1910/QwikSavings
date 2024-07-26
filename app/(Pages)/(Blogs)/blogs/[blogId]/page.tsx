"use client";

import Spinner from "@/app/(Pages)/_PageComponents/Spinner";
import axios from "@/app/api/axios/axios";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import useGetBlogDetails from "@/hooks/useGetBlogDetails";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const BlogDetailsPage = () => {
  const { blogId } = useParams();
  const { data: session } = useSession();
  const { data, error, isLoading } = useGetBlogDetails(blogId);
  // to store popular store data
  const [popularData, setPopularData] = useState<Record<string, any>[]>([]);
  // to store top categories data
  const [topCategories, setTopCategories] = useState<Record<string, any>[]>([]);

  const blocks = "abcdefghijklmnopqrstuvwxyz".split("");

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
    fetchTopCategoriesData();
  }, []);

  return (
    <div className="min-h-[40vh] w-full py-16">
      {isLoading ? (
        <div className="flex h-[40vh] w-full items-center justify-center">
          <Spinner />
        </div>
      ) : error ? (
        <div className="flex h-[40vh] w-full items-center justify-center">
          <p>{error}</p>
        </div>
      ) : (
        <section className="relative mb-6 flex w-full flex-col items-start gap-6 px-0 sm:px-8 lg:flex-row lg:px-16">
          {session?.user.role === "admin" && (
            <div className="absolute right-4 top-0 flex flex-col gap-y-2 place-self-end lg:right-20">
              <Link
                href={`/admin/editblog/${blogId}`}
                className="underline transition-colors duration-300 ease-linear hover:text-app-main"
              >
                Edit Blog
              </Link>
            </div>
          )}
          <aside className="hidden flex-col items-center gap-y-8 lg:flex lg:w-1/4">
            {/* Popular Stores */}
            {popularData?.length > 0 && (
              <PopularItems
                title="Popular Stores"
                items={popularData.map((store, index) => ({
                  id: index,
                  name: store.name,
                }))}
              />
            )}
            {topCategories?.length > 0 && (
              <PopularItems
                title="Today's Top Categories"
                items={topCategories.map((category, index) => ({
                  id: index,
                  name: category.name,
                }))}
              />
            )}
            <div className="w-full rounded-lg bg-popover p-4 shadow-md">
              <h2 className="mb-2 font-medium">Browse by Stores</h2>
              <div className="flex flex-wrap gap-2">
                {blocks.map((block) => (
                  <Button
                    key={block}
                    className="!size-4 bg-neutral-500/40 text-xs font-light text-black hover:bg-neutral-500/40 dark:text-slate-200"
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

          <div className="flex w-full flex-col items-center gap-4 self-stretch rounded-md p-4 sm:pr-0 lg:pt-0">
            {data.thumbnail_url && (
              <Image
                src={data.thumbnail_url ?? "https://via.placeholder.com/600"}
                alt={data.title}
                width={1920}
                height={1080}
                className="aspect-video max-h-48 w-full rounded-md object-cover"
              />
            )}
            <h2
              className={`${data.thumbnail_url ? "mt-2" : ""} place-self-start text-xl font-bold sm:text-2xl`}
            >
              {data.title}
            </h2>
            <div
              dangerouslySetInnerHTML={{ __html: data.content }}
              className="w-full bg-popover p-4"
            />
            {/* Popular Stores */}
            {popularData?.length > 0 && (
              <PopularItems
                title="Popular Stores"
                items={popularData.map((store, index) => ({
                  id: index,
                  name: store.name,
                }))}
                isHidden
              />
            )}
            {topCategories?.length > 0 && (
              <PopularItems
                title="Today's Top Categories"
                items={topCategories.map((category, index) => ({
                  id: index,
                  name: category.name,
                }))}
                isHidden
              />
            )}
          </div>
        </section>
      )}
    </div>
  );
};

export default BlogDetailsPage;

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
      <div className={`mt-4 flex flex-wrap gap-2`}>
        {items.map((item) => {
          return (
            <Link
              href={
                isStore ? `/stores/${item.name}` : `/categories/${item.name}`
              }
              key={item.id}
            >
              <Badge className="bg-neutral-500/40 font-light text-black hover:bg-neutral-500/40 dark:text-slate-200">
                {item.name}
              </Badge>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
