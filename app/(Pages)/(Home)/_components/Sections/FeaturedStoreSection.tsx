"use client";

import Spinner from "@/app/(Pages)/_PageComponents/Spinner";
import axios from "@/app/api/axios/axios";
import { constructS3Url } from "@/lib/utilities/AwsConfig";
import { cn } from "@/lib/utils";
import { AxiosError } from "axios";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const FeaturedStoreSection = () => {
  const [featuredData, setFeaturedData] = useState<Record<string, any>[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | undefined>(undefined);
  useEffect(() => {
    const fetchFeatureData = async () => {
      try {
        const response = await axios.get(
          `/getfeaturedstores?_=${new Date().getTime()}`,
        );
        if (response.data.success) {
          setFeaturedData(response.data.featuredStores);
          setIsLoading(false);
        }
      } catch (err) {
        console.log(err);
        setIsLoading(false);
        if (err instanceof AxiosError) {
          setError(err.response?.data.error);
        }
        if (err instanceof Error) {
          setError(err.message);
        }
      }
    };
    fetchFeatureData();
  }, []);
  return (
    <section className={`${featuredData[0] ? "" : "hidden"} py-8`}>
      <div className=" mx-auto flex w-full max-w-screen-xl flex-col items-center sm:flex-row sm:justify-between sm:px-10 lg:items-start lg:px-12 xl:px-6 2xl:px-0">
        <h2 className="mb-6 text-2xl font-bold lg:text-3xl">Featured Stores</h2>
        <Link
          href={"/stores"}
          className="font-medium transition-all duration-300 ease-linear hover:text-app-main hover:underline sm:-translate-y-3 lg:translate-y-0"
        >
          View all stores
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
        <div
          className={cn(
            `flex w-full max-w-screen-xl flex-nowrap items-center justify-start gap-6 overflow-x-auto px-4 py-4 sm:justify-start sm:px-10 lg:mx-auto lg:px-12 xl:px-6 2xl:px-0`,
          )}
        >
          {featuredData.map((store) => {
            return (
              <div
                className="flex shrink-0 flex-col items-center gap-y-2"
                key={store.storeId}
              >
                <Link
                  href={`/store/${store.slug}`}
                  className="rounded-full bg-popover p-2 shadow-md transition-all duration-200 ease-linear hover:scale-105 hover:shadow-lg lg:ml-2"
                >
                  <div>
                    <Image
                      src={
                        constructS3Url(store.logo_url) ??
                        "https://via.placeholder.com/600x400"
                      }
                      alt={store.storeId}
                      width={400}
                      height={400}
                      className="size-24 cursor-pointer rounded-full transition-all duration-200 ease-linear  md:size-28"
                    />
                  </div>
                </Link>
                <span className="translate-x-1 tabular-nums text-muted-foreground">
                  {store._count.coupons} Coupons
                </span>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default FeaturedStoreSection;
