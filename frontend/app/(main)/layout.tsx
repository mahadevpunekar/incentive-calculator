import { Suspense, type ReactNode } from "react";

import { AppHeader } from "@/components/layout/app-header";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { GlobalFiltersBar } from "@/components/layout/global-filters-bar";

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <div className="app-shell flex w-full min-h-0 overflow-hidden bg-background">
      <AppSidebar />
      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        <AppHeader />
        <Suspense
          fallback={
            <div
              className="shrink-0 min-h-[48px] border-b border-border/40 bg-card/50"
              aria-hidden
            />
          }
        >
          <GlobalFiltersBar />
        </Suspense>
        <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden overscroll-y-contain bg-[hsl(210_20%_97.5%)] dark:bg-muted/20">
          {children}
        </main>
      </div>
    </div>
  );
}
