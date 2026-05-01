"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface VerifyFormProps {
  userId: string;
}

type VerificationStatus =
  | "idle"
  | "loading"
  | "success"
  | "failed"
  | "pending"
  | "not_found";

export default function VerifyForm({ userId }: VerifyFormProps) {
  const router = useRouter();
  const [reference, setReference] = useState("");
  const [status, setStatus] = useState<VerificationStatus>("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!reference.trim()) {
      toast.error("Please enter a transaction reference");
      return;
    }

    setStatus("loading");
    setMessage("");

    try {
      const response = await fetch("/api/paystack/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reference, userId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Verification failed");
      }

      setStatus(data.status);
      setMessage(data.message);

      if (data.status === "success") {
        toast.success("Payment verified! Access granted.");
        setTimeout(() => {
          router.push("/learner");
        }, 2000);
      } else if (data.status === "pending") {
        toast.info("Payment still processing");
      } else {
        toast.error(data.message || "Verification failed");
      }
    } catch (error) {
      setStatus("failed");
      setMessage(
        error instanceof Error ? error.message : "Something went wrong",
      );
      toast.error("Failed to verify payment");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="reference">Transaction Reference</Label>
        <Input
          id="reference"
          type="text"
          placeholder="e.g., TX_0000000000000_o1k24"
          value={reference}
          onChange={(e) => setReference(e.target.value)}
          disabled={status === "loading"}
        />
        <p className="text-xs text-muted-foreground">
          Found in your payment confirmation email from Paystack
        </p>
      </div>

      <Button type="submit" disabled={status === "loading"} className="w-full">
        {status === "loading" ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Verifying...
          </>
        ) : (
          "Verify Payment"
        )}
      </Button>

      {/* Result Messages */}
      {status !== "idle" && status !== "loading" && (
        <div
          className={`p-4 rounded-lg ${
            status === "success"
              ? "bg-green-50 border border-green-200"
              : status === "pending"
                ? "bg-yellow-50 border border-yellow-200"
                : "bg-red-50 border border-red-200"
          }`}
        >
          <div className="flex items-start gap-3">
            {status === "success" && (
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
            )}
            {status === "pending" && (
              <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
            )}
            {(status === "failed" || status === "not_found") && (
              <XCircle className="h-5 w-5 text-red-600 mt-0.5" />
            )}

            <div>
              <p
                className={`font-medium ${
                  status === "success"
                    ? "text-green-800"
                    : status === "pending"
                      ? "text-yellow-800"
                      : "text-red-800"
                }`}
              >
                {status === "success" && "✓ Payment Verified!"}
                {status === "pending" && "⏳ Payment Processing"}
                {status === "failed" && "✗ Payment Failed"}
                {status === "not_found" && "🔍 Transaction Not Found"}
              </p>
              <p
                className={`text-sm mt-1 ${
                  status === "success"
                    ? "text-green-700"
                    : status === "pending"
                      ? "text-yellow-700"
                      : "text-red-700"
                }`}
              >
                {message}
              </p>
              {status === "success" && (
                <Button
                  variant="link"
                  className="p-0 h-auto mt-2 text-green-700"
                  onClick={() => router.push("/learner")}
                >
                  Go to your dashboard →
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </form>
  );
}
