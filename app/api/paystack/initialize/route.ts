import { randomUUID } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { paystackRequest } from "@/lib/payments/paystack";

const schema = z.object({
  email: z.email(),
  expectedAmount: z.number().int().positive().max(Number.MAX_SAFE_INTEGER),
  items: z.array(z.object({ id: z.uuid(), type: z.literal("bundle"), quantity: z.literal(1) })).min(1).max(50),
});

export async function POST(req: NextRequest) {
  let reference: string | undefined;
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Please sign in to continue." }, { status: 401 });
    const parsed = schema.safeParse(await req.json().catch(() => null));
    if (!parsed.success || new Set(parsed.data.items.map((item) => item.id)).size !== parsed.data.items.length) {
      return NextResponse.json({ error: "Choose each bundle once and enter a valid receipt email." }, { status: 400 });
    }
    const { email, items, expectedAmount } = parsed.data;
    const callback = new URL("/payment/success", process.env.NEXT_PUBLIC_APP_URL);
    if (!process.env.PAYSTACK_SECRET_KEY) throw new Error("Payment configuration missing");
    const proposedReference = `TX_${randomUUID()}`;
    const { data: reservation, error } = await supabaseAdmin.rpc("reserve_bundle_payment", {
      p_user_id: user.id, p_reference: proposedReference,
      p_bundle_ids: items.map((item) => item.id), p_expected_amount: expectedAmount,
    });
    if (error || !reservation) throw new Error("Purchase reservation failed");
    if (reservation.status !== "reserved") {
      const messages: Record<string, string> = {
        owned: "You already own a bundle in this cart. Remove it before paying.",
        pending: "A payment for this bundle already exists. Check that payment before starting another.",
        unavailable: "A bundle is no longer available. Please return to Explore and update your cart.",
        price_changed: "The price has changed. Please remove and re-add the bundle to review the current price before paying.",
      };
      return NextResponse.json({ error: messages[reservation.status] || "Unable to start checkout.", reference: reservation.reference }, { status: 409 });
    }
    reference = proposedReference;
    const payment = await paystackRequest("transaction/initialize", {
      email, amount: Number(reservation.amount), currency: "NGN", reference,
      callback_url: callback.toString(), metadata: { user_id: user.id, items },
    });
    const url = new URL(payment.authorization_url);
    if (url.protocol !== "https:" || url.hostname !== "checkout.paystack.com") throw new Error("Invalid checkout URL");
    const { error: saveError } = await supabaseAdmin.from("purchases")
      .update({ checkout_url: url.toString() }).eq("payment_reference", reference).eq("user_id", user.id);
    if (saveError) throw new Error("Checkout could not be saved");
    return NextResponse.json({ authorization_url: url.toString(), reference });
  } catch (error) {
    console.error("Bundle checkout initialization failed", error instanceof Error ? error.message : "Unknown error");
    // An interrupted request may already exist at Paystack. Never release its reservation
    // merely because our response was lost: doing so could allow another charge.
    return NextResponse.json({
      error: reference ? "We could not finish opening checkout. Check this payment before trying again." : "Checkout is temporarily unavailable. Please try again.",
      reference,
    }, { status: 503 });
  }
}
