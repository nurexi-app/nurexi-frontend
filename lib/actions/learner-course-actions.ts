"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { requireAuth } from "./guard-actions";
export async function toggleLessonProgress(
  lessonId: string,
  courseId: string,
  isCurrentlyCompleted: boolean,
) {
  const supabase = await createClient();

  const authResponse = await requireAuth();
  if (!authResponse.authorized) {
    throw new Error(authResponse.error);
  }

  const user = authResponse.user;

  //   const { data: purchase, error: purchaseError } = await supabase
  //     .from("course_purchases")
  //     .select("id")
  //     .eq("user_id", user.id)
  //     .eq("course_id", courseId)
  //     .single();

  //   if (purchaseError || !purchase) {
  //     throw new Error("Unauthorized: You have not purchased this course.");
  //   }

  // ... Proceed with the mutation ...
  if (isCurrentlyCompleted) {
    const { error } = await supabase
      .from("lesson_completions")
      .delete()
      .match({ user_id: user.id, lesson_id: lessonId });

    if (error) throw new Error("Failed to remove progress");
  } else {
    const { error } = await supabase.from("lesson_completions").insert({
      user_id: user.id,
      course_id: courseId,
      lesson_id: lessonId,
    });

    if (error) throw new Error("Failed to save progress");
  }

  revalidatePath(`/learner/courses/[slug]/learn`, "layout");

  return { success: true, isCompleted: !isCurrentlyCompleted };
}
