"use client";

import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Logo from "./Logo";
import { SidebarContent } from "./SidebarContent";
import { useState } from "react";
import LogoutButton from "./LogoutButton";

export function MobileSidebar() {
  const [open, setOpen] = useState(false);
  function closeMobileSidebar() {
    setOpen(false);
  }
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger className="md:hidden">
        <Menu size={22} />
      </SheetTrigger>

      <SheetContent side="left" className="w-64 p-0">
        <div className="h-12 flex items-center px-4 border-b">
          <Logo />
        </div>

        <SidebarContent onClick={closeMobileSidebar} isHovered={true} />

        <LogoutButton />
      </SheetContent>
    </Sheet>
  );
}
