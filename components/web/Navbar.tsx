"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Badge } from "@/components/ui/badge";
import {
  Menu,
  ShoppingCart,
  Mail,
  GraduationCap,
  BookOpen,
  ChevronDown,
  ArrowRight,
} from "lucide-react";
import Logo from "./Logo";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// ─── nav structure ─────────────────────────────────────────────────────────────

const anchorLinks = [
  { link: "#key", name: "Key features" },
  { link: "#How", name: "How it works" },
  { link: "#ForEducators", name: "For Educators" },
  { link: "#faqs", name: "FAQ" },
];

const exploreItems = [
  {
    href: "/explore",
    title: "Bundles",
    description: "Structured nursing bundles for practice and quizzes.",
    icon: GraduationCap,
  },
  {
    href: "/resources",
    title: "Resources",
    description: "Free study guides, clinical tips, and career resources.",
    icon: BookOpen,
  },
];

// ─── cart badge (item count) ──────────────────────────────────────────────────

function CartButton({ itemCount = 0 }: { itemCount?: number }) {
  return (
    <Link
      href="/cart"
      className="relative flex items-center justify-center h-9 w-9 rounded-full hover:bg-muted transition-colors"
      aria-label="Cart"
    >
      <ShoppingCart className="h-[18px] w-[18px] text-foreground" />
      {itemCount > 0 && (
        <Badge className="absolute -top-1 -right-1 h-4 min-w-4 px-1 flex items-center justify-center text-[10px] font-bold rounded-full">
          {itemCount > 9 ? "9+" : itemCount}
        </Badge>
      )}
    </Link>
  );
}

// ─── explore dropdown item (desktop) ──────────────────────────────────────────

function ExploreListItem({
  href,
  title,
  description,
  icon: Icon,
}: {
  href: string;
  title: string;
  description: string;
  icon: React.ElementType;
}) {
  return (
    <NavigationMenuLink asChild>
      <Link
        href={href}
        className="flex items-start gap-3 rounded-xl p-3 hover:bg-muted/60 transition-colors group no-underline"
      >
        <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/15 transition-colors">
          <Icon className="h-4 w-4 text-primary" />
        </div>
        <div className="space-y-0.5">
          <p className="text-sm font-semibold text-foreground leading-none">
            {title}
          </p>
          <p className="text-[12px] text-muted-foreground leading-snug">
            {description}
          </p>
        </div>
      </Link>
    </NavigationMenuLink>
  );
}

// ─── main navbar ──────────────────────────────────────────────────────────────

