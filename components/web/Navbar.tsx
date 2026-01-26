import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import Logo from "./Logo";
import { ModeToggle } from "./ThemeSwitcher";

const navlinks = [
  { link: "#key", name: "Key features" },
  { link: "/explore-courses", name: "Explore courses" },
  { link: "#How", name: "How it works" },
  { link: "#ForEducators", name: "For Educators" },
  { link: "#faqs", name: "FAQ" },
];

export default function Navbar() {
  return (
    <header className="fixed top-0 left-1/2 -translate-x-1/2 z-80 rounded-4xl w-full container flex items-center justify-between py-4 bg-white/60 backdrop-blur-2xl border-b border-white/20">
      {/* Brand */}
      <Logo />

      {/* Desktop Nav */}
      <nav className="hidden lg:flex items-center gap-6">
        {navlinks.map((nav) => (
          <Link
            key={nav.name}
            href={nav.link}
            className="text-sm font-medium text-gray-600 hover:text-black transition-colors"
          >
            {nav.name}
          </Link>
        ))}
      </nav>

      {/* Desktop Auth */}
      <div className="hidden lg:flex items-center gap-4">
        <Link
          href="/login"
          className={cn(buttonVariants({ variant: "ghost" }))}
        >
          Login
        </Link>
        <Button asChild>
          <Link href="/signup">Sign up</Link>
        </Button>
        <ModeToggle />
      </div>

      {/* Mobile Menu */}
      <Sheet>
        <SheetTrigger asChild>
          <Button size="icon" variant="ghost" className="lg:hidden">
            <Menu className="h-7 w-7" />
          </Button>
        </SheetTrigger>

        <SheetContent side="right" className="pt-20 px-3">
          <nav className="flex flex-col gap-6">
            {navlinks.map((nav) => (
              <Link
                key={nav.name}
                href={nav.link}
                className="text-base font-medium"
              >
                {nav.name}
              </Link>
            ))}
          </nav>

          <div className="mt-8 flex flex-col gap-3">
            <Link
              href="/login"
              className={cn(buttonVariants({ variant: "outline" }))}
            >
              Login
            </Link>

            <Button asChild>
              <Link href="/signup">Sign up</Link>
            </Button>

            <ModeToggle />
          </div>
        </SheetContent>
      </Sheet>
    </header>
  );
}
