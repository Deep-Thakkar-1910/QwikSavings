import { Metadata } from "next";
import DetailsPage from "@/app/(Pages)/_PageComponents/DetailsPage";

interface Params {
  params: {
    storename: string;
  };
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { storename } = params;

  const title = `Store ${storename} - Explore Products`;
  const description = `Discover products available in Store ${storename}. Shop now to explore unique items curated just for you.`;

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
