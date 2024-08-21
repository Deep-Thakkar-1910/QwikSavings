"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import Spinner from "./Spinner";

interface DisplayItemsProps<
  T extends {
    storeId?: number;
    categoryId?: number;
    name: string;
    logo_url?: string;
    coupons: { type: string }[] | [];
  },
> {
  data: T[];
  isLoading: boolean;
  error: string | undefined;
  emptyMessage: string;
  onDelete?: (id: number) => Promise<void>;
}

const DisplayItems = <
  T extends {
    storeId?: number;
    categoryId?: number;
    name: string;
    logo_url?: string;
    coupons: { type: string }[] | [];
  },
>({
  data,
  isLoading,
  error,
  emptyMessage,
  onDelete,
}: DisplayItemsProps<T>) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<T | null>(null);
  const { data: session } = useSession();

  const groupByCharacter = (items: T[]) => {
    return items.reduce((acc: Record<string, T[]>, item) => {
      const char = item.name[0].toUpperCase();
      if (!acc[char]) {
        acc[char] = [];
      }
      acc[char].push(item);
      return acc;
    }, {});
  };

  const sortedData = data.sort((a, b) => a.name.localeCompare(b.name));
  const groupedData = groupByCharacter(sortedData);

  const handleDeleteClick = (item: T) => {
    setItemToDelete(item);
    setIsDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (onDelete && itemToDelete) {
      try {
        await onDelete(itemToDelete.storeId ?? itemToDelete.categoryId!);
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
    <div className="mb-6 min-h-[40vh] w-full px-8 py-4 lg:px-12">
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
        Object.keys(groupedData).map((char) => (
          <div key={char} className="my-4 first:mt-0 last:mb-0">
            <div className="w-full border border-muted-foreground px-2 pb-3 pt-2 sm:px-4">
              <h2 className="mb-2 text-2xl sm:text-3xl">{char}</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-3">
                {groupedData[char].map((item) => (
                  <div
                    key={item.storeId ?? item.categoryId}
                    className="group relative flex max-w-80 cursor-pointer flex-col items-center rounded-lg border bg-gray-100 p-3 shadow-md transition-transform duration-300 ease-linear dark:bg-app-dark-navbar sm:max-w-full sm:hover:scale-105 lg:max-w-full"
                  >
                    <div className="flex w-full items-center justify-between gap-x-3">
                      <Link
                        href={`${item.storeId ? `/stores/${item.name}` : `/categories/${item.name}`}`}
                        className="flex flex-grow items-center gap-x-3"
                      >
                        <div className="flex flex-col">
                          <p className="text-sm tracking-wide transition-colors duration-300 ease-linear lg:text-base">
                            {item.name}
                          </p>
                        </div>
                      </Link>
                      <div className="flex-shrink-0 rounded-lg bg-white p-1 dark:border-white dark:bg-black">
                        <Image
                          src={
                            item.logo_url ??
                            "https://via.placeholder.com/600x400"
                          }
                          alt={item.name}
                          width={400}
                          height={400}
                          className="aspect-square w-20 rounded-full object-cover transition-shadow duration-300 ease-linear group-hover:shadow-md"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="w-11/12 max-w-96">
          <DialogHeader>
            <DialogTitle>
              Are you sure you want to delete this item?
            </DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete the{" "}
              {itemToDelete?.storeId ? "store" : "category"}{" "}
              {itemToDelete?.name} and remove all associated data.
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

export default DisplayItems;
