import { Card } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";

export default function InstructorCard() {
  return (
    <Card className="p-4 space-y-3">
      <h3 className="font-semibold">About the instructor</h3>

      <div className="flex items-center gap-3">
        <img
          src="https://i.pravatar.cc/100"
          className="h-12 w-12 rounded-full"
        />

        <div>
          <p className="flex items-center gap-1 font-medium">
            Dr. Ifunanya Okeke
            <CheckCircle className="h-4 w-4 text-primary" />
          </p>
          <p className="text-sm text-muted-foreground">
            Nurse Educator & Pharmacologist
          </p>
        </div>
      </div>

      <p className="text-sm text-muted-foreground">
        Over 10 years of experience preparing nurses for NMCN and international
        exams.
      </p>
    </Card>
  );
}
