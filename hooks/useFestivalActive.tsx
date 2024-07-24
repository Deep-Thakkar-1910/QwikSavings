import { create } from "zustand";

//Define type of hook to be created
type ActiveFestivalStore = {
  isActive: boolean;
  onSetActive: () => void;
  onSetInactive: () => void;
};

//create a hook with these pro(perties
export const useActiveFestival = create<ActiveFestivalStore>((set) => ({
  isActive: true,
  onSetActive: () => set({ isActive: true }),
  onSetInactive: () => set({ isActive: false }),
}));
