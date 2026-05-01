import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function POST(req: NextRequest) {
  try {
    const { reference, userId } = await req.json();

    if (!reference || !userId) {
      return NextResponse.json(
        { error: "Reference and user ID required" },
        { status: 400 },
      );
    }

    // Check if already completed
    const { data: existing, error: fetchError } = await supabaseAdmin
      .from("purchases")
      .select("status, payment_reference")
      .eq("payment_reference", reference)
      .eq("user_id", userId)
      .maybeSingle();

    if (fetchError) {
      return NextResponse.json({ error: "Database error" }, { status: 500 });
    }

    if (existing?.status === "completed") {
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
