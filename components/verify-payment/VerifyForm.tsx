"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { validReference } from "@/lib/payments/contracts";

export default function VerifyForm({ initialReference = "" }: { initialReference?: string }) {
  const router = useRouter();
  const [reference, setReference] = useState(initialReference);
  const [error, setError] = useState("");
  const [opening, setOpening] = useState(false);
  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (opening) return;
    if (!validReference(reference.trim())) { setError("Enter a valid transaction reference from your receipt."); return; }
    setOpening(true);
    // Recovery and the provider callback use exactly the same reconciliation screen.
    router.push(`/payment/success?reference=${encodeURIComponent(reference.trim())}`);
  }
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="reference">Transaction reference</Label>
        <Input id="reference" value={reference} onChange={(event) => setReference(event.target.value)} disabled={opening} required aria-describedby="reference-help" aria-invalid={!!error} />
        <p id="reference-help" className="text-sm text-muted-foreground">Use the reference from your payment receipt or confirmation page.</p>
      </div>
      {error && <p role="alert">{error}</p>}
      <Button type="submit" disabled={opening} className="w-full">{opening ? "Opening payment…" : "Check payment and access"}</Button>
    </form>
  );
}
