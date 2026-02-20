"use client";
import Logo from "./Logo";
import { SidebarContent } from "./SidebarContent";
import LogoutButton from "./LogoutButton";

export function Asidebar() {
  return (
    <aside
      className="
        group/sidebar
        fixed top-0 left-0 z-50
        h-dvh 
        mr-2
        w-14 hover:w-60  
        bg-background border-r
        border-muted
        hover:shadow-xl
        transition-all duration-300 ease-in-out
        overflow-hidden
        hidden md:block
      "
    >
      <div className="h-12 mb-2 flex items-center px-4">
        <Logo />
      </div>

      <SidebarContent onClick={() => {}} />

      <LogoutButton />
    </aside>
  );
}
