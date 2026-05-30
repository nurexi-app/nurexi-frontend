// app/learner/exam/[examCode]/ExamSessionSelector.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/hooks/StoreHooks";
import {
  setExamSession,
  setExamDuration,
  startExam,
} from "@/lib/features/exam/examSlice";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Lock,
  Unlock,
  Clock,
  AlertCircle,
  BookOpen,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { cn, getInitials } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Session {
  id: number;
  session_name: string;
  year: number;
  hasAccess: boolean;
  questionCount: number;
  authorName: string;
  authorAvatar?: string;
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

  const [selectedSessionId, setSelectedSessionId] = useState<number | null>(
    null,
  );
  const [selectedDuration, setSelectedDuration] = useState<number>(90); // Default 90 minutes
  const [isStarting, setIsStarting] = useState(false);
  const [checkingAccess, setCheckingAccess] = useState(false);

  // Get selected session details
  const selectedSession = sessions.find((s) => s.id === selectedSessionId);
  const isSelectedSessionLocked = selectedSession
    ? !selectedSession.hasAccess
    : false;

  // Handle session selection (Now allows selecting locked sessions to preview access action!)
  const handleSessionChange = (session: Session) => {
    setSelectedSessionId(session.id);
    // Only dispatch active session state if they actually have access rights
    if (session.hasAccess) {
      dispatch(setExamSession(session.id));
    }
  };

  // Handle duration change
  const handleDurationChange = (minutes: number) => {
    setSelectedDuration(minutes);
    dispatch(setExamDuration(minutes * 60)); // Convert to seconds
  };

  // Handle start exam or purchase routing
  const handleStartExam = async () => {
    if (!selectedSessionId || !selectedSession) return;

    try {
      setIsStarting(true);

      // If user is not logged in, redirect directly to intended target context
      if (!user) {
        router.push(`/login?redirect=/learner/exam/${examCode}`);
        return; // Don't reset isStarting so button stays in loading state during redirect
      }

      if (!selectedSession.hasAccess) {
        setCheckingAccess(true);
        const supabase = createClient();
        const { data: bundleQuestion } = await supabase
          .from("bundle_questions")
          .select("bundle_id")
          .eq("exam_session_id", selectedSessionId)
          .single();

        if (bundleQuestion) {
          router.push(`/explore/?${bundleQuestion.bundle_id}`);
        } else {
          router.push(`/explore?session=${selectedSessionId}&exam=${examCode}`);
        }
        return; // Don't reset isStarting so button stays in loading state during redirect
      }

      // Valid Access granted
      dispatch(startExam(examCode.toLowerCase()));
      router.push(`/learner/exam/${examCode}/${selectedSessionId}`);
      // Don't reset isStarting so button stays in loading state during redirect
    } catch (error) {
      setIsStarting(false);
      setCheckingAccess(false);
      if (error instanceof Error) {
        toast.error(error?.message);
      } else {
        toast.error("An error occurred. Please try again.");
      }
    }
  };

  return (
    <div className="space-y-8 antialiased">
      {/* ─── SECTION 1: SESSION SELECTION ───────────────────────────────── */}
      <div className="space-y-3">
        <div>
          <Label className="text-base font-semibold text-foreground tracking-tight">
            Select Exam Session
          </Label>
          <p className="text-xs text-muted-foreground">
            Choose which year/session template you want to practice under
            simulation conditions
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {sessions.map((session) => {
            const isLocked = !session.hasAccess;
            const isSelected = selectedSessionId === session.id;

            return (
              <button
                key={session.id}
                type="button"
                onClick={() => handleSessionChange(session)}
                className={cn(
                  "group relative w-full text-left rounded-2xl border transition-all duration-200 cursor-pointer overflow-hidden",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
                  isSelected
                    ? "border-primary bg-primary/5 shadow-[0_0_0_3px_oklch(78.07%_0.117_166.71/0.15)]"
                    : "border-border bg-card hover:border-primary/30 hover:shadow-sm",
                )}
              >
                {/* selected indicator strip */}
                <div
                  className={cn(
                    "absolute left-0 top-0 bottom-0 w-[3px] rounded-l-2xl transition-all duration-200",
                    isSelected ? "bg-primary" : "bg-transparent",
                  )}
                />

                <div className="p-4 pl-5 flex flex-col gap-3">
                  {/* ── top row: name + lock badge ── */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <h3
                        className={cn(
                          "font-semibold text-sm leading-snug tracking-tight truncate transition-colors duration-150",
                          isSelected
                            ? "text-primary"
                            : "text-foreground group-hover:text-primary",
                        )}
                      >
                        {session.session_name}
                      </h3>
                      {session.year && (
                        <p className="text-[11px] text-muted-foreground font-mono mt-0.5">
                          {session.year}
                        </p>
                      )}
                    </div>

                    {isLocked ? (
                      <Badge
                        variant="secondary"
                        className="shrink-0 gap-1 px-1.5 py-0.5 text-[10px] font-medium bg-neutral-100 text-neutral-500 dark:bg-neutral-900 dark:text-neutral-400 border-none rounded-full"
                      >
                        <Lock className="h-2.5 w-2.5" />
                        Premium
                      </Badge>
                    ) : (
                      <Badge
                        variant="secondary"
                        className="shrink-0 gap-1 px-1.5 py-0.5 text-[10px] font-medium bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border-none rounded-full"
                      >
                        <Unlock className="h-2.5 w-2.5 text-emerald-500" />
                        Free
                      </Badge>
                    )}
                  </div>

                  {/* ── author row ── */}
                  {session.authorName && (
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6 shrink-0 ring-1 ring-border">
                        <AvatarImage
                          src={session?.authorAvatar || ""}
                          alt={session.authorName}
                        />
                        <AvatarFallback
                          className="text-[10px] font-semibold"
                          style={{
                            background: "oklch(78.07% 0.117 166.71 / 0.15)",
                            color: "oklch(42% 0.117 166.71)",
                          }}
                        >
                          {getInitials(session.authorName)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-[11px] text-muted-foreground truncate">
                        {session.authorName}
                      </span>
                    </div>
                  )}

                  {/* ── bottom row: question count + selected check ── */}
                  <div
                    className={cn(
                      "flex items-center justify-between pt-2.5 border-t text-[11px]",
                      isSelected ? "border-primary/20" : "border-border/50",
                    )}
                  >
                    <span className="text-muted-foreground">Questions</span>
                    <div className="flex items-center gap-1.5">
                      <span
                        className={cn(
                          "font-semibold px-1.5 py-0.5 rounded text-[11px]",
                          isSelected
                            ? "bg-primary/10 text-primary"
                            : "bg-muted/60 text-foreground",
                        )}
                      >
                        {session.questionCount ?? "—"} Qs
                      </span>
                      {isSelected && (
                        <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0" />
                      )}
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ─── SECTION 2: DURATION SELECTION ─────────────────────────────── */}
      <div className="space-y-3">
        <div>
          <Label className="text-base font-semibold text-foreground tracking-tight">
            Exam Duration
          </Label>
          <p className="text-xs text-muted-foreground">
            Configure target duration boundaries for countdown alerts
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {[60, 90, 120].map((minutes) => {
            const isDurationSelected = selectedDuration === minutes;
            return (
              <button
                key={minutes}
                type="button"
                onClick={() => handleDurationChange(minutes)}
                className={`
                  p-3 rounded-xl border text-center transition-all duration-200 cursor-pointer flex flex-col items-center justify-center space-y-1 bg-card
                  ${
                    isDurationSelected
                      ? "border-primary bg-primary/2 ring-2 ring-primary/20"
                      : "border-border hover:border-muted-foreground/30"
                  }
                `}
              >
                <Clock
                  className={`h-4 w-4 transition-colors ${isDurationSelected ? "text-primary" : "text-muted-foreground"}`}
                />
                <span className="font-medium text-xs text-foreground">
                  {minutes} Mins
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ─── SECTION 3: RULES & DETAILS BRIEF ──────────────────────────── */}
      <div className="rounded-xl border border-border/60 bg-muted/20 p-4 space-y-3.5">
        <div className="flex items-center gap-2 text-foreground">
          <BookOpen className="h-4 w-4 text-primary" />
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Quiz Instructions & Tips
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-muted-foreground">
          <div className="flex items-start gap-2">
            <CheckCircle2 className="h-3.5 w-3.5 text-primary/70 shrink-0 mt-0.5" />
            <span>
              Detailed explanations and rationales will unlock as soon as you
              submit your quiz.
            </span>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle2 className="h-3.5 w-3.5 text-primary/70 shrink-0 mt-0.5" />
            <span>
              Your progress saves automatically after every answer—no need to
              worry if you lose connection.
            </span>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle2 className="h-3.5 w-3.5 text-primary/70 shrink-0 mt-0.5" />
            <span>
              If the study timer runs out, your quiz answers will safely submit
              exactly where you left off.
            </span>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle2 className="h-3.5 w-3.5 text-primary/70 shrink-0 mt-0.5" />
            <span>
              You can flag difficult questions to review, skip ahead, or come
              back to them before finishing.
            </span>
          </div>
        </div>
      </div>

      {/* ─── SECTION 4: ACTIONS PLATFORM BUTTONS ───────────────────────── */}
      <div className="pt-2">
        {!user && (
          <div className="mb-4 p-3 bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 rounded-xl flex items-center gap-2.5">
            <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0" />
            <p className="text-xs text-amber-800 dark:text-amber-300">
              An active learner profile session token is required to start
              running test compilation records.
            </p>
          </div>
        )}
        <Button
          onClick={handleStartExam}
          disabled={!selectedSessionId || isStarting}
          variant={isSelectedSessionLocked ? "secondary" : "default"}
          className="w-full h-12 text-sm font-semibold rounded-xl tracking-wide shadow-sm transition-all active:scale-[0.99]"
        >
          {checkingAccess ? (
            "Checking your access..."
          ) : isStarting ? (
            "Loading your quiz..."
          ) : !user ? (
            "Log in to Start Practicing"
          ) : !selectedSessionId ? (
            "Choose an Exam Session Above"
          ) : isSelectedSessionLocked ? (
            <span className="flex items-center gap-1.5 justify-center">
              <Sparkles className="h-4 w-4 text-primary animate-pulse" />
              Unlock Study Access for {selectedSession?.session_name}
            </span>
          ) : (
            "Start Practice Quiz"
          )}
        </Button>{" "}
      </div>
    </div>
  );
}
