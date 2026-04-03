"use client";

import { Menu, X } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTrigger,
} from "@/components/ui/drawer";
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
    <Drawer direction="left" open={open} onOpenChange={setOpen}>
      <DrawerTrigger className="md:hidden">
        <Menu size={22} />
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="h-12 mb-6  flex! flex-row justify-between items-center px-4 border-b">
          <Logo />

          <DrawerClose>
            <X size={22} />
          </DrawerClose>
        </DrawerHeader>
        <SidebarContent onClick={closeMobileSidebar} isHovered={true} />
        <LogoutButton />
      </DrawerContent>
    </Drawer>
  );
}
