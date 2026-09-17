"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ExternalLink, Loader2, LockKeyhole, ReceiptText } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { RootState } from "@/lib/store";
import { formatPrice } from "@/lib/utils";

interface CheckoutUser {
  success: boolean;
  data: { id: string; email?: string } | null;
}

export default function Checkout({ userObj }: { userObj: CheckoutUser }) {
  const router = useRouter();
  const { items, discount } = useSelector((state: RootState) => state.cart);
  const requestInFlight = useRef(false);
  const user = userObj.data;
  const [email, setEmail] = useState(user?.email || "");
  const [checkoutError, setCheckoutError] = useState("");
  const [paymentReference, setPaymentReference] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalKobo = Math.max(0, subtotal - discount);

  useEffect(() => {
    if (!user) router.replace(`/login?redirect=${encodeURIComponent("/checkout")}`);
    else if (items.length === 0) router.replace("/cart");
  }, [user, items.length, router]);

  async function handleCheckout() {
    if (requestInFlight.current || !user) return;
    if (!email.trim()) {
      toast.error("Enter the email address for your receipt.");
      return;
    }

    requestInFlight.current = true;
    setIsProcessing(true);
    setCheckoutError("");
    setPaymentReference("");

    try {
      const response = await fetch("/api/paystack/initialize", {
        method: "POST",
        signal: AbortSignal.timeout(30000),
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          expectedAmount: totalKobo,
          items: items.map((item) => ({ id: item.id, type: item.type, quantity: item.quantity })),
        }),
      });
      const data = await response.json();
      if (data.reference) setPaymentReference(data.reference);
      if (!response.ok) throw new Error(data.error || "Failed to initialize payment");

      const url = new URL(data.authorization_url);
      if (url.protocol !== "https:" || url.hostname !== "checkout.paystack.com") throw new Error("Unable to open secure checkout.");
      window.location.href = url.toString();
    } catch (cause) {
      requestInFlight.current = false;
      const message = cause instanceof Error ? cause.message : "Unable to open payment. Please check again.";
      setCheckoutError(message);
      toast.error(message);
      setIsProcessing(false);
    }
  }

  if (items.length === 0) return null;

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-300 px-6 py-16 sm:px-10 sm:py-20 lg:px-16 lg:py-24">
        <Link href="/cart" className="arrow-link inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground transition-colors hover:text-accent"><ArrowLeft aria-hidden="true" data-link-arrow="back" className="size-4" /> Back to cart</Link>
        <div className="mt-8 max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-[0.23em] text-accent">Secure checkout</p>
          <h1 className="mt-5 text-[clamp(2.8rem,5vw,5rem)] font-semibold leading-[1.04] tracking-[-0.055em]">Confirm and pay.</h1>
          <p className="mt-5 text-lg leading-relaxed text-muted-foreground">Review your order and choose where your receipt should be sent. Paystack will handle the payment securely.</p>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-[minmax(0,1fr)_24rem] lg:items-start">
          <section className="rounded-3xl border border-border bg-card p-6 sm:p-8" aria-labelledby="order-heading">
            <h2 id="order-heading" className="text-xl font-semibold">Order summary</h2>
            <div className="mt-6 divide-y divide-border border-y border-border">
              {items.map((item) => (
                <div key={item.id} className="flex items-start justify-between gap-6 py-5">
                  <div><p className="font-semibold">{item.name}</p><p className="mt-1 text-sm text-muted-foreground">{item.type === "bundle" ? `${item.sessionCount ?? 0} exam sessions` : "Course access"}</p></div>
                  <p className="shrink-0 font-semibold">{formatPrice((item.price * item.quantity) / 100)}</p>
                </div>
              ))}
            </div>
            <dl className="mt-6 space-y-3">
              <div className="flex justify-between"><dt className="text-muted-foreground">Subtotal</dt><dd>{formatPrice(subtotal / 100)}</dd></div>
              {discount > 0 && <div className="flex justify-between text-accent"><dt>Discount</dt><dd>−{formatPrice(discount / 100)}</dd></div>}
              <div className="flex justify-between border-t border-border pt-5 text-xl font-semibold"><dt>Total</dt><dd>{formatPrice(totalKobo / 100)}</dd></div>
            </dl>
          </section>

          <section className="rounded-3xl border border-border bg-card p-6 sm:p-8 lg:sticky lg:top-24" aria-labelledby="payment-heading">
            <span className="flex size-11 items-center justify-center rounded-full bg-secondary text-accent"><ReceiptText aria-hidden="true" className="size-5" /></span>
            <h2 id="payment-heading" className="mt-6 text-xl font-semibold">Payment details</h2>
            <div className="mt-6 space-y-2">
              <Label htmlFor="email">Receipt email</Label>
              <Input id="email" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} disabled={isProcessing || !!paymentReference} className="h-12 rounded-xl" required />
              <p className="text-xs leading-relaxed text-muted-foreground">Your confirmation and payment receipt will use this address.</p>
            </div>

            {checkoutError && (
              <div role="alert" className="mt-5 rounded-2xl border border-destructive/30 bg-destructive/10 p-4 text-sm">
                <p>{checkoutError}</p>
                {paymentReference && <Link className="mt-2 inline-flex font-semibold underline underline-offset-4" href={`/payment/success?reference=${encodeURIComponent(paymentReference)}`}>Check this payment</Link>}
              </div>
            )}

            <Button onClick={handleCheckout} disabled={isProcessing || !email.trim() || !!paymentReference || !user} className="mt-6 h-12 w-full rounded-full text-base">
              {isProcessing ? <><Loader2 aria-hidden="true" className="animate-spin" /> Opening Paystack…</> : <>Pay {formatPrice(totalKobo / 100)} <ExternalLink aria-hidden="true" /></>}
            </Button>
            <p className="mt-5 flex items-start gap-2 text-xs leading-relaxed text-muted-foreground"><LockKeyhole aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-accent" /> You will leave Nurexi briefly to pay on Paystack. Return here afterward while we confirm your access.</p>
          </section>
        </div>
      </div>
    </main>
  );
}
