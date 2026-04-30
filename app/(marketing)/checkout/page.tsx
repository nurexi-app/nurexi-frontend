"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { formatPrice } from "@/lib/utils";

export default function CheckoutPage() {
  const router = useRouter();
  const supabase = createClient();
  const { items, discount } = useSelector((state: RootState) => state.cart);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [email, setEmail] = useState("");

  // Calculate totals
  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const total = (subtotal - discount) / 100;
  const grandTotal = total;

  // Check authentication on page load
  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        localStorage.setItem("redirectAfterLogin", "/checkout");
        router.push("/login");
        return;
      }

      setUser(user);
      setEmail(user.email || "");
      setIsLoading(false);
    };

    checkAuth();
  }, [supabase, router]);

  // Redirect if cart is empty
  useEffect(() => {
    if (!isLoading && items.length === 0) {
      router.push("/cart");
      toast.error("Your cart is empty");
    }
  }, [isLoading, items.length, router]);

  const handleCheckout = async () => {
    if (!email) {
      toast.error("Please enter your email");
      return;
    }

    setIsProcessing(true);

    try {
      // Step 1: Initialize transaction with your backend
      const response = await fetch("/api/paystack/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          amount: grandTotal,
          items: items.map((item) => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            type: item.type,
          })),
          userId: user.id,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to initialize payment");
      }

      // Step 2: Redirect to Paystack payment page
      window.location.href = data.authorization_url;
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Payment initialization failed",
      );
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16 flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="container mt-18 mx-auto px-4 py-8 ">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/cart">
          <Button variant="ghost" size="icon">
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
                  <span>-${formatPrice(discount)}</span>
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

            <Button
              onClick={handleCheckout}
              disabled={isProcessing || !email}
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
              You will be redirected to Paystack's secure payment page
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
