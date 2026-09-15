import ExamPersistGate from "@/context/PersistGate";
import { Suspense } from "react";
import BrandLoader from "@/components/web/BrandLoader";
import PaymentSuccessContent from "./PaymentSuccessContent";

const Page = () => {
  return (
    <Suspense
      fallback={<BrandLoader message="Verifying your transaction..." />}
    >
      <ExamPersistGate><PaymentSuccessContent /></ExamPersistGate>
    </Suspense>
  );
};

export default Page;
