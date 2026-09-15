import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const supabaseServer = await createClient();
    const {
      data: { user },
    } = await supabaseServer.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { email, items } = await req.json();
    const userId = user.id;
    const reference = `TX_${Date.now()}_${Math.random().toString(36).substring(7)}`;

    // 1. Logic Check: Ensure items exists
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "No items provided" }, { status: 400 });
    }

    // 2. Compute Real Prices and Build Rows
    const itemIds = items.map((item: any) => item.id);
    const { data: bundles, error: bundleError } = await supabaseAdmin
      .from("bundles")
      .select("id, price")
      .in("id", itemIds);

    if (bundleError) {
      return NextResponse.json(
        { error: "Failed to verify prices" },
        { status: 500 },
      );
    }

    let calculatedTotal = 0;
    const rows = [];

    for (const item of items) {
      const bundle = bundles?.find((b: any) => b.id === item.id);
      if (!bundle) {
        return NextResponse.json(
          { error: `Invalid item: ${item.id}` },
          { status: 400 },
        );
      }

      if (
        !Number.isInteger(item.quantity) ||
        item.quantity <= 0 ||
        item.quantity > 10
      ) {
        return NextResponse.json(
          { error: `Invalid quantity for item: ${item.name}` },
          { status: 400 },
        );
      }

      const amount_paid = bundle.price * item.quantity;
      calculatedTotal += amount_paid;

      rows.push({
        user_id: userId,
        bundle_id: item.id,
        amount_paid,
        status: "pending",
        payment_reference: reference,
      });
    }

    // 3. Bulk Insert
    const { error: insertError } = await supabaseAdmin
      .from("purchases")
      .insert(rows);

    if (insertError) {
      console.error(
        "Supabase Insertion Error:",
        insertError.message,
        insertError.details,
      );
      throw new Error(`Failed to insert purchases: ${insertError.message}`);
    }

    // 4. Initialize Paystack
    const response = await fetch(
      "https://api.paystack.co/transaction/initialize",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email || user.email,
          amount: Math.round(calculatedTotal),
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
