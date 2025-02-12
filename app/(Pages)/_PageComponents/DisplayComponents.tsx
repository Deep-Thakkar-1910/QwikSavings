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
import { usePathname } from "next/navigation";
import { constructS3Url } from "@/lib/utilities/AwsConfig";

interface DisplayItemsProps<
  T extends {
    storeId?: number;
    categoryId?: number;
    name: string;
    slug: string;
    logo_url?: string;
    coupons: { type: string }[] | [];
  },
> {
  data: T[];
  isLoading: boolean;
  error: string | undefined;
  emptyMessage: string;
  onDelete?: (id: number, logo_url?: string | undefined) => Promise<void>;
}

const DisplayItems = <
  T extends {
    storeId?: number;
    categoryId?: number;
    name: string;
    slug: string;
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
  const isAdminPath = usePathname().includes("/admin");
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
        await onDelete(
          itemToDelete.storeId ?? itemToDelete.categoryId!,
          itemToDelete.logo_url,
        );
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
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                {groupedData[char].map((item) => (
                  <div
                    key={item.storeId ?? item.categoryId}
                    className="group relative flex max-w-80 cursor-pointer flex-col items-center rounded-lg border bg-gray-300/70 p-3 shadow-md transition-transform duration-300 ease-linear sm:max-w-full sm:hover:scale-105 lg:max-w-full"
                  >
                    <div className="flex w-full items-center justify-start gap-x-3 ">
                      <Link
                        href={`${item.storeId
                          ? isAdminPath
                            ? `/admin/editstore/${item.slug}`
                            : `/store/${item.slug}`
                          : isAdminPath
                            ? `/admin/editcategory/${item.slug}`
                            : `/categories/${item.slug}`
                          }`}
                        className="flex flex-grow items-center gap-x-3"
                      >
                        <div className="rounded-full border border-black bg-white p-1">
                          <Image
                            src={
                              constructS3Url(item.logo_url) ??
                              "https://via.placeholder.com/600x400"
                            }
                            alt={item.name}
                            width={400}
                            height={400}
                            className="aspect-square w-16 rounded-full object-cover transition-shadow duration-300 ease-linear group-hover:shadow-md"
                          />
                        </div>
                        <div className="flex flex-col items-start gap-y-1">
                          <p className="text-sm tracking-normal transition-colors duration-300 ease-linear sm:text-base">
                            {item.name}
                          </p>
                          <p className="text-xs font-semibold text-muted-foreground sm:text-sm">
                            <span>
                              {
                                item.coupons.filter(
                                  (coupon) => coupon.type === "Deal",
                                ).length
                              }{" "}
                              Deals
                            </span>
                            {" | "}
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
                      </Link>
                      {session?.user?.role === "admin" && isAdminPath && (
                        <Trash2
                          className="absolute right-2 top-2 size-4 cursor-pointer text-app-main"
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
