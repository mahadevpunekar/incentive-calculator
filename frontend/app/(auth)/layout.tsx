import type { ReactNode } from "react";

import { BrandLogo } from "@/components/brand/brand-logo";
import { ShieldCheck, Sparkles, TrendingUp } from "lucide-react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  const year = new Date().getFullYear();

  return (
    <div className="flex min-h-screen w-full flex-col bg-background xl:flex-row">
      {/* Brand panel — desktop */}
      <aside className="relative hidden min-h-0 flex-col justify-between overflow-hidden border-b border-border/60 bg-gradient-to-br from-primary/[0.06] via-muted/50 to-background px-10 py-12 xl:flex xl:min-h-screen xl:w-[min(460px,44vw)] xl:border-b-0 xl:border-r xl:border-border/60">
        <div
          className="pointer-events-none absolute -right-24 top-0 h-[420px] w-[420px] rounded-full bg-brand-green/[0.12] blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -left-32 bottom-0 h-[320px] w-[320px] rounded-full bg-primary/[0.07] blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute right-12 top-1/3 h-px w-32 rotate-[-35deg] bg-gradient-to-r from-transparent via-brand-amber/35 to-transparent"
          aria-hidden
        />

        <div className="relative z-10 flex flex-col gap-10">
          <BrandLogo width={268} priority className="max-w-[min(268px,100%)]" />
          <div className="max-w-sm space-y-5">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-widest text-primary/90">
                Incentive platform
              </p>
              <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-[1.65rem] sm:leading-snug">
                Clarity for performance, targets, and payouts
              </h1>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">
              A secure workspace aligned with Dhofar Insurance standards —
              designed for sales, managers, and leadership.
            </p>
            <ul className="grid gap-3.5 text-sm text-muted-foreground">
              <li className="flex gap-3">
                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-green/15 text-brand-green">
                  <TrendingUp className="h-4 w-4" aria-hidden />
                </span>
                <span className="leading-relaxed">
                  <span className="font-medium text-foreground">
                    Live performance
                  </span>
                  — dashboards and trends updated as your book moves.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/12 text-primary">
                  <ShieldCheck className="h-4 w-4" aria-hidden />
                </span>
                <span className="leading-relaxed">
                  <span className="font-medium text-foreground">
                    Enterprise controls
                  </span>
                  — roles, approvals, and audit-friendly breakdowns.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-amber/15 text-brand-amber">
                  <Sparkles className="h-4 w-4" aria-hidden />
                </span>
                <span className="leading-relaxed">
                  <span className="font-medium text-foreground">
                    What-if & planning
                  </span>
                  — model scenarios before quarter close.
                </span>
              </li>
            </ul>
          </div>
        </div>

        <p className="relative z-10 text-xs text-muted-foreground">
          © {year} Dhofar Insurance SAOG · Internal use
        </p>
      </aside>

      {/* Form column */}
      <div className="relative flex flex-1 flex-col items-center justify-center px-5 py-10 sm:px-8 lg:px-12">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_45%_at_50%_-10%,hsl(var(--primary)/0.08),transparent)]" />
        <div className="relative z-10 w-full max-w-[440px] space-y-8">
          <div className="flex justify-center xl:hidden">
            <BrandLogo width={200} className="max-w-[200px]" />
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
