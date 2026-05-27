"use client";

import { PersistGate } from "redux-persist/integration/react";
import { persistor } from "@/lib/store";
import BrandLoader from "@/components/web/BrandLoader";

export default function ExamPersistGate({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PersistGate
      loading={<BrandLoader message="Restoring your exam workspace..." />}
      persistor={persistor}
    >
      {children}
    </PersistGate>
  );
}
