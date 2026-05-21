import { Button } from "@/components/ui/button";
import ShowAvailablePracticeSubject from "@/components/user/learner/practice/ShowAvailablePracticeSubject";
import DashboardCaption from "@/components/web/DashboardCaption";
import { GetUserProfile } from "@/lib/actions/auth";
import { GetSubjectsWithCounts } from "@/lib/actions/practice-actions";
import { BookOpen, RefreshCw } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Practice",
  description: "Practice your nursing skills",
};

export default async function Page() {
  const user = await GetUserProfile();
  const subjects = await GetSubjectsWithCounts(user?.id);

  const hasSubjects = subjects && Object.keys(subjects).length > 0;

  return (
    <>
      <DashboardCaption
        heading="Choose a Course!"
        text="Take your time. Learn deeply. Build confidence."
      />

      {hasSubjects ? (
        <ShowAvailablePracticeSubject subjectsObject={subjects} />
      ) : (
        <div className=" mt-6 p-8 rounded-2xl border border-dashed border-border/60 bg-muted/10 flex flex-col items-center text-center max-w-md mx-auto">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4 animate-pulse">
            <BookOpen className="h-5 w-5" />
          </div>

          <h3 className="text-base font-semibold text-foreground tracking-tight">
            Preparing Your Study Materials
          </h3>

          <p className="text-xs text-muted-foreground mt-1.5 max-w-xs leading-relaxed">
            We are currently updating our nursing question banks and setting up
            your practice modules. Please check back in a few moments!
          </p>

          <div className="pt-5 w-full flex flex-col sm:flex-row gap-2 justify-center">
            <Link href="/learner" passHref className="w-full sm:w-auto">
              <Button
                variant="secondary"
                className="w-full text-xs h-9 rounded-xl font-medium"
              >
                Back to Dashboard
              </Button>
            </Link>

            <Link
              href="/learner/practice"
              passHref
              className="w-full sm:w-auto"
            >
              <Button className="w-full text-xs h-9 rounded-xl font-medium gap-1.5">
                <RefreshCw className="h-3 w-3" />
                Refresh Page
              </Button>
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
