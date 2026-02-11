"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldContent,
  FieldLabel,
  FieldTitle,
} from "@/components/ui/field";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import Timer from "@/components/web/Timer";
import { useAppContext } from "@/context/AppProvider";
import { Question } from "@/lib/types/questions";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";

const NMCNQuestions = () => {
  const [questions, setQuestions] = useState<Question[] | []>([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    async function getqestions() {
      setLoading(true);
      const res = await fetch("/data/questions/medical_surgical.json");
      const questions = await res.json();

      setQuestions(questions);
      setLoading(false);
    }
    getqestions();
  }, []);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const currentQuestion = questions[currentQuestionIndex];
  const [selectedResponse, setSelectedResponse] = useState<
    {
      answeredIndex: number | null;
      option: string | null;
      correct_answer: string | null;
    }[]
  >([]);
  const {
    setShowResult,
    answeredQuestionsProgress,
    setAnsweredQuestionsProgress,
  } = useAppContext();
  function handleNext() {
    if (currentQuestionIndex === questions.length - 1) {
      setShowResult(true);
      return;
    }
    setCurrentQuestionIndex(currentQuestionIndex + 1);
  }

  function handlePrevious() {
    if (currentQuestionIndex === 0) return;
    setCurrentQuestionIndex(currentQuestionIndex - 1);
  }
  if (loading)
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="animate-spin" size={24} />
      </div>
    );

  return (
    <div className="bg-white  mt-4 min-h-[528px] rounded-xl">
      <div className="flex items-center justify-between">
        <h4 className="font-light">
          Question {currentQuestionIndex + 1} of {questions.length}
        </h4>
        <Timer />
      </div>
      <Progress value={answeredQuestionsProgress} className="my-4" />
      <div className="flex items-center justify-between">
        <Badge>NMCN</Badge>
        <div className="flex items-center gap-2">
          {currentQuestion?.topics?.map((topic, index) => (
            <Badge variant={"outline"} key={index}>
              {topic}
            </Badge>
          ))}
        </div>
      </div>
      <div className="space-y-2 mt-2 ">
        <p>{currentQuestion?.question_text}</p>
      </div>

      {currentQuestion?.question_type === "multiple_choice" && (
        <RadioGroup className="gap-3 mt-4  mb-5 flex flex-col peer">
          {currentQuestion?.options.map((option, index) => (
            <FieldLabel
              htmlFor={option}
              key={index}
              onClick={() => {
                setSelectedResponse((prev) => [
                  ...prev,
                  {
                    answeredIndex: currentQuestionIndex,
                    option,
                    correct_answer: currentQuestion.correct_answer,
                  },
                ]);
                const progress =
                  ((currentQuestionIndex + 1) / questions.length) * 100;
                setAnsweredQuestionsProgress(progress);
              }}
              className={`
    rounded-2xl border p-2 text-[16px]
    transition duration-200 cursor-pointer

    hover:border-primary hover:bg-secondaryLight

    peer-data-[state=checked]:border-primary
    peer-data-[state=checked]:bg-primary/10
  `}
            >
              <Field orientation="horizontal" className="cursor-pointer ">
                <RadioGroupItem className="size-5" value={option} id={option} />
                <FieldContent>
                  <FieldTitle>{option}</FieldTitle>
                </FieldContent>
              </Field>
            </FieldLabel>
          ))}
        </RadioGroup>
      )}

      {/* {currentQuestion?.question_type === "fill_in_the_blank" && (
        <Button variant={"link"} onClick={() => setShowExplanation(true)}>
          Show Explanation
        </Button>
      )} */}

      {/* {showExplanation && (
        <div className="bg-secondaryLight p-2 rounded-lg">
          <p>Answer: {currentQuestion.correct_answer}</p>
          <p>💡 {currentQuestion?.explanation}</p>
        </div>
      )} */}

      <div className="flex items-center justify-between mt-5">
        <Button
          className="bg-secondaryLightActive text-black"
          onClick={() => handlePrevious()}
        >
          <MdKeyboardArrowLeft />
          Previous
        </Button>
        <Button onClick={() => handleNext()}>
          {currentQuestionIndex === questions.length - 1 ? (
            <>Finish</>
          ) : (
            <>
              Next
              <MdKeyboardArrowRight />
            </>
          )}
        </Button>
      </div>

      <div className="mt-4 flex items-center flex-wrap gap-2">
        {questions.map((_, index) => (
          <div
            key={index}
            onClick={() => setCurrentQuestionIndex(index)}
            className={`w-23 h-23 flex items-center justify-center rounded cursor-pointer bg-gray-300 ${index === currentQuestionIndex ? "border-primary border-2" : ""} ${selectedResponse.some((response) => response.answeredIndex === index) ? "bg-primary" : ""}   `}
          >
            {index + 1}
          </div>
        ))}
      </div>
    </div>
  );
};

export default NMCNQuestions;
