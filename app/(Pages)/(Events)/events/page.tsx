"use client";
import { useActiveFestival } from "@/hooks/useFestivalActive";
import EventDisplay from "../_EventComponents/EventDisplay";

const EventPage = () => {
  const isActiveFestival = useActiveFestival((state) => state.isActive);
  return (
    <section
      className={`mx-auto mb-10 mt-2 flex w-full max-w-screen-xl flex-col items-start px-4 sm:px-8 lg:mt-0 lg:px-12 xl:px-2 2xl:px-0 ${isActiveFestival ? "translate-y-10 transition-transform duration-200 ease-linear" : "translate-y-0 transition-transform duration-200 ease-linear"}`}
    >
      <h1 className="text-xl font-bold sm:text-2xl">
        Browse Top Saving Events
      </h1>
      <p>Browse Top Shopping Events</p>
      <EventDisplay />
    </section>
  );
};

export default EventPage;
