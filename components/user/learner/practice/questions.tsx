"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldContent,
  FieldLabel,
  FieldTitle,
} from "@/components/ui/field";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Question } from "@/lib/types/questions";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";

const Questions = () => {
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
  const [showExplanation, setShowExplanation] = useState(false);

  function handleNext() {
    if (currentQuestionIndex === questions.length - 1) return;
    setCurrentQuestionIndex(currentQuestionIndex + 1);
    setShowExplanation(false);
  }

  function handlePrevious() {
    if (currentQuestionIndex === 0) return;
    setCurrentQuestionIndex(currentQuestionIndex - 1);
    setShowExplanation(false);
  }
  if (loading)
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="animate-spin" size={24} />
      </div>
    );

  return (
    <div className="bg-white p-6.25 min-h-[528px] rounded-xl">
      <div className="flex items-center justify-between">
        <Badge>Medical–Surgical Nursing</Badge>
        <div className="flex items-center gap-2">
          {currentQuestion?.topics?.map((topic, index) => (
            <Badge variant={"outline"} key={index}>
              {topic}
            </Badge>
          ))}
        </div>
      </div>
      <div className="space-y-2 mt-2 ">
        <h4 className="font-light">
          Question {currentQuestionIndex + 1} of {questions.length}
        </h4>
        <p>{currentQuestion?.question_text}</p>
      </div>

      {currentQuestion?.question_type === "multiple_choice" && (
        <RadioGroup className="gap-3 mt-4  mb-5 flex flex-col">
          {currentQuestion?.options.map((option, index) => (
            <FieldLabel
              htmlFor={option}
              key={index}
              onClick={() => setShowExplanation(true)}
              className={`rounded-2xl transition duration-200   hover:border-primary hover:bg-secondaryLight border
                 text-[16px] p-2`}
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

      {currentQuestion?.question_type === "fill_in_the_blank" && (
        <Button variant={"link"} onClick={() => setShowExplanation(true)}>
          Show Explanation
        </Button>
      )}

      {showExplanation && (
        <div className="bg-secondaryLight p-2 rounded-lg">
          <p>Answer: {currentQuestion.correct_answer}</p>
          <p>💡 {currentQuestion?.explanation}</p>
        </div>
      )}

      <div className="flex items-center justify-between mt-5">
        <Button
          className="bg-secondaryLightActive text-black"
          onClick={() => handlePrevious()}
        >
          <MdKeyboardArrowLeft />
          Previous
        </Button>
        <Button onClick={() => handleNext()}>
          Next
          <MdKeyboardArrowRight />
        </Button>
      </div>
    </div>
  );
};

export default Questions;
