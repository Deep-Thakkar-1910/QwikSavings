"use client";

import Spinner from "@/app/(Pages)/_PageComponents/Spinner";
import axios from "@/app/api/axios/axios";
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
        const response = await axios.get(`/getfeaturedstores?${new Date()}`);
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
    <section className={`${featuredData[0] ? "" : "hidden"} mt-6`}>
      <div className=" flex w-full justify-between px-8 lg:px-16">
        <h2 className="mb-4 text-base font-bold sm:text-2xl ">
          Featured Stores
        </h2>
        <Link
          href={"/stores"}
          className=" transition-all duration-300 ease-linear hover:text-app-main hover:underline"
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
            `grid w-full grid-cols-2 place-items-center px-8 py-4 sm:grid-cols-4 lg:grid-cols-8 lg:px-16`,
            featuredData.length < 4 &&
              "flex flex-wrap items-center justify-center gap-4",
          )}
        >
          {featuredData.map((store) => {
            return (
              <Image
                key={store.storeId}
                src={store.logo_url ?? "https://via.placeholder.com/600x400"}
                alt={store.storeId}
                width={400}
                height={400}
                className="size-16 cursor-pointer rounded-full transition-all duration-200 ease-linear hover:scale-110 hover:shadow-md sm:size-20"
              />
            );
          })}
        </div>
      )}
    </section>
  );
};

export default FeaturedStoreSection;
