// app/learner/exam/[examCode]/ExamSessionSelector.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/hooks/StoreHooks";
import {
  setExamSession,
  setExamDuration,
  startExam,
} from "@/lib/features/exam/examSlice";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Lock, Unlock, Clock, AlertCircle, BookOpen } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface Session {
  id: number;
  session_name: string;
  year: number;
  hasAccess: boolean;
  questionCount: number;
}

interface ExamSessionSelectorProps {
  examName: string;
  examCode: string;
  sessions: Session[];
  user: any;
}

export default function ExamSessionSelector({
  examName,
  examCode,
  sessions,
  user,
}: ExamSessionSelectorProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { duration } = useAppSelector((store) => store.exam);

  const [selectedSessionId, setSelectedSessionId] = useState<number | null>(
    null,
  );
  const [selectedDuration, setSelectedDuration] = useState<number>(90); // Default 90 minutes
  const [isStarting, setIsStarting] = useState(false);

  // Get selected session details
  const selectedSession = sessions.find((s) => s.id === selectedSessionId);
  const isSelectedSessionLocked = selectedSession
    ? !selectedSession.hasAccess
    : false;

  // Handle session selection
  const handleSessionChange = (sessionId: number) => {
    setSelectedSessionId(sessionId);
    dispatch(setExamSession(sessionId));
  };

  // Handle duration change
  const handleDurationChange = (minutes: number) => {
    setSelectedDuration(minutes);
    dispatch(setExamDuration(minutes * 60)); // Convert to seconds
  };

  // Handle start exam
  const handleStartExam = async () => {
    if (!selectedSessionId) return;

    setIsStarting(true);

    // If user is not logged in, redirect to login
    if (!user) {
      router.push(
        `/login?redirect=/learner/exam/${examCode}/${selectedSessionId}`,
      );
      return;
    }

    // Check access again (to be safe)
    const supabase = createClient();
    const { data: hasAccess } = await supabase.rpc("check_exam_access", {
      p_user_id: user.id,
      p_exam_session_id: selectedSessionId,
    });

    if (!hasAccess) {
      // Find which bundle contains this session for purchase
      const { data: bundleQuestion } = await supabase
        .from("bundle_questions")
        .select("bundle_id")
        .eq("exam_session_id", selectedSessionId)
        .single();

      if (bundleQuestion) {
        router.push(
          `/purchase/${bundleQuestion.bundle_id}?session=${selectedSessionId}&exam=${examCode}`,
        );
      } else {
        router.push(`/purchase?session=${selectedSessionId}&exam=${examCode}`);
      }
      setIsStarting(false);
      return;
    }

    // Has access - start the exam
    dispatch(startExam(examCode.toLowerCase()));
    router.push(`/learner/exam/${examCode}/${selectedSessionId}`);
    setIsStarting(false);
  };

  return (
    <div className="space-y-6">
      {/* Session Selection */}
      <div className="space-y-2">
        <Label htmlFor="examSession" className="text-base font-semibold">
          Select Exam Session
        </Label>
        <p className="text-sm text-muted-foreground mb-3">
          Choose which year/session you want to practice
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {sessions.map((session) => {
            const isLocked = !session.hasAccess;
            const isSelected = selectedSessionId === session.id;

            return (
              <button
                key={session.id}
                onClick={() => !isLocked && handleSessionChange(session.id)}
                disabled={isLocked}
                className={`
                  relative p-4 rounded-lg border-2 text-left transition-all
                  ${
                    isSelected
                      ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                      : "border-border hover:border-primary/50"
                  }
                  ${
                    isLocked
                      ? "opacity-60 cursor-not-allowed bg-muted/30"
                      : "cursor-pointer hover:shadow-md"
                  }
                `}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{session.session_name}</h3>
                      {isLocked ? (
                        <Lock className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Unlock className="h-4 w-4 text-green-500" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {session.year}
                    </p>
                    {/* <p className="text-xs text-muted-foreground mt-2">
                      {session.questionCount || 100} questions
                    </p> */}
                  </div>
                  {isLocked && (
                    <div className="text-xs bg-muted px-2 py-1 rounded">
                      🔒 Locked
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Duration Selection */}
      <div className="space-y-2">
        <Label htmlFor="duration" className="text-base font-semibold">
          Exam Duration
        </Label>
        <p className="text-sm text-muted-foreground mb-3">
          Choose how long you want for this practice session
        </p>

        <div className="grid grid-cols-3 gap-3">
          {[60, 90, 120].map((minutes) => (
            <button
              key={minutes}
              onClick={() => handleDurationChange(minutes)}
              className={`
                p-3 rounded-lg border-2 text-center transition-all
                ${
                  selectedDuration === minutes
                    ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                    : "border-border hover:border-primary/50"
                }
              `}
            >
              <Clock className="h-5 w-5 mx-auto mb-1 text-primary" />
              <span className="font-medium">{minutes} minutes</span>
            </button>
          ))}
        </div>
      </div>

      {/* Exam Details Card */}
      <div className="mt-6 rounded-lg border bg-muted/30 p-4 space-y-3">
        <div className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-primary" />
          <h3 className="text-base font-semibold">Exam Details</h3>
        </div>

        <ul className="space-y-2 text-sm text-muted-foreground">
          <li className="flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-primary" />
            <span>Questions vary by session (typically 80-120 questions)</span>
          </li>
          <li className="flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-primary" />
            <span>Answers and explanations available after submission</span>
          </li>
          <li className="flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-primary" />
            <span>Auto-submission when time elapses</span>
          </li>
          <li className="flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-primary" />
            <span>Review your answers before final submission</span>
          </li>
        </ul>
      </div>

      {/* Start Button */}
      <div className="pt-4">
        {!user && (
          <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-yellow-600" />
            <p className="text-sm text-yellow-700">
              Please login to start the exam
            </p>
          </div>
        )}

        <Button
          onClick={handleStartExam}
          disabled={!selectedSessionId || !user || isStarting}
          className="w-full h-12 text-base font-semibold"
        >
          {isStarting
            ? "Starting..."
            : !user
              ? "Login to Start"
              : !selectedSessionId
                ? "Select a Session to Start"
                : isSelectedSessionLocked
                  ? "Purchase Access to Start"
                  : `Start ${examName} Exam`}
        </Button>

        {selectedSession && isSelectedSessionLocked && (
          <p className="text-xs text-center text-muted-foreground mt-3">
            This session requires purchase. Click start to view pricing options.
          </p>
        )}
      </div>
    </div>
  );
}
