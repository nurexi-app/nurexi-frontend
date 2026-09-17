import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import Cart from "./Cart";

export const metadata: Metadata = {
  title: "Your cart | Nurexi",
  description: "Review your selected Nurexi exam preparation bundles before checkout.",
  robots: { index: false, follow: false },
};

export default async function CartPage() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  return <Cart userObj={{ success: !error && !!data.user, data: data.user ?? null }} />;
}
