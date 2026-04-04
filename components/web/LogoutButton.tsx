"use client";

import { Logout } from "@/lib/actions/auth";
import { Button } from "../ui/button";
import { LogOut } from "lucide-react";
import { toast } from "sonner";

export default function LogoutButton() {
  const handleLogout = async () => {
    try {
      await Logout();
      toast.success("Logout successful");
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes("NEXT_REDIRECT")) {
          return;
        }
        toast.error(error.message);
      } else {
        toast.error("Something went wrong");
      }
    }
  };

  return (
    <Button
      onClick={handleLogout}
      variant={"ghost"}
      className={`group/item flex items-center gap-3 rounded-xl md:ml-3   px-3 py-2  transition-all bg-destructive/20!`}
    >
      <LogOut size={24} className="transition-transform text-destructive " />

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
  );
}
