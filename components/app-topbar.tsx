"use client";

import { useState } from "react";
import { Menu } from "lucide-react";

import { AccountMenu } from "@/components/account-menu";
import { BrandLogo } from "@/components/brand-logo";
import { SidebarContent } from "@/components/sidebar-content";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

export function AppTopbar() {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  return (
    <header className="flex h-16 shrink-0 items-center justify-between gap-4 border-b bg-background/80 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:px-6">
      <div className="flex items-center gap-2">
        <Sheet open={isMobileNavOpen} onOpenChange={setIsMobileNavOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon" aria-label="Abrir menu de navegação">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-4">
            <SheetTitle className="sr-only">Menu de navegação</SheetTitle>
            <div className="flex h-full flex-col gap-6">
              <BrandLogo />
              <SidebarContent onNavigate={() => setIsMobileNavOpen(false)} />
            </div>
          </SheetContent>
        </Sheet>
        <BrandLogo className="md:hidden" />
      </div>
      <AccountMenu />
    </header>
  );
}
