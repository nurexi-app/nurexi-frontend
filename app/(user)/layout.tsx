import { Asidebar } from "@/components/web/asidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Bell } from "lucide-react";
import { ReactNode, Suspense } from "react";
import { MobileSidebar } from "@/components/web/MobileSidebar";
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

          {/* Header - margin adjusts based on sidebar state */}
          <header
            className="
              fixed top-0 bg-white  right-0 z-30 
              h-16 flex items-center justify-between
              border-b px-4
              transition-all duration-300 ease-in-out
              left-0 md:left-14
              md:group-hover/sidebar:left-64
            "
          >
            <div className="flex items-center w-[80%] gap-3">
              <MobileSidebar />
              <Input
                type="search"
                placeholder="Search for topics"
                className="h-10 hidden md:block bg-custom-background"
              />
            </div>

            <div className="flex items-center gap-3">
              <Link href={"/learner/notification"}>
                <Bell size={24} />
              </Link>
              <Suspense fallback={<AvatarSkeleton />}>
                <Avatar className="h-8 w-8 md:w-10 md:h-10">
                  <AvatarImage src={profile?.avatar_url} />
                  <AvatarFallback className="uppercase">
                    {profile?.full_name?.slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
              </Suspense>
            </div>
          </header>

          {/* Content - margin adjusts with sidebar */}
          <section
            className="
              pt-16 px-1 md:px-4
              transition-all duration-300 ease-in-out
              md:ml-14
            "
          >
            {children}
          </section>
        </main>
      </StoreProvider>
    </AppProvider>
  );
}
