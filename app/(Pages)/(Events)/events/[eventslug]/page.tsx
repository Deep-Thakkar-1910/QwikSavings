import { Metadata } from "next";
import EventDetailsPage from "../../_EventComponents/EventDetailsPage";
import db from "@/lib/prisma";

interface Params {
  params: {
    eventslug: string;
  };
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { eventslug } = params;
  const titleName = await db.event.findUnique({
    where: {
      slug: eventslug,
    },
    select: {
      name: true,
    },
  });
  return {
    title: `${titleName?.name}`,
    description: `Get all the details about Event ${titleName?.name}.`,
  };
}

const EventPage: React.FC = () => {
  return (
    <main className="overflow-x-hidden">
      <EventDetailsPage />
    </main>
  );
};

export default EventPage;
