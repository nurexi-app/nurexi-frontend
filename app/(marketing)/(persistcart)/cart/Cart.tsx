"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Loader2, ShieldCheck, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/hooks/StoreHooks";
import { clearCart, removeFromCart } from "@/lib/features/cart/cartSlice";
import { formatPrice } from "@/lib/utils";

interface CartUser {
  success: boolean;
  data: { id: string; email?: string } | null;
}

export default function Cart({ userObj }: { userObj: CartUser }) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { items, discount } = useAppSelector((store) => store.cart);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = Math.max(0, subtotal - discount);

  function removeItem(id: string) {
    dispatch(removeFromCart(id));
    toast.success("Item removed from cart");
  }

  function emptyCart() {
    dispatch(clearCart());
    toast.success("Cart cleared");
  }

  function proceed() {
    setIsCheckingOut(true);
    if (!userObj.success) {
      document.cookie = "redirectTo=/checkout; path=/; max-age=3600; samesite=lax";
      router.push(`/login?redirect=${encodeURIComponent("/checkout")}`);
      return;
    }
    router.push("/checkout");
  }

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-background text-foreground">
        <div className="mx-auto grid max-w-360 items-center gap-10 px-6 py-16 sm:px-10 lg:min-h-[720px] lg:grid-cols-[0.7fr_1.3fr] lg:px-16">
          <div className="max-w-lg">
            <p className="text-xs font-bold uppercase tracking-[0.23em] text-accent">Your cart</p>
            <h1 className="mt-6 text-[clamp(3rem,5vw,5.5rem)] font-semibold leading-[1.02] tracking-[-0.06em]">Nothing here yet.</h1>
            <p className="mt-7 text-lg leading-relaxed text-muted-foreground">Choose an exam preparation bundle and it will appear here for you to review before payment.</p>
            <Button asChild size="lg" className="mt-9 h-12 rounded-full px-6">
              <Link href="/explore" className="arrow-link">Browse exam prep bundles <ArrowRight aria-hidden="true" data-link-arrow="forward" /></Link>
            </Button>
          </div>
          <div className="relative aspect-6/5 overflow-hidden rounded-4xl bg-card">
            <Image src="/assets/emptycart.png" alt="Nurse sitting beside an empty shopping cart" fill priority sizes="(max-width: 1024px) 100vw, 60vw" className="object-contain" />
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-360 px-6 py-16 sm:px-10 sm:py-20 lg:px-16 lg:py-24">
        <Link href="/explore" className="arrow-link inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground transition-colors hover:text-accent"><ArrowLeft aria-hidden="true" data-link-arrow="back" className="size-4" /> Continue browsing</Link>
        <div className="mt-8 max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-[0.23em] text-accent">Review your selection</p>
          <h1 className="mt-5 text-[clamp(2.8rem,5vw,5rem)] font-semibold leading-[1.04] tracking-[-0.055em]">Your cart</h1>
          <p className="mt-5 text-lg text-muted-foreground">Confirm what you are purchasing before continuing to secure payment.</p>
        </div>

        <div className="mt-12 grid gap-10 lg:grid-cols-[minmax(0,1fr)_23rem] lg:items-start">
          <section aria-labelledby="cart-items-heading">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <h2 id="cart-items-heading" className="font-semibold">{items.length} item{items.length === 1 ? "" : "s"}</h2>
              <button type="button" onClick={emptyCart} className="text-sm font-medium text-muted-foreground underline underline-offset-4 hover:text-destructive">Clear cart</button>
            </div>
            <div className="divide-y divide-border">
              {items.map((item) => (
                <article key={item.id} className="flex items-start gap-5 py-7">
                  <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-secondary font-semibold text-accent">{item.type === "bundle" ? "B" : "C"}</div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-lg font-semibold">{item.name}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{item.type === "bundle" ? `${item.sessionCount ?? 0} exam session${item.sessionCount === 1 ? "" : "s"}` : "Course access"}</p>
                    <button type="button" onClick={() => removeItem(item.id)} className="mt-4 inline-flex min-h-10 items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-destructive" aria-label={`Remove ${item.name} from cart`}><Trash2 aria-hidden="true" className="size-4" /> Remove</button>
                  </div>
                  <p className="shrink-0 font-semibold">{formatPrice((item.price * item.quantity) / 100)}</p>
                </article>
              ))}
            </div>
          </section>

          <aside className="rounded-3xl border border-border bg-card p-6 lg:sticky lg:top-24" aria-labelledby="summary-heading">
            <h2 id="summary-heading" className="text-xl font-semibold">Order summary</h2>
            <dl className="mt-6 space-y-4 text-sm">
              <div className="flex justify-between gap-4"><dt className="text-muted-foreground">Subtotal</dt><dd>{formatPrice(subtotal / 100)}</dd></div>
              {discount > 0 && <div className="flex justify-between gap-4 text-accent"><dt>Discount</dt><dd>−{formatPrice(discount / 100)}</dd></div>}
              <div className="flex justify-between gap-4 border-t border-border pt-5 text-lg font-semibold"><dt>Total</dt><dd>{formatPrice(total / 100)}</dd></div>
            </dl>
            <Button className="mt-7 h-12 w-full rounded-full" size="lg" disabled={isCheckingOut} onClick={proceed}>
              {isCheckingOut ? <><Loader2 aria-hidden="true" className="animate-spin" /> Opening checkout…</> : <>Continue to checkout <ArrowRight aria-hidden="true" /></>}
            </Button>
            <p className="mt-5 flex items-start gap-2 text-xs leading-relaxed text-muted-foreground"><ShieldCheck aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-accent" /> Payment is completed on Paystack. Access is added to your Nurexi account after confirmation.</p>
          </aside>
        </div>
      </div>
    </main>
  );
}
