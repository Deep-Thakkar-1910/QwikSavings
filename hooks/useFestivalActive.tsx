import axios from "@/app/api/axios/axios";
import { create } from "zustand";

type Festival = {
  festivalId: number;
  name: string;
  title: string;
  activated: boolean;
  store: {
    slug: string;
  };
};

type ActiveFestivalStore = {
  data: Festival | null;
  isActive: boolean;
  error: string | null;
  fetchActiveFestival: () => Promise<void>;
  onSetInactive: () => void;
};

export const useActiveFestival = create<ActiveFestivalStore>((set) => ({
  data: null,
  isActive: false,
  error: null,
  fetchActiveFestival: async () => {
    set({ error: null });
    try {
      const response = await axios.get("/getactivefestival");
      if (response.data.success) {
        set({
          data: response.data.activeFestival,
          isActive: response.data.activeFestival !== null,
        });
      }
    } catch (error) {
      console.error("Error fetching active festival:", error);
      set({
        error: "An error occurred while fetching the active festival",
      });
    }
  },
  onSetInactive: () => set({ isActive: false }),
}));
