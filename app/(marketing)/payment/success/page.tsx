"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle, AlertCircle, WifiOff } from "lucide-react";
import { useDispatch } from "react-redux";
import { clearCart } from "@/lib/features/cart/cartSlice";
import { createClient } from "@/lib/supabase/client";

type PaymentStatus =
  | "loading"
  | "success"
  | "processing"
  | "network_error"
  | "not_found"
  | "timeout";

export default function PaymentSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();
  const dispatch = useDispatch();

  const reference = searchParams.get("reference");

  const [status, setStatus] = useState<PaymentStatus>("loading");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [attempts, setAttempts] = useState(0);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    if (!reference) {
      router.push("/cart");
      return;
    }

    const verifyPayment = async () => {
      try {
        // Get current user
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError) {
          // Network error vs auth error
          if (
            userError.message.includes("fetch failed") ||
            userError.message.includes("network")
          ) {
            setStatus("network_error");
            setErrorMessage(
              "Unable to connect. Please check your internet connection.",
            );
          } else {
            setStatus("not_found");
            setErrorMessage("Please login to verify your payment.");
            setTimeout(
              () =>
                router.push(
                  `/login?redirect=/payment/success?reference=${reference}`,
                ),
              3000,
            );
          }
          return;
        }

        if (!user) {
          setStatus("not_found");
          setErrorMessage("Please login to verify your payment.");
          setTimeout(
            () =>
              router.push(
                `/login?redirect=/payment/success?reference=${reference}`,
              ),
            3000,
          );
          return;
        }

        // Check purchase status
        const { data: purchases, error: purchaseError } = await supabase
          .from("purchases")
          .select("status")
          .eq("payment_reference", reference)
          .eq("user_id", user.id);

        if (purchaseError) {
          // Network error during purchase check
          if (
            purchaseError.message.includes("fetch failed") ||
            purchaseError.message.includes("network")
          ) {
            setStatus("network_error");
            setErrorMessage("Connection issue. Retrying...");
            // Auto retry after 3 seconds
            setTimeout(() => {
              if (retryCount < 3) {
                setRetryCount((prev) => prev + 1);
              } else {
                setStatus("processing");
                setErrorMessage(
                  "We're having trouble confirming your payment. You will receive an email confirmation.",
                );
              }
            }, 3000);
          } else {
            setStatus("processing");
            setErrorMessage(
              "Your payment is being processed. You will receive an email confirmation shortly.",
            );
          }
          return;
        }

        const hasCompleted = purchases?.some((p) => p.status === "completed");
        const hasPending = purchases?.some((p) => p.status === "pending");

        if (hasCompleted) {
          // Success! Clear cart and show success
          dispatch(clearCart());
          setStatus("success");
        } else if (hasPending) {
          // Still pending - webhook hasn't processed yet
          if (attempts < 10) {
            setTimeout(() => {
              setAttempts((prev) => prev + 1);
            }, 2000);
          } else {
            setStatus("processing");
            setErrorMessage(
              "Your payment is still being processed. You will receive an email confirmation shortly.",
            );
          }
        } else {
          // No purchase found with this reference
          setStatus("not_found");
          setErrorMessage(
            "We couldn't find a purchase with this reference. Please contact support.",
          );
        }
      } catch (err) {
        // Unexpected error
        setStatus("processing");
        setErrorMessage(
          "Something went wrong. You will receive an email confirmation if payment was successful.",
        );
      }
    };

    verifyPayment();
  }, [reference, supabase, router, attempts, retryCount, dispatch]);

  // Loading state
  if (status === "loading") {
    return (
      <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <h1 className="text-xl font-semibold mb-2">
          Verifying your payment...
        </h1>
        <p className="text-muted-foreground">
          Please wait, this may take a few seconds.
        </p>
      </div>
    );
  }

  // Network error state
  if (status === "network_error") {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <WifiOff className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-2">Connection Issue</h1>
        <p className="text-muted-foreground mb-4">{errorMessage}</p>
        <div className="flex gap-4 justify-center">
          <Button onClick={() => window.location.reload()}>Try Again</Button>
          <Link href="/learner/my-learning">
            <Button variant="outline">Check My Learning</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Not found / auth error
  if (status === "not_found") {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <AlertCircle className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-2">Verification Issue</h1>
        <p className="text-muted-foreground mb-6">{errorMessage}</p>
        <div className="flex gap-4 justify-center">
          <Link href="/learner/my-learning">
            <Button>Go to My Learning</Button>
          </Link>
          <Link href="/explore">
            <Button variant="outline">Continue Exploring</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Processing state (payment confirmed but still pending in DB)
  if (status === "processing") {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <Loader2 className="h-16 w-16 text-primary animate-spin mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-2">Payment Processing</h1>
        <p className="text-muted-foreground mb-4">{errorMessage}</p>
        <p className="text-sm text-muted-foreground mb-6">
          Reference: {reference}
        </p>
        <div className="flex gap-4 justify-center">
          <Button onClick={() => window.location.reload()}>Check Again</Button>
          <Link href="/learner/my-learning">
            <Button variant="outline">Check My Learning</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Success state
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
      <h1 className="text-2xl font-bold mb-2">Payment Successful!</h1>
      <p className="text-muted-foreground mb-6">
        Your order has been confirmed. Your bundles are now available in your
        learning dashboard.
      </p>
      <div className="flex gap-4 justify-center">
        <Link href="/learner/my-learning">
          <Button size="lg">Go to My Learning</Button>
        </Link>
        <Link href="/explore">
          <Button size="lg" variant="outline">
            Continue Exploring
          </Button>
        </Link>
      </div>
    </div>
  );
}
