"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import Loader from "@/components/web/Loader";
import QuestionRenderer from "@/components/web/QuestionRenderer";
import Timer from "@/components/web/Timer";
import { useAppDispatch, useAppSelector } from "@/hooks/StoreHooks";
import {
  setCurrentQuestionIndex,
  setNextQuestion,
  setPreviousQuestion,
  setQuestions,
} from "@/lib/features/exam/examSlice";
import { useEffect, useState } from "react";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";

const NMCNQuestions = () => {
  const { progress, currentQuestionIndex, questions, answers } = useAppSelector(
    (store) => store.exam,
  );
  const dispatch = useAppDispatch();

  // question fetching
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    async function getqestions() {
      setLoading(true);
      const res = await fetch("/data/questions/medical_surgical.json");
      const ques = await res.json();

      dispatch(setQuestions(ques));
      setLoading(false);
    }
    getqestions();
  }, []);

  const currentQuestion = questions[currentQuestionIndex];

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader />
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
      <Progress value={progress} className="my-4" />
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

      <QuestionRenderer question={currentQuestion} />

      <div className="flex items-center justify-between mt-5">
        <Button
          className="bg-secondaryLightActive text-black"
          onClick={() => dispatch(setPreviousQuestion())}
        >
          <MdKeyboardArrowLeft />
          Previous
        </Button>
        <Button onClick={() => dispatch(setNextQuestion())}>
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

      <div className="mt-4 grid grid-cols-[repeat(auto-fit,minmax(2.5rem,1fr))] md:grid-cols-[repeat(auto-fit,minmax(4.5rem,1fr))] lg:grid-cols-[repeat(auto-fit,minmax(5.5rem,1fr))] gap-2">
        {questions.map((_, index) => (
          <div
            key={index}
            onClick={() => dispatch(setCurrentQuestionIndex(index))}
            className={`h-10 md:h-23 flex items-center justify-center rounded cursor-pointer transition-all
        ${index === currentQuestionIndex ? "ring-2 ring-primary bg-white shadow-md" : "bg-gray-300 hover:bg-gray-400"} 
        ${answers.some((r) => r.questionId === questions[index].id && r.selected) ? "bg-primary " : "text-gray-800"}
      `}
          >
            {index + 1}
          </div>
        ))}
      </div>
    </div>
  );
};

export default NMCNQuestions;
