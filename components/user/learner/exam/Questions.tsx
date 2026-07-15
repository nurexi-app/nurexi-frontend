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
import { useEffect, useState } from "react";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import EndExamDialog from "./EndExamDialog";
import { Question } from "@/lib/types/questions";
import { Progress } from "@/components/animate-ui/components/radix/progress";
import { ChevronUp, ChevronDown, Grid3x3 } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

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
  const [navigatorOpen, setNavigatorOpen] = useState(false);

  useEffect(() => {
    dispatch(setQuestions(fetchedQuestions));
  }, [fetchedQuestions, dispatch]);

  const currentQuestion = questions[currentQuestionIndex];
  const answeredCount = answers.filter((a) => a.selected).length;
  const totalCount = questions.length;

  // scroll the active navigator button into view when it changes
  useEffect(() => {
    if (!navigatorOpen) return;
    const el = document.getElementById(`nav-q-${currentQuestionIndex}`);
    el?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [currentQuestionIndex, navigatorOpen]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable
      ) {
        return;
      }

      if (event.key === "ArrowRight" || event.key.toLocaleLowerCase() === "n") {
        if (currentQuestionIndex !== questions.length - 1) {
          dispatch(setNextQuestion());
          // dispatch
        } else {
          toast.info("You are at the last question");
        }
      }
      if (event.key === "ArrowLeft" || event.key.toLocaleLowerCase() === "p") {
        dispatch(setPreviousQuestion());
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div className="flex flex-col bg-white rounded-xl mt-4 overflow-hidden">
      {/* ── main content ── */}
      <div className="p-4 flex-1">
        {/* quit + timer row */}
        <div className="flex items-center justify-between mb-3">
          <EndExamDialog type="quit">
            <button className="flex cursor-pointer items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
              <MdKeyboardArrowLeft />
              <span>{mode === "learning" ? "Quit Practice" : "Quit Exam"}</span>
            </button>
          </EndExamDialog>

          {mode === "exam" ? (
            <Timer />
          ) : (
            <p className="text-xs text-muted-foreground">Practice mode</p>
          )}
        </div>

        {/* question count + progress */}
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm font-medium text-foreground">
            Question {currentQuestionIndex + 1}{" "}
            <span className="text-muted-foreground font-normal">
              of {totalCount}
            </span>
          </span>
          <span className="text-xs text-muted-foreground">
            {answeredCount}/{totalCount} answered
          </span>
        </div>
        <Progress value={progress} className="mb-4" />

        {/* badges row */}
        <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
          <Badge>{examCode.toUpperCase()}</Badge>
          <div className="flex items-center gap-1.5 flex-wrap">
            {currentQuestion?.topics?.map((topic, index) => (
              <Badge variant="outline" key={index} className="text-[11px]">
                {topic}
              </Badge>
            ))}
          </div>
        </div>

        {/* question renderer */}
        <QuestionRenderer question={currentQuestion} />

        {/* prev / next row */}
        <div className="flex items-center justify-between mt-6 gap-2">
          <Button
            variant="outline"
            size="sm"
            className="gap-1"
            onClick={() => dispatch(setPreviousQuestion())}
            disabled={currentQuestionIndex === 0}
          >
            <MdKeyboardArrowLeft />
            Previous
          </Button>

          {currentQuestionIndex === questions.length - 1 ? (
            status === "review" ? (
              <Button
                variant="destructive"
                size="sm"
                onClick={() => {
                  dispatch(endExam());
                  router.push("/learner/exam");
                }}
              >
                End Exam
              </Button>
            ) : (
              <EndExamDialog type="finish">
                <Button variant="destructive" size="sm">
                  {mode === "learning" ? "Finish Practice" : "Finish Exam"}
                </Button>
              </EndExamDialog>
            )
          ) : (
            <Button
              size="sm"
              className="gap-1"
              onClick={() => dispatch(setNextQuestion())}
            >
              Next
              <MdKeyboardArrowRight />
            </Button>
          )}
        </div>
      </div>

      {/* ── collapsible question navigator ── */}
      <div className="border-t border-border">
        {/* toggle bar */}
        <button
          onClick={() => setNavigatorOpen((prev) => !prev)}
          className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-muted/40 transition-colors"
        >
          <div className="flex items-center gap-2 text-sm font-medium text-foreground">
            <Grid3x3 className="h-3.5 w-3.5 text-muted-foreground" />
            Question navigator
          </div>
          <div className="flex items-center gap-3">
            {/* legend */}
            <div className="hidden sm:flex items-center gap-3 text-[11px] text-muted-foreground">
              <span className="flex items-center gap-1">
                <span className="h-2.5 w-2.5 rounded-sm bg-primary inline-block" />
                Answered
              </span>
              <span className="flex items-center gap-1">
                <span className="h-2.5 w-2.5 rounded-sm bg-muted border border-border inline-block" />
                Unanswered
              </span>
              <span className="flex items-center gap-1">
                <span className="h-2.5 w-2.5 rounded-sm border-2 border-primary inline-block" />
                Current
              </span>
            </div>
            {navigatorOpen ? (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronUp className="h-4 w-4 text-muted-foreground" />
            )}
          </div>
        </button>

        <div
          className={cn(
            "overflow-hidden transition-all duration-300 ease-in-out",
            navigatorOpen ? "max-h-52" : "max-h-0",
          )}
        >
          <div className="overflow-y-auto max-h-52 px-4 pb-4 pt-2">
            <div className="grid grid-cols-[repeat(auto-fill,minmax(2.25rem,1fr))] sm:grid-cols-[repeat(auto-fill,minmax(3rem,1fr))] gap-1.5">
              {questions.map((q, index) => {
                const isAnswered = answers.some(
                  (r) => r.questionId === q.id && r.selected,
                );
                const isCurrent = index === currentQuestionIndex;

                return (
                  <button
                    id={`nav-q-${index}`}
                    key={index}
                    onClick={() => dispatch(setCurrentQuestionIndex(index))}
                    className={cn(
                      "h-9 flex items-center justify-center rounded-lg text-xs font-semibold transition-all duration-150 cursor-pointer select-none",
                      isCurrent
                        ? "ring-2 ring-primary ring-offset-1 bg-white text-primary shadow-sm scale-105"
                        : isAnswered
                          ? "bg-primary text-white hover:bg-primary/90"
                          : "bg-muted text-muted-foreground hover:bg-muted/70 border border-border",
                    )}
                  >
                    {index + 1}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Questions;
