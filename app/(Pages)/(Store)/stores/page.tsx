"use client";
import { Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import FilterBlocks from "../../_PageComponents/FilterBlocks";
import { useFilter } from "@/hooks/useFilter";
import DisplayItems from "../../_PageComponents/DisplayComponents";
import CustomPaginationComponent from "../../_PageComponents/CustomPaginationComponent";
import { useActiveFestival } from "@/hooks/useFestivalActive";

const StoresPageContent = () => {
  const searchParams = useSearchParams();
  const isActiveFestival = useActiveFestival((state) => state.isActive);
  const initialLike = searchParams.get("like") || "";
  const { setPage, setLike, data, page, like, isLoading, totalCount, error } =
    useFilter("stores", initialLike);
  const totalPages = Math.ceil(totalCount / 20);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  useEffect(() => {
    const newLike = searchParams.get("like") || "";
    setLike(newLike);
  }, [searchParams, setLike]);

  return (
    <section
      className={`mb-6 mt-2 w-full lg:mt-0 ${isActiveFestival ? "!mb-20 translate-y-10 transition-transform duration-200 ease-linear" : "mb-0 translate-y-0 transition-transform duration-200 ease-linear"}`}
    >
      <h1 className="mb-4 ml-8 text-2xl font-semibold lg:ml-12">
        All Stores & Brands A-Z
      </h1>
      <FilterBlocks filterForPage="stores" like={like} setLike={setLike} />
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

const StoresPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <StoresPageContent />
    </Suspense>
  );
};

export default StoresPage;
