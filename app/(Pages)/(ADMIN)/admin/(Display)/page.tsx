"use client";

import CustomPaginationComponent from "@/app/(Pages)/_PageComponents/CustomPaginationComponent";
import DisplayItems from "@/app/(Pages)/_PageComponents/DisplayComponents";
import FilterBlocks from "@/app/(Pages)/_PageComponents/FilterBlocks";
import { useFilter } from "@/hooks/useFilter";
import { Tag } from "lucide-react";
import Link from "next/link";
import axios from "@/app/api/axios/axios";
import { toast } from "@/components/ui/use-toast";
import { AxiosError } from "axios";

const AdminAllStoresPage = () => {
  const {
    setPage,
    setLike,
    data,
    page,
    like,
    isLoading,
    totalCount,
    error,
    setData,
    setTotalCount,
  } = useFilter("stores");
  const totalPages = Math.ceil(totalCount / 20);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await axios.delete(`/deletestore/${id}`);
      if (response.data.success) {
        // Update local state
        setData((prevData) => prevData.filter((item) => item.storeId !== id));
        setTotalCount((prevCount) => prevCount - 1);
        toast({
          title: "Store deleted",
          description: "The store has been successfully deleted.",
        });
      }
    } catch (error) {
      console.error("Error deleting store:", error);
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
        description: "Failed to delete the store. Please try again.",
        variant: "destructive",
      });
      throw error; // Re-throw for DisplayItems to handle
    }
  };

  return (
    <section className="mt-10 flex w-full flex-col items-center">
      <h1 className="mb-6 text-2xl font-bold">Stores</h1>
      <FilterBlocks filterForPage="stores" like={like} setLike={setLike} />
      <div className="my-6 flex w-full items-center justify-between px-4 sm:px-8 lg:px-12">
        <Link
          href={"/admin/createstore"}
          className="flex items-center gap-x-1 text-app-main underline transition-transform duration-200 ease-linear hover:scale-105"
        >
          <Tag className="size-3" />
          Create a new Store
        </Link>
        <span className="text-xl font-medium">Total Stores: {totalCount}</span>
      </div>
      <DisplayItems
        data={data.map((item: Record<string, any>) => ({
          storeId: item.storeId,
          name: item.name,
          logo_url: item.logo_url,
          coupons: item.coupons,
        }))}
        isLoading={isLoading}
        error={error}
        emptyMessage="No Stores Found"
        onDelete={handleDelete}
      />
      {totalPages > 1 && (
        <CustomPaginationComponent
          currentPage={page}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </section>
  );
};

export default AdminAllStoresPage;
