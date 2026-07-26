"use client";

import Link from "next/link";
import { useSearchParams, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const TABS = [
  { id: "overview", label: "Overview" },
  { id: "qna", label: "Q&A" },
  { id: "notes", label: "Notes" },
];

function LessonTabs({ lessonContent }: { lessonContent: string | null }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // Default to overview if no tab is in the URL
  const activeTab = searchParams.get("tab") || "overview";

  return (
    <div className="w-full max-w-5xl mx-auto p-4 sm:p-6 lg:p-8">
      {/* Tab Navigation */}
      <div className="flex items-center gap-6 border-b border-border">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <Link
              key={tab.id}
              href={`${pathname}?tab=${tab.id}`}
              className={cn(
                "pb-3 text-sm font-medium transition-colors relative",
                isActive
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {tab.label}
              {isActive && (
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-t-full" />
              )}
            </Link>
          );
        })}
      </div>

      {/* Tab Content Area */}
      <div className="pt-8 min-h-100">
        {activeTab === "overview" && (
          <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none">
            {lessonContent ? (
              <div dangerouslySetInnerHTML={{ __html: lessonContent }} />
            ) : (
              <p className="text-muted-foreground">
                No description provided for this lesson.
              </p>
            )}
          </div>
        )}

        {activeTab === "qna" && (
          <div className="text-muted-foreground flex flex-col items-center justify-center py-12">
            <h3 className="text-lg font-medium text-foreground mb-2">
              Questions & Answers
            </h3>
            <p>Q&A feature coming soon. Ask the instructor anything here.</p>
          </div>
        )}

        {activeTab === "notes" && (
          <div className="text-muted-foreground flex flex-col items-center justify-center py-12">
            <h3 className="text-lg font-medium text-foreground mb-2">
              Personal Notes
            </h3>
            <p>
              Notes feature coming soon. Keep track of important timestamps
              here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
export default LessonTabs;
