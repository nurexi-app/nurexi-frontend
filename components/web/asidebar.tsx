"use client";
import Logo from "./Logo";
import { SidebarContent } from "./SidebarContent";
import LogoutButton from "./LogoutButton";
import { useState } from "react";

export function Asidebar() {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <aside
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`
        ${!isHovered ? "w-14" : "w-60"}
        group/sidebar
        fixed top-0 left-0 z-50
        h-dvh 
        mr-2
         hover:w-60  
        bg-white border-r
        
        hover:shadow-xl
        transition-all duration-300 ease-in-out
        overflow-hidden
        hidden md:block
      `}
    >
      <div className="h-12 md:mt-3 mb-2 md:mb-4 flex items-center px-4">
        <Logo />
      </div>

      <SidebarContent onClick={() => {}} isHovered={isHovered} />

      <LogoutButton />
    </aside>
  );
}
