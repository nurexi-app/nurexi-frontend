"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";

export default function Back() {
  const router = useRouter();
  return (
    <Button variant="outline" size="lg" onClick={() => router.back()}>
      <ChevronLeft className="h-4 w-4 mr-2" />
      Go back
    </Button>
  );
}
