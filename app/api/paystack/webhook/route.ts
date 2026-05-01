import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function POST(req: NextRequest) {
  try {
    const signature = req.headers.get("x-paystack-signature");
    const body = await req.text();

    // Verify signature
    const hash = crypto
      .createHmac("sha512", process.env.PAYSTACK_SECRET_KEY!)
      .update(body)
      .digest("hex");

    if (hash !== signature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const event = JSON.parse(body);
    const supabase = supabaseAdmin;

    if (event.event === "charge.success") {
      const { reference, metadata, amount } = event.data;

      // IDEMPOTENCY CHECK: Check if already processed
      const { data: existing, error: fetchError } = await supabase
        .from("purchases")
        .select("status")
        .eq("payment_reference", reference)
        .maybeSingle();

      if (fetchError) {
        console.error("Error checking existing purchase:", fetchError);
        return NextResponse.json(
          { error: "Failed to check purchase status" },
          { status: 500 },
        );
      }

      // If already completed, skip processing
      if (existing?.status === "completed") {
        return NextResponse.json({
          received: true,
          message: "Already processed",
        });
      }

      // If already processing or failed, decide what to do
      if (existing?.status === "processing") {
        // You could wait or skip - for now, skip
        return NextResponse.json({
          received: true,
          message: "Already processing",
        });
      }

      // Verify with Paystack
      const verifyRes = await fetch(
        `https://api.paystack.co/transaction/verify/${reference}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          },
        },
      );
      const verification = await verifyRes.json();

      if (verification.data.status === "success") {
        // Update purchases from pending/completed
        const { error: updateError } = await supabase
          .from("purchases")
          .update({
            status: "completed",
            updated_at: new Date().toISOString(),
          })
          .eq("payment_reference", reference)
          .in("status", ["pending", "processing"]); // Update both pending and processing

        if (updateError) {
          return NextResponse.json(
            { error: "Failed to update purchases" },
            { status: 500 },
          );
        }
      } else {
        // Payment verification failed
        await supabase
          .from("purchases")
          .update({
            status: "failed",
            updated_at: new Date().toISOString(),
          })
          .eq("payment_reference", reference);
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ received: true });
  }
}
