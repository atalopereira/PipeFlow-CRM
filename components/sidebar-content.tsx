"use client";

import { NavItem } from "@/components/nav-item";
import { WorkspaceSwitcher } from "@/components/workspace-switcher";
import { NAV_ITEMS } from "@/lib/constants/nav";

interface SidebarContentProps {
  onNavigate?: () => void;
}

export function SidebarContent({ onNavigate }: SidebarContentProps) {
  return (
    <div className="flex h-full flex-col gap-6">
      <WorkspaceSwitcher />
      <nav className="flex flex-1 flex-col gap-1">
        {NAV_ITEMS.map((item) => (
          <NavItem key={item.href} item={item} onNavigate={onNavigate} />
        ))}
      </nav>
    </div>
  );
}
