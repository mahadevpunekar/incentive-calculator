"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, Menu, Search } from "lucide-react";

import { ThemeToggle } from "@/components/layout/theme-toggle";
import { MobileSidebar } from "@/components/layout/mobile-sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { mockUser } from "@/lib/mock-api/data";
import { cn } from "@/lib/utils";

function initials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function headerCrumbs(pathname: string): { kicker: string; title: string } {
  const routes: { prefix: string; kicker: string; title: string }[] = [
    {
      prefix: "/dashboard",
      kicker: "Executive view",
      title: "Consolidated incentive book",
    },
    { prefix: "/calculator", kicker: "Tools", title: "Incentive calculator" },
    { prefix: "/performance", kicker: "Analytics", title: "Performance" },
    { prefix: "/leaderboard", kicker: "People", title: "Leaderboard" },
    { prefix: "/breakdown", kicker: "Analytics", title: "Breakdown" },
    { prefix: "/simulation", kicker: "Tools", title: "Simulation" },
    { prefix: "/workflow", kicker: "Governance", title: "Approval workflow" },
    {
      prefix: "/commission-rules",
      kicker: "Policy",
      title: "Commission rule engine",
    },
    { prefix: "/audit", kicker: "Compliance", title: "Audit trail" },
    { prefix: "/notifications", kicker: "Engagement", title: "Notifications" },
    { prefix: "/analytics", kicker: "Analytics", title: "Product & channel" },
    { prefix: "/rule-engine", kicker: "Policy", title: "Rule engine" },
    { prefix: "/data-quality", kicker: "Quality", title: "Data validation" },
    { prefix: "/targets", kicker: "Planning", title: "Targets" },
    { prefix: "/profile", kicker: "Account", title: "Profile" },
    { prefix: "/integrations", kicker: "Admin", title: "Integrations" },
    { prefix: "/admin", kicker: "Admin", title: "Administration" },
    { prefix: "/reports", kicker: "Reporting", title: "Reports" },
  ];
  const hit = routes.find(
    (r) => pathname === r.prefix || pathname.startsWith(`${r.prefix}/`)
  );
  if (hit) return { kicker: hit.kicker, title: hit.title };
  return { kicker: "Workspace", title: "Incentive workspace" };
}

export function AppHeader({ className }: { className?: string }) {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const pathname = usePathname();
  const { kicker, title } = headerCrumbs(pathname ?? "");

  return (
    <>
      <MobileSidebar open={mobileOpen} onOpenChange={setMobileOpen} />
      <header
        className={cn(
          "z-30 flex h-14 shrink-0 items-center gap-3 border-b border-border/80 bg-background/95 px-4 text-sidebar-foreground backdrop-blur-md supports-[backdrop-filter]:bg-background/85",
          className
        )}
      >
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="lg:hidden h-9 w-9"
          onClick={() => setMobileOpen(true)}
          aria-label="Open menu"
        >
          <Menu className="h-4 w-4" />
        </Button>

        <div className="hidden min-w-0 flex-col gap-0.5 pr-2 lg:flex lg:max-w-[280px] xl:max-w-sm">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-sidebar-muted-foreground">
            {kicker}
          </span>
          <span className="truncate text-sm font-medium text-sidebar-foreground">
            {title}
          </span>
        </div>

        <div className="relative hidden md:block flex-1 max-w-md">
          <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-sidebar-muted-foreground" />
          <Input
            type="search"
            placeholder="Search deals, plans, people…"
            className="h-9 pl-9 bg-muted/40 border-transparent text-foreground placeholder:text-muted-foreground focus-visible:bg-background"
          />
        </div>

        <div className="flex-1 md:hidden" />

        <div className="flex items-center gap-2 ml-auto">
          <Badge
            variant="secondary"
            className="hidden font-normal capitalize sm:inline-flex"
          >
            {mockUser.role}
          </Badge>

          <ThemeToggle />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="h-9 w-9 relative"
                aria-label="Notifications"
              >
                <Bell className="h-4 w-4" />
                <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-primary" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="px-2 py-3 text-sm text-muted-foreground">
                Payout batch scheduled for 15 Apr. Motor renewals within 8% of
                accelerator band.
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/dashboard">View activity</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="outline" size="sm" className="hidden sm:inline-flex" asChild>
            <Link href="/login">Sign out</Link>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="h-9 gap-2 px-2 rounded-full"
                aria-label="User menu"
              >
                <Avatar className="h-8 w-8">
                  <AvatarFallback>{initials(mockUser.name)}</AvatarFallback>
                </Avatar>
                <span className="hidden sm:inline-flex flex-col items-start text-left">
                  <span className="text-sm font-medium leading-none text-sidebar-foreground">
                    {mockUser.name}
                  </span>
                  <span className="text-xs text-sidebar-muted-foreground capitalize mt-0.5">
                    {mockUser.role}
                  </span>
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">{mockUser.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {mockUser.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/profile">Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/admin">Admin</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/login">Sign out</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
    </>
  );
}
