"use client";

import Spinner from "@/app/(Pages)/_PageComponents/Spinner";
import useGetBlogDetails from "@/hooks/useGetBlogDetails";
import Image from "next/image";
import { useParams } from "next/navigation";

const BlogDetailsPage = () => {
  const { blogId } = useParams();
  const { data, error, isLoading } = useGetBlogDetails(blogId);
  return (
    <div className="min-h-[40vh] w-full  p-8 lg:px-16 lg:py-16">
      {isLoading ? (
        <div className="flex h-[40vh] w-full items-center justify-center">
          <Spinner />
        </div>
      ) : error ? (
        <div className="flex h-[40vh] w-full items-center justify-center">
          <p>{error}</p>
        </div>
      ) : (
        <div className="relative">
          <div className="flex flex-col items-center gap-4 rounded-md p-4">
            <Image
              src={data.thumbnail_url ?? "https://via.placeholder.com/600"}
              alt={data.title}
              width={1920}
              height={1080}
              className="aspect-video max-h-48 w-full rounded-md object-cover"
            />
            <h2 className="mt-2 place-self-start text-xl font-bold sm:text-2xl">
              {data.title}
            </h2>
            <div
              dangerouslySetInnerHTML={{ __html: data.content }}
              className="w-full"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogDetailsPage;
