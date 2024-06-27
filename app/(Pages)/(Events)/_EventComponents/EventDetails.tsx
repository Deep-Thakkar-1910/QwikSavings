"use client";
import useGetEventDetails from "@/hooks/useGetEventDetails";
import Spinner from "../../_PageComponents/Spinner";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useSession } from "next-auth/react";

const EventDetails = () => {
  const { eventName } = useParams();
  const { data: session } = useSession();
  const { data, isLoading, error } = useGetEventDetails(eventName as string);
  return (
    <div className="min-h-[40vh] w-full  p-8 lg:px-16 lg:py-16">
      {isLoading ? (
        <div className="flex h-[40vh] w-full items-center justify-center">
          <Spinner />
        </div>
      ) : error ? (
        <div className="flex h-[40vh] w-full items-center justify-center">
          <p>{error}</p>
        </div>
      ) : data?.length === 0 ? (
        <div className="flex h-[40vh] w-full items-center justify-center">
          <p>No Events Found</p>
        </div>
      ) : (
        <div className="relative">
          {session?.user.role === "admin" && (
            <Link
              href={`/admin/editevent/${eventName}`}
              className="absolute right-4 top-0 place-self-end  underline transition-colors duration-300 ease-linear hover:text-app-main lg:right-20"
            >
              Edit Event
            </Link>
          )}
        </div>
      )}
    </div>
  );
};

export default EventDetails;
