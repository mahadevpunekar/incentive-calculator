"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { BrandLogo } from "@/components/brand/brand-logo";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { mainNav } from "@/lib/navigation";
import { cn } from "@/lib/utils";

export function MobileSidebar({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const pathname = usePathname();

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-72 p-0 flex flex-col">
        <SheetHeader className="gap-3 border-b p-4 text-left space-y-0 text-sidebar-foreground">
          <BrandLogo width={160} height={61} className="max-w-[160px]" />
          <div className="space-y-0.5 pt-1">
            <SheetTitle className="text-base text-sidebar-foreground">Menu</SheetTitle>
            <p className="text-xs font-normal text-sidebar-muted-foreground">
              Incentive workspace
            </p>
          </div>
        </SheetHeader>
        <ScrollArea className="flex-1">
          <nav className="grid gap-1 p-2">
            {mainNav.map((item) => {
              const active = pathname === item.href;
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
                  <Link href={item.href} onClick={() => onOpenChange(false)}>
                    <Icon className="h-4 w-4" />
                    {item.title}
                  </Link>
                </Button>
              );
            })}
          </nav>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
