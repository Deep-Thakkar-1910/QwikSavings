"use client";
import DisplayItems from "@/app/(Pages)/_PageComponents/DisplayComponents";
import FilterBlocks from "@/app/(Pages)/_PageComponents/FilterBlocks";
import { useFilter } from "@/hooks/useFilter";
import { Tag } from "lucide-react";
import Link from "next/link";

const AllCategories = () => {
  const { setPage, setLike, data, page, like, isLoading, totalCount, error } =
    useFilter("categories");
  return (
    <section className="mt-10 flex w-full flex-col items-center">
      <h1 className="mb-6 text-2xl font-bold">Categories</h1>
      <FilterBlocks filterForPage="stores" like={like} setLike={setLike} />
      <div className="my-6 flex w-full items-center justify-between px-4 sm:px-8 lg:px-16">
        <Link
          href={"/admin/createcategory"}
          className="flex items-center gap-x-1 text-app-main underline transition-transform duration-200 ease-linear hover:scale-105"
        >
          <Tag className="size-3" />
          Create a new Category
        </Link>
        <span className="text-xl font-medium">
          Total Categories: {totalCount}
        </span>
      </div>
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
    </section>
  );
};

export default AllCategories;
