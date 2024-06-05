// DisplayItems.tsx
import Image from "next/image";
import Spinner from "./Spinner";

interface DisplayItemsProps<
  T extends {
    storeId?: number;
    categoryId?: number;
    name: string;
    logo_url?: string;
  },
> {
  data: T[];
  isLoading: boolean;
  error: string | undefined;
  emptyMessage: string;
}

const DisplayItems = <
  T extends {
    storeId?: number;
    categoryId?: number;
    name: string;
    logo_url?: string;
  },
>({
  data,
  isLoading,
  error,
  emptyMessage,
}: DisplayItemsProps<T>) => {
  return (
    <div className="mt-6 min-h-[40vh] w-full bg-popover p-8 lg:px-16 lg:py-16">
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
              key={item.storeId || item.categoryId}
              className="group flex max-h-28 max-w-xs flex-col items-center rounded-md border p-4 transition-transform duration-300 ease-linear hover:scale-105"
            >
              <div className="flex h-28 w-full min-w-64 items-center justify-start gap-x-4">
                <Image
                  src={item.logo_url ?? "https://via.placeholder.com/600x400"}
                  alt={item.name}
                  width={400}
                  height={400}
                  className="h-20 w-20 rounded-full object-cover transition-shadow duration-300 ease-linear group-hover:shadow-md"
                />
                <p className="transition-colors duration-300 ease-linear group-hover:text-app-main">
                  {item.name}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DisplayItems;
