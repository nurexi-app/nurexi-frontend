import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle2, Clock, BookOpen } from "lucide-react";
import Image from "next/image";
export default function PracticeInstructions({
  onToggle,
}: {
  onToggle: () => void;
}) {
  return (
    <div className=" mx-auto md:py-8 py-4 space-y-6">
      {/* Header */}

      {/* Illustration / Image placeholder */}
      <div className="relative h-72 overflow-hidden rounded-lg flex items-center justify-center bg-primary/5">
        {/* Overlay */}
        <div className="absolute inset-0 z-40 bg-linear-to-b from-black/60 to-black/10 pointer-events-none" />

        {/* Text content */}
        <div className="absolute z-50 text-center text-white space-y-2">
          <BookOpen className="mx-auto h-8 w-8" />
          <p className="text-sm">Study mode is designed for focused learning</p>
        </div>

        {/* Background image */}
        <Image
          src="/assets/grouplearning.jpg"
          alt="group learning"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Instructions */}
      <Card className="p-6 space-y-4">
        <h2 className="text-lg font-semibold">How Study Mode works</h2>

        <ul className="space-y-3">
          <li className="flex gap-3">
            <Clock className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <p className="font-medium">No time limit</p>
              <p className="text-sm text-muted-foreground">
                Study at your own pace without pressure. Pause and resume
                anytime.
              </p>
            </div>
          </li>

          <li className="flex gap-3">
            <CheckCircle2 className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <p className="font-medium">Answer and check instantly</p>
              <p className="text-sm text-muted-foreground">
                Attempt each question and view the correct answer and
                explanation immediately.
              </p>
            </div>
          </li>

          <li className="flex gap-3">
            <BookOpen className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <p className="font-medium">Learn, not just score</p>
              <p className="text-sm text-muted-foreground">
                This mode focuses on understanding concepts, not testing speed.
              </p>
            </div>
          </li>
        </ul>
      </Card>

      {/* CTA */}
      <div className="flex justify-end">
        <Button onClick={onToggle}>Start Learning</Button>
      </div>
    </div>
  );
}
