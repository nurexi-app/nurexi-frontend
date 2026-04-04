"use client";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTrigger,
} from "@/components/ui/drawer";
import Logo from "./Logo";
import { SidebarContent } from "./SidebarContent";
import { useState } from "react";
import LogoutButton from "./LogoutButton";
import { Menu } from "../animate-ui/icons/menu";
import { AnimateIcon } from "../animate-ui/icons/icon";
import { X } from "../animate-ui/icons/x";

export function MobileSidebar() {
  const [open, setOpen] = useState(false);
  function closeMobileSidebar() {
    setOpen(false);
  }

  return (
    <Drawer direction="right" open={open} onOpenChange={setOpen}>
      <DrawerTrigger className="md:hidden">
        <AnimateIcon animateOnHover>
          <Menu size={22} animation="path" />
        </AnimateIcon>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="h-12 mb-6  flex! flex-row justify-between items-center px-4 border-b">
          <Logo />

          <DrawerClose>
            <AnimateIcon animateOnView>
              <X size={22} animation="path" />
            </AnimateIcon>
          </DrawerClose>
        </DrawerHeader>
        <SidebarContent onClick={closeMobileSidebar} isHovered={true} />
        <LogoutButton />
      </DrawerContent>
    </Drawer>
  );
}
