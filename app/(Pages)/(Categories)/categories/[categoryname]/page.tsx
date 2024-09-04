import DetailsPage from "@/app/(Pages)/_PageComponents/DetailsPage";

const CategoryDetailPage = () => {
  return (
    <main className="overflow-x-hidden">
      <DetailsPage fetchFrom="category" />;
    </main>
  );
};

export default CategoryDetailPage;