export default function Navbar({
  isLoggedIn,
  cartItemCount = 0,
}: {
  isLoggedIn?: boolean;
  cartItemCount?: number;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const getNavLink = (link: string) => (pathname === "/" ? link : `/${link}`);

  const headerRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const menuBtnRef = useRef<HTMLButtonElement>(null);

  useGSAP(
    () => {
      gsap.set(headerRef.current, { xPercent: -50 });
      const tl = gsap.timeline({ defaults: { ease: "power2.out" } });

      tl.from(logoRef.current, { y: -20, opacity: 0, duration: 0.5 })
        .from(
          ".nav-link",
          { y: -10, opacity: 0, stagger: 0.06, duration: 0.4 },
          "-=0.3",
        )
        .from(
          menuBtnRef.current,
          { scale: 0.8, opacity: 0, duration: 0.3 },
          "-=0.4",
        )
        .from(".link-buttons", { y: 20, opacity: 0, duration: 1.8 }, "-1.5");

      ScrollTrigger.create({
        start: "top -20",
        end: 99999,
        onUpdate: (self) => {
          if (!headerRef.current) return;
          if (self.direction === 1) {
            gsap.to(headerRef.current, {
              scale: 0.96,
              xPercent: -50,
              backgroundColor: "rgba(255,255,255,0.85)",
              backdropFilter: "blur(20px)",
              duration: 0.3,
              ease: "power2.out",
            });
          } else {
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
      className="fixed top-0 left-1/2 -translate-x-1/2 z-999 lg:rounded-4xl container flex items-center justify-between py-3 backdrop-blur-xl border-b transition-all duration-300"
    >
      {/* ── Logo ── */}
      <div ref={logoRef}>
        <Logo />
      </div>

      {/* ── Desktop Nav ── */}
      <NavigationMenu viewport={false} className="hidden lg:flex">
        <NavigationMenuList className="gap-1">
          {/* ── Explore dropdown ── */}
          <NavigationMenuItem>
            <NavigationMenuTrigger className="nav-link bg-transparent text-sm font-medium text-gray-600 hover:text-white data-[state=open]:text-black">
              Explore
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <div className="grid w-[340px] gap-1 p-2">
                {exploreItems.map((item) => (
                  <ExploreListItem key={item.href} {...item} />
                ))}
              </div>
            </NavigationMenuContent>
          </NavigationMenuItem>

          {/* ── anchor links ── */}
          {anchorLinks.map((nav) => (
            <NavigationMenuItem key={nav.name}>
              <NavigationMenuLink asChild>
                <Link
                  href={getNavLink(nav.link)}
                  className="nav-link group relative inline-flex h-9 items-center px-3 text-sm font-medium text-gray-600 hover:text-white transition-colors no-underline bg-transparent"
                >
                  {nav.name}
                  {/* <span className="absolute left-3 right-3 -bottom-px h-[2px] bg-black scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out origin-left" /> */}
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          ))}

          {/* ── contact ── */}
          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <Link
                href={getNavLink("/contact")}
                className="nav-link group relative inline-flex h-9 items-center px-3 text-sm font-medium text-gray-600 hover:text-white transition-colors no-underline bg-transparent"
              >
                Contact
                {/* <span className="absolute left-3 right-3 -bottom-px h-[2px] bg-black scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out origin-left" /> */}
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>

      {/* ── Desktop right side: cart + auth ── */}
      <div className="hidden lg:flex items-center gap-3 link-buttons">
        <div className="nav-link">
          <CartButton itemCount={cartItemCount} />
        </div>

        {isLoggedIn ? (
          <Button asChild>
            <Link href="/learner">Dashboard</Link>
          </Button>
        ) : (
          <>
            <Link
              href="/login"
              className={cn(buttonVariants({ variant: "ghost" }))}
            >
              Login
            </Link>
            <Button asChild>
              <Link href="/signup">Sign up</Link>
            </Button>
          </>
        )}
      </div>

      {/* ── Mobile: cart + menu trigger ── */}
      <div className="flex items-center gap-1 lg:hidden">
        <CartButton itemCount={cartItemCount} />

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button
              ref={menuBtnRef}
              size="icon"
              variant="ghost"
              className="transition-transform duration-200 hover:scale-105 active:scale-95"
            >
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>

          <SheetContent side="right" className="pt-16 px-4 overflow-y-auto">
            <nav className="flex flex-col gap-1">
              {/* explore — expandable group on mobile */}
              <MobileExploreGroup onNavigate={() => setOpen(false)} />

              <div className="h-px bg-border my-2" />

              {anchorLinks.map((nav) => (
                <Link
                  key={nav.name}
                  href={getNavLink(nav.link)}
                  onClick={() => setOpen(false)}
                  className="text-[15px] font-medium text-foreground py-2.5 px-2 rounded-lg hover:bg-muted transition-colors no-underline"
                >
                  {nav.name}
                </Link>
              ))}

              <Link
                href={getNavLink("#contact")}
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 text-[15px] font-medium text-foreground py-2.5 px-2 rounded-lg hover:bg-muted transition-colors no-underline"
              >
                <Mail className="h-4 w-4" />
                Contact
              </Link>
            </nav>

            <div className="mt-6 pt-6 border-t flex flex-col gap-3">
              {isLoggedIn ? (
                <Button asChild>
                  <Link href="/learner" onClick={() => setOpen(false)}>
                    Dashboard
                  </Link>
                </Button>
              ) : (
                <>
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
                </>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}

// ─── mobile explore — accordion-style expandable group ───────────────────────

function MobileExploreGroup({ onNavigate }: { onNavigate: () => void }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div>
      <button
        onClick={() => setExpanded((p) => !p)}
        className="w-full flex items-center justify-between py-2.5 px-2 rounded-lg hover:bg-muted transition-colors"
      >
        <span className="text-[15px] font-medium text-foreground">Explore</span>
        <ChevronDown
          className={cn(
            "h-4 w-4 text-muted-foreground transition-transform duration-200",
            expanded && "rotate-180",
          )}
        />
      </button>

      <div
        className={cn(
          "overflow-hidden transition-all duration-250 ease-in-out",
          expanded ? "max-h-40 opacity-100" : "max-h-0 opacity-0",
        )}
      >
        <div className="pl-2 pb-1 space-y-1">
          {exploreItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className="flex items-center gap-3 py-2 px-2 rounded-lg hover:bg-muted transition-colors no-underline group"
            >
              <div className="h-7 w-7 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
                <item.icon className="h-3.5 w-3.5 text-primary" />
              </div>
              <span className="text-[14px] font-medium text-foreground">
                {item.title}
              </span>
              <ArrowRight className="h-3.5 w-3.5 text-muted-foreground ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
