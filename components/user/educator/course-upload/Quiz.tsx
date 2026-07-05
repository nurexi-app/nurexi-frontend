"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Item, ItemContent } from "@/components/ui/item";
import { toast } from "sonner";
import QuizFrom from "./QuizFrom";
import { useCourse } from "@/context/CourseProvider";
import { QuizPageSkeleton } from "@/components/ui/skeletons";
import { AlertCircle } from "lucide-react";
import { Quiz as QuizType } from "@/lib/types/questions";

// Validation function
const validateQuiz = (quiz: any) => {
  const errors: string[] = [];

  if (!quiz.question?.trim()) {
    errors.push("Question text is required");
  }

  if (quiz.questionType === "mcq") {
    const validOptions = quiz.options.filter((opt: string) => opt.trim());
    if (validOptions.length < 2) {
      errors.push("At least 2 valid options are required");
    }
    if (!quiz.answer || !quiz.answer.trim()) {
      errors.push("Please select a correct answer");
    }
  }

  if (quiz.questionType === "short_answer" && !quiz.answer?.trim()) {
    errors.push("Correct answer is required");
  }

  if (quiz.questionType === "true_false" && !quiz.answer) {
    errors.push("Please select True or False as the correct answer");
  }

  return errors;
};

const Quiz = () => {
  const { sections, addQuiz, handleUpdateSection, isLoading, quizSection } =
    useCourse();
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(
    null,
  );
  const [isSaving, setIsSaving] = useState(false);
  const [validationErrors, setValidationErrors] = useState<
    Record<number, string[]>
  >({});

  useState(() => {
    if (sections.length > 0 && !selectedSectionId) {
      setSelectedSectionId(sections[0].id);
    }
  });

  const selectedSection = sections.find((s) => s.id === selectedSectionId);
  const currentQuizData = quizSection.find(
    (s) => s.sectionId === selectedSectionId,
  )?.quizArray as QuizType[];

  const handleSaveQuiz = async () => {
    if (!selectedSectionId) return;

    // Validate all questions
    const allErrors: Record<number, string[]> = {};
    let hasErrors = false;

    if (currentQuizData) {
      currentQuizData.forEach((quiz, index) => {
        const errors = validateQuiz(quiz);
        if (errors.length > 0) {
          allErrors[index] = errors;
          hasErrors = true;
        }
      });
    }

    setValidationErrors(allErrors);

    if (hasErrors) {
      toast.error("Please fix the errors before saving");
      return;
    }

    setIsSaving(true);
    try {
      console.log("quiz data: ", currentQuizData);
      await handleUpdateSection(selectedSectionId, {
        quiz_data: currentQuizData || [],
      });
      toast.success("Quiz saved successfully!");
    } catch (error) {
      toast.error("Failed to save quiz");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <QuizPageSkeleton />;
  }

  if (sections.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        No sections yet. Create a section first to add quizzes.
      </div>
    );
  }

  console.log("quiz data: ", sections);
  return (
    <div className="pb-20">
      <div className="flex gap-4 flex-col md:flex-row">
        {/* Left Sidebar - Sections */}
        <div className="basis-[35%]">
          <div className="mb-4">
            <h3 className="font-semibold leading-[130%] mb-1.5">
              Section Quizzes
            </h3>
            <p className="font-normal text-sm leading-[130%]">
              One quiz per section (auto-generated)
            </p>
          </div>

          <div className="space-y-2">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setSelectedSectionId(section.id)}
                className="w-full text-left"
              >
                <Item
                  className={`rounded-xl border transition-all cursor-pointer ${
                    selectedSectionId === section.id
                      ? "border-secondary bg-secondaryLight hover:bg-secondaryLight/80"
                      : " border-grey/50 hover:bg-secondaryLight/80"
                  }`}
                >
                  <ItemContent>
                    <h4 className="font-semibold leading-[130%] mb-0.5">
                      {section.title}
                    </h4>
                    <p className="font-normal text-grey text-sm">
                      {(section.quiz_data as QuizType[])?.length || 0} questions
                    </p>
                  </ItemContent>
                </Item>
              </button>
            ))}
          </div>
        </div>

        {/* Right Panel - Quiz Editor */}
        <div className="flex-1">
          {selectedSection ? (
            <>
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-semibold leading-[130%]">
                  {selectedSection.title} - Quiz Questions
                </h3>
                <Button onClick={handleSaveQuiz} disabled={isSaving}>
                  {isSaving ? "Saving..." : "Save Quiz"}
                </Button>
              </div>

              {currentQuizData?.length === 0 && currentQuizData !== null ? (
                <div className="text-center py-12 text-muted-foreground border-2 border-dashed rounded-lg">
                  No questions yet. Click "Add question" to create your first
                  quiz question.
                </div>
              ) : (
                currentQuizData?.map((quiz, index) => (
                  <QuizFrom
                    key={quiz.id}
                    quiz={quiz}
                    count={index}
                    validationError={validationErrors[index]}
                    sectionId={selectedSectionId!}
                  />
                ))
              )}

              {selectedSectionId && (
                <div className="mt-6 flex justify-end">
                  <Button
                    variant="outline"
                    onClick={() => addQuiz(selectedSectionId)}
                  >
                    Add question
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              Select a section to create or edit its quiz
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Quiz;
