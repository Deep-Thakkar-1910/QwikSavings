import { Metadata } from "next";
import CategoryDetailPage from "@/app/(Pages)/_PageComponents/CategoryDetailPage";
import db from "@/lib/prisma";

interface Params {
  params: {
    categoryslug: string;
  };
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { categoryslug } = params;
  const titleName = await db.category.findUnique({
    where: {
      slug: categoryslug,
    },
    select: {
      name: true,
    },
  });
  return {
    title: `${titleName?.name}`,
    description: `Discover more about ${titleName?.name}. Explore details, insights, and more about this category.`,
  };
}

const CategoryPage = ({ params }: Params) => {
  return (
    <main className="overflow-x-hidden">
      <CategoryDetailPage categoryname={params.categoryslug} />
    </main>
  );
};

export default CategoryPage;
