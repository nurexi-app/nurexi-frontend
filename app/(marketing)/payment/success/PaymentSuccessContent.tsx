"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { useAppDispatch } from "@/hooks/StoreHooks";
import { removePurchasedBundles } from "@/lib/features/cart/cartSlice";
import { setExamSession, setExamDuration, startExam } from "@/lib/features/exam/examSlice";
import type { PaymentResult, PurchasedSession } from "@/lib/payments/contracts";

export default function PaymentSuccessContent() {
  const router = useRouter();
  const reference = useSearchParams().get("reference")?.trim() || "";
  const dispatch = useAppDispatch();
  const [result, setResult] = useState<PaymentResult | null>(null);
  const [error, setError] = useState("");
  const [needsLogin, setNeedsLogin] = useState(false);
  const [checking, setChecking] = useState(true);
  const [retry, setRetry] = useState(0);
  const [starting, setStarting] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const controller = new AbortController();
    let attempts = 0;
    async function check() {
      if (!reference) {
        setError("The payment reference is missing. Enter it from your receipt to check your payment.");
        setChecking(false);
        return;
      }
      setChecking(true);
      setError("");
      setNeedsLogin(false);
      try {
        const response = await fetch("/api/paystack/verify", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ reference }),
          signal: AbortSignal.any([controller.signal, AbortSignal.timeout(30000)]),
        });
        const data = await response.json();
        if (cancelled) return;
        if (response.status === 401) setNeedsLogin(true);
        if (!response.ok) throw new Error(data.error || "Unable to check payment. Please try again.");
        const payment = data as PaymentResult;
        setResult(payment);
        if (["success", "access_pending"].includes(payment.status)) {
          dispatch(removePurchasedBundles(payment.bundleIds));
        }
        if ((payment.status === "pending" || payment.status === "access_pending") && ++attempts < 6) {
          timer = setTimeout(check, 4000);
        }
      } catch (cause) {
        if (!cancelled) setError(cause instanceof Error && cause.name !== "TimeoutError" ? cause.message : "The connection timed out. Check again before paying again.");
      } finally { if (!cancelled) setChecking(false); }
    }
    void check();
    return () => { cancelled = true; controller.abort(); clearTimeout(timer); };
  }, [reference, retry, dispatch]);

  function handleStart(session: PurchasedSession) {
    if (starting !== null) return;
    setStarting(session.id);
    dispatch(setExamSession(session.id));
    dispatch(setExamDuration(90 * 60));
    dispatch(startExam(session.examCode.toLowerCase()));
    router.push(`/learner/exam/${encodeURIComponent(session.examCode)}/${session.id}`);
  }

  const success = result?.status === "success" && !error;
  const title = error ? "Payment needs checking" : success ? "Your exam sessions are ready"
    : result?.status === "access_pending" ? "Payment received — checking access"
    : result?.status === "failed" ? "Payment unsuccessful"
    : result?.status === "refunded" ? "Payment reversed"
    : result?.status === "expired" ? "Access has expired"
    : "Checking your payment";
  const recoveryUrl = `/verify-payment?reference=${encodeURIComponent(reference)}`;
  const loginUrl = `/login?redirect=${encodeURIComponent(`/payment/success?reference=${encodeURIComponent(reference)}`)}`;

  return (
    <section className="mx-auto max-w-2xl px-4 py-16 mt-10 space-y-6">
      <div role="status" aria-live="polite" aria-atomic="true" className="text-center space-y-3">
        {success ? <CheckCircle aria-hidden="true" className="mx-auto h-12 w-12 text-green-700" />
          : checking ? <Loader2 aria-hidden="true" className="mx-auto h-12 w-12 animate-spin" />
          : <AlertCircle aria-hidden="true" className="mx-auto h-12 w-12 text-amber-700" />}
        <h1 className="text-2xl font-semibold">{title}</h1>
        <p>{error || result?.message || "Please wait while we confirm your payment and access."}</p>
      </div>
      {reference && <p className="text-sm text-muted-foreground break-all text-center">Reference: {reference}</p>}
      {success && result.sessions.map((session) => (
        <div key={session.id} className="rounded-xl border p-5 space-y-3">
          <h2 className="text-lg font-semibold">{session.name}</h2>
          <p className="text-sm text-muted-foreground">Ready to use · 90-minute mock exam</p>
          <Button className="w-full min-h-12 whitespace-normal" disabled={starting !== null} onClick={() => handleStart(session)}>
            {starting === session.id ? "Opening exam…" : `Start Exam — ${session.name}`}
          </Button>
        </div>
      ))}
      {!success && <div className="flex flex-col sm:flex-row gap-3 justify-center">
        {needsLogin ? <Button asChild><Link href={loginUrl}>Sign in to confirm access</Link></Button>
          : reference && <Button disabled={checking} onClick={() => setRetry((value) => value + 1)}>{checking ? "Checking…" : "Check payment again"}</Button>}
        <Button asChild variant="outline"><Link href={recoveryUrl}>Enter payment reference</Link></Button>
        {result?.status === "failed" && <Button asChild variant="outline"><Link href="/checkout">Return to checkout</Link></Button>}
        {result?.status === "pending" && result.checkoutUrl && <Button asChild variant="outline"><a href={result.checkoutUrl}>Continue existing payment</a></Button>}
      </div>}
      <p className="text-center text-sm"><a className="underline" href={`mailto:legal@mails.nurexi.com?subject=${encodeURIComponent(`Bundle payment help: ${reference}`)}`}>Contact support about this payment</a></p>
    </section>
  );
}
