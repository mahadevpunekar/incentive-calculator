import { create } from "zustand";

type UiState = {
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
  toggleSidebar: () => void;
  openSections: Record<string, boolean>;
  setSectionOpen: (id: string, open: boolean) => void;
};

export const useUiStore = create<UiState>((set) => ({
  sidebarCollapsed: false,
  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
  toggleSidebar: () =>
    set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
  openSections: {},
  setSectionOpen: (id, open) =>
    set((s) => ({
      openSections: { ...s.openSections, [id]: open },
    })),
}));
