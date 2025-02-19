import { OutlineCard } from "@/lib/types";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

type OutlineStore = {
  outlines: OutlineCard[];
  resetOutlines: () => void;
  addOutline: (outline: OutlineCard) => void;
  addMultipleoutlines: (outlines: OutlineCard[]) => void;
};

const useScratchStore = create<OutlineStore>()(
  devtools(
    persist(
      (set) => ({
        outlines: [],
        resetOutlines: () => {
          set({ outlines: [] });
        },
        addOutline: (outline: OutlineCard) => {
          set((state) => ({
            outlines: [...state.outlines, outline],
          }));
        },
        addMultipleoutlines: (outlines: OutlineCard[]) => {
          set(() => ({
            outlines: [...outlines],
          }));
        },
      }),
      { name: "scratch" }
    )
  )
);

export default useScratchStore;
