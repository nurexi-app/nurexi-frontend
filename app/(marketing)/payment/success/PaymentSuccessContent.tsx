"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { AlertCircle, ArrowRight, CheckCircle2, Clock3, Loader2, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useAppDispatch } from "@/hooks/StoreHooks";
import { setExamDuration, setExamSession, startExam } from "@/lib/features/exam/examSlice";
import { removePurchasedBundles } from "@/lib/features/cart/cartSlice";
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
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ reference }),
          signal: AbortSignal.any([controller.signal, AbortSignal.timeout(30000)]),
        });
        const data = await response.json();
        if (cancelled) return;
        if (response.status === 401) setNeedsLogin(true);
        if (!response.ok) throw new Error(data.error || "Unable to check payment. Please try again.");

        const payment = data as PaymentResult;
        setResult(payment);
        if (["success", "access_pending"].includes(payment.status)) dispatch(removePurchasedBundles(payment.bundleIds));
        if ((payment.status === "pending" || payment.status === "access_pending") && ++attempts < 6) timer = setTimeout(check, 4000);
      } catch (cause) {
        if (!cancelled) setError(cause instanceof Error && cause.name !== "TimeoutError" ? cause.message : "The connection timed out. Check again before paying again.");
      } finally {
        if (!cancelled) setChecking(false);
      }
    }

    void check();
    return () => {
      cancelled = true;
      controller.abort();
      clearTimeout(timer);
    };
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
  const pending = !error && (checking || result?.status === "pending" || result?.status === "access_pending");
  const title = error
    ? "Your payment needs another check."
    : success
      ? "Your exam sessions are ready."
      : result?.status === "access_pending"
        ? "Payment received. Access is being prepared."
        : result?.status === "failed"
          ? "This payment was unsuccessful."
          : result?.status === "refunded"
            ? "This payment was reversed."
            : result?.status === "expired"
              ? "This access period has expired."
              : "We’re checking your payment.";
  const message = error || result?.message || "Please wait while we confirm your payment and add access to your account.";
  const recoveryUrl = `/verify-payment?reference=${encodeURIComponent(reference)}`;
  const loginUrl = `/login?redirect=${encodeURIComponent(`/payment/success?reference=${encodeURIComponent(reference)}`)}`;

  return (
    <main className="min-h-screen bg-secondary/40 px-6 py-16 text-foreground sm:px-10 sm:py-24">
      <section className="mx-auto max-w-3xl rounded-4xl border border-border bg-card p-7 sm:p-10 lg:p-12">
        <div role="status" aria-live="polite" aria-atomic="true">
          <span className={`flex size-14 items-center justify-center rounded-full ${success ? "bg-secondary text-accent" : pending ? "bg-secondary text-foreground" : "bg-destructive/10 text-destructive"}`}>
            {success ? <CheckCircle2 aria-hidden="true" className="size-7" /> : pending ? <Loader2 aria-hidden="true" className="size-7 animate-spin" /> : <AlertCircle aria-hidden="true" className="size-7" />}
          </span>
          <p className="mt-8 text-xs font-bold uppercase tracking-[0.2em] text-accent">Payment status</p>
          <h1 className="mt-4 text-[clamp(2.4rem,5vw,4.5rem)] font-semibold leading-[1.05] tracking-[-0.05em]">{title}</h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">{message}</p>
        </div>

        {reference && <div className="mt-7 rounded-2xl bg-secondary/60 p-4"><p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Transaction reference</p><p className="mt-1 break-all text-sm font-semibold">{reference}</p></div>}

        {success && (
          <div className="mt-10 space-y-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground"><ShieldCheck aria-hidden="true" className="size-4 text-accent" /> Access is linked to your Nurexi account.</div>
            {result.sessions.map((session) => (
              <article key={session.id} className="rounded-3xl border border-border p-6 sm:flex sm:items-center sm:justify-between sm:gap-6">
                <div><h2 className="text-lg font-semibold">{session.name}</h2><p className="mt-2 flex items-center gap-2 text-sm text-muted-foreground"><Clock3 aria-hidden="true" className="size-4" /> 90-minute mock exam</p></div>
                <Button className="mt-5 min-h-12 w-full rounded-full whitespace-normal sm:mt-0 sm:w-auto" disabled={starting !== null} onClick={() => handleStart(session)}>
                  {starting === session.id ? <><Loader2 aria-hidden="true" className="animate-spin" /> Opening exam…</> : <>Start exam <ArrowRight aria-hidden="true" /></>}
                </Button>
              </article>
            ))}
          </div>
        )}

        {!success && (
          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            {needsLogin ? (
              <Button asChild className="h-12 rounded-full px-6"><Link href={loginUrl}>Sign in to confirm access</Link></Button>
            ) : reference ? (
              <Button className="h-12 rounded-full px-6" disabled={checking} onClick={() => setRetry((value) => value + 1)}>{checking ? "Checking…" : "Check payment again"}</Button>
            ) : null}
            <Button asChild variant="outline" className="h-12 rounded-full px-6"><Link href={recoveryUrl}>Enter payment reference</Link></Button>
            {result?.status === "failed" && <Button asChild variant="outline" className="h-12 rounded-full px-6"><Link href="/checkout">Return to checkout</Link></Button>}
            {result?.status === "pending" && result.checkoutUrl && <Button asChild variant="outline" className="h-12 rounded-full px-6"><a href={result.checkoutUrl}>Continue existing payment</a></Button>}
          </div>
        )}

        <p className="mt-9 border-t border-border pt-6 text-sm text-muted-foreground">Need help? <a className="font-semibold text-foreground underline underline-offset-4 hover:text-accent" href={`mailto:support@mails.nurexi.com?subject=${encodeURIComponent(`Bundle payment help: ${reference}`)}`}>Contact support about this payment</a>.</p>
      </section>
    </main>
  );
}
