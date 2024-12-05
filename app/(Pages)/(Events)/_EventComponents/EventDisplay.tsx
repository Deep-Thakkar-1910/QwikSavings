"use client";
import useGetEvents from "@/hooks/useGetEvents";
import Image from "next/image";
import Spinner from "../../_PageComponents/Spinner";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { constructS3Url } from "@/lib/utilities/AwsConfig";

const EventDisplay = () => {
  const { data, error, isLoading } = useGetEvents();
  return (
    <div className="mt-6 min-h-[30vh] w-full rounded-md bg-[#f2f0e6] p-4 dark:bg-accent">
      {isLoading ? (
        <div className="flex h-[30vh] w-full items-center justify-center">
          <Spinner />
        </div>
      ) : error ? (
        <div className="flex h-[30vh] w-full items-center justify-center">
          <p>{error}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
          {data?.map((event: Record<string, any>) => (
            <div
              key={event.eventId}
              className="flex max-w-72 flex-col items-center gap-4 rounded-md bg-popover p-4 shadow-md sm:max-w-80 lg:max-w-full"
            >
              <h2 className="mt-2 text-lg font-semibold">{event.name}</h2>

              {event.logo_url ? (
                <Image
                  src={constructS3Url(event.logo_url)!}
                  alt={event.name}
                  width={600}
                  height={600}
                  className="size-32 object-contain"
                />
              ) : (
                <div className="aspect-video size-32" />
              )}
              <Button
                className="w-full rounded-lg bg-app-main hover:bg-app-main"
                asChild
              >
                <Link href={`/events/${event.slug}`}>Reveal Deals</Link>
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EventDisplay;
