// app/(Pages)/_PageComponents/CategoryDetailPage.tsx (Client Component)

"use client";

import DetailsPage from "@/app/(Pages)/_PageComponents/DetailsPage";

interface CategoryDetailPageProps {
    categoryname: string;
}

const CategoryDetailPage = ({ categoryname }: CategoryDetailPageProps) => {
    console.log(categoryname);

    return (
        <main className="overflow-x-hidden">
            <DetailsPage fetchFrom="category" />
        </main>
    );
};

export default CategoryDetailPage;
