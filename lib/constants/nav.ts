import type { LucideIcon } from "lucide-react";
import { LayoutDashboard, Settings, Users, Columns3 } from "lucide-react";

export interface NavItemConfig {
  label: string;
  href: string;
  icon: LucideIcon;
}

export const NAV_ITEMS: NavItemConfig[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Leads", href: "/leads", icon: Users },
  { label: "Pipeline", href: "/pipeline", icon: Columns3 },
  { label: "Configurações", href: "/settings", icon: Settings },
];
