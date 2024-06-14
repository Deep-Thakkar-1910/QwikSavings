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
    <section className={`${featuredData[0] ? "" : "hidden"} p-10`}>
      <div className=" mx-auto flex w-full max-w-screen-xl flex-col items-center px-4 sm:flex-row sm:justify-between sm:px-8 lg:items-start lg:px-16 xl:px-2 2xl:px-0">
        <h2 className="mb-6 text-2xl font-bold lg:text-3xl">Featured Stores</h2>
        <Link
          href={"/stores"}
          className=" transition-all duration-300 ease-linear hover:text-app-main hover:underline sm:-translate-y-3 lg:translate-y-0"
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
            `mx-auto grid w-full max-w-screen-xl grid-cols-1 place-items-center p-10 px-8 py-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 lg:px-16`,
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
                className="max-w-32 cursor-pointer rounded-full shadow-md transition-all duration-200 ease-linear hover:scale-110 hover:shadow-lg"
              />
            );
          })}
        </div>
      )}
    </section>
  );
};

export default FeaturedStoreSection;
