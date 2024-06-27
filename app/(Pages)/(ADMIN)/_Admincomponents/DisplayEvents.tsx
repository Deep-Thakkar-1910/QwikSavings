import Link from "next/link";
import Spinner from "../../_PageComponents/Spinner";
import Image from "next/image";

interface DisplayEventProps {
  data: Record<string, any>[];
  isLoading: boolean;
  error: string | null;
  emptyMessage: string;
}
const DisplayEvents = ({
  data,
  isLoading,
  emptyMessage,
  error,
}: DisplayEventProps) => {
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
            <Link key={item.eventId} href={`/events/${item.name}`}>
              <div className="group flex max-h-28 max-w-xs cursor-pointer flex-col items-center rounded-md border p-4 transition-transform duration-300 ease-linear hover:scale-105">
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
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default DisplayEvents;
