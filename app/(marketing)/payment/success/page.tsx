import type { Metadata } from "next";
import { Suspense } from "react";
import ExamPersistGate from "@/context/PersistGate";
import BrandLoader from "@/components/web/BrandLoader";
import PaymentSuccessContent from "./PaymentSuccessContent";

export const metadata: Metadata = {
  title: "Payment status | Nurexi",
  description: "Confirm your Nurexi payment and access.",
  robots: { index: false, follow: false },
};

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<BrandLoader message="Checking your payment and access..." />}>
      <ExamPersistGate><PaymentSuccessContent /></ExamPersistGate>
    </Suspense>
  );
}
