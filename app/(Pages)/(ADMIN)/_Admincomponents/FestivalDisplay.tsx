import { Badge } from "@/components/ui/badge";
import Spinner from "../../_PageComponents/Spinner";
// import { format } from "date-fns";
import { MinusCircle, Trash2, Verified } from "lucide-react";
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
import axios from "@/app/api/axios/axios";
import { toast } from "@/components/ui/use-toast";
import { AxiosError } from "axios";

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
  const [isActivateDialogOpen, setIsActivateDialogOpen] =
    useState<boolean>(false);
  const [isDeactivateDialogOpen, setIsDeactivateDialogOpen] =
    useState<boolean>(false);
  const [itemToDelete, setItemToDelete] = useState<Record<string, any> | null>(
    null,
  );
  const [festivalToActivate, setFestivalToActivate] = useState<number | null>(
    null,
  );
  const [festivalToDeactivate, setFestivalToDeactivate] = useState<
    number | null
  >(null);
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

  const handleConfirmActivate = async () => {
    if (festivalToActivate) {
      try {
        const response = await axios.put(
          `/activatefestival/${festivalToActivate}`,
        );
        if (response.data.success) {
          toast({
            title: "Success",
            description: "Festival Activated",
          });
        }
        setIsActivateDialogOpen(false);
        setFestivalToActivate(null);
      } catch (error) {
        console.error("Error activating item:", error);
        setIsActivateDialogOpen(false);
        setFestivalToActivate(null);
        if (error instanceof AxiosError) {
          toast({
            title: "Oops!",
            description: error?.response?.data?.error,
            variant: "destructive",
          });
        }
        toast({
          title: "Error",
          description: "Failed to activate the festival. Please try again.",
          variant: "destructive",
        });
      }
    }
  };
  const handleConfirmDeactivate = async () => {
    if (festivalToDeactivate) {
      try {
        const response = await axios.put(
          `/deactivatefestival/${festivalToDeactivate}`,
        );
        if (response.data.success) {
          toast({
            title: "Success",
            description: "Festival Deactivated",
          });
        }
        setIsDeactivateDialogOpen(false);
        setFestivalToDeactivate(null);
      } catch (error) {
        console.error("Error activating item:", error);
        setIsDeactivateDialogOpen(false);
        setFestivalToDeactivate(null);
        if (error instanceof AxiosError) {
          toast({
            title: "Oops!",
            description: error?.response?.data?.error,
            variant: "destructive",
          });
        }
        toast({
          title: "Error",
          description: "Failed to activate the festival. Please try again.",
          variant: "destructive",
        });
      }
    }
  };
  return (
    <div className="my-6 min-h-[40vh] w-full bg-popover p-8 px-4 sm:px-8 lg:px-12 lg:py-16">
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
              <div className="mb-2 mt-4 flex w-full items-center justify-center gap-x-4">
                <Badge className="grid w-20 place-items-center bg-purple-700/50 text-white hover:bg-purple-700/50 ">
                  Festival
                </Badge>
                <Badge
                  className={`grid w-20 place-items-center text-white ${festival.isActive ? "bg-emerald-500 hover:bg-emerald-500" : "bg-app-main hover:bg-app-main"}`}
                >
                  {festival.activated ? "Active" : "Inactive"}
                </Badge>
              </div>
              <p>Name: {festival.name}</p>
              <p>Title: {festival.title}</p>
              <p>Store: {like}</p>
              <Trash2
                className="absolute right-2 top-2 size-4 cursor-pointer text-app-main"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteClick(festival);
                }}
              />
              <div className="flex space-x-4">
                <span
                  className="flex items-center gap-x-1 text-emerald-500"
                  onClick={(e) => {
                    e.stopPropagation();
                    setFestivalToActivate(festival.festivalId);
                    setIsActivateDialogOpen(true);
                  }}
                >
                  <Verified className="size-4" />
                  Activate
                </span>
                <span
                  className="flex items-center gap-x-1 text-app-main"
                  onClick={(e) => {
                    e.stopPropagation();
                    setFestivalToDeactivate(festival.festivalId);
                    setIsDeactivateDialogOpen(true);
                  }}
                >
                  <MinusCircle className="size-4" />
                  Deactivate
                </span>
              </div>
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

      {/* Festival Activate Dialog */}
      <Dialog
        open={isActivateDialogOpen}
        onOpenChange={setIsActivateDialogOpen}
      >
        <DialogContent className="w-11/12 max-w-96">
          <DialogHeader>
            <DialogTitle>
              Are you sure you want to Activate this festival?
            </DialogTitle>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              className="my-4 border-app-main sm:mx-2 sm:my-0"
              onClick={() => setIsActivateDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button className="bg-app-main" onClick={handleConfirmActivate}>
              Activate
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Festival Deactivate Dialog */}
      <Dialog
        open={isDeactivateDialogOpen}
        onOpenChange={setIsDeactivateDialogOpen}
      >
        <DialogContent className="w-11/12 max-w-96">
          <DialogHeader>
            <DialogTitle>
              Are you sure you want to Deactivate this festival?
            </DialogTitle>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              className="my-4 border-app-main sm:mx-2 sm:my-0"
              onClick={() => setIsDeactivateDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button className="bg-app-main" onClick={handleConfirmDeactivate}>
              Deactivate
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FestivalDisplay;
