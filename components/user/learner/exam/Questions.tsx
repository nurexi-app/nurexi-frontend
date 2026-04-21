"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import QuestionRenderer from "@/components/web/QuestionRenderer";
import Timer from "@/components/web/Timer";
import { useAppDispatch, useAppSelector } from "@/hooks/StoreHooks";
import {
  endExam,
  setCurrentQuestionIndex,
  setNextQuestion,
  setPreviousQuestion,
  setQuestions,
} from "@/lib/features/exam/examSlice";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import EndExamDialog from "./EndExamDialog";
import { Question } from "@/lib/types/questions";
import { Progress } from "@/components/animate-ui/components/radix/progress";

const Questions = ({
  fetchedQuestions,
  examCode,
}: {
  fetchedQuestions: Question[];
  examCode: string;
}) => {
  const { progress, mode, currentQuestionIndex, questions, answers, status } =
    useAppSelector((store) => store.exam);
  const dispatch = useAppDispatch();
  const router = useRouter();

  // question fetching
  useEffect(() => {
    function getqestions() {
      dispatch(setQuestions(fetchedQuestions));
    }
    getqestions();
  }, [fetchedQuestions, dispatch, questions.length]);

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="bg-white p-4  mt-4 min-h-[528px] rounded-xl">
      <EndExamDialog type="quit">
        <button className="flex cursor-pointer items-center gap-1 text-xs mb-2">
          <MdKeyboardArrowLeft />
          <span>{mode === "learning" ? "Quit Practice" : "Quit Exam"}</span>
        </button>
      </EndExamDialog>

      <div className="flex items-center justify-between">
        <h4 className="font-light">
          Question {currentQuestionIndex + 1} of {questions.length}
        </h4>
        {mode === "exam" ? (
          <Timer />
        ) : (
          <p className="text-xs">No timer for practice mode</p>
        )}
      </div>
      <Progress value={progress} className="my-4" />
      <div className="flex items-center justify-between">
        <Badge>{examCode.toUpperCase()}</Badge>
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
        {currentQuestionIndex === questions.length - 1 ? (
          status === "review" ? (
            <Button
              variant={"destructive"}
              onClick={() => {
                dispatch(endExam());
                router.push("/learner/exam");
              }}
            >
              End Exam
            </Button>
          ) : (
            <EndExamDialog type="finish">
              <Button variant={"destructive"}>
                {mode === "learning" ? "Finish Practice" : "Finish Exam"}
              </Button>
            </EndExamDialog>
          )
        ) : (
          <Button onClick={() => dispatch(setNextQuestion())}>
            Next
            <MdKeyboardArrowRight />
          </Button>
        )}
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

export default Questions;
