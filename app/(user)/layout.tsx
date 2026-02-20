import { Asidebar } from "@/components/web/asidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Bell } from "lucide-react";
import { ReactNode, Suspense } from "react";
import { MobileSidebar } from "@/components/web/MobileSidebar";
import { ModeToggle } from "@/components/web/ThemeSwitcher";
import Link from "next/link";
import AppProvider from "@/context/AppProvider";
import StoreProvider from "@/context/StoreProvider";
import { GetUserProfile } from "@/lib/actions/auth";
import AvatarSkeleton from "@/components/web/AvatarSkeleton";

export default async function Layout({ children }: { children: ReactNode }) {
  const profile = await GetUserProfile();
  return (
    <AppProvider>
      <StoreProvider>
        <main className="min-h-dvh bg-muted">
          <Asidebar />

          {/* Header */}
          <header
            className="
          fixed top-0 right-0 z-60
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
                className="h-9 md:w-2/3 bg-primary-light"
              />
            </div>

            <div className="flex items-center gap-3">
              <Link href={"/learner/notification"}>
                <Bell size={18} />
              </Link>
              <Suspense fallback={<AvatarSkeleton />}>
                <Avatar className="h-8 w-8">
                  <AvatarImage src={profile?.avatar_url} />
                  <AvatarFallback className="uppercase">
                    {profile?.full_name?.slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
              </Suspense>
              <ModeToggle />
            </div>
          </header>

          {/* Content */}
          <section
            className="
        px-1
          pt-12
          md:ml-11
          md:px-4
        "
          >
            {children}
          </section>
        </main>
      </StoreProvider>
    </AppProvider>
  );
}
