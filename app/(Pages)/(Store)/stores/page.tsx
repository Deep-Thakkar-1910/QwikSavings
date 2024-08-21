"use client";
import { useActiveFestival } from "@/hooks/useFestivalActive";
import { useFilter } from "@/hooks/useFilter";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";
import CustomPaginationComponent from "../../_PageComponents/CustomPaginationComponent";
import DisplayItems from "../../_PageComponents/DisplayComponents";
import FilterBlocks from "../../_PageComponents/FilterBlocks";

const StoresPageContent = () => {
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const isActiveFestival = useActiveFestival((state) => state.isActive);
  const isAdmin = session?.user?.role === "admin";
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
      className={`mb-6 mt-2 w-full lg:mt-0 ${isActiveFestival && !isAdmin ? "mb-[96px] translate-y-10 transition-transform duration-200 ease-linear" : "mb-0 translate-y-0 transition-transform duration-200 ease-linear"}`}
    >
      <h1 className="mb-4 ml-8 text-2xl font-semibold lg:ml-12">
        All Brands & Stroes A-Z
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
