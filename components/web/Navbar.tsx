"use client";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import Logo from "./Logo";
import { useState, useRef } from "react";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const navlinks = [
  { link: "#key", name: "Key features" },
  // { link: "/explore-courses", name: "Explore courses" },
  { link: "#How", name: "How it works" },
  { link: "#ForEducators", name: "For Educators" },
  { link: "#faqs", name: "FAQ" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const menuBtnRef = useRef<HTMLButtonElement>(null);

  useGSAP(
    () => {
      // 🔹 Entrance animation
      gsap.set(headerRef.current, { xPercent: -50 });
      const tl = gsap.timeline({
        defaults: { ease: "power2.out" },
      });

      tl.from(logoRef.current, {
        y: -20,
        opacity: 0,
        duration: 0.5,
      })
        .from(
          ".nav-link",
          {
            y: -10,
            opacity: 0,
            stagger: 0.06,
            duration: 0.4,
          },
          "-=0.3",
        )
        .from(
          menuBtnRef.current,
          {
            scale: 0.8,
            opacity: 0,
            duration: 0.3,
          },
          "-=0.4",
        )
        .from(
          ".link-buttons",
          {
            y: 20,
            opacity: 0,
            duration: 1.8,
          },
          "-1.5",
        );

      // 🔹 Scroll animation
      ScrollTrigger.create({
        start: "top -20",
        end: 99999,
        onUpdate: (self) => {
          if (!headerRef.current) return;

          if (self.direction === 1) {
            // scrolling down
            gsap.to(headerRef.current, {
              scale: 0.96,
              xPercent: -50,
              backgroundColor: "rgba(255,255,255,0.85)",
              backdropFilter: "blur(20px)",
              duration: 0.3,
              ease: "power2.out",
            });
          } else {
            // scrolling up
            gsap.to(headerRef.current, {
              xPercent: -50,
              scale: 1,
              backgroundColor: "rgba(255,255,255,0.6)",
              backdropFilter: "blur(30px)",
              duration: 0.3,
              ease: "power2.out",
            });
          }
        },
      });
    },
    { scope: headerRef },
  );

  return (
    <header
      ref={headerRef}
      className="fixed top-0  left-1/2 -translate-x-1/2 z-999 lg:rounded-4xl  container flex items-center justify-between py-4 backdrop-blur-xl border-b  transition-all duration-300"
    >
      {/* Logo */}
      <div ref={logoRef}>
        <Logo />
      </div>

      {/* Desktop Nav */}
      <nav ref={navRef} className="hidden lg:flex items-center gap-6">
        {navlinks.map((nav) => (
          <Link
            key={nav.name}
            href={nav.link}
            className="nav-link group relative text-sm font-medium text-gray-600 hover:text-black transition-colors"
          >
            {nav.name}

            {/* Underline */}
            <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-black transition-all duration-300 ease-out group-hover:w-full"></span>
          </Link>
        ))}
      </nav>

      {/* Desktop Auth */}
      <div className="hidden lg:flex items-center gap-4 link-buttons">
        <Link
          href="/login"
          className={cn(buttonVariants({ variant: "ghost" }))}
        >
          Login
        </Link>
        <Button asChild>
          <Link href="/signup">Sign up</Link>
        </Button>
      </div>

      {/* Mobile Menu */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            ref={menuBtnRef}
            size="icon"
            variant="ghost"
            className="lg:hidden transition-transform duration-200 hover:scale-105 active:scale-95"
          >
            <Menu className="h-7 w-7" />
          </Button>
        </SheetTrigger>

        <SheetContent side="right" className="pt-20 px-3">
          <nav className="flex flex-col gap-6">
            {navlinks.map((nav) => (
              <Link
                key={nav.name}
                href={nav.link}
                onClick={() => setOpen(false)}
                className="mobile-nav-item text-base font-medium"
              >
                {nav.name}
              </Link>
            ))}
          </nav>

          <div className="mt-8 flex flex-col gap-3 link-buttons">
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className={cn(buttonVariants({ variant: "outline" }))}
            >
              Login
            </Link>

            <Button asChild>
              <Link href="/signup" onClick={() => setOpen(false)}>
                Sign up
              </Link>
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </header>
  );
}
