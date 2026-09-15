import { createHmac, timingSafeEqual } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { reconcilePayment } from "@/lib/payments/paystack";
import { validReference } from "@/lib/payments/contracts";

export async function POST(req: NextRequest) {
  try {
    const secret = process.env.PAYSTACK_SECRET_KEY;
    if (!secret) throw new Error("Payment configuration missing");
    const signature = req.headers.get("x-paystack-signature");
    const body = await req.text();
    const digest = createHmac("sha512", secret).update(body).digest("hex");
    if (!signature || !/^[a-f0-9]{128}$/i.test(signature) ||
        !timingSafeEqual(Buffer.from(digest, "hex"), Buffer.from(signature, "hex"))) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }
    const event = JSON.parse(body);
    if (event.event !== "charge.success") return NextResponse.json({ received: true });
    if (!validReference(event.data?.reference)) return NextResponse.json({ error: "Invalid reference" }, { status: 400 });
    const result = await reconcilePayment(event.data.reference);
    if (result.status !== "paid" && result.status !== "refunded") throw new Error("Successful charge is not reconciled yet");
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Bundle webhook processing failed", error instanceof Error ? error.message : "Unknown error");
    // Non-2xx asks Paystack to retry; never acknowledge an unprocessed charge.
    return NextResponse.json({ error: "Payment processing needs to be retried." }, { status: 503 });
  }
}
