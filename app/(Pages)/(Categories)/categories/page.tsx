"use client";
import React from "react";
import FilterBlocks from "../../_PageComponents/FilterBlocks";
import { useFilter } from "@/hooks/useFilter";
import DisplayItems from "../../_PageComponents/DisplayComponents";
import CustomPaginationComponent from "../../_PageComponents/CustomPaginationComponent";

const CategoriesPage = () => {
  const { setPage, setLike, data, page, like, totalCount, isLoading, error } =
    useFilter("categories");

  const totalPages = Math.ceil(totalCount / 20);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  return (
    <section className="mb-6 w-full">
      <h1 className="mb-4 ml-8 text-2xl font-semibold lg:ml-16">
        All Categories A-Z
      </h1>
      <FilterBlocks filterForPage="categories" like={like} setLike={setLike} />
      <DisplayItems
        data={data.map((item: Record<string, any>) => ({
          categoryId: item.categoryId,
          name: item.name,
          logo_url: item.logo_url,
          coupons: item.coupons,
        }))}
        isLoading={isLoading}
        error={error}
        emptyMessage="No Categories Found"
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

export default CategoriesPage;
