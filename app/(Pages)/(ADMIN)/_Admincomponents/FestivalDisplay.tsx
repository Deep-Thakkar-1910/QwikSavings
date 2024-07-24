import { Badge } from "@/components/ui/badge";
import Spinner from "../../_PageComponents/Spinner";
// import { format } from "date-fns";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface FestivalDisplayProps {
  like: string | null;
  data: Record<string, any>[];
  isLoading: boolean;
  error: string | undefined;
  emptyMessage: string | undefined;
  onDelete: (id: number) => Promise<void>;
}

const FestivalDisplay = ({
  like,
  data,
  error,
  isLoading,
  emptyMessage,
  onDelete,
}: FestivalDisplayProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [itemToDelete, setItemToDelete] = useState<Record<string, any> | null>(
    null,
  );
  const router = useRouter();

  const handleDeleteClick = (item: Record<string, any>) => {
    setItemToDelete(item);
    setIsDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (itemToDelete) {
      try {
        await onDelete(itemToDelete.festivalId);
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
      ) : data?.length === 0 ? (
        <div className="flex h-[40vh] w-full items-center justify-center">
          <p>{emptyMessage}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2 md:gap-x-8 lg:grid-cols-4 lg:gap-x-12">
          {data.map((festival) => (
            <div
              className="relative flex cursor-pointer flex-col items-center gap-4 rounded-lg bg-accent p-4 dark:bg-background"
              key={festival.festivalId}
              onClick={() => {
                router.push(`/admin/editfestival/${festival.festivalId}`);
              }}
            >
              <div className="my-2 flex w-full items-center justify-center gap-x-4">
                <Badge className="grid w-20 place-items-center bg-purple-400/50 text-black hover:bg-purple-400/50 dark:text-slate-200">
                  Festival
                </Badge>
                {/* <Badge
                  className={`grid w-20 place-items-center text-black dark:text-slate-200 ${
                    new Date(festival.end_date).getTime() > new Date().getTime()
                      ? "bg-emerald-500"
                      : "bg-app-main"
                  }`}
                >
                  {new Date(festival.end_date).getTime() > new Date().getTime()
                    ? "Active"
                    : "Ended"}
                </Badge> */}
              </div>
              <p>Name: {festival.name}</p>
              <p>Title: {festival.title}</p>
              <p>Store: {like}</p>
              {/* <p>
                Start Date:{" "}
                {format(new Date(festival.start_date), "dd-MMM-yyyy")}
              </p>
              <p>
                End Date: {format(new Date(festival.end_date), "dd-MMM-yyyy")}
              </p> */}
              <Trash2
                className="absolute right-2 top-2 size-4 cursor-pointer text-app-main"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteClick(festival);
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
              Are you sure you want to delete this festival?
            </DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete the
              Festival.
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

export default FestivalDisplay;
