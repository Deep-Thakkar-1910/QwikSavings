import { useEffect } from "react";
import { ArrowRight, Gift, XIcon } from "lucide-react";
import Link from "next/link";
import { useActiveFestival } from "@/hooks/useFestivalActive";
import { cn } from "@/lib/utils";

const FestivalStrip: React.FC = () => {
  const { data, isActive, error, fetchActiveFestival, onSetInactive } =
    useActiveFestival((state) => state);

  useEffect(() => {
    fetchActiveFestival();
  }, [fetchActiveFestival]);

  if (error || !data) return null;

  return (
    <div
      className={cn(
        "fixed left-0 right-0 top-0 z-50 flex h-16 w-full items-center justify-center bg-black px-4 text-slate-200 transition-all duration-300 ease-in-out sm:px-4 md:px-6 xl:px-12",
        isActive ? "translate-y-0" : "-translate-y-full",
      )}
    >
      <div className="ml-auto flex w-full items-center justify-center gap-x-4">
        <Gift className="hover:animate-shake h-full w-8 py-2 text-app-main" />
        <p className="font-semibold first-letter:uppercase">
          {data.title} on the occasion of {data.name}
        </p>

        <Link
          href={`/stores/${data.store.name}`}
          className="flex items-center gap-x-1 underline"
        >
          Visit {data.store.name} <ArrowRight className="size-4" />
        </Link>
      </div>
      <XIcon onClick={onSetInactive} className="ml-auto cursor-pointer" />
    </div>
  );
};

export default FestivalStrip;
