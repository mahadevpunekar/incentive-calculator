"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";
import { ChevronDown } from "lucide-react";

import { BrandLogo } from "@/components/brand/brand-logo";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { navSections, type NavItem } from "@/lib/navigation";
import { cn } from "@/lib/utils";

function isItemActive(pathname: string, href: string) {
  return (
    pathname === href ||
    (href !== "/dashboard" && pathname.startsWith(`${href}/`))
  );
}

function sectionHasActive(pathname: string, items: NavItem[]) {
  return items.some((item) => isItemActive(pathname, item.href));
}

export function MobileSidebar({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const pathname = usePathname();

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

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="flex w-72 flex-col p-0">
        <SheetHeader className="gap-3 space-y-0 border-b p-4 text-left text-sidebar-foreground">
          <BrandLogo width={160} height={61} className="max-w-[160px]" />
          <div className="space-y-0.5 pt-1">
            <SheetTitle className="text-base text-sidebar-foreground">
              Menu
            </SheetTitle>
            <p className="text-xs font-normal text-sidebar-muted-foreground">
              Incentive workspace
            </p>
          </div>
        </SheetHeader>
        <ScrollArea className="flex-1">
          <nav className="flex flex-col gap-0.5 p-2">
            {navSections.map((section) => (
              <Collapsible
                key={section.id}
                open={openSections[section.id] ?? true}
                onOpenChange={(next) =>
                  setOpenSections((prev) => ({ ...prev, [section.id]: next }))
                }
                className="group/coll"
              >
                <CollapsibleTrigger
                  className={cn(
                    "flex w-full items-center gap-2 rounded-md py-2 pl-1 pr-2 text-left text-[10px] font-semibold uppercase tracking-wider text-sidebar-muted-foreground",
                    "outline-none transition-colors hover:text-primary/90"
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
                    {section.items.map((item) => {
                      const active = isItemActive(pathname, item.href);
                      const Icon = item.icon;
                      return (
                        <Button
                          key={item.href}
                          variant="ghost"
                          className={cn(
                            "justify-start gap-3",
                            active &&
                              "bg-primary/10 font-medium text-primary hover:bg-primary/15 hover:text-primary"
                          )}
                          asChild
                        >
                          <Link
                            href={item.href}
                            onClick={() => onOpenChange(false)}
                          >
                            <Icon className="h-4 w-4" />
                            {item.title}
                          </Link>
                        </Button>
                      );
                    })}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            ))}
          </nav>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
