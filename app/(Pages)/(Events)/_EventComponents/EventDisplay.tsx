"use client";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect, useState } from "react";

type Event = {
  id: number;
  name: string;
  path: string;
};

const EventDisplay = () => {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    // Fetch events dynamically from an API or database
    const fetchEvents = async () => {
      try {
        const response = await fetch("/api/events"); // Replace with your API endpoint
        if (!response.ok) {
          throw new Error("Failed to fetch events");
        }
        const data: Event[] = await response.json();
        setEvents(data);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div className="mt-6 min-h-[30vh] w-full rounded-md bg-[#f2f0e6] p-4 dark:bg-accent">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 justify-items-center">
        {events.map((event) => (
          <div
            key={event.id}
            className="flex w-full max-w-[300px] flex-col items-center gap-4 rounded-md bg-popover p-4 shadow-md sm:max-w-[350px] py-4"
          >
            <h2 className="mt-2 text-center text-lg font-semibold">
              {event.name}
            </h2>
            <Image
              src={event.path}
              alt={event.name}
              width={600}
              height={600}
              className="w-36 h-36 object-cover mt-5"
            />
            <Button
              className="w-full rounded-lg bg-app-main hover:bg-app-main mt-5"
              asChild
            >
              <Link href={`/events/${event.id}`}>Reveal Deals</Link>
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventDisplay;
