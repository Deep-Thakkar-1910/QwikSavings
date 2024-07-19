import { Badge } from "@/components/ui/badge";
import Spinner from "../../_PageComponents/Spinner";
import { format } from "date-fns";
import Link from "next/link";
import Image from "next/image";
interface BlogsDisplayProps {
  like: string | null;
  data: Record<string, any>[];
  isLoading: boolean;
  error: string | undefined;
  emptyMessage: string | undefined;
}

const BlogsDisplay = ({
  like,
  data,
  error,
  isLoading,
  emptyMessage,
}: BlogsDisplayProps) => {
  function stripHtml(html: string) {
    let doc = new DOMParser().parseFromString(html, "text/html");
    return doc.body.textContent || "";
  }
  return (
    <div className="my-6 min-h-[40vh] w-full bg-popover p-8 px-4 sm:px-8 lg:px-16 lg:py-16">
      {isLoading ? (
        <div className="flex h-[40vh] w-full items-center justify-center">
          <Spinner />
        </div>
      ) : error ? (
        <div className="flex h-[40vh] w-full items-center justify-center">
          <p>{error}</p>
        </div>
      ) : data.length === 0 ? (
        <div className="flex h-[40vh] w-full items-center justify-center">
          <p>{emptyMessage}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-x-6  gap-y-4 sm:grid-cols-2 md:gap-x-8 lg:grid-cols-4 lg:gap-x-12">
          {data.map((blog) => (
            <Link key={blog.couponId} href={`/admin/editblog/${blog.blogId}`}>
              <div className="flex cursor-pointer flex-col items-center gap-4 rounded-lg bg-accent p-4 dark:bg-background">
                {blog.thumbnail_url ? (
                  <Image
                    src={blog.thumbnail_url}
                    alt={blog.title}
                    width={400}
                    height={400}
                    className="size-28 rounded-full"
                  />
                ) : (
                  <div className="grid size-28 place-items-center rounded-full bg-popover">
                    <p className="text-muted-foreground">No Image</p>
                  </div>
                )}
                <Badge className="grid  w-20 place-items-center bg-blue-400/50 text-black hover:bg-blue-400/50 dark:text-slate-200">
                  {like}
                </Badge>
                <p>Title: {blog.title}</p>
                <p className="place-self-start text-sm text-muted-foreground">
                  Content:{" "}
                  {blog.content.length > 40
                    ? stripHtml(blog.content).slice(0, 40) + "..."
                    : stripHtml(blog.content)}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default BlogsDisplay;
