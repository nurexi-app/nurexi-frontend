"use client";

import { useState } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Plus,
  ArrowLeft,
  ArrowRight,
  Layers,
  Loader2,
  Check,
} from "lucide-react";
import { useCourse } from "@/context/CourseProvider";
import ActualSection from "./Section";
import Link from "next/link";
import { Reorder } from "framer-motion";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function CourseSection() {
  const router = useRouter();
  const {
    sections,
    isLoading,
    handleAddSection,
    handleReorderSections,
    courseId,
  } = useCourse();

  const [isSaving, setIsSaving] = useState(false);

  // ── Save Handler ──
  const handleSave = async (shouldNavigate = false) => {
    // 1. Validation guard: Ensure at least 1 section exists
    if (sections.length === 0) {
      toast.error("Please add at least one section to your course.");
      return;
    }

    // 2. Validation guard: Ensure sections have titles & lessons
    const emptySection = sections.find((s) => !s.title.trim());
    if (emptySection) {
      toast.error("All sections must have a title.");
      return;
    }

    setIsSaving(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 400));

      toast.success("Course content saved successfully!");

      if (shouldNavigate) {
        router.push(`/educator/courses/${courseId}/edit?section=course-quiz`);
      }
    } catch (error) {
      toast.error("Failed to save course content.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <section className="space-y-6 pb-24 relative min-h-[calc(100vh-12rem)]">
      {/* ── Sticky Header ── */}
      <div className="flex items-center justify-between sticky top-[calc(4rem+80px)] z-10 bg-background/95 backdrop-blur-md py-3 px-1 border-b border-border/50">
        <div className="space-y-0.5">
          <h3 className="font-semibold text-foreground text-[15px]">
            Course Content
          </h3>
          <p className="text-[12px] text-muted-foreground">
            {sections.length > 0
              ? `${sections.length} section${sections.length !== 1 ? "s" : ""} · ${sections.reduce(
                  (acc, s) => acc + (s.lessons?.length ?? 0),
                  0,
                )} lessons`
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

      {/* ── Sections List ── */}
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
        <Reorder.Group
          axis="y"
          values={sections}
          onReorder={handleReorderSections}
          className="space-y-4"
        >
          {sections.map((section) => (
            <Reorder.Item key={section.id} value={section}>
              <ActualSection section={section} />
            </Reorder.Item>
          ))}
        </Reorder.Group>
      )}

      {/* ── Floating / Sticky Action Footer ── */}
      <div className="sticky bottom-0 left-0 right-0 z-20 bg-background/95 backdrop-blur-md border-t border-border py-4 px-2 mt-8 flex items-center justify-between shadow-lg">
        <Button variant="outline" size="sm" asChild className="gap-1.5">
          <Link
            href={`/educator/courses/${courseId}/edit?section=course-overview`}
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Overview
          </Link>
        </Button>

        <div className="flex items-center gap-3">
          <Button
            onClick={() => handleSave(false)}
            disabled={isSaving || isLoading}
            variant="outline"
            size="sm"
            className="gap-1.5"
          >
            {isSaving ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Check className="h-3.5 w-3.5 text-emerald-500" />
            )}
            Save Draft
          </Button>

          <Button
            onClick={() => handleSave(true)}
            disabled={isSaving || isLoading}
            size="sm"
            className={cn(buttonVariants({ size: "sm" }), "gap-1.5")}
          >
            {isSaving ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <>
                Next: Quizzes
                <ArrowRight className="h-3.5 w-3.5" />
              </>
            )}
          </Button>
        </div>
      </div>
    </section>
  );
}
