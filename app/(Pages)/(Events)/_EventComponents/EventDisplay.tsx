"use client";
import { Button } from "@/components/ui/button";
import useGetEvents from "@/hooks/useGetEvents";
import Image from "next/image";
import Link from "next/link";
import Spinner from "../../_PageComponents/Spinner";

const EventDisplay = () => {
  const { data, error, isLoading } = useGetEvents();
  return (
    <div className="mt-6 min-h-[30vh] w-full rounded-lg bg-[#f2f0e6] p-4 dark:bg-accent">
      {isLoading ? (
        <div className="flex h-[30vh] w-full items-center justify-center">
          <Spinner />
        </div>
      ) : error ? (
        <div className="flex h-[30vh] w-full items-center justify-center">
          <p>{error}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-1 lg:grid-cols-3 xl:grid-cols-4">
          {data?.map((event: Record<string, any>) => (
            <div
              key={event.eventId}
              className="flex h-80 max-w-xs flex-col items-center gap-4 rounded-lg bg-popover p-4 shadow-md sm:max-w-xs lg:max-w-xs"
            >
              <h2
                className="mt-2 text-sm font-bold"
                style={{ position: "relative", bottom: "10px" }}
              >
                {event.name}
              </h2>

              {event.logo_url ? (
                <Image
                  src={event.logo_url}
                  alt={event.name}
                  width={400}
                  height={1000}
                  className="size-32"
                  style={{position:"relative", top:"40px"}}
                />
              ) : (
                <div className="aspect-video size-32" />
              )}
              <Button
                className="w-half rounded-lg bg-app-main hover:bg-app-main"
                asChild
                style={{
                  position: "relative",
                  top: "70px",
                  width: "160px",
                  height: "30px",
                }}
              >
                <Link href={`/events/${event.name}`}>Reveal Deals</Link>
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EventDisplay;
