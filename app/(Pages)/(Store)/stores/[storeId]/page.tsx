"use client";
import DetailsPage from "@/app/(Pages)/_PageComponents/DetailsPage";
import Spinner from "@/app/(Pages)/_PageComponents/Spinner";
import useGetDetails from "@/hooks/useGetDetails";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useParams } from "next/navigation";

const StorePage = () => {
  const { storeId } = useParams();
  const { data: session } = useSession();
  const {
    data: storeData,
    isLoading,
    error,
  } = useGetDetails({
    fetchFrom: "store",
    id: storeId as string,
  });
  return <DetailsPage fetchFrom="store" />;
};

export default StorePage;
