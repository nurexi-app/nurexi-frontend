"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { formatPrice } from "@/lib/utils";

const Checkout = ({ userObj }: { userObj: { success: boolean; data: { id: string; email?: string } | null } }) => {
  const router = useRouter();
  const { items, discount } = useSelector((state: RootState) => state.cart);
  const requestInFlight = useRef(false);
  const [checkoutError, setCheckoutError] = useState("");
  const [paymentReference, setPaymentReference] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const user = userObj.data;
  const [email, setEmail] = useState(user?.email || "");

  // Calculate totals
  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const total = (subtotal - discount) / 100;
  const grandTotal = total;

  useEffect(() => {
    if (!user) router.replace(`/login?redirect=${encodeURIComponent("/checkout")}`);
    else if (items.length === 0) router.replace("/cart");
  }, [user, items.length, router]);

  const handleCheckout = async () => {
    if (requestInFlight.current) return;
    if (!user) {
      toast.error("Please sign in to continue");
      return;
    }

    if (!email) {
      toast.error("Please enter your email");
      return;
    }

    requestInFlight.current = true;
    setIsProcessing(true);
    setCheckoutError("");
    setPaymentReference("");

    try {
      // Step 1: Initialize transaction with your backend
      const response = await fetch("/api/paystack/initialize", {
        method: "POST",
        signal: AbortSignal.timeout(30000),
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          expectedAmount: subtotal - discount,
          items: items.map((item) => ({
            id: item.id,
            type: item.type,
            quantity: item.quantity,
          })),
        }),
      });

      const data = await response.json();

      if (data.reference) setPaymentReference(data.reference);
      if (!response.ok) {
        throw new Error(data.error || "Failed to initialize payment");
      }

      // Step 2: Redirect to Paystack payment page
      const url = new URL(data.authorization_url);
      if (url.protocol !== "https:" || url.hostname !== "checkout.paystack.com") throw new Error("Unable to open secure checkout.");
      window.location.href = url.toString();
    } catch (error) {
      requestInFlight.current = false;
      setCheckoutError(error instanceof Error ? error.message : "Unable to open payment. Please check again.");
      toast.error(
        error instanceof Error
          ? error.message
          : "Payment initialization failed",
      );
      setIsProcessing(false);
    }
  };

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="container mt-18 mx-auto px-4 py-8 ">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/cart">
          <Button variant="ghost" size="icon" aria-label="Back to cart">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Checkout</h1>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Order Summary */}
        <div className="flex-1">
          <div className="bg-white rounded-xl border p-5 space-y-4">
            <h3 className="font-semibold text-lg">Order Summary</h3>

            <div className="space-y-3">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between py-2 border-b"
                >
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Qty: {item.quantity}
                    </p>
                  </div>
                  <p>{formatPrice((item.price * item.quantity) / 100)}</p>
                </div>
              ))}
            </div>

            <div className="space-y-2 pt-4 border-t">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal / 100)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>-{formatPrice(discount / 100)}</span>
                </div>
              )}
              <div className="border-t pt-2 flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span>{formatPrice(grandTotal)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Section */}
        <div className="lg:w-96">
          <div className="bg-white rounded-xl border p-5 space-y-4">
            <h3 className="font-semibold text-lg">Contact Information</h3>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
              <p className="text-xs text-muted-foreground">
                Payment receipt will be sent to this email
              </p>
            </div>

            {checkoutError && <div role="alert" className="space-y-2 text-sm">
              <p>{checkoutError}</p>
              {paymentReference && <Link className="underline" href={`/payment/success?reference=${encodeURIComponent(paymentReference)}`}>Check existing payment</Link>}
            </div>}
            <Button
              onClick={handleCheckout}
              disabled={isProcessing || !email || !!paymentReference || !user}
              className="w-full h-12 text-base font-semibold"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Redirecting to Paystack...
                </>
              ) : (
                `Pay ${formatPrice(grandTotal)}`
              )}
            </Button>

            <p className="text-xs text-muted-foreground text-center">
              You will be redirected to Paystack’s secure payment page
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
