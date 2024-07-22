import { useRouter } from "next/navigation";
import Spinner from "../../_PageComponents/Spinner";
import Image from "next/image";
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
import { Trash2 } from "lucide-react";
interface DisplayEventProps {
  data: Record<string, any>[];
  isLoading: boolean;
  error: string | null;
  emptyMessage: string;
  onDelete: (id: number) => Promise<void>;
}
const DisplayEvents = ({
  data,
  isLoading,
  emptyMessage,
  error,
  onDelete,
}: DisplayEventProps) => {
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [itemToDelete, setItemToDelete] = useState<Record<string, any> | null>(
    null,
  );

  const handleDeleteClick = (item: Record<string, any>) => {
    setItemToDelete(item);
    setIsDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (itemToDelete) {
      try {
        await onDelete(itemToDelete.eventId);
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
    <div className="my-6 min-h-[40vh] w-full bg-popover p-8 lg:px-16 lg:py-16">
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
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-4 md:gap-x-8 lg:justify-start lg:gap-x-12">
          {data.map((item) => (
            <div
              key={item.eventId}
              className="group relative flex max-h-28 max-w-xs cursor-pointer flex-col items-center rounded-md border p-4 transition-transform duration-300 ease-linear hover:scale-105"
              onClick={() => router.push(`/events/${item.name}`)}
            >
              <div className="flex h-28 w-full min-w-64 items-center justify-start gap-x-4">
                <Image
                  src={item.logo_url ?? "https://via.placeholder.com/600x400"}
                  alt={item.name}
                  width={400}
                  height={400}
                  className="h-20 w-20 rounded-full object-cover transition-shadow duration-300 ease-linear group-hover:shadow-md"
                />
                <div className="flex flex-col items-start gap-y-2">
                  <p className="tracking-wide transition-colors duration-300 ease-linear group-hover:text-app-main">
                    {item.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <span>
                      {item.coupons?.filter(
                        (coupon: any) => coupon.type === "Deal",
                      ).length ?? 0}{" "}
                      Deals
                    </span>{" "}
                    |{" "}
                    <span>
                      {item.coupons?.filter(
                        (coupon: any) => coupon.type === "Coupon",
                      ).length ?? 0}{" "}
                      Coupons
                    </span>
                  </p>
                </div>
              </div>
              <Trash2
                className="absolute right-2 top-2 size-4 cursor-pointer text-app-main"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteClick(item);
                }}
              />
            </div>
          ))}
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="w-11/12 max-w-96">
              <DialogHeader>
                <DialogTitle>
                  Are you sure you want to delete this item?
                </DialogTitle>
                <DialogDescription>
                  This action cannot be undone. This will permanently delete the
                  Event and remove all associated data.
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
      )}
    </div>
  );
};

export default DisplayEvents;
