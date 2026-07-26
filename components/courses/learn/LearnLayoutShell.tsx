"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronLeft, Menu, MoreVertical, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CircularProgress } from "@/components/ui/circular-progress";
import { LearnSidebarAccordion } from "./LearnSidebarAccordion";
import { useLearnContext } from "@/context/LearnProvider";

interface LearnLayoutShellProps {
  children: React.ReactNode;

  curriculum: any;
}

export function LearnLayoutShell({
  children,

  curriculum,
}: LearnLayoutShellProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    function checkScreeenWitdth() {
      const width = window.innerWidth;

      if (width <= 768) {
        setIsSidebarOpen(false);
      }
    }

    checkScreeenWitdth();

    window.addEventListener("resize", checkScreeenWitdth);

    return () => window.removeEventListener("resize", checkScreeenWitdth);
  }, []);

  const { course, progressPercentage } = useLearnContext();
  return (
    <div className="h-screen w-full flex flex-col bg-background md:p-6 md:mt-2 rounded overflow-hidden">
      {/* ── TOP BAR (Fixed Height: 14 = 56px) ── */}
      <header className="h-14 border-b bg-card flex items-center justify-between px-4 shrink-0 z-30">
        {/* Left: Back Button & Title */}
        <div className="flex items-center gap-4">
          <Link href={`/learner/courses/${course?.slug}`}>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-foreground"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="h-6 w-px bg-border hidden sm:block" />
          <h1 className="font-semibold text-sm sm:text-base line-clamp-1 max-w-75 sm:max-w-md">
            {course?.title}
          </h1>
        </div>

        {/* Right: Progress & Controls */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2">
            <CircularProgress
              value={progressPercentage}
              size={32}
              strokeWidth={3}
            />
            <span className="text-xs font-medium text-muted-foreground mr-2">
              {progressPercentage}%
            </span>
          </div>

          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreVertical className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="flex items-center gap-2 h-8"
          >
            {isSidebarOpen ? (
              <X className="h-4 w-4" />
            ) : (
              <Menu className="h-4 w-4" />
            )}
            <span className="hidden sm:inline">
              {isSidebarOpen ? "Close" : "Course content"}
            </span>
          </Button>
        </div>
      </header>

      {/* ── MAIN CONTENT & SIDEBAR CONTAINER ── */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* LEFT: Video Player & Tabs (Scrollable independently) */}
        <main className="flex-1 overflow-y-auto flex flex-col relative z-10 bg-muted/10">
          {children}
        </main>

        {/* RIGHT: Course Curriculum Sidebar */}
        <aside
          className={`
            bg-card border-l shrink-0 transition-all duration-300 ease-in-out
            ${isSidebarOpen ? "w-90 translate-x-0" : "w-0 translate-x-full border-none opacity-0"}
          `}
        >
          {/* Scrollable Curriculum Area */}
          <div className="w-90 h-full overflow-y-auto p-4">
            <h2 className="font-semibold mb-4 text-sm">Course Content</h2>
            <div className="p-2">
              <LearnSidebarAccordion sections={curriculum} />
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
