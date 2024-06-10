"use client";
import DetailsPage from "@/app/(Pages)/_PageComponents/DetailsPage";
import Spinner from "@/app/(Pages)/_PageComponents/Spinner";
import useGetDetails from "@/hooks/useGetDetails";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";

const CategoryDetailPage = () => {
  const { categoryId } = useParams();
  const { data: session } = useSession();
  const {
    data: categoryData,
    isLoading,
    error,
  } = useGetDetails({
    fetchFrom: "category",
    id: categoryId as string,
  });
  return <DetailsPage fetchFrom="category" />;
};

export default CategoryDetailPage;
