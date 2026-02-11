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

export default function QuestionRenderer({ question }: { question: Question }) {
  const dispatch = useDispatch();
  const { answers, questions } = useAppSelector((state) => state.exam);

  const selectedAnswer = answers.find(
    (a) => a.questionId === question.id,
  )?.selected;

  const handleAnswerChange = (value: string) => {
    dispatch(
      setAnswers({
        questionId: question.id,
        selected: value,
      }),
    );
  };
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

                  const localProgress =
                    (uniqueAnswered.size / questions.length) * 100;

                  dispatch(setAnsweredQuestionsProgress(localProgress));
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
    </div>
  );
}
