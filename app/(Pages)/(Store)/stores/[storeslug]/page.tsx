import { Metadata } from "next";
import DetailsPage from "@/app/(Pages)/_PageComponents/DetailsPage";
import db from "@/lib/prisma";

interface Params {
  params: {
    storeslug: string;
  };
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { storeslug } = params;
  const titleName = await db.store.findUnique({
    where: {
      slug: storeslug,
    },
    select: {
      name: true,
      description: true,
    },
  });
  const title = `${titleName?.name}`;
  const description = titleName?.description as string;

  return {
    title,
    description,
  };
}

const StorePage = () => {
  return (
    <main className="overflow-x-hidden">
      <DetailsPage fetchFrom="store" />
    </main>
  );
};

export default StorePage;
