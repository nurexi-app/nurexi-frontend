import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { resend } from "@/lib/email/resend";

export async function POST(req: NextRequest) {
  try {
    const signature = req.headers.get("x-paystack-signature");
    const body = await req.text();

    if (!signature) {
      return NextResponse.json({ error: "Missing signature" }, { status: 401 });
    }

    // Verify signature
    const hash = crypto
      .createHmac("sha512", process.env.PAYSTACK_SECRET_KEY!)
      .update(body)
      .digest("hex");

    const valid =
      hash.length === signature.length &&
      crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(signature));

    if (!valid) {
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
        .eq("payment_reference", reference);

      if (fetchError) {
        console.error("Error checking existing purchase:", fetchError);
        return NextResponse.json(
          { error: "Failed to check purchase status" },
          { status: 500 },
        );
      }

      // If already completed, skip processing
      if (existing?.some((p: any) => p.status === "completed")) {
        return NextResponse.json({
          received: true,
          message: "Already processed",
        });
      }

      // If already processing, decide what to do
      if (existing?.some((p: any) => p.status === "processing")) {
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
        const { data: updatedRows, error: updateError } = await supabase
          .from("purchases")
          .update({
            status: "completed",
            updated_at: new Date().toISOString(),
          })
          .eq("payment_reference", reference)
          .in("status", ["pending", "processing"])
          .select(); // Update both pending and processing

        if (updateError) {
          return NextResponse.json(
            { error: "Failed to update purchases" },
            { status: 500 },
          );
        }

        // Send confirmation email if purchases were successfully updated
        if (updatedRows && updatedRows.length > 0) {
          const customerEmail = event.data.customer?.email;
          if (customerEmail) {
            try {
              await resend.emails.send({
                from: "Nurexi Receipts <receipts@mails.nurexi.com>",
                to: customerEmail,
                subject: "Payment Confirmation - Nurexi",
                html: `
                  <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
                    <h2 style="color: #2563eb;">Payment Successful!</h2>
                    <p>Thank you for your purchase.</p>
                    <p>Your payment reference is: <strong style="background-color: #f3f4f6; padding: 4px 8px; border-radius: 4px;">${reference}</strong></p>
                    <a href="${process.env.NEXT_PUBLIC_APP_URL}/verify-payment?reference=${reference}">
                      <p>Verify your payment</p>
                    </a>
                    <p>You can use this reference to manually verify your payment on our platform if needed.</p>
                    <br/>
                    <p>Best regards,<br/><strong>The Nurexi Team</strong></p>
                  </div>
                `,
              });
            } catch (emailError) {
              console.error("Failed to send confirmation email:", emailError);
            }
          }
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
