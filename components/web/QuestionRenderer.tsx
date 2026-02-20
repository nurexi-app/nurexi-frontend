"use client";

import { useDispatch } from "react-redux";
import {
  setAnsweredQuestionsProgress,
  setAnswers,
} from "@/lib/features/exam/examSlice";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useAppSelector } from "@/hooks/StoreHooks";
import { Question } from "@/lib/types/questions";
import { Field, FieldContent, FieldLabel, FieldTitle } from "../ui/field";
import { Badge } from "../ui/badge";

export default function QuestionRenderer({ question }: { question: Question }) {
  const dispatch = useDispatch();
  const { answers, questions, status } = useAppSelector((state) => state.exam);

  const selectedAnswer = answers.find(
    (a) => a.questionId === question.id,
  )?.selected;

  const handleAnswerChange = (value: string) => {
    if (status === "review") return;
    dispatch(
      setAnswers({
        questionId: question.id,
        selected: value,
      }),
    );
  };

  function handleOptionClick(option: string) {
    if (status === "review") return;
    dispatch(
      setAnswers({
        questionId: question.id,
        selected: option,
      }),
    );

    // More accurate progress calculation
    const uniqueAnswered = new Set([
      ...answers.map((a) => a.questionId),
      question.id,
    ]);

    const localProgress = (uniqueAnswered.size / questions.length) * 100;

    dispatch(setAnsweredQuestionsProgress(localProgress));
  }
  const selectedAnswerForCurrent =
    answers.find((a) => a.questionId === question?.id)?.selected || "";
  return (
    <div className="space-y-6">
      <p className="space-y-2 mt-2">{question?.question_text}</p>

      {/* MULTIPLE CHOICE */}
      {(question?.question_type === "multiple_choice" ||
        question?.question_type === "true_false") && (
        <RadioGroup
          value={selectedAnswerForCurrent}
          className="gap-3 mt-4 mb-5 flex flex-col"
        >
          {question?.options.map((option, index) => {
            const isSelected = selectedAnswerForCurrent === option;

            return (
              <FieldLabel
                htmlFor={option}
                key={index}
                onClick={() => {
                  handleOptionClick(option);
                }}
                className={`
          rounded-2xl border p-2 text-[16px]
          transition duration-200 cursor-pointer

          hover:border-primary hover:bg-secondaryLight

          ${isSelected ? "border-primary bg-primary/10" : "border-gray-200"}
        `}
              >
                <Field orientation="horizontal" className="cursor-pointer">
                  <RadioGroupItem
                    className="size-5"
                    value={option}
                    id={option}
                  />
                  <FieldContent>
                    <FieldTitle>{option}</FieldTitle>
                  </FieldContent>
                </Field>
              </FieldLabel>
            );
          })}
        </RadioGroup>
      )}

      {/* FILL IN THE BLANK */}
      {question?.question_type === "fill_in_the_blank" && (
        <div className="border-b-2 border-primary pb-2">
          <Input
            placeholder="Type your answer here..."
            value={selectedAnswer || ""}
            onChange={(e) => handleAnswerChange(e.target.value)}
            className="border-none focus-visible:ring-0 text-lg"
          />
        </div>
      )}

      {/* REVIEW MODE */}
      {status === "review" && (
        <div className="mt-4 space-y-4">
          <div className="flex items-center flex-wrap gap-2">
            <Badge
              variant={
                selectedAnswer === question.correct_answer
                  ? "default"
                  : "destructive"
              }
            >
              {selectedAnswer === question.correct_answer
                ? "Correct"
                : "Incorrect"}
            </Badge>
            <Badge
              variant="secondary"
              className="whitespace-normal wrap-break-word max-w-full h-auto py-1 "
            >
              Correct: {question.correct_answer}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            {question.explanation}
          </p>
        </div>
      )}
    </div>
  );
}
