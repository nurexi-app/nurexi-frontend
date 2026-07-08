"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import QuizFrom from "./QuizFrom";
import { useCourse } from "@/context/CourseProvider";
import { QuizPageSkeleton } from "@/components/ui/skeletons";
import { AlertCircle, HelpCircle, Plus, ChevronRight } from "lucide-react";
import { Quiz as QuizType } from "@/lib/types/questions";
import { useState } from "react";
import { cn } from "@/lib/utils";

const validateQuiz = (quiz: any) => {
  const errors: string[] = [];
  if (!quiz.question?.trim()) errors.push("Question text is required");
  if (quiz.questionType === "mcq") {
    if (quiz.options.filter((o: string) => o.trim()).length < 2)
      errors.push("At least 2 valid options are required");
    if (!quiz.answer?.trim()) errors.push("Please select a correct answer");
  }
  if (quiz.questionType === "short_answer" && !quiz.answer?.trim())
    errors.push("Correct answer is required");
  if (quiz.questionType === "true_false" && !quiz.answer)
    errors.push("Please select True or False as the correct answer");
  return errors;
};

const Quiz = () => {
  const { sections, addQuiz, handleUpdateSection, isLoading, quizSection } =
    useCourse();
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(
    sections.length > 0 ? sections[0].id : null,
  );
  const [isSaving, setIsSaving] = useState(false);
  const [validationErrors, setValidationErrors] = useState<
    Record<number, string[]>
  >({});
  const [mobileView, setMobileView] = useState<"sections" | "editor">(
    "sections",
  );

  const selectedSection = sections.find((s) => s.id === selectedSectionId);
  const currentQuizData = quizSection.find(
    (s) => s.sectionId === selectedSectionId,
  )?.quizArray as QuizType[] | undefined;

  const handleSaveQuiz = async () => {
    if (!selectedSectionId) return;
    const allErrors: Record<number, string[]> = {};
    let hasErrors = false;

    currentQuizData?.forEach((quiz, index) => {
      const errors = validateQuiz(quiz);
      if (errors.length > 0) {
        allErrors[index] = errors;
        hasErrors = true;
      }
    });

    setValidationErrors(allErrors);
    if (hasErrors) {
      toast.error("Please fix the errors before saving");
      return;
    }

    setIsSaving(true);
    try {
      await handleUpdateSection(selectedSectionId, {
        quiz_data: currentQuizData || [],
      });
      toast.success("Quiz saved successfully!");
    } catch {
      toast.error("Failed to save quiz");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <QuizPageSkeleton />;

  if (sections.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 py-16 text-center">
        <div className="h-12 w-12 rounded-xl bg-muted flex items-center justify-center">
          <HelpCircle className="h-5 w-5 text-muted-foreground/50" />
        </div>
        <p className="text-sm text-muted-foreground">
          No sections yet. Create a section first to add quizzes.
        </p>
      </div>
    );
  }

  return (
    <div className="pb-20">
      {/* ── mobile toggle ── */}
      <div className="flex sm:hidden items-center gap-2 mb-4 p-1 bg-muted rounded-xl">
        {(["sections", "editor"] as const).map((v) => (
          <button
            key={v}
            onClick={() => setMobileView(v)}
            className={cn(
              "flex-1 py-2 rounded-lg text-[12px] font-semibold capitalize transition-all",
              mobileView === v
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground",
            )}
          >
            {v === "sections" ? "Sections" : "Quiz editor"}
          </button>
        ))}
      </div>

      <div className="flex gap-4 flex-col sm:flex-row">
        {/* ── left sidebar — section list ── */}
        <div
          className={cn(
            "sm:basis-[35%] sm:block",
            mobileView === "sections" ? "block" : "hidden",
          )}
        >
          <div className="mb-4">
            <h3 className="font-semibold text-[15px] text-foreground leading-tight">
              Section Quizzes
            </h3>
            <p className="text-[12px] text-muted-foreground mt-0.5">
              One quiz per section
            </p>
          </div>

          <div className="space-y-2">
            {sections.map((section) => {
              const quizCount = (section.quiz_data as QuizType[])?.length ?? 0;
              const isSelected = selectedSectionId === section.id;
              return (
                <button
                  key={section.id}
                  onClick={() => {
                    setSelectedSectionId(section.id);
                    setMobileView("editor");
                  }}
                  className={cn(
                    "w-full text-left flex items-center gap-3 p-3 rounded-xl border transition-all",
                    isSelected
                      ? "border-secondary bg-secondaryLight"
                      : "border-border hover:bg-muted/30",
                  )}
                >
                  <div
                    className={cn(
                      "h-8 w-8 rounded-lg flex items-center justify-center shrink-0 text-[11px] font-bold",
                      isSelected
                        ? "bg-secondary text-white"
                        : "bg-muted text-muted-foreground",
                    )}
                  >
                    {quizCount}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-semibold text-foreground truncate">
                      {section.title}
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      {quizCount} question{quizCount !== 1 ? "s" : ""}
                    </p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                </button>
              );
            })}
          </div>
        </div>

        {/* ── right panel — quiz editor ── */}
        <div
          className={cn(
            "flex-1 sm:block",
            mobileView === "editor" ? "block" : "hidden",
          )}
        >
          {selectedSection ? (
            <div className="space-y-4">
              {/* editor header */}
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="font-semibold text-[15px] text-foreground leading-tight truncate">
                    {selectedSection.title}
                  </h3>
                  <p className="text-[12px] text-muted-foreground">
                    {currentQuizData?.length ?? 0} question
                    {(currentQuizData?.length ?? 0) !== 1 ? "s" : ""}
                  </p>
                </div>
                <Button
                  onClick={handleSaveQuiz}
                  disabled={isSaving}
                  size="sm"
                  className="shrink-0"
                >
                  {isSaving ? "Saving..." : "Save quiz"}
                </Button>
              </div>

              {/* validation summary */}
              {Object.keys(validationErrors).length > 0 && (
                <div className="flex items-start gap-2 p-3 rounded-xl bg-destructive/5 border border-destructive/20 text-[12px] text-destructive">
                  <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>
                    {Object.keys(validationErrors).length} question
                    {Object.keys(validationErrors).length !== 1
                      ? "s have"
                      : " has"}{" "}
                    errors. Fix them before saving.
                  </span>
                </div>
              )}

              {/* questions */}
              {!currentQuizData || currentQuizData.length === 0 ? (
                <button
                  onClick={() =>
                    selectedSectionId && addQuiz(selectedSectionId)
                  }
                  className="w-full flex flex-col items-center gap-3 py-12 rounded-2xl border-2 border-dashed border-border hover:border-secondary/50 hover:bg-muted/20 transition-all group"
                >
                  <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center group-hover:bg-secondary/10 transition-colors">
                    <Plus className="h-5 w-5 text-muted-foreground group-hover:text-secondary" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    No questions yet — click to add the first one
                  </p>
                </button>
              ) : (
                <div className="space-y-4">
                  {currentQuizData.map((quiz, index) => (
                    <QuizFrom
                      key={quiz.id}
                      quiz={quiz}
                      count={index}
                      validationError={validationErrors[index]}
                      sectionId={selectedSectionId!}
                    />
                  ))}
                </div>
              )}

              {selectedSectionId &&
                currentQuizData &&
                currentQuizData.length > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1.5"
                    onClick={() => addQuiz(selectedSectionId)}
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Add question
                  </Button>
                )}
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3 py-16 text-center">
              <HelpCircle className="h-8 w-8 text-muted-foreground/25" />
              <p className="text-sm text-muted-foreground">
                Select a section to edit its quiz
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Quiz;
