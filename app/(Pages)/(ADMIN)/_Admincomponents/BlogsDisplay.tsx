import { Badge } from "@/components/ui/badge";
import Spinner from "../../_PageComponents/Spinner";
import { format } from "date-fns";
import Image from "next/image";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface BlogsDisplayProps {
  like: string | null;
  data: Record<string, any>[];
  isLoading: boolean;
  error: string | undefined;
  emptyMessage: string | undefined;
  onDelete: (id: number) => Promise<void>;
}

const BlogsDisplay = ({
  like,
  data,
  error,
  isLoading,
  emptyMessage,
  onDelete,
}: BlogsDisplayProps) => {
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [itemToDelete, setItemToDelete] = useState<Record<string, any> | null>(
    null,
  );

  function stripHtml(html: string) {
    let doc = new DOMParser().parseFromString(html, "text/html");
    return doc.body.textContent || "";
  }

  const handleDeleteClick = (item: Record<string, any>) => {
    setItemToDelete(item);
    setIsDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (itemToDelete) {
      try {
        await onDelete(itemToDelete.blogId);
        setIsDialogOpen(false);
        setItemToDelete(null);
      } catch (error) {
        console.error("Error deleting item:", error);
        setIsDialogOpen(false);
        setItemToDelete(null);
      }
    }
  };

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
            <div
              key={blog.couponId}
              className="relative flex cursor-pointer flex-col items-center gap-4 rounded-lg bg-accent p-4 dark:bg-background"
              onClick={() => {
                router.push(`/admin/editblog/${blog.blogId}`);
              }}
            >
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
              <p className="place-self-start">Title: {blog.title}</p>
              <p className="place-self-start">
                Created At: {format(blog.createdAt, "dd-MMM-yyy")}
              </p>
              <p className="place-self-start">
                Updated At: {format(blog.updatedAt, "dd-MMM-yyy")}
              </p>
              <p className="place-self-start text-muted-foreground">
                Content:{" "}
                {blog.content.length > 40
                  ? stripHtml(blog.content).slice(0, 40) + "..."
                  : stripHtml(blog.content)}
              </p>
              <Trash2
                className="absolute right-2 top-2 size-4 cursor-pointer text-app-main "
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteClick(blog);
                }}
              />
            </div>
          ))}
        </div>
      )}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="w-11/12 max-w-96">
          <DialogHeader>
            <DialogTitle>
              Are you sure you want to delete this item?
            </DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete the
              Blog.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              className="my-4 border-app-main sm:mx-2 sm:my-0"
              onClick={() => setIsDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button className="bg-app-main" onClick={handleConfirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BlogsDisplay;
