"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import { Plus, ArrowLeft, ArrowRight, Layers } from "lucide-react";
import { useCourse } from "@/context/CourseProvider";
import ActualSection from "./Section";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function CourseSection() {
  const { sections, isLoading, handleAddSection, courseId } = useCourse();

  return (
    <section className="space-y-6">
      {/* ── sticky header ── */}
      <div className="flex items-center justify-between sticky top-[calc(4rem+80px)] z-10 bg-background/95 backdrop-blur-md py-3 px-1">
        <div className="space-y-0.5">
          <h3 className="font-semibold text-foreground text-[15px]">
            Course Content
          </h3>
          <p className="text-[12px] text-muted-foreground">
            {sections.length > 0
              ? `${sections.length} section${sections.length !== 1 ? "s" : ""} · ${sections.reduce((acc, s) => acc + (s.lessons?.length ?? 0), 0)} lessons`
              : "Organize your course into sections and lessons"}
          </p>
        </div>

        <Button
          onClick={handleAddSection}
          size="sm"
          className="bg-secondary hover:bg-secondary/90 gap-1.5 shrink-0"
          disabled={isLoading}
        >
          <Plus className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">
            {isLoading ? "Adding..." : "Add section"}
          </span>
          <span className="sm:hidden">{isLoading ? "..." : "Section"}</span>
        </Button>
      </div>

      {/* ── sections list ── */}
      {isLoading && sections.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-16">
          <div className="h-8 w-8 border-2 border-secondary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-muted-foreground">Loading sections...</p>
        </div>
      ) : sections.length === 0 ? (
        <button
          onClick={handleAddSection}
          className="w-full flex flex-col items-center gap-3 py-16 rounded-2xl border-2 border-dashed border-border hover:border-secondary/50 hover:bg-muted/30 transition-all group"
        >
          <div className="h-12 w-12 rounded-xl bg-muted flex items-center justify-center group-hover:bg-secondary/10 transition-colors">
            <Layers className="h-5 w-5 text-muted-foreground group-hover:text-secondary transition-colors" />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-foreground">
              No sections yet
            </p>
            <p className="text-[12px] text-muted-foreground mt-0.5">
              Click to add your first section
            </p>
          </div>
        </button>
      ) : (
        <div className="space-y-4">
          {sections.map((section) => (
            <ActualSection section={section} key={section.id} />
          ))}
        </div>
      )}

      {/* ── footer nav ── */}
      <div className="flex items-center justify-between pt-6 mt-8 border-t border-border">
        <Button variant="outline" size="sm" asChild className="gap-1.5">
          <Link
            href={`/educator/courses/${courseId}/edit?section=course-overview`}
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Overview
          </Link>
        </Button>

        <Link
          className={cn(buttonVariants({ size: "sm" }), "gap-1.5")}
          href={`/educator/courses/${courseId}/edit?section=course-quiz`}
        >
          Quizzes
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </section>
  );
}
