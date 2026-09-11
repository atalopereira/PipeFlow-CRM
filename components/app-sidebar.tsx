import { BrandLogo } from "@/components/brand-logo";
import { SidebarContent } from "@/components/sidebar-content";

export function AppSidebar() {
  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r bg-card/40 md:flex">
      <div className="flex h-16 items-center border-b px-4">
        <BrandLogo />
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        <SidebarContent />
      </div>
    </aside>
  );
}
