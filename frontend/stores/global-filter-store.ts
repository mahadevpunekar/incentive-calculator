import { create } from "zustand";
import { DateRange } from "react-day-picker";

export type GlobalFilterState = {
  channel: string;
  region: string;
  branch: string;
  staff: string;
  product: string;
  /** `all` or short month e.g. `Apr` */
  month: string;
  dateRange: DateRange | undefined;
};

const defaults: GlobalFilterState = {
  channel: "All",
  region: "All",
  branch: "All",
  staff: "All",
  product: "All",
  month: "all",
  dateRange: undefined,
};

type Store = {
  filters: GlobalFilterState;
  setFilters: (patch: Partial<GlobalFilterState>) => void;
  resetFilters: () => void;
};

export const useGlobalFilterStore = create<Store>((set) => ({
  filters: defaults,
  setFilters: (patch) =>
    set((s) => ({ filters: { ...s.filters, ...patch } })),
  resetFilters: () => set({ filters: defaults }),
}));
