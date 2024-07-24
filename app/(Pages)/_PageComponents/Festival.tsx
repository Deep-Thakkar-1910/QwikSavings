import { useActiveFestival } from "@/hooks/useFestivalActive";
import { XIcon } from "lucide-react";

const FestivalStrip = () => {
  const isActive = useActiveFestival((state) => state.isActive);
  const onSetActive = useActiveFestival((state) => state.onSetActive);
  const onSetInactive = useActiveFestival((state) => state.onSetInactive);
  return (
    <div className="flex h-16 w-full items-center justify-center bg-black px-4 text-slate-200 dark:bg-app-main sm:px-4 md:px-6  xl:px-12 ">
      <div className="flex items-center justify-center gap-x-4 place-self-center">
        <p>Festival</p>
      </div>
      <XIcon onClick={onSetInactive} className="ml-auto cursor-pointer" />
    </div>
  );
};

export default FestivalStrip;
