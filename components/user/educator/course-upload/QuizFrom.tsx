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
import { useCourse } from "@/context/CourseProvider";
import { QuestionType, Quiz } from "@/lib/types/questions";
import { Trash2Icon, TrashIcon, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";

const QuizFrom = ({
  quiz,
  count,
  validationError,
}: {
  quiz: Quiz;
  count: number;
  validationError?: string[];
}) => {
  const { handleRemoveQuiz, updateQuiz } = useCourse();
  const [questionObject, setQuestionObject] = useState(quiz);

  useEffect(() => {
    updateQuiz(quiz.id, questionObject);
  }, [questionObject]);

  const handleQuestionObject = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  ) => {
    const { name, value } = e.target;
    setQuestionObject((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleQuestionTypeChange = (value: string) => {
    setQuestionObject((prev) => ({
      ...prev,
      questionType: value as QuestionType,
      // Reset options based on type
      options: value === "true_false" ? ["True", "False"] : ["", "", "", ""],
      answer: "",
    }));
  };

  const handleOptionChange = (index: number, value: string) => {
    const updatedOptions = [...questionObject.options];
    updatedOptions[index] = value;
    setQuestionObject({ ...questionObject, options: updatedOptions });
  };

  const handleAddOption = () => {
    setQuestionObject({
      ...questionObject,
      options: [...questionObject.options, ""],
    });
  };

  const handleDeleteOption = (indexToDelete: number) => {
    const updatedOptions = questionObject.options.filter(
      (_, index) => index !== indexToDelete,
    );

    const currentAnswerValue = questionObject.options[indexToDelete];
    const newAnswer =
      questionObject.answer === currentAnswerValue ? "" : questionObject.answer;

    setQuestionObject({
      ...questionObject,
      options: updatedOptions,
      answer: newAnswer,
    });
  };

  const handleSelectAnswer = (optionValue: string) => {
    setQuestionObject({
      ...questionObject,
      answer: optionValue,
    });
  };

  const hasError = validationError && validationError.length > 0;

  return (
    <section
      className={`space-y-3 mb-6 relative p-4 rounded-lg border ${hasError ? "border-destructive/50 bg-destructive/5" : "border-transparent"}`}
    >
      <TrashIcon
        size={18}
        className="absolute top-2 right-2 cursor-pointer text-destructive"
        onClick={() => {
          handleRemoveQuiz(quiz.id);
        }}
      />

      <div className="space-y-1.5 mt-2">
        <Label
          htmlFor={`question-${count}`}
          className="text-sm font-semibold leading-[130%]"
        >
          Question {count + 1} *
        </Label>
        <Textarea
          id={`question-${count}`}
          className={`min-h-20 w-full resize-none bg-secondaryLight border rounded-lg focus-visible:ring-secondary focus-visible:border-secondary focus-visible:ring-1 ${
            validationError?.some((e) => e.includes("Question"))
              ? "border-destructive focus-visible:ring-destructive"
              : "border-secondary"
          }`}
          placeholder="Type your question here..."
          value={questionObject.question}
          name="question"
          onChange={(e) => {
            handleQuestionObject(e);
          }}
        />
      </div>

      {/* type of question */}
      <div className="space-y-1.5">
        <Label
          htmlFor="questionType"
          className="text-sm font-semibold leading-[130%]"
        >
          Question Type *
        </Label>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="lg">
              {questionObject.questionType === "mcq" && "Multiple Choice"}
              {questionObject.questionType === "short_answer" && "Short Answer"}
              {questionObject.questionType === "true_false" && "True or False"}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => handleQuestionTypeChange("mcq")}>
              Multiple Choice
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleQuestionTypeChange("short_answer")}
            >
              Short Answer
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleQuestionTypeChange("true_false")}
            >
              True or False
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="space-y-1.5">
        <Label
          htmlFor="options"
          className="text-sm font-semibold leading-[130%]"
        >
          {questionObject.questionType !== "short_answer"
            ? "Options *"
            : "Correct Answer *"}
        </Label>

        {questionObject.questionType === "mcq" && (
          <div className="flex flex-col gap-4">
            {questionObject.options.map((option, index) => {
              const optionLetter = String.fromCharCode(65 + index);
              const isChecked =
                questionObject.answer === option && option !== "";

              return (
                <div
                  key={index}
                  className="flex items-center gap-2 w-full group"
                >
                  <button
                    type="button"
                    onClick={() => handleSelectAnswer(option)}
                    disabled={!option.trim()}
                    className={`w-6 h-6 rounded-full flex items-center justify-center border transition-all text-xs font-bold shrink-0
                      ${
                        isChecked
                          ? "bg-secondary border-secondary text-white"
                          : "border-grey/40 hover:border-secondary bg-transparent text-grey/64"
                      } ${!option.trim() ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                    title="Mark as correct answer"
                  >
                    {optionLetter}
                  </button>

                  <Textarea
                    id={`option-${index}`}
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    className="min-h-10 w-full resize-none text-sm font-semibold leading-[130%] rounded-lg focus-visible:ring-secondary focus-visible:border-secondary focus-visible:ring-1"
                    placeholder={`Option ${optionLetter}`}
                  />

                  {questionObject.options.length > 2 && (
                    <button
                      type="button"
                      onClick={() => handleDeleteOption(index)}
                      className="p-2 text-grey/64 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors shrink-0"
                      title="Delete option"
                    >
                      <Trash2Icon size={16} />
                    </button>
                  )}
                </div>
              );
            })}

            <button
              type="button"
              onClick={handleAddOption}
              className="flex items-center gap-2 self-start text-sm font-medium text-secondary hover:underline mt-1"
            >
              <svg
                xmlns="http://w3.org"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14M12 5v14" />
              </svg>
              Add Option
            </button>
          </div>
        )}

        {questionObject.questionType === "short_answer" && (
          <div className="space-y-2">
            <Textarea
              id="answer"
              className={`min-h-10 w-full resize-none text-sm font-semibold leading-[130%] rounded-lg focus-visible:ring-secondary focus-visible:border-secondary focus-visible:ring-1 ${
                validationError?.some((e) => e.includes("answer"))
                  ? "border-destructive"
                  : ""
              }`}
              name="answer"
              value={questionObject.answer}
              onChange={(e) => handleQuestionObject(e)}
              placeholder="Write the correct answer here..."
            />
            <p className="text-xs text-secondary mt-1">
              Write the correct answer for the question
            </p>
          </div>
        )}

        {questionObject.questionType === "true_false" && (
          <div className="space-y-2">
            <div className="flex items-center gap-4">
              {["True", "False"].map((value) => {
                const isChecked = questionObject.answer === value;
                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => handleSelectAnswer(value)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${
                      isChecked
                        ? "bg-secondary border-secondary text-white"
                        : "border-grey/40 hover:border-secondary bg-transparent"
                    }`}
                  >
                    {value}
                  </button>
                );
              })}
            </div>
            <p className="text-xs text-secondary mt-1">
              Click the button for the correct answer
            </p>
          </div>
        )}
      </div>

      {/* Validation Errors */}
      {validationError && validationError.length > 0 && (
        <div className="mt-2 space-y-1">
          {validationError.map((err, idx) => (
            <p
              key={idx}
              className="text-sm text-destructive flex items-center gap-1"
            >
              <AlertCircle className="h-3 w-3" />
              {err}
            </p>
          ))}
        </div>
      )}
    </section>
  );
};

export default QuizFrom;
