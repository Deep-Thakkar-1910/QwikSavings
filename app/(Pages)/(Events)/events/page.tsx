import EventDisplay from "../_EventComponents/EventDisplay";

const EventPage = () => {
  return (
    <section className="mx-auto mb-10 flex w-full max-w-screen-xl flex-col  items-start px-4 sm:px-8 lg:px-16 xl:px-2 2xl:px-0">
      <h1 className="text-xl font-bold sm:text-2xl">
        Browse Top Saving Events
      </h1>
      <p>Browse Top Shopping Events</p>
      <EventDisplay />
    </section>
  );
};

export default EventPage;
