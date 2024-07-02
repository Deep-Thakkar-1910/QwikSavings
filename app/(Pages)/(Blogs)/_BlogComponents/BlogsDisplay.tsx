"use client";

import Image from "next/image";
import Spinner from "../../_PageComponents/Spinner";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import useGetBlogs from "@/hooks/useGetBlogs";

const BlogDisplay = () => {
  const { data, error, isLoading } = useGetBlogs();
  return (
    <div className="mt-6 min-h-[40vh] w-full rounded-md p-4">
      {isLoading ? (
        <div className="flex h-[40vh] w-full items-center justify-center">
          <Spinner />
        </div>
      ) : error ? (
        <div className="flex h-[40vh] w-full items-center justify-center">
          <p>{error}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 gap-x-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {data?.map((blog: Record<string, any>) => (
            <div
              key={blog.blogId}
              className="flex max-w-72 flex-col items-center  rounded-md bg-popover shadow-md sm:max-w-80 lg:max-w-full"
            >
              {blog.thumbnail_url ? (
                <Image
                  src={
                    blog.thumbnail_url ?? "https://via.placeholder.com/400x600"
                  }
                  alt={blog.title}
                  width={600}
                  height={600}
                  className="aspect-video w-full rounded-md rounded-bl-none rounded-br-none object-cover"
                />
              ) : (
                <div className="aspect-video w-full rounded-md bg-popover" />
              )}
              <div className="flex w-full flex-col items-center gap-y-4 p-4">
                <h2 className="mx-auto mt-2 text-center text-lg font-semibold">
                  {blog.title}
                </h2>

                <Button className="w-full rounded-lg bg-app-main" asChild>
                  <Link href={`/blogs/${blog.blogId}`}>View Blog</Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BlogDisplay;
