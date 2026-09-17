"use client";

import { useState } from "react";
import { ArrowRight, RotateCcw } from "lucide-react";

const questions = [
  {
    question: "A patient reports feeling dizzy when standing up. What should the nurse do first?",
    answers: [
      "Encourage the patient to walk independently",
      "Assist the patient to sit or lie down safely",
      "Ask the patient to drink water immediately",
      "Document the finding at the end of the shift",
    ],
    correct: 1,
    explanation: "Safety comes first. Helping the patient sit or lie down reduces the immediate risk of a fall before further assessment.",
  },
  {
    question: "Before giving a medication, which action is essential?",
    answers: [
      "Confirm the patient's identity using two identifiers",
      "Ask a visitor to confirm the patient's name",
      "Check the room number only",
      "Wait until the end of the shift to document it",
    ],
    correct: 0,
    explanation: "Using two patient identifiers helps ensure the medication is given to the intended patient.",
  },
  {
    question: "A patient is having difficulty breathing. Which assessment has the highest priority?",
    answers: [
      "Their usual sleep schedule",
      "Their preferred meal",
      "Their airway and breathing status",
      "Their last routine appointment",
    ],
    correct: 2,
    explanation: "Assessing the airway and breathing addresses the most urgent concern and guides the next action.",
  },
];

export function SampleQuiz() {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [finished, setFinished] = useState(false);
  const question = questions[questionIndex];

  function nextQuestion() {
    if (questionIndex === questions.length - 1) {
      setFinished(true);
    } else {
      setQuestionIndex(questionIndex + 1);
      setSelected(null);
    }
  }

  function restart() {
    setQuestionIndex(0);
    setSelected(null);
    setFinished(false);
  }

  return (
    <div className="self-start rounded-[1.75rem] bg-card p-6 shadow-[0_22px_65px_rgba(24,72,58,0.07)] sm:p-9 lg:p-10">
      {finished ? (
        <div className="flex min-h-[330px] flex-col items-start justify-center" aria-live="polite">
          <span className="mb-7 inline-flex size-14 items-center justify-center rounded-full bg-secondary text-accent">
            <RotateCcw aria-hidden="true" className="size-6" />
          </span>
          <h3 className="text-3xl font-semibold tracking-tight text-foreground">Keep the practice going.</h3>
          <p className="mt-4 max-w-[390px] leading-relaxed text-muted-foreground">
            You have reached the end of this short sample. Try it again or explore more ways to prepare.
          </p>
          <button type="button" onClick={restart} className="mt-8 inline-flex min-h-12 items-center gap-2 rounded-full bg-primary px-6 font-semibold text-primary-foreground hover:bg-accent-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary">
            Start again <RotateCcw aria-hidden="true" className="size-4" />
          </button>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between gap-4 text-xs font-bold uppercase tracking-[0.15em] text-accent">
            <span>Quick practice</span>
            <span>Question {questionIndex + 1} of {questions.length}</span>
          </div>
          <div className="mt-5 flex gap-1.5" aria-hidden="true">
            {questions.map((item, index) => (
              <span key={item.question} className={["h-1.5 flex-1 rounded-full", index <= questionIndex ? "bg-accent" : "bg-secondary/70"].join(" ")} />
            ))}
          </div>
          <h3 className="mt-9 text-2xl font-semibold leading-snug tracking-tight text-foreground sm:text-[1.7rem]">
            {question.question}
          </h3>
          <div className="mt-7 space-y-3" role="group" aria-label="Answer choices">
            {question.answers.map((answer, index) => {
              const revealed = selected !== null;
              const correct = index === question.correct;
              const chosen = selected === index;
              return (
                <button
                  key={answer}
                  type="button"
                  disabled={revealed}
                  onClick={() => setSelected(index)}
                  aria-pressed={chosen}
                  className={[
                    "flex min-h-14 w-full items-center gap-4 rounded-xl border px-4 py-3 text-left text-sm leading-snug transition-colors sm:text-base",
                    revealed && correct ? "border-accent bg-secondary text-foreground" :
                    revealed && chosen ? "border-destructive/50 bg-destructive/10 text-destructive" :
                    "border-border bg-card text-foreground hover:border-accent disabled:hover:border-border",
                    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
                  ].join(" ")}
                >
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-full border border-current text-xs font-semibold">
                    {String.fromCharCode(65 + index)}
                  </span>
                  {answer}
                </button>
              );
            })}
          </div>
          {selected !== null && (
            <div className="mt-7 border-t border-border pt-6" role="status" aria-live="polite">
              <p className="font-semibold text-foreground">{selected === question.correct ? "That's right." : "Let's look at the reasoning."}</p>
              <p className="mt-2 leading-relaxed text-muted-foreground">{question.explanation}</p>
              <button type="button" onClick={nextQuestion} className="mt-6 inline-flex min-h-12 items-center gap-2 rounded-full bg-primary px-6 font-semibold text-primary-foreground transition-colors hover:bg-accent-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary">
                {questionIndex === questions.length - 1 ? "Finish sample" : "Next question"}
                <ArrowRight aria-hidden="true" className="size-4" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
