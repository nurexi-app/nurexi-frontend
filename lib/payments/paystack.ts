import { supabaseAdmin } from "@/lib/supabase/admin";
import { resend } from "@/lib/email/resend";
import { classifyProviderStatus, validateTransaction, type Purchase, type VerifiedTransaction } from "./contracts";

export class PaymentError extends Error {
  constructor(message: string, public statusCode = 503) { super(message); }
}

export async function paystackRequest(path: string, body?: unknown) {
  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret) throw new PaymentError("Payment service is unavailable.");
  const response = await fetch(`https://api.paystack.co/${path}`, {
    method: body ? "POST" : "GET",
    headers: { Authorization: `Bearer ${secret}`, "Content-Type": "application/json" },
    ...(body ? { body: JSON.stringify(body) } : {}),
    cache: "no-store",
    signal: AbortSignal.timeout(15000),
  });
  const data = await response.json();
  if (!response.ok || data.status !== true || !data.data) {
    throw new PaymentError("We could not confirm the payment with Paystack. Please check again before paying again.");
  }
  return data.data;
}

export async function reconcilePayment(reference: string, userId?: string) {
  // Read the whole transaction, not a subset that could conceal a mismatched owner.
  const { data, error } = await supabaseAdmin.from("purchases")
    .select("id,user_id,bundle_id,amount_paid,status,expires_at")
    .eq("payment_reference", reference);
  if (error) throw new PaymentError("Unable to read purchase status. Please check again.");
  const rows = (data || []) as Purchase[];
  if (!rows.length || (userId && rows.some((row) => row.user_id !== userId))) {
    throw new PaymentError("No purchase with this reference was found for your account.", 404);
  }
  const transaction = await paystackRequest(`transaction/verify/${encodeURIComponent(reference)}`) as VerifiedTransaction;
  let amount: number;
  try { amount = validateTransaction(rows, transaction, reference); }
  catch { throw new PaymentError("Payment details do not match this purchase. Please contact support.", 409); }
  const state = classifyProviderStatus(transaction.status);
  if (state !== "pending") {
    // One database transaction locks and updates every item; concurrent webhook/callback
    // requests cannot overwrite a completed/refunded transaction with a stale failure.
    const { error: updateError } = await supabaseAdmin.rpc("reconcile_bundle_payment", {
      p_reference: reference,
      p_user_id: rows[0].user_id,
      p_amount: amount,
      p_status: state === "paid" ? "completed" : state,
    });
    if (updateError) throw new PaymentError("Payment confirmation could not be saved. Please check again.");
  }
  const { data: current, error: currentError } = await supabaseAdmin.from("purchases")
    .select("id,user_id,bundle_id,amount_paid,status,expires_at")
    .eq("payment_reference", reference);
  if (currentError || !current || current.length !== rows.length) {
    throw new PaymentError("Unable to confirm all purchased bundles. Please check again.");
  }
  const purchases = current as Purchase[];
  const completed = purchases.every((row) => row.status === "completed");
  if (completed && rows.some((row) => row.status !== "completed") && transaction.customer?.email) {
    // Provider idempotency prevents duplicate receipts from webhook/callback races.
    // Email delivery must never turn a fulfilled purchase into a payment error.
    try {
      const url = new URL("/payment/success", process.env.NEXT_PUBLIC_APP_URL);
      url.searchParams.set("reference", reference);
      const result = await resend.emails.send({
        from: "Nurexi Receipts <receipts@mails.nurexi.com>",
        to: transaction.customer.email,
        subject: "Your Nurexi bundle payment is confirmed",
        text: `Your payment of NGN ${(amount / 100).toFixed(2)} is confirmed.\nReference: ${reference}\nView your purchased exam sessions: ${url.toString()}`,
      }, { idempotencyKey: `bundle-receipt/${reference}` });
      if (result.error) console.error("Bundle receipt delivery failed", result.error.name);
    } catch { console.error("Bundle receipt delivery failed"); }
  }
  return {
    purchases,
    status: purchases.some((row) => row.status === "refunded") ? "refunded" as const
      : completed ? "paid" as const
      : purchases.every((row) => row.status === "failed") ? "failed" as const : "pending" as const,
  };
}
