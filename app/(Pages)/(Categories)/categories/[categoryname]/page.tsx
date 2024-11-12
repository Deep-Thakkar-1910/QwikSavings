// app/category/[categoryname]/page.tsx (Server Component)

import { Metadata } from "next";
import CategoryDetailPage from "@/app/(Pages)/_PageComponents/CategoryDetailPage";

interface Params {
  params: {
    categoryname: string;
  };
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { categoryname } = params;

  return {
    title: `${categoryname.charAt(0).toUpperCase() + categoryname.slice(1)} - Category Details`,
    description: `Discover more about ${categoryname}. Explore details, insights, and more about this category.`,
  };
}

const CategoryPage = ({ params }: Params) => {
  return (
    <main className="overflow-x-hidden">
      <CategoryDetailPage categoryname={params.categoryname} />
    </main>
  );
};

export default CategoryPage;
