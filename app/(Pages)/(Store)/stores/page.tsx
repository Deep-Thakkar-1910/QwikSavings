// StoresPage.tsx
"use client";
import FilterBlocks from "../../_PageComponents/FilterBlocks";
import { useFilter } from "@/hooks/useFilter";
import DisplayItems from "../../_PageComponents/DisplayComponents";
import CustomPaginationComponent from "../../_PageComponents/CustomPaginationComponent";

const StoresPage = () => {
  const { setPage, setLike, data, page, like, isLoading, totalCount, error } =
    useFilter("stores");
  const totalPages = Math.ceil(totalCount / 20);
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };
  return (
    <section className="mb-6 w-full">
      <h1 className="mb-4 ml-8 text-2xl font-semibold lg:ml-16">
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

export default StoresPage;
