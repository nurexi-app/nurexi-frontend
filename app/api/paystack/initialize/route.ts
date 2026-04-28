import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const { email, amount, items, userId } = await req.json();

    const reference = `TX_${Date.now()}_${Math.random().toString(36).substring(7)}`;

    const supabase = await createClient();

    for (const item of items) {
      await supabase.from("purchases").insert({
        user_id: userId,
        bundle_id: item.id,
        amount_paid: item.price * item.quantity,
        status: "pending", // Not paid yet
        payment_reference: reference, // Same reference for all items in cart
      });
    }

    // Call Paystack API to initialize payment
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
          amount: Math.round(amount * 100), // convert to kobo
          reference,
          callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment/success`,
          metadata: {
            items,
            user_id: userId,
          },
        }),
      },
    );

    // Parse Paystack's response
    const data = await response.json();

    // If Paystack returns an error, send it back to frontend
    if (!data.status) {
      return NextResponse.json({ error: data.message }, { status: 400 });
    }

    // Send the payment link back to frontend
    return NextResponse.json({
      authorization_url: data.data.authorization_url,
      reference,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
