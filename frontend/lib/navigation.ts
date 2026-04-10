import {
  BarChart3,
  Calculator,
  FileBarChart,
  Gauge,
  LayoutDashboard,
  LineChart,
  Link2,
  Settings2,
  Shield,
  Target,
  Trophy,
  UserCircle,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  title: string;
  href: string;
  icon: LucideIcon;
};

export const mainNav: NavItem[] = [
  { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { title: "Incentive Calculator", href: "/calculator", icon: Calculator },
  { title: "Performance", href: "/performance", icon: Gauge },
  { title: "Leaderboard", href: "/leaderboard", icon: Trophy },
  { title: "Breakdown", href: "/breakdown", icon: BarChart3 },
  { title: "Simulation", href: "/simulation", icon: LineChart },
  { title: "Reports", href: "/reports", icon: FileBarChart },
  { title: "Targets", href: "/targets", icon: Target },
  { title: "Admin", href: "/admin", icon: Shield },
  { title: "Integrations", href: "/integrations", icon: Link2 },
  { title: "Profile", href: "/profile", icon: UserCircle },
];

export const footerNav: NavItem[] = [
  { title: "Settings", href: "/profile", icon: Settings2 },
];
