import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { resend } from "@/lib/email/resend";

export async function POST(req: NextRequest) {
  try {
    const supabaseServer = await createClient();
    const {
      data: { user },
    } = await supabaseServer.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { reference } = await req.json();
    const userId = user.id;
    const userEmail = user.email;

    if (!reference) {
      return NextResponse.json(
        { error: "Reference required" },
        { status: 400 },
      );
    }

    // Check if already completed
    const { data: existing, error: fetchError } = await supabaseAdmin
      .from("purchases")
      .select("status, payment_reference")
      .eq("payment_reference", reference)
      .eq("user_id", userId);

    if (fetchError) {
      return NextResponse.json({ error: "Database error" }, { status: 500 });
    }

    if (existing?.some((p: any) => p.status === "completed")) {
      return NextResponse.json({
        status: "success",
        message: "Access already granted for this transaction.",
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

    if (!verification.status) {
      return NextResponse.json({
        status: "not_found",
        message:
          "Transaction not found. Please check the reference and try again.",
      });
    }

    const paymentStatus = verification.data.status;

    if (paymentStatus === "success") {
      // Update pending purchases to completed
      const { error: updateError } = await supabaseAdmin
        .from("purchases")
        .update({
          status: "completed",
          updated_at: new Date().toISOString(),
        })
        .eq("payment_reference", reference)
        .eq("user_id", userId);

      await resend.emails.send({
        from: "Nurexi Receipts <receipts@mails.nurexi.com>",
        to: userEmail!,
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

      if (updateError) {
        return NextResponse.json(
          { error: "Failed to update purchase status" },
          { status: 500 },
        );
      }

      return NextResponse.json({
        status: "success",
        message: "Payment verified! Your bundles are now available.",
      });
    }

    if (paymentStatus === "pending") {
      return NextResponse.json({
        status: "pending",
        message:
          "Your payment is still processing. This may take a few minutes.",
      });
    }

    return NextResponse.json({
      status: "failed",
      message:
        "Payment verification failed. Please contact support if you believe this is an error.",
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
