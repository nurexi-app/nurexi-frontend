"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Loader2 } from "lucide-react";
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
    const value = reference.trim();
    if (!validReference(value)) {
      setError("Enter a valid transaction reference from your receipt.");
      return;
    }
    setError("");
    setOpening(true);
    router.push(`/payment/success?reference=${encodeURIComponent(value)}`);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="reference">Transaction reference</Label>
        <Input id="reference" value={reference} onChange={(event) => setReference(event.target.value)} disabled={opening} required autoComplete="off" aria-describedby="reference-help reference-error" aria-invalid={!!error} className="h-12 rounded-xl" />
        <p id="reference-help" className="text-sm leading-relaxed text-muted-foreground">You can find it on the Paystack confirmation page or payment receipt.</p>
        {error && <p id="reference-error" role="alert" className="text-sm text-destructive">{error}</p>}
      </div>
      <Button type="submit" disabled={opening} className="h-12 w-full rounded-full">
        {opening ? <><Loader2 aria-hidden="true" className="animate-spin" /> Opening payment…</> : <>Check payment <ArrowRight aria-hidden="true" /></>}
      </Button>
    </form>
  );
}
