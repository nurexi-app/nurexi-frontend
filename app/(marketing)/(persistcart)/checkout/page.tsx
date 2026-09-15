import { createClient } from "@/lib/supabase/server";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import Checkout from "./Checkout";
import { Suspense } from "react";
import CheckoutSkeleton from "./CheckoutSkeleton";

export const metadata: Metadata = {
  title: "Checkout",
};
export default async function Page() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect(`/login?redirect=${encodeURIComponent("/checkout")}`);
  const userObj = { success: true, data: user };

  return (
    <Suspense fallback={<CheckoutSkeleton />}>
      <Checkout userObj={userObj} />
    </Suspense>
  );
}
