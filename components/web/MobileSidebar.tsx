"use client";

import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Logo from "./Logo";
import { SidebarContent } from "./SidebarContent";

export function MobileSidebar() {
  return (
    <Sheet>
      <SheetTrigger className="md:hidden">
        <Menu size={22} />
      </SheetTrigger>

      <SheetContent side="left" className="w-64 p-0">
        <div className="h-12 flex items-center px-4 border-b">
          <Logo />
        </div>

        <SidebarContent />
      </SheetContent>
    </Sheet>
  );
}
