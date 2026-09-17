import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ReceiptText } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import VerifyForm from "@/components/verify-payment/VerifyForm";

export const metadata: Metadata = {
  title: "Verify payment | Nurexi",
  description: "Check a Nurexi payment and confirm access to purchased exam preparation.",
  robots: { index: false, follow: false },
};

export default async function VerifyPaymentPage({ searchParams }: { searchParams: Promise<{ reference?: string }> }) {
  const { reference = "" } = await searchParams;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect(`/login?redirect=${encodeURIComponent(`/verify-payment?reference=${encodeURIComponent(reference)}`)}`);

  return (
    <main className="min-h-screen bg-secondary/40 px-6 py-16 text-foreground sm:px-10 sm:py-24">
      <section className="mx-auto max-w-xl rounded-4xl border border-border bg-card p-7 sm:p-10" aria-labelledby="verify-heading">
        <span className="flex size-12 items-center justify-center rounded-full bg-secondary text-accent"><ReceiptText aria-hidden="true" className="size-6" /></span>
        <p className="mt-7 text-xs font-bold uppercase tracking-[0.2em] text-accent">Payment recovery</p>
        <h1 id="verify-heading" className="mt-4 text-[clamp(2.3rem,5vw,3.8rem)] font-semibold leading-[1.05] tracking-[-0.05em]">Check your payment and access.</h1>
        <p className="mt-5 text-base leading-relaxed text-muted-foreground">Enter the transaction reference from your receipt. We will check the existing payment; you will not be charged again.</p>
        <div className="mt-8"><VerifyForm initialReference={reference} /></div>
      </section>
    </main>
  );
}
