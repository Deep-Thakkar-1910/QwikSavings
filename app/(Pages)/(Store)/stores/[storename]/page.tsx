import DetailsPage from "@/app/(Pages)/_PageComponents/DetailsPage";
const StorePage = () => {
  return (
    <main className="overflow-x-hidden">
      <DetailsPage fetchFrom="store" />
    </main>
  );
};

export default StorePage;
