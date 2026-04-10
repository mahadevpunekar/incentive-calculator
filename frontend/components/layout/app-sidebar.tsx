"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";
import { ChevronDown, ChevronLeft, ChevronRight, PanelLeft } from "lucide-react";

import { BrandLogo } from "@/components/brand/brand-logo";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { navSections, type NavItem } from "@/lib/navigation";
import { cn } from "@/lib/utils";
import { useUiStore } from "@/stores/ui-store";

function isItemActive(pathname: string, href: string) {
  return (
    pathname === href ||
    (href !== "/dashboard" && pathname.startsWith(`${href}/`))
  );
}

function sectionHasActive(pathname: string, items: NavItem[]) {
  return items.some((item) => isItemActive(pathname, item.href));
}

export function AppSidebar({ className }: { className?: string }) {
  const pathname = usePathname();
  const collapsed = useUiStore((s) => s.sidebarCollapsed);
  const toggleSidebar = useUiStore((s) => s.toggleSidebar);

  const [openSections, setOpenSections] = React.useState<Record<string, boolean>>(
    () =>
      Object.fromEntries(navSections.map((s) => [s.id, true])) as Record<
        string,
        boolean
      >
  );

  React.useEffect(() => {
    setOpenSections((prev) => {
      const next = { ...prev };
      for (const section of navSections) {
        if (sectionHasActive(pathname, section.items)) {
          next[section.id] = true;
        }
      }
      return next;
    });
  }, [pathname]);

  const renderNavLink = (item: NavItem) => {
    const active = isItemActive(pathname, item.href);
    const Icon = item.icon;
    const link = (
      <Link
        key={item.href}
        href={item.href}
        className={cn(
          "flex items-center gap-3 rounded-md border-l-[3px] py-2.5 text-sm font-medium transition-all duration-150 ease-out",
          collapsed ? "justify-center px-0" : "pl-2.5 pr-2",
          active
            ? "border-primary bg-primary/10 text-primary shadow-sm dark:bg-primary/20 dark:text-primary dark:border-primary"
            : "border-transparent text-sidebar-muted-foreground hover:bg-sidebar-accent hover:text-primary/90 dark:hover:bg-sidebar-accent/80 dark:hover:text-primary",
          collapsed &&
            active &&
            "border-transparent bg-primary/12 text-primary ring-1 ring-inset ring-primary/30 dark:bg-primary/25 dark:text-primary"
        )}
      >
        <Icon className="h-4 w-4 shrink-0" aria-hidden />
        {!collapsed ? <span className="truncate">{item.title}</span> : null}
      </Link>
    );

    if (collapsed) {
      return (
        <Tooltip key={item.href}>
          <TooltipTrigger asChild>{link}</TooltipTrigger>
          <TooltipContent side="right">{item.title}</TooltipContent>
        </Tooltip>
      );
    }
    return link;
  };

  return (
    <aside
      className={cn(
        "hidden h-full min-h-0 shrink-0 border-r border-sidebar-border bg-white text-sidebar-foreground transition-[width] duration-200 ease-out dark:bg-sidebar dark:text-sidebar-foreground lg:flex lg:flex-col",
        collapsed ? "lg:w-[72px]" : "lg:w-60",
        className
      )}
    >
      <div
        className={cn(
          "flex shrink-0 flex-col border-b border-sidebar-border bg-white px-3 py-2.5 dark:bg-sidebar",
          collapsed && "items-center gap-2 py-2.5 px-2"
        )}
      >
        {collapsed ? (
          <>
            <Link
              href="/dashboard"
              className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border/60 bg-white shadow-sm transition-opacity hover:opacity-90 dark:bg-card/80"
              aria-label="Dhofar Insurance — Home"
            >
              <BrandLogo
                width={200}
                height={77}
                className="h-8 min-w-[200px] -translate-x-px object-left object-cover"
              />
            </Link>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 shrink-0 text-sidebar-muted-foreground transition-colors duration-150"
                  onClick={toggleSidebar}
                  aria-label="Expand sidebar"
                >
                  <PanelLeft className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">Expand</TooltipContent>
            </Tooltip>
          </>
        ) : (
          <>
            <div className="flex items-start justify-between gap-2">
              <Link
                href="/dashboard"
                className="flex min-w-0 flex-1 items-center overflow-hidden rounded-lg border border-border/60 bg-white px-2.5 py-2 shadow-sm transition-opacity hover:opacity-90 dark:bg-card/80"
                aria-label="Dhofar Insurance — Home"
              >
                <BrandLogo
                  width={200}
                  height={77}
                  className="h-11 w-auto max-w-full object-contain object-left"
                />
              </Link>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="mt-0.5 h-8 w-8 shrink-0 text-sidebar-muted-foreground transition-colors duration-150"
                    onClick={toggleSidebar}
                    aria-label="Collapse sidebar"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">Collapse</TooltipContent>
              </Tooltip>
            </div>
            <p className="mt-2 text-xs font-medium leading-snug text-sidebar-muted-foreground">
              Incentive workspace
            </p>
          </>
        )}
      </div>

      <nav className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden overscroll-contain bg-white py-2 px-2 dark:bg-sidebar">
        {collapsed ? (
          <div className="flex flex-col gap-0">
            {navSections.map((section, si) => (
              <div key={section.id}>
                {si > 0 ? (
                  <div className="mx-1 my-2 h-px bg-sidebar-border" aria-hidden />
                ) : null}
                <div className="grid gap-1">
                  {section.items.map((item) => renderNavLink(item))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-0.5">
            {navSections.map((section) => (
              <Collapsible
                key={section.id}
                open={openSections[section.id] ?? true}
                onOpenChange={(open) =>
                  setOpenSections((prev) => ({ ...prev, [section.id]: open }))
                }
                className="group/coll"
              >
                <CollapsibleTrigger
                  className={cn(
                    "flex w-full items-center gap-2 rounded-md py-2 pl-1 pr-2 text-left text-[10px] font-semibold uppercase tracking-wider text-sidebar-muted-foreground",
                    "outline-none transition-colors hover:text-primary/90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-sidebar"
                  )}
                >
                  <ChevronDown
                    className="h-3.5 w-3.5 shrink-0 text-muted-foreground transition-transform duration-200 group-data-[state=closed]/coll:-rotate-90"
                    aria-hidden
                  />
                  <span className="truncate">{section.title}</span>
                </CollapsibleTrigger>
                <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
                  <div className="grid gap-0.5 pb-2 pt-0.5">
                    {section.items.map((item) => renderNavLink(item))}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            ))}
          </div>
        )}
      </nav>

      <div className="shrink-0 border-t border-sidebar-border bg-white p-2 dark:bg-sidebar">
        {!collapsed ? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="w-full justify-start gap-2 transition-colors duration-150"
            onClick={toggleSidebar}
          >
            <ChevronRight className="h-4 w-4" />
            Collapse
          </Button>
        ) : null}
      </div>
    </aside>
  );
}
