import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { PaymentError, reconcilePayment } from "@/lib/payments/paystack";
import { validReference, type PaymentResult, type PurchasedSession } from "@/lib/payments/contracts";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Please sign in to check your payment." }, { status: 401 });
    const body = await req.json().catch(() => null);
    const reference = typeof body?.reference === "string" ? body.reference.trim() : null;
    if (!validReference(reference)) return NextResponse.json({ error: "Enter a valid payment reference." }, { status: 400 });
    const { purchases, status } = await reconcilePayment(reference, user.id);
    const bundleIds = [...new Set(purchases.map((row) => row.bundle_id))];
    const result: PaymentResult = { status: "pending", message: "Your payment is still awaiting confirmation. Do not pay again while we check it.", bundleIds, sessions: [] };
    if (status === "pending") {
      const { data: pending } = await supabase.from("purchases").select("checkout_url")
        .eq("payment_reference", reference).eq("user_id", user.id).limit(1).maybeSingle();
      if (pending?.checkout_url) {
        const url = new URL(pending.checkout_url);
        if (url.protocol === "https:" && url.hostname === "checkout.paystack.com") result.checkoutUrl = url.toString();
      }
    }
    if (status === "failed" || status === "refunded") {
      result.status = status;
      result.message = status === "failed" ? "This payment was unsuccessful or abandoned. You can return to checkout to try again." : "This payment was reversed. Please contact support if you need help.";
    } else if (status === "paid") {
      if (purchases.some((row) => row.expires_at && new Date(row.expires_at).getTime() <= Date.now())) {
        result.status = "expired";
        result.message = "This payment was completed, but its access period has expired.";
      } else {
        // Use the learner's client so this checks both the access RPC and their RLS visibility.
        const { data: mappings, error } = await supabase.from("bundle_questions")
          .select("bundle_id,exam_session_id").in("bundle_id", bundleIds);
        if (error) throw new PaymentError("Payment received. We could not check access yet. Please check again.");
        let ready = bundleIds.every((id) => mappings?.some((row) => row.bundle_id === id));
        const sessions: PurchasedSession[] = [];
        for (const id of [...new Set((mappings || []).map((row) => row.exam_session_id))]) {
          if (!Number.isSafeInteger(id)) { ready = false; continue; }
          const { data: access, error: accessError } = await supabase.rpc("check_exam_access", { p_user_id: user.id, p_exam_session_id: id });
          const { data: session, error: sessionError } = await supabase.from("exam_session")
            .select("id,session_name,exam_id").eq("id", id).eq("is_active", true).single();
          const { data: exam } = session ? await supabase.from("exams").select("code").eq("id", session.exam_id).single() : { data: null };
          const { count, error: questionsError } = await supabase.from("questions")
            .select("id", { count: "exact", head: true }).eq("exam_session_id", id).eq("is_active", true);
          if (accessError || access !== true || sessionError || !exam?.code || questionsError || !count) {
            ready = false;
          } else sessions.push({ id, name: session.session_name || "Exam session", examCode: exam.code });
        }
        result.status = ready && sessions.length ? "success" : "access_pending";
        result.message = result.status === "success" ? "Payment confirmed. Your exam sessions are ready." : "Payment received, but we could not confirm access to every session. Please check again or contact support. Do not pay again.";
        result.sessions = result.status === "success" ? sessions : [];
      }
    }
    return NextResponse.json(result, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("Bundle verification failed", error instanceof Error ? error.message : "Unknown error");
    return NextResponse.json({ error: error instanceof PaymentError ? error.message : "We could not check your payment. Please try again before paying again." }, { status: error instanceof PaymentError ? error.statusCode : 503 });
  }
}
