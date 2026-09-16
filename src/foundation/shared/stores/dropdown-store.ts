import { create } from "zustand";

interface DropdownCoordinatorStore {
  openId: string | null;
  open: (id: string) => void;
  close: (id: string) => void;
  toggle: (id: string) => void;
}

/**
 * Tracks which single dropdown (by id) is currently open, app-wide. Backs
 * `useDropdownToggle` — not meant to be used directly by components.
 */
export const useDropdownCoordinatorStore = create<DropdownCoordinatorStore>(
  (set) => ({
    openId: null,
    open: (id) => set({ openId: id }),
    close: (id) =>
      set((state) => (state.openId === id ? { openId: null } : state)),
    toggle: (id) =>
      set((state) => ({ openId: state.openId === id ? null : id })),
  })
);
