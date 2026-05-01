import { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import VerifyForm from "@/components/verify-payment/VerifyForm";

export const metadata: Metadata = {
  title: "Verify Payment | Nurexi",
  description:
    "Verify your payment status and get access to your purchased bundles",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function VerifyPaymentPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/login?redirect=/verify-payment`);
  }

  return (
    <div className="container max-w-2xl mt-10 mx-auto px-4 py-16">
      <div className="bg-white rounded-xl border p-6 md:p-8">
        <h1 className="text-2xl font-bold mb-2">Verify Your Payment</h1>
        <p className="text-muted-foreground mb-6">
          Enter the transaction reference from your email receipt to confirm
          your payment.
        </p>

        <VerifyForm userId={user.id} />
      </div>
    </div>
  );
}
