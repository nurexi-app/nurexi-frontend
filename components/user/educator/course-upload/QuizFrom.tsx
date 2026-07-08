"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useCourse } from "@/context/CourseProvider";
import { QuestionType, Quiz } from "@/lib/types/questions";
import { Trash2, AlertCircle, ChevronDown, Plus } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

const QuizFrom = ({
  quiz,
  count,
  validationError,
  sectionId,
}: {
  quiz: Quiz;
  count: number;
  validationError?: string[];
  sectionId: string;
}) => {
  const { handleRemoveQuiz, updateQuiz } = useCourse();
  const [questionObject, setQuestionObject] = useState(quiz);
  const hasError = validationError && validationError.length > 0;

  useEffect(() => {
    updateQuiz(sectionId, quiz.id, questionObject);
  }, [questionObject]);

  const handleQuestionObject = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  ) => {
    const { name, value } = e.target;
    setQuestionObject((prev) => ({ ...prev, [name]: value }));
  };

  const handleQuestionTypeChange = (value: QuestionType) => {
    setQuestionObject((prev) => ({
      ...prev,
      questionType: value,
      options: value === "true_false" ? ["True", "False"] : ["", "", "", ""],
      answer: "",
    }));
  };

  const handleOptionChange = (index: number, value: string) => {
    const updated = [...questionObject.options];
    updated[index] = value;
    setQuestionObject({ ...questionObject, options: updated });
  };

  const handleDeleteOption = (indexToDelete: number) => {
    const updated = questionObject.options.filter(
      (_, i) => i !== indexToDelete,
    );
    const deletedValue = questionObject.options[indexToDelete];
    setQuestionObject({
      ...questionObject,
      options: updated,
      answer:
        questionObject.answer === deletedValue ? "" : questionObject.answer,
    });
  };

  const handleSelectAnswer = (value: string) => {
    setQuestionObject({ ...questionObject, answer: value });
  };

  const TYPE_LABELS: Partial<Record<QuestionType, string>> = {
    mcq: "Multiple choice",
    short_answer: "Short answer",
    true_false: "True or False",
  };

  return (
    <div
      className={cn(
        "relative rounded-xl border p-4 space-y-4 transition-colors",
        hasError
          ? "border-destructive/40 bg-destructive/5"
          : "border-border bg-card",
      )}
    >
      {/* ── question header ── */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-md bg-muted flex items-center justify-center text-[11px] font-bold text-muted-foreground shrink-0">
            {count + 1}
          </div>
          <Badge
            variant="outline"
            className="text-[10px] font-semibold capitalize"
          >
            {TYPE_LABELS[questionObject.questionType]}
          </Badge>
        </div>

        <button
          type="button"
          onClick={() => handleRemoveQuiz(sectionId, quiz.id)}
          className="h-7 w-7 flex items-center justify-center rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors shrink-0"
          title="Remove question"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* ── question text ── */}
      <div className="space-y-1.5">
        <Label className="text-[12px] font-semibold">
          Question {count + 1} *
        </Label>
        <Textarea
          className={cn(
            "min-h-[72px] resize-none rounded-lg bg-secondaryLight focus-visible:ring-secondary focus-visible:border-secondary focus-visible:ring-1",
            hasError && validationError?.some((e) => e.includes("Question"))
              ? "border-destructive"
              : "border-secondary",
          )}
          placeholder="Type your question here..."
          value={questionObject.question}
          name="question"
          onChange={handleQuestionObject}
        />
      </div>

      {/* ── question type selector ── */}
      <div className="space-y-1.5">
        <Label className="text-[12px] font-semibold">Question type *</Label>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="gap-2 justify-between w-full sm:w-auto min-w-[160px]"
            >
              {TYPE_LABELS[questionObject.questionType]}
              <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem onClick={() => handleQuestionTypeChange("mcq")}>
              Multiple choice
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleQuestionTypeChange("short_answer")}
            >
              Short answer
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleQuestionTypeChange("true_false")}
            >
              True or False
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* ── MCQ options ── */}
      {questionObject.questionType === "mcq" && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-[12px] font-semibold">Options *</Label>
            <p className="text-[10px] text-muted-foreground">
              Tap a letter to mark as correct
            </p>
          </div>

          <div className="flex flex-col gap-2.5">
            {questionObject.options.map((option, index) => {
              const letter = String.fromCharCode(65 + index);
              const isCorrect =
                questionObject.answer === option && option !== "";

              return (
                <div key={index} className="flex items-start gap-2">
                  {/* answer selector */}
                  <button
                    type="button"
                    onClick={() => handleSelectAnswer(option)}
                    disabled={!option.trim()}
                    title="Mark as correct answer"
                    className={cn(
                      "h-8 w-8 rounded-full flex items-center justify-center border text-[11px] font-bold shrink-0 transition-all mt-1",
                      isCorrect
                        ? "bg-secondary border-secondary text-white shadow-sm"
                        : "border-border text-muted-foreground hover:border-secondary",
                      !option.trim() && "opacity-40 cursor-not-allowed",
                    )}
                  >
                    {letter}
                  </button>

                  <Textarea
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    className="min-h-[36px] flex-1 resize-none text-sm rounded-lg focus-visible:ring-secondary focus-visible:border-secondary focus-visible:ring-1"
                    placeholder={`Option ${letter}`}
                    rows={1}
                  />

                  {questionObject.options.length > 2 && (
                    <button
                      type="button"
                      onClick={() => handleDeleteOption(index)}
                      className="h-8 w-8 flex items-center justify-center rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors shrink-0 mt-1"
                      title="Remove option"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() =>
              setQuestionObject((p) => ({
                ...p,
                options: [...p.options, ""],
              }))
            }
            className="flex items-center gap-1.5 text-[12px] font-medium text-secondary hover:underline mt-1"
          >
            <Plus className="h-3.5 w-3.5" />
            Add option
          </button>
        </div>
      )}

      {/* ── short answer ── */}
      {questionObject.questionType === "short_answer" && (
        <div className="space-y-1.5">
          <Label className="text-[12px] font-semibold">Correct answer *</Label>
          <Textarea
            className={cn(
              "min-h-[60px] resize-none text-sm rounded-lg focus-visible:ring-secondary focus-visible:border-secondary focus-visible:ring-1",
              validationError?.some((e) => e.includes("answer"))
                ? "border-destructive"
                : "",
            )}
            name="answer"
            value={questionObject.answer}
            onChange={handleQuestionObject}
            placeholder="Write the correct answer here..."
          />
          <p className="text-[11px] text-muted-foreground">
            This is the expected answer — exact or keyword match.
          </p>
        </div>
      )}

      {/* ── true / false ── */}
      {questionObject.questionType === "true_false" && (
        <div className="space-y-2">
          <Label className="text-[12px] font-semibold">Correct answer *</Label>
          <div className="flex items-center gap-3">
            {["True", "False"].map((value) => {
              const isSelected = questionObject.answer === value;
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => handleSelectAnswer(value)}
                  className={cn(
                    "flex-1 py-2.5 rounded-xl border text-sm font-semibold transition-all",
                    isSelected
                      ? "bg-secondary border-secondary text-white shadow-sm"
                      : "border-border text-muted-foreground hover:border-secondary hover:bg-secondary/5",
                  )}
                >
                  {value}
                </button>
              );
            })}
          </div>
          <p className="text-[11px] text-muted-foreground">
            Select the correct answer for this question.
          </p>
        </div>
      )}

      {/* ── validation errors ── */}
      {hasError && (
        <div className="rounded-lg bg-destructive/5 border border-destructive/20 px-3 py-2.5 space-y-1">
          {validationError!.map((err, i) => (
            <p
              key={i}
              className="text-[12px] text-destructive flex items-center gap-1.5"
            >
              <AlertCircle className="h-3.5 w-3.5 shrink-0" />
              {err}
            </p>
          ))}
        </div>
      )}
    </div>
  );
};

export default QuizFrom;
