"use client";
import useGetEvents from "@/hooks/useGetEvents";
import { Tag } from "lucide-react";
import Link from "next/link";
import DisplayEvents from "../../../_Admincomponents/DisplayEvents";
import axios from "@/app/api/axios/axios";
import { toast } from "@/components/ui/use-toast";
import { AxiosError } from "axios";

const AllEventsPage = () => {
  const { data, setData, error, isLoading, totalCount, setTotalCount } =
    useGetEvents();

  const handleDelete = async (id: number) => {
    try {
      const response = await axios.delete(`/deleteevent/${id}`);
      if (response.data.success) {
        // Update local state
        setData((prevData) => prevData.filter((item) => item.eventId !== id));
        setTotalCount((prevCount) => prevCount - 1);
        toast({
          title: "Event deleted",
          description: "The event has been successfully deleted.",
        });
      }
    } catch (error) {
      console.error("Error deleting event:", error);
      if (error instanceof AxiosError) {
        toast({
          title: "Error",
          description: error?.response?.data?.error,
          variant: "destructive",
        });
        return;
      }
    }
  };
  return (
    <section className="mt-10 flex w-full flex-col items-center">
      <h1 className="mb-6 text-2xl font-bold">Events</h1>
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
        onDelete={handleDelete}
      />
    </section>
  );
};

export default AllEventsPage;
