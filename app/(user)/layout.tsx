import { Asidebar } from "@/components/web/asidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Bell } from "lucide-react";
import { ReactNode } from "react";
import { MobileSidebar } from "@/components/web/MobileSidebar";
import { ModeToggle } from "@/components/web/ThemeSwitcher";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-dvh bg-muted">
      <Asidebar />

      {/* Header */}
      <header
        className="
          fixed top-0 right-0 z-30
          bg-background
          h-12
          w-full md:w-[calc(100%-2.75rem)]
          md:ml-11
          flex items-center justify-between
          border-b  px-4
        "
      >
        <div className="flex items-center basis-1/2 gap-3">
          <MobileSidebar />
          <Input
            type="search"
            placeholder="Search for topics"
            className="h-9 w-2/3 bg-primary-light"
          />
        </div>

        <div className="flex items-center gap-3">
          <Bell size={18} />
          <Avatar className="h-8 w-8">
            <AvatarImage src="https://i.pravatar.cc/100" />
            <AvatarFallback>OC</AvatarFallback>
          </Avatar>
          <ModeToggle />
        </div>
      </header>

      {/* Content */}
      <section
        className="
          pt-12
          md:ml-11
          px-4
        "
      >
        {children}
      </section>
    </main>
  );
}
