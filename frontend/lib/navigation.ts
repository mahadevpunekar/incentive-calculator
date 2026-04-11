import {
  BarChart3,
  BellRing,
  ClipboardList,
  Calculator,
  FileBarChart,
  Gauge,
  History,
  LayoutDashboard,
  Layers,
  LineChart,
  Link2,
  PieChart,
  Settings2,
  Shield,
  ShieldCheck,
  Target,
  Trophy,
  UserCircle,
  Workflow,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  title: string;
  href: string;
  icon: LucideIcon;
};

export type NavSection = {
  id: string;
  title: string;
  items: NavItem[];
};

export const navSections: NavSection[] = [
  {
    id: "overview",
    title: "Overview",
    items: [
      { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    ],
  },
  {
    id: "workbench",
    title: "Workbench",
    items: [
      { title: "Incentive Calculator", href: "/calculator", icon: Calculator },
      { title: "Simulation", href: "/simulation", icon: LineChart },
    ],
  },
  {
    id: "insights",
    title: "Insights",
    items: [
      { title: "Analytics", href: "/analytics", icon: PieChart },
      { title: "Performance", href: "/performance", icon: Gauge },
      { title: "Leaderboard", href: "/leaderboard", icon: Trophy },
      { title: "Breakdown", href: "/breakdown", icon: BarChart3 },
    ],
  },
  {
    id: "governance",
    title: "Policy & governance",
    items: [
      { title: "Workflow", href: "/workflow", icon: Workflow },
      { title: "Rule engine", href: "/rule-engine", icon: ShieldCheck },
      { title: "Commission rules", href: "/commission-rules", icon: Layers },
      { title: "Data validation", href: "/data-quality", icon: ClipboardList },
      { title: "Audit trail", href: "/audit", icon: History },
    ],
  },
  {
    id: "operations",
    title: "Reporting & planning",
    items: [
      { title: "Reports", href: "/reports", icon: FileBarChart },
      { title: "MIS report", href: "/reports/mis", icon: PieChart },
      { title: "Notifications", href: "/notifications", icon: BellRing },
      { title: "Targets", href: "/targets", icon: Target },
    ],
  },
  {
    id: "administration",
    title: "Administration",
    items: [
      { title: "Admin", href: "/admin", icon: Shield },
      { title: "Integrations", href: "/integrations", icon: Link2 },
    ],
  },
  {
    id: "account",
    title: "Account",
    items: [
      { title: "Profile", href: "/profile", icon: UserCircle },
      { title: "Settings", href: "/profile", icon: Settings2 },
    ],
  },
];

/** Flat list for legacy consumers / search */
export const mainNav: NavItem[] = navSections.flatMap((s) => s.items);
