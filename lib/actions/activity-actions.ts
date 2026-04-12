"use server";

import { createClient } from "@/lib/supabase/server";

interface ExamActivityParams {
  userId: string;
  sessionId: string | number;
  score: number;
  totalQuestions: number;
  correctCount: number;
}

export async function addExamActivity(params: ExamActivityParams) {
  try {
    const supabase = await createClient();

    // Fetch session title from exam_sessions table
    const { data: session, error: sessionError } = await supabase
      .from("exam_session")
      .select("session_name")
      .eq("id", params.sessionId)
      .single();

    if (sessionError) {
      console.error("Error fetching session:", sessionError);
      return { success: false, error: "Failed to fetch session details" };
    }

    const { data, error } = await supabase
      .from("user_activities")
      .insert({
        user_id: params.userId,
        type: "exam",
        action: "completed",
        reference_id: params.sessionId.toString(),
        title: session.session_name,
        description: `You scored ${params.score}%`,
        metadata: {
          score: params.score,
          total: params.totalQuestions,
          correct: params.correctCount,
        },
        read: true,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error("Error adding exam activity:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to add activity",
    };
  }
}
