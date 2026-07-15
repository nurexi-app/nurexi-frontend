"use client";

import { useDispatch } from "react-redux";
import {
  setAnsweredQuestionsProgress,
  setAnswers,
  setShowExplanation,
} from "@/lib/features/exam/examSlice";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useAppSelector } from "@/hooks/StoreHooks";
import { Question } from "@/lib/types/questions";
import { Field, FieldContent, FieldLabel, FieldTitle } from "../ui/field";
import { Badge } from "../ui/badge";
import { CheckCircle2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import ExplanationRenderer from "./ExplanationRenderer";

export default function QuestionRenderer({ question }: { question: Question }) {
  const dispatch = useDispatch();
  const { answers, questions, status, showExplanation, mode } = useAppSelector(
    (state) => state.exam,
  );

  console.log("question object :", question);
  const selectedAnswer = answers.find(
    (a) => a.questionId === question?.id,
  )?.selected;

  // fix: undefined means not answered, not "has answered"
  const hasAnswered = selectedAnswer !== undefined && selectedAnswer !== "";

  const handleAnswerChange = (value: string) => {
    if (status === "review") return;
    dispatch(setAnswers({ questionId: question.id, selected: value }));
  };
  // button controls for answer

  // useEffect(() => {
  //   const handleKeyDown = (event: KeyboardEvent) => {
  //     const target = event.target as HTMLElement;
  //     if (
  //       target.tagName === "INPUT" ||
  //       target.tagName === "TEXTAREA" ||
  //       target.isContentEditable
  //     ) {
  //       return;
  //     }

  //     if (event.key.toLocaleLowerCase() === "a") {
  //       handleOptionClick(options[0]);
  //     }
  //     if (event.key.toLocaleLowerCase() === "b") {
  //       handleOptionClick(options[1]);
  //     }
  //     if (question.question_type === "true_false") return;
  //     if (event.key.toLocaleLowerCase() === "c") {
  //       handleOptionClick(options[2]);
  //     }
  //     if (event.key.toLocaleLowerCase() === "d") {
  //       handleOptionClick(options[3]);
  //     }
  //   };

  //   window.addEventListener("keydown", handleKeyDown);

  //   return () => {
  //     window.removeEventListener("keydown", handleKeyDown);
  //   };
  // }, []);

  function handleOptionClick(option: string) {
    if (status === "review") return;
    if (mode === "learning") {
      dispatch(setShowExplanation(true));
    }
    dispatch(setAnswers({ questionId: question.id, selected: option }));

    const uniqueAnswered = new Set([
      ...answers.map((a) => a.questionId),
      question.id,
    ]);
    const localProgress = (uniqueAnswered.size / questions.length) * 100;
    dispatch(setAnsweredQuestionsProgress(localProgress));
  }

  const selectedAnswerForCurrent =
    answers.find((a) => a.questionId === question?.id)?.selected || "";

  const shouldShowExplanation =
    status === "review" ||
    (mode === "learning" && hasAnswered && showExplanation);

  const isCorrect =
    selectedAnswer?.trim().toLowerCase() ===
    question?.correct_answer?.trim().toLowerCase();

  if (!question) return null;

  const options =
    question.question_type === "true_false"
      ? ["True", "False"]
      : question.options || [];

  return (
    <div className="space-y-5">
      {/* question text */}
      <p className="text-[15px] leading-relaxed text-foreground font-medium mt-1">
        {question.question_text}
      </p>

      {/* ── MCQ / True-False ── */}
      {(question.question_type === "mcq" ||
        question.question_type === "multiple_choice" ||
        question.question_type === "true_false") && (
        <RadioGroup
          value={selectedAnswerForCurrent}
          className="flex flex-col gap-2.5"
        >
          {options.map((option, index) => {
            const isSelected = selectedAnswerForCurrent === option;
            const isCorrectOption =
              option.trim().toLowerCase() ===
              question.correct_answer?.trim().toLowerCase();

            // colour logic — only reveal after answering in learning mode or in review
            const showResult = shouldShowExplanation && hasAnswered;

            let optionStyle = "border-gray-200 bg-white";
            if (showResult) {
              if (isCorrectOption) {
                optionStyle =
                  "border-green-400 bg-green-50 text-green-800 dark:border-green-600 dark:bg-green-950/40";
              } else if (isSelected && !isCorrectOption) {
                optionStyle =
                  "border-red-300 bg-red-50 text-red-800 dark:border-red-600 dark:bg-red-950/40";
              }
            } else if (isSelected) {
              optionStyle = "border-primary bg-primary/8 shadow-sm";
            }

            return (
              <FieldLabel
                htmlFor={`option-${index}`}
                key={index}
                onClick={() => handleOptionClick(option)}
                className={cn(
                  "rounded-xl border-[1.5px] p-3 text-[14px] transition-all duration-150 cursor-pointer select-none",
                  "hover:border-primary/50 hover:bg-primary/5",
                  optionStyle,
                  status === "review" &&
                    "cursor-default hover:bg-transparent hover:border-current",
                )}
              >
                <Field
                  orientation="horizontal"
                  className="cursor-pointer gap-3"
                >
                  <span>{String.fromCharCode(65 + index)}</span>
                  <RadioGroupItem
                    className="size-4 shrink-0"
                    value={option}
                    id={`option-${index}`}
                  />
                  <FieldContent className="flex-1">
                    <FieldTitle className="font-normal text-[14px] leading-snug">
                      {option}
                    </FieldTitle>
                  </FieldContent>
                  {/* result icon */}
                  {showResult && isCorrectOption && (
                    <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0" />
                  )}
                  {showResult && isSelected && !isCorrectOption && (
                    <XCircle className="h-4 w-4 text-red-500 shrink-0" />
                  )}
                </Field>
              </FieldLabel>
            );
          })}
        </RadioGroup>
      )}

      {/* ── Short answer / Fill in the blank ── */}
      {(question.question_type === "fill_in_the_blank" ||
        question.question_type === "short_answer") && (
        <div className="border-b-2 border-primary pb-2">
          <Input
            placeholder="Type your answer here..."
            value={selectedAnswer || ""}
            onChange={(e) => handleAnswerChange(e.target.value)}
            className="border-none focus-visible:ring-0 text-[15px] px-0"
            disabled={status === "review"}
          />
        </div>
      )}

      {/* ── explanation / result panel ── */}
      {shouldShowExplanation && (
        <div
          className={cn(
            "rounded-xl border p-4 space-y-3 transition-all duration-200",
            isCorrect
              ? "border-green-200 bg-green-50/60 dark:border-green-800 dark:bg-green-950/30"
              : "border-red-200 bg-red-50/60 dark:border-red-800 dark:bg-red-950/30",
          )}
        >
          {/* correct / incorrect header */}
          <div className="flex items-center flex-wrap gap-2">
            <Badge
              variant={isCorrect ? "default" : "destructive"}
              className="gap-1.5"
            >
              {isCorrect ? (
                <CheckCircle2 className="h-3 w-3" />
              ) : (
                <XCircle className="h-3 w-3" />
              )}
              {isCorrect ? "Correct" : "Incorrect"}
            </Badge>

            {!isCorrect && (
              <Badge
                variant="secondary"
                className="whitespace-normal wrap-break-word h-auto py-1 max-w-full text-[12px]"
              >
                Correct answer: {question.correct_answer}
              </Badge>
            )}
          </div>

          {/* explanation */}

          {shouldShowExplanation && (
            <div
              className={cn(
                "rounded-xl border p-4 space-y-3 transition-all duration-200",
                isCorrect
                  ? "border-green-200 bg-green-50/60 dark:border-green-800 dark:bg-green-950/30"
                  : "border-red-200 bg-red-50/60 dark:border-red-800 dark:bg-red-950/30",
              )}
            >
              {/* ── explanation — uses rich if available, falls back to plain ── */}
              {(question.rich_explanation || question.explanation) && (
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground mb-2">
                    Explanation
                  </p>
                  <ExplanationRenderer
                    richExplanation={question.rich_explanation}
                    plainExplanation={question.explanation}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
