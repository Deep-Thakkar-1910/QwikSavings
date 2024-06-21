"use client";
import useGetCouponsByStoreName from "@/hooks/useGetCouponsByStoreName";
import StoreFilterForCoupon from "../../../_Admincomponents/StoreFilterForCoupons";
import { useEffect, useRef, useState } from "react";
import axios from "@/app/api/axios/axios";
import CouponDisplay from "../../../_Admincomponents/CouponDisplay";
import Link from "next/link";
import { Tag } from "lucide-react";

const AllCouponsPage = () => {
  const [stores, setStores] = useState<{ storeId: number; name: string }[]>([]);
  const { data, error, isLoading, like, setLike, totalCount } =
    useGetCouponsByStoreName();
  useEffect(() => {
    const fetchStores = async () => {
      try {
        const response = await axios.get("/getstores");

        if (response.data?.success) {
          setStores(response.data.stores);
          setLike(response.data.stores[0].name);
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchStores();
  }, [setLike]);
  return (
    <section className="mt-10 flex w-full flex-col items-center">
      <h1 className="mb-6 text-2xl font-bold">Coupons</h1>
      <StoreFilterForCoupon like={like} setLike={setLike} stores={stores} />
      <div className="my-6 flex w-full flex-col items-center justify-between px-4 sm:flex-row sm:px-8 lg:px-16">
        <Link
          href={"/admin/createcoupon"}
          className="flex items-center gap-x-1 text-app-main underline transition-transform duration-200 ease-linear hover:scale-105"
        >
          <Tag className="size-3" />
          Create a new Coupon
        </Link>
        <span className="text-xl font-medium">
          Total Coupons in {like} : {totalCount}
        </span>
      </div>
      <CouponDisplay
        data={data}
        isLoading={isLoading}
        emptyMessage="No Coupons Found"
        error={error}
      />
    </section>
  );
};

export default AllCouponsPage;
