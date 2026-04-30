import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function POST(req: NextRequest) {
  try {
    const { email, amount, items, userId } = await req.json();
    const reference = `TX_${Date.now()}_${Math.random().toString(36).substring(7)}`;

    // 1. Logic Check: Ensure items exists
    if (!items || !Array.isArray(items)) {
      return NextResponse.json({ error: "No items provided" }, { status: 400 });
    }

    // 2. Loop with Error Handling
    for (const item of items) {
      console.log(`Inserting item: ${item.id}`);

      const { data, error } = await supabaseAdmin
        .from("purchases")
        .insert({
          user_id: userId,
          bundle_id: item.id,
          amount_paid: item.price * item.quantity,
          status: "pending",
          payment_reference: reference,
        })
        .select();

      if (error) {
        console.error(
          "Supabase Insertion Error:",
          error.message,
          error.details,
        );
        // Throwing here stops the loop and triggers the catch block below
        throw new Error(`Failed to insert ${item.name}: ${error.message}`);
      }
    }

    // 3. Initialize Paystack
    const response = await fetch(
      "https://api.paystack.co/transaction/initialize",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          amount: Math.round(amount * 100),
          reference,
          callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment/success`,
          metadata: { items, user_id: userId },
        }),
      },
    );

    const data = await response.json();

    if (!data.status) {
      return NextResponse.json({ error: data.message }, { status: 400 });
    }

    return NextResponse.json({
      authorization_url: data.data.authorization_url,
      reference,
    });
  } catch (error: any) {
    console.error("API Route Error:", error.message);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 },
    );
  }
}
