"use client";
import React from "react";
import FilterBlocks from "../../_PageComponents/FilterBlocks";
import { useFilter } from "@/hooks/useFilter";
import DisplayItems from "../../_PageComponents/DisplayComponents";
import CustomPaginationComponent from "../../_PageComponents/CustomPaginationComponent";
import { useActiveFestival } from "@/hooks/useFestivalActive";
import { useSession } from "next-auth/react";

const CategoriesPage = () => {
  const { setPage, setLike, data, page, like, totalCount, isLoading, error } =
    useFilter("categories");
  const { data: session } = useSession();
  const isActiveFestival = useActiveFestival((state) => state.isActive);
  const isAdmin = session?.user?.role === "admin";
  const totalPages = Math.ceil(totalCount / 20);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  return (
    <section
      className={`mb-6 mt-2 w-full lg:mt-0 ${isActiveFestival ? "!mb-20 translate-y-10 transition-transform duration-200 ease-linear" : "mb-0 translate-y-0 transition-transform duration-200 ease-linear"}`}
    >
      <h1 className="mb-4 ml-8 text-2xl font-semibold lg:ml-12">
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
