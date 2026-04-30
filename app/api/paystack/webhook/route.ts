import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function POST(req: NextRequest) {
  try {
    const signature = req.headers.get("x-paystack-signature");
    const body = await req.text();

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
        // Update purchases from pending to completed
        const { error: updateError } = await supabase
          .from("purchases")
          .update({
            status: "completed",
            updated_at: new Date().toISOString(),
          })
          .eq("payment_reference", reference)
          .eq("status", "pending");

        if (updateError) {
          return NextResponse.json(
            { error: "Failed to update purchases" },
            { status: 500 },
          );
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch {
    return NextResponse.json({ received: true });
  }
}
