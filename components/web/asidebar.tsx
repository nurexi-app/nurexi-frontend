import { Button } from "../ui/button";
import Logo from "./Logo";
import { SidebarContent } from "./SidebarContent";
import { LogOut } from "lucide-react";

export function Asidebar() {
  return (
    <aside
      className="
        group/sidebar
        fixed top-0 left-0 z-40
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

      <SidebarContent />

      <Button
        variant={"ghost"}
        className={`group/item flex items-center gap-3 rounded-xl ml-3   px-3 py-2
                       transition-all
                      bg-muted!`}
      >
        <LogOut
          size={24}
          className="transition-transform text-destructive hover:text-white! group-hover:text-white! group-hover/item:scale-110"
        />

        <span
          className="
                    whitespace-nowrap
                    lg:opacity-0 lg:hidden 
                   text-destructive 
                    group-hover/sidebar:block
                    group-hover/sidebar:opacity-100 group-hover/sidebar:translate-x-0
                    transition-all duration-200
                  "
        >
          Logout
        </span>
      </Button>
    </aside>
  );
}
