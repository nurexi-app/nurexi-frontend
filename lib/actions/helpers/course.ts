import { createClient } from "@/lib/supabase/server";
import { LessonAsset } from "../../types/course";

export async function registerOrphanedAsset(
  supabase: Awaited<ReturnType<typeof createClient>>,
  asset: LessonAsset,
  lessonId: string,
  courseId: string,
  reason:
    | "asset_removed"
    | "lesson_deleted"
    | "replacement_approved" = "asset_removed",
) {
  const identifier =
    asset.provider === "cloudinary" ? asset.public_id : asset.filename;

  if (!identifier) return;

  const resourceType = asset.type === "pdf" ? "raw" : "video";
  const { error } = await supabase.rpc("register_orphaned_asset", {
    p_provider: asset.provider,
    p_asset_identifier: identifier,
    p_resource_type: resourceType,
    p_bucket_name: asset.provider === "supabase" ? "courses" : null,
    p_lesson_id: lessonId,
    p_course_id: courseId,
    p_reason: reason,
  });

  if (error) {
    console.error("Failed to register orphaned asset:", error.message);
  }
}
