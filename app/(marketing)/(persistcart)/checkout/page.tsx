import { createClient } from "@/lib/supabase/server";
import { Metadata } from "next";
import Checkout from "./Checkout";
import { Suspense } from "react";
import CheckoutSkeleton from "./CheckoutSkeleton";

export const metadata: Metadata = {
  title: "Checkout",
};
export default async function Page() {
  let userObj;
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error) {
    if (error) {
      userObj = {
        success: false,
        message: error.message,
      };
    }
  }
  userObj = {
    success: true,
    data: data.user,
  };

  return (
    <Suspense fallback={<CheckoutSkeleton />}>
      <Checkout userObj={userObj} />
    </Suspense>
  );
}
