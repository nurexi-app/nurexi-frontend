"use server";

import { createClient } from "@/lib/supabase/server";
import { calculateNewStreak } from "../utils";
import { addExamActivity } from "./activity-actions";
import { uploadLearnerAnalytics } from "./learnerAnalytic-action";

interface ExamResult {
  correctCount: number;
  totalQuestions: number;
  sessionId: string;
  performanceBySubject: Record<
    string,
    { correct: number; total: number; percentage: number }
  >;
}

export async function saveExamResult(result: ExamResult) {
  const supabase = await createClient();
  const today = new Date();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error("User not authenticated");
  }

  const { data: stats, error: fetchError } = await supabase
    .from("learner_stats")
    .select(
      "current_streak, longest_streak, last_activity_date, total_exam_attempts, total_questions_answered, total_correct_answers",
    )
    .eq("user_id", user.id)
    .single();

  if (fetchError) {
    throw new Error("Failed to fetch user stats");
  }

  const newStreak = calculateNewStreak(
    stats.current_streak,
    stats.last_activity_date,
    today,
  );

  const score = Math.round((result.correctCount / result.totalQuestions) * 100);

  const newTotalAttempts = stats.total_exam_attempts + 1;
  const newTotalQuestions =
    stats.total_questions_answered + result.totalQuestions;
  const newTotalCorrect = stats.total_correct_answers + result.correctCount;

  const { error: updateError } = await supabase
    .from("learner_stats")
    .update({
      total_exam_attempts: newTotalAttempts,
      total_questions_answered: newTotalQuestions,
      total_correct_answers: newTotalCorrect,
      current_streak: newStreak,
      longest_streak: Math.max(newStreak, stats.longest_streak),
      last_activity_date: today.toISOString(),
      updated_at: today.toISOString(),
    })
    .eq("user_id", user.id);

  if (updateError) {
    throw new Error("Failed to update stats");
  }

  // Run independent operations - if they fail, throw
  const [activityResult, analyticsResult] = await Promise.all([
    addExamActivity({
      userId: user.id,
      sessionId: result.sessionId,
      score: score,
      correctCount: result.correctCount,
      totalQuestions: result.totalQuestions,
    }),
    uploadLearnerAnalytics(result, score),
  ]);

  if (!activityResult.success) {
    throw new Error(activityResult.error || "Failed to save activity");
  }

  if (!analyticsResult.success) {
    throw new Error(analyticsResult.error || "Failed to save analytics");
  }

  return {
    success: true,
    newStreak: newStreak,
    streakIncreased: newStreak > stats.current_streak,
  };
}
