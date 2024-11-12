
import { Metadata } from "next";
import EventDetailsPage from "../../_EventComponents/EventDetailsPage";

interface Params {
  params: {
    eventId: string;
  };
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { eventId } = params;

  return {
    title: `Event ${eventId} - Details`,
    description: `Get all the details about Event ${eventId}.`,
  };
}

const EventPage = ({ params }: Params) => {
  return (
    <main className="overflow-x-hidden">
      <EventDetailsPage eventId={params.eventId} />
    </main>
  );
};

export default EventPage;
