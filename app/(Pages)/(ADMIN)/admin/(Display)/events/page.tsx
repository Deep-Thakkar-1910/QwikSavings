"use client";
import useGetEvents from "@/hooks/useGetEvents";
import { Tag } from "lucide-react";
import Link from "next/link";
import DisplayEvents from "../../../_Admincomponents/DisplayEvents";

const AllEventsPage = () => {
  const { data, error, isLoading, totalCount } = useGetEvents();
  return (
    <section className="mt-10 flex w-full flex-col items-center">
      <h1 className="mb-6 text-2xl font-bold">Categories</h1>

      <div className="my-6 flex w-full items-center justify-between px-4 sm:px-8 lg:px-16">
        <Link
          href={"/admin/createevent"}
          className="flex items-center gap-x-1 text-app-main underline transition-transform duration-200 ease-linear hover:scale-105"
        >
          <Tag className="size-3" />
          Create a new Event
        </Link>
        <span className="text-xl font-medium">
          Total Categories: {totalCount}
        </span>
      </div>
      <DisplayEvents
        data={data}
        isLoading={isLoading}
        error={error}
        emptyMessage="No Events Found"
      />
    </section>
  );
};

export default AllEventsPage;
