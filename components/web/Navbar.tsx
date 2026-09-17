"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useAppSelector } from "@/hooks/StoreHooks";
import { cn } from "@/lib/utils";
import Logo from "./Logo";

const navigation = [
  { href: "/explore", label: "Exam prep" },
  { href: "/resources", label: "Resources" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
];

function CartButton({ itemCount }: { itemCount: number }) {
  return (
    <Link
      href="/cart"
      className="relative inline-flex size-11 items-center justify-center rounded-full text-foreground transition-colors hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      aria-label={`Shopping cart${itemCount > 0 ? `, ${itemCount} items` : ""}`}
    >
      <ShoppingCart aria-hidden="true" className="size-5" />
      {itemCount > 0 && (
        <Badge className="absolute -right-0.5 -top-0.5 flex size-5 items-center justify-center rounded-full bg-accent p-0 text-[10px] text-accent-foreground">
          {itemCount > 9 ? "9+" : itemCount}
        </Badge>
      )}
    </Link>
  );
}

export default function Navbar({
  isLoggedIn,
  cartItemCount = 0,
}: {
  isLoggedIn?: boolean;
  cartItemCount?: number;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const cartItems = useAppSelector((store) => store.cart.items);
  const itemCount = cartItems.length || cartItemCount;

  const isActive = (href: string) =>
    pathname === href || (href !== "/" && pathname.startsWith(`${href}/`));

  return (
    <header className="sticky top-0 z-50 border-b border-border/80 bg-background/95 backdrop-blur-xl supports-[backdrop-filter]:bg-background/85">
      <div className="mx-auto flex h-[76px] max-w-[1440px] items-center justify-between gap-6 px-6 sm:px-10 lg:px-16">
        <Logo />

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary navigation">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(item.href) ? "page" : undefined}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                isActive(item.href)
                  ? "bg-secondary text-secondary-foreground"
                  : "text-muted-foreground hover:bg-secondary/70 hover:text-foreground",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <CartButton itemCount={itemCount} />
          {!isLoggedIn && (
            <Link href="/login" className={cn(buttonVariants({ variant: "ghost" }), "rounded-full px-5")}>
              Sign in
            </Link>
          )}
          <Button asChild className="h-11 rounded-full px-6">
            <Link href="/learner">{isLoggedIn ? "Dashboard" : "Explore Nurexi"}</Link>
          </Button>
        </div>

        <div className="flex items-center gap-1 lg:hidden">
          <CartButton itemCount={itemCount} />
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button size="icon" variant="ghost" className="size-11 rounded-full" aria-label="Open navigation menu">
                <Menu aria-hidden="true" className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[min(88vw,390px)] border-border bg-background px-6 pb-7 pt-5">
              <SheetHeader className="p-0 text-left">
                <SheetTitle><Logo /></SheetTitle>
              </SheetHeader>
              <nav className="mt-10 flex flex-col" aria-label="Mobile navigation">
                {navigation.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    aria-current={isActive(item.href) ? "page" : undefined}
                    className={cn(
                      "border-b border-border py-4 text-lg font-medium transition-colors",
                      isActive(item.href) ? "text-accent" : "text-foreground hover:text-accent",
                    )}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
              <div className="mt-auto grid gap-3 border-t border-border pt-6">
                {!isLoggedIn && (
                  <Button asChild variant="outline" className="h-12 rounded-full">
                    <Link href="/login" onClick={() => setOpen(false)}>Sign in</Link>
                  </Button>
                )}
                <Button asChild className="h-12 rounded-full">
                  <Link href="/learner" onClick={() => setOpen(false)}>
                    {isLoggedIn ? "Go to dashboard" : "Explore Nurexi"}
                  </Link>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
