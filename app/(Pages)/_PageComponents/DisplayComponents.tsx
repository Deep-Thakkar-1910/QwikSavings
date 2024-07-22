"use client";
import Image from "next/image";
import Spinner from "./Spinner";
import Link from "next/link";
import React, { useState } from "react";
import { Trash2 } from "lucide-react";
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
  onDelete: (id: number) => Promise<void>;
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
  // Function to group items by their starting character
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

  // Sort the data alphabetically by name
  const sortedData = data.sort((a, b) => a.name.localeCompare(b.name));

  // Group the sorted data by their starting character
  const groupedData = groupByCharacter(sortedData);

  const handleDeleteClick = (item: T) => {
    setItemToDelete(item);
    setIsDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (itemToDelete) {
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
        Object.keys(groupedData).map((char) => (
          <div key={char} className="my-4">
            <h2 className="mb-2 text-xl font-bold">{char}</h2>
            <div className="w-full border-0 border-muted-foreground sm:border-2 sm:p-4">
              <div className="grid grid-cols-1 place-items-center gap-x-6 gap-y-4 md:grid-cols-2 md:place-items-start md:gap-x-8 lg:grid-cols-3 lg:gap-x-12 xl:grid-cols-4">
                {groupedData[char].map((item) => (
                  <div
                    key={item.storeId ?? item.categoryId}
                    className="group relative flex max-h-28 max-w-xs cursor-pointer flex-col items-center rounded-md border p-4 transition-transform duration-300 ease-linear hover:scale-105"
                  >
                    <div className="flex h-28 w-full min-w-64 items-center justify-start gap-x-4">
                      <Link
                        href={`${item.storeId ? `/stores/${item.name}` : `/categories/${item.name}`}`}
                        className="flex-grow"
                      >
                        <div className="flex items-center gap-x-4">
                          <Image
                            src={
                              item.logo_url ??
                              "https://via.placeholder.com/600x400"
                            }
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
                                {
                                  item.coupons.filter(
                                    (coupon) => coupon.type === "Deal",
                                  ).length
                                }{" "}
                                Deals
                              </span>{" "}
                              |{" "}
                              <span>
                                {
                                  item.coupons.filter(
                                    (coupon) => coupon.type === "Coupon",
                                  ).length
                                }{" "}
                                Coupons
                              </span>
                            </p>
                          </div>
                        </div>
                      </Link>
                      {session?.user?.role === "admin" && (
                        <Trash2
                          className="absolute right-2 top-2 size-4 cursor-pointer text-app-main "
                          onClick={() => handleDeleteClick(item)}
                        />
                      )}
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
              {itemToDelete?.storeId ? "store" : "category"}
              {itemToDelete?.name}" and remove all associated data.
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
