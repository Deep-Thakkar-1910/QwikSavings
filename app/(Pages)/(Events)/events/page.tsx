"use client";
import { useActiveFestival } from "@/hooks/useFestivalActive";
import { useSession } from "next-auth/react";
import EventDisplay from "../_EventComponents/EventDisplay";

const EventPage = () => {
  const { data: session } = useSession();
  const isActiveFestival = useActiveFestival((state) => state.isActive);
  const isAdmin = session?.user?.role === "admin";
  return (
    <section
      className={`mx-auto mb-10 mt-2 flex w-full max-w-screen-xl flex-col items-start px-4 sm:px-8 lg:mt-0 lg:px-12 xl:px-2 2xl:px-0 ${isActiveFestival && !isAdmin ? "mb-28 translate-y-10 transition-transform duration-200 ease-linear" : "translate-y-0 transition-transform duration-200 ease-linear"}`}
    >
      <h1 className="text-xl font-bold sm:text-2xl">
        Browse Top Saving Events
      </h1><br/>
      <p>Browse Top Shopping Events</p>
      <EventDisplay />
    </section>
  );
};

export default EventPage;
