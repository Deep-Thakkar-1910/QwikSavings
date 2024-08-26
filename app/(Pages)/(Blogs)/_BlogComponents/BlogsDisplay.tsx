"use client";
import Image from "next/image";
import Spinner from "../../_PageComponents/Spinner";
import Link from "next/link";
import useGetBlogs from "@/hooks/useGetBlogs";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Separator } from "@radix-ui/react-dropdown-menu";

const BlogDisplay = () => {
  const { data, error, isLoading } = useGetBlogs();
  function stripHtml(html: string) {
    let doc = new DOMParser().parseFromString(html, "text/html");
    return doc.body.textContent || "";
  }
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
              className="flex max-w-72  flex-col rounded-xl bg-popover shadow-md sm:max-w-80 lg:max-w-full"
            >
              {blog.thumbnail_url ? (
                <Image
                  src={
                    blog.thumbnail_url ?? "https://via.placeholder.com/400x600"
                  }
                  alt={blog.title}
                  width={600}
                  height={600}
                  className="aspect-video w-full rounded-xl rounded-bl-none rounded-br-none object-cover"
                />
              ) : (
                <div className="flex aspect-video w-full items-center justify-center rounded-xl bg-popover">
                  <span className="text-gray-400">No image</span>
                </div>
              )}
              <div className="flex flex-grow flex-col">
                <div className="flex w-full items-center justify-between p-4 pb-2">
                  <Badge className="bg-app-main hover:bg-app-main">
                    {blog.category.name}
                  </Badge>
                  <p className="text-sm text-muted-foreground">
                    {format(blog.updatedAt, "dd-MMM-yyyy")}
                  </p>
                </div>
                <h2 className="line-clamp-2 px-4 text-lg font-semibold">
                  {blog.title}
                </h2>
                <p className="my-2 flex-grow overflow-hidden px-4 text-xs text-muted-foreground">
                  {blog.content.length > 40
                    ? stripHtml(blog.content).slice(0, 40) + "..."
                    : stripHtml(blog.content)}
                </p>
                <div className="mt-auto">
                  <Separator className="h-px w-full bg-muted-foreground" />
                  <Link
                    href={`/blogs/${blog.blogId}`}
                    className="flex items-center gap-x-1 px-4 py-2 text-xs transition-colors duration-300 ease-linear hover:text-app-main"
                  >
                    <span>Read more</span>
                    <ArrowRight className="size-3" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BlogDisplay;
