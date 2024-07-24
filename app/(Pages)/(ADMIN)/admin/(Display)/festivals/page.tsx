"use client";
import useGetFestivalsByStoreName from "@/hooks/useGetFestivalsByStoreName";
import { useEffect, useState } from "react";
import axios from "@/app/api/axios/axios";
import Link from "next/link";
import { toast } from "@/components/ui/use-toast";
import { AxiosError } from "axios";
import StoreFilterForCoupon from "../../../_Admincomponents/StoreFilterForCouponsAndFestivals";
import FestivalDisplay from "../../../_Admincomponents/FestivalDisplay";

const AllFestivalsPage = () => {
  const [stores, setStores] = useState<{ storeId: number; name: string }[]>([]);
  const {
    data,
    setData,
    error,
    isLoading,
    like,
    setLike,
    totalCount,
    setTotalCount,
  } = useGetFestivalsByStoreName();
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

  const handleDelete = async (id: number) => {
    try {
      const response = await axios.delete(`/deletefestival/${id}`);
      if (response.data.success) {
        // Update local state
        setData((prevData) =>
          prevData.filter((item) => item.festivalId !== id),
        );
        setTotalCount((prevCount) => prevCount - 1);
        toast({
          title: "Festival deleted",
          description: "The festival has been successfully deleted.",
        });
      }
    } catch (error) {
      console.error("Error deleting festival:", error);
      if (error instanceof AxiosError) {
        toast({
          title: "Error",
          description: error?.response?.data?.error,
          variant: "destructive",
        });
        return;
      }
      toast({
        title: "Error",
        description: "Failed to delete the festival. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };

  return (
    <section className="mt-10 flex w-full flex-col items-center">
      <h1 className="mb-6 text-2xl font-bold">Festivals</h1>
      <StoreFilterForCoupon like={like} setLike={setLike} stores={stores} />
      <div className="my-6 flex w-full flex-col items-center justify-between px-4 sm:flex-row sm:px-8 lg:px-16">
        <Link
          href={"/admin/createfestival"}
          className="flex items-center gap-x-1 text-app-main underline transition-transform duration-200 ease-linear hover:scale-105"
        >
          Create a new Festival
        </Link>
        <span className="text-xl font-medium">
          Total Festivals in {like} : {totalCount}
        </span>
      </div>
      <FestivalDisplay
        like={like}
        data={data}
        isLoading={isLoading}
        emptyMessage="No Festivals Found"
        error={error}
        onDelete={handleDelete}
      />
    </section>
  );
};

export default AllFestivalsPage;
