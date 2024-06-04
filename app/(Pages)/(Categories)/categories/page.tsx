// CategoriesPage.tsx
"use client";
import FilterBlocks from "../../_PageComponents/FilterBlocks";
import { useFilter } from "@/hooks/useFilter";
import DisplayItems from "../../_PageComponents/DisplayComponents";

const CategoriesPage = () => {
  const { setPage, setLike, data, page, like, isLoading, error } =
    useFilter("categories");

  return (
    <section className="w-full">
      <h1 className="mb-4 ml-8 text-2xl font-semibold lg:ml-16">
        All Categories A-Z
      </h1>
      <FilterBlocks filterForPage="categories" like={like} setLike={setLike} />
      <DisplayItems
        data={data.map((item: Record<string, any>) => ({
          categoryId: item.categoryId,
          name: item.name,
          logo_url: item.logo_url,
        }))}
        isLoading={isLoading}
        error={error}
        emptyMessage="No Categories Found"
      />
    </section>
  );
};

export default CategoriesPage;
