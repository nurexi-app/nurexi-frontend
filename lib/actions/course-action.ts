"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "../supabase/server";
import { Lesson, LessonAsset } from "../types/course";
import { courseOverviewType } from "../validators/courseUpload";
import { isReadyToPublish } from "../utils";
import { registerOrphanedAsset } from "./helpers/course";
import { requireCoursePermission } from "./guard-actions";

// course uplaod, sections and lessons

export async function createCourse(userId: string) {
  const supabase = await createClient();

  const { data: courseData, error: courseError } = await supabase
    .from("courses")
    .insert({
      educator_id: userId,
      title: "Untitled Course",
      status: "draft",
    })
    .select()
    .single();

  if (courseError) {
    throw new Error("Failed to create course");
  }

  return { success: true, courseData };
}

export async function getCourse(courseId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("courses")
    .select("*")
    .eq("id", courseId)
    .single();

  if (error) {
    throw new Error("Failed to fetch course data");
  }

  return data;
}

export async function uploadCourseCoverImage(
  courseId: string,
  imageUrl: string,
) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("courses")
    .update({
      cover_image: imageUrl,
    })
    .eq("id", courseId)
    .select()
    .single();

  if (error) {
    console.log(error.message);
    throw new Error("Failed to upload course cover image");
  }

  return data;
}

export async function getEducatorCourses(educatorId: string) {
  const supabase = await createClient();

  const { data: allEducatorCourses, error } = await supabase
    .from("courses")
    .select("*")
    .eq("educator_id", educatorId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error("Failed to fetch educator courses");
  }

  return allEducatorCourses;
}

export async function deleteCourse(courseId: string) {
  const supabase = await createClient();

  // Get course first
  const { data: course } = await supabase
    .from("courses")
    .select("status, is_approved")
    .eq("id", courseId)
    .single();

  // Only allow deletion of drafts
  if (course?.is_approved) {
    throw new Error("Cannot delete approved courses");
  }
  if (course?.status !== "draft") {
    throw new Error("Cannot delete published courses");
  }

  // Proceed with deletion
  const { error } = await supabase.from("courses").delete().eq("id", courseId);

  if (error) throw new Error("Failed to delete course");
}

export async function updateCourseOverview(
  courseId: string,
  data: courseOverviewType,
) {
  const supabase = await createClient();
  const { data: currentCourse } = await supabase
    .from("courses")
    .select("is_approved")
    .eq("id", courseId)
    .single();

  if (currentCourse?.is_approved) {
    delete (data as any).slug;
    return { error: "Slug can not be changed once the course is approved." };
  }
  if (data.slug) {
    const { data: existing } = await supabase
      .from("courses")
      .select("id")
      .eq("slug", data.slug)
      .neq("id", courseId)
      .maybeSingle();

    if (existing) {
      return { error: "Slug already exists. Please choose another." };
    }
  }

  const { error } = await supabase
    .from("courses")
    .update({
      title: data.title,
      slug: data.slug,
      description: data.description,
      difficulty_level: data.dificultyLevel,
      expected_duration: data.expectedDuration,
      language: data.language,
      what_you_will_learn: data.learningOutcome,
      cover_image: data.image,
      updated_at: new Date().toISOString(),
    })
    .eq("id", courseId);

  if (error) {
    console.log(error);
    return { error: error.message };
  }

  return { success: true };
}

export async function updateCourseData(courseId: string, updates: any) {
  const supabase = await createClient();

  const { data: currentCourse } = await supabase
    .from("courses")
    .select("is_approved")
    .eq("id", courseId)
    .single();

  if (currentCourse?.is_approved) {
    delete (updates as any).slug;
    return { error: "Slug can not be changed once the course is approved." };
  }
  if (updates.slug) {
    const { data: existing } = await supabase
      .from("courses")
      .select("id")
      .eq("slug", updates.slug)
      .neq("id", courseId)
      .maybeSingle();

    if (existing) {
      return { error: "Slug already exists. Please choose another." };
    }
  }

  const { data, error } = await supabase
    .from("courses")
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq("id", courseId)
    .select()
    .single();

  if (error) {
    console.log(error);
    throw new Error(error.message || "Failed to update course data");
  }

  return {
    success: true,
    data: data,
  };
}

//  sections

export async function getAllCourseSections(courseId: string) {
  const supabase = await createClient();
  const { data: courseSections, error } = await supabase
    .from("course_sections")
    .select("*")
    .eq("course_id", courseId)
    .order("position", { ascending: true });

  if (error) {
    throw new Error("Failed to fetch course sections");
  }

  return courseSections;
}

export async function addNewSection(courseId: string) {
  const supabase = await createClient();
  // verify course
  const { data: course, error: courseError } = await supabase
    .from("courses")
    .select("educator_id")
    .eq("id", courseId)
    .single();

  if (courseError || !course) {
    throw new Error("Course not found");
  }

  // Get current max position
  const { data: maxPositionData } = await supabase
    .from("course_sections")
    .select("position")
    .eq("course_id", courseId)
    .order("position", { ascending: false })
    .limit(1)
    .maybeSingle();

  const newPosition = (maxPositionData?.position ?? 0) + 1;

  const { data: courseSection, error } = await supabase
    .from("course_sections")
    .insert({
      course_id: courseId,
      title: "Untitled Section",
      position: newPosition,
    })
    .select()
    .single();

  if (error) {
    throw new Error("Failed to add new section");
  }

  return courseSection;
}

export async function updateSection(
  sectionId: string,
  updates: { title?: string; position?: number },
) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("course_sections")
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq("id", sectionId)
    .select()
    .single();

  if (error) {
    console.log(error);
    throw new Error("Failed to update section");
  }

  return {
    success: true,
    data,
  };
}

export async function deleteSection(sectionId: string) {
  const supabase = await createClient();

  // Get section info
  const { data: section } = await supabase
    .from("course_sections")
    .select("course_id, position")
    .eq("id", sectionId)
    .single();

  if (!section) throw new Error("Section not found");

  // Delete section
  const { error: deleteError } = await supabase
    .from("course_sections")
    .delete()
    .eq("id", sectionId);

  if (deleteError) throw new Error("Failed to delete section");

  // Get all remaining sections for this course
  const { data: remainingSections } = await supabase
    .from("course_sections")
    .select("id, position")
    .eq("course_id", section.course_id)
    .order("position", { ascending: true });

  // Reassign positions sequentially
  if (remainingSections?.length) {
    for (let i = 0; i < remainingSections.length; i++) {
      await supabase
        .from("course_sections")
        .update({ position: i + 1 })
        .eq("id", remainingSections[i].id);
    }
  }

  return { success: true };
}

// Reorder sections (drag and drop)
export async function reorderSections(courseId: string, sectionIds: string[]) {
  const supabase = await createClient();

  // Update each section's position based on array order
  const updates = sectionIds.map((id, index) =>
    supabase
      .from("course_sections")
      .update({ position: index + 1 })
      .eq("id", id),
  );

  const results = await Promise.all(updates);

  const errors = results.filter((r) => r.error);
  if (errors.length > 0) {
    throw new Error("Failed to reorder sections");
  }

  return { success: true };
}

// ============================================
// LESSON ACTIONS
// ============================================

export async function getSectionLessons(sectionId: string) {
  const supabase = await createClient();

  const { data: lessons, error } = await supabase
    .from("course_lessons")
    .select("*")
    .eq("section_id", sectionId)
    .order("position", { ascending: true });

  if (error) {
    throw new Error("Failed to fetch lessons");
  }

  return lessons;
}

export async function addLesson(sectionId: string, courseId: string) {
  const supabase = await createClient();

  // Get current max position in this section
  const { data: maxPosition } = await supabase
    .from("course_lessons")
    .select("position")
    .eq("section_id", sectionId)
    .order("position", { ascending: false })
    .limit(1)
    .maybeSingle();

  const newPosition = (maxPosition?.position ?? 0) + 1;

  const { data, error } = await supabase
    .from("course_lessons")
    .insert({
      section_id: sectionId,
      course_id: courseId,
      title: "Untitled Lesson",
      content_type: "video",
      position: newPosition,
    })
    .select()
    .single();

  if (error) {
    throw new Error("Failed to add lesson");
  }

  return data;
}

// Update a lesson
export async function updateLesson(
  lessonId: string,
  courseId: string,
  updates: Partial<Lesson>,
) {
  // 1. Guard Check — Verify educator owns this course
  const auth = await requireCoursePermission(courseId);
  if (!auth.authorized) {
    throw new Error(auth.error);
  }

  const supabase = await createClient();

  // 2. Orphan Tracking Check — ONLY run if 'asset' key is present in updates
  if ("asset" in updates) {
    const { data: currentLesson } = await supabase
      .from("course_lessons")
      .select("asset")
      .eq("id", lessonId)
      .single();

    const oldAsset = currentLesson?.asset as LessonAsset | null;

    if (oldAsset && Object.keys(oldAsset).length > 0) {
      const newAsset = updates.asset as LessonAsset | null;

      const isReplaced =
        newAsset &&
        ((newAsset.public_id && newAsset.public_id !== oldAsset.public_id) ||
          (newAsset.filename && newAsset.filename !== oldAsset.filename));

      const isCleared = newAsset === null;

      if (isReplaced || isCleared) {
        await registerOrphanedAsset(
          supabase,
          oldAsset,
          lessonId,
          courseId,
          isReplaced ? "replacement_approved" : "asset_removed",
        );
      }
    }
  }

  // 3. Save updates to database
  const { data, error } = await supabase
    .from("course_lessons")
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq("id", lessonId)
    .select()
    .single();

  // 4. Catch database trigger errors (e.g., maximum 2 preview lessons)
  if (error) {
    if (error.message.includes("maximum of 2 preview lessons")) {
      throw new Error(
        "This course already has 2 preview lessons enabled. Please disable a preview on another lesson first.",
      );
    }
    throw new Error(error.message || "Failed to update lesson");
  }

  revalidatePath(`/educator/courses/${courseId}`);
  return { success: true, data };
}

// Delete a lesson
export async function deleteLesson(lessonId: string) {
  const supabase = await createClient();

  // First, get the lesson to know its section and position
  const { data: lesson, error: fetchError } = await supabase
    .from("course_lessons")
    .select("section_id, position")
    .eq("id", lessonId)
    .single();

  if (fetchError) {
    throw new Error("Lesson not found");
  }

  // Delete the lesson
  const { error: deleteError } = await supabase
    .from("course_lessons")
    .delete()
    .eq("id", lessonId);

  if (deleteError) {
    throw new Error("Failed to delete lesson");
  }

  // Reorder remaining lessons in the same section
  const { data: remainingLessons } = await supabase
    .from("course_lessons")
    .select("id, position")
    .eq("section_id", lesson.section_id)
    .order("position", { ascending: true });

  if (remainingLessons && remainingLessons.length > 0) {
    for (let i = 0; i < remainingLessons.length; i++) {
      await supabase
        .from("course_lessons")
        .update({ position: i + 1 })
        .eq("id", remainingLessons[i].id);
    }
  }

  return { success: true };
}

// Reorder lessons within a section (for drag and drop)
export async function reorderLessons(sectionId: string, lessonIds: string[]) {
  const supabase = await createClient();

  const updates = lessonIds.map((id, index) =>
    supabase
      .from("course_lessons")
      .update({ position: index + 1 })
      .eq("id", id)
      .eq("section_id", sectionId),
  );

  const results = await Promise.all(updates);
  const errors = results.filter((r) => r.error);

  if (errors.length > 0) {
    throw new Error("Failed to reorder lessons");
  }

  return { success: true };
}

interface PublishCourseParams {
  courseId: string;
  educatorId: string;
}

export async function publishCourse(courseId: string) {
  const supabase = await createClient();

  // 1. Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("Not authenticated");
  }

  // 2. Get course with all content
  const { data: course, error } = await supabase
    .from("courses")
    .select(
      `
      *,
      sections:course_sections (
        id,
        title,
        lessons:course_lessons (
          id,
          title,
          content_type,
          video_url,
          text_content,
          asset
        )
      )
    `,
    )

    .eq("id", courseId)
    .eq("educator_id", user.id)
    .single();
  console.log("course from server: ", course);
  if (error || !course) {
    console.log("course error: ", error);
    throw new Error("Course not found or you don't have permission");
  }

  // 3. Check if already published
  if (course.status === "published") {
    throw new Error("Course is already published");
  }

  // 4. Validate content readiness
  const isReady = isReadyToPublish(course);

  if (!isReady) {
    throw new Error(
      "Course is not ready to publish. Please complete all sections and lessons.",
    );
  }

  // 5. Publish the course
  const { error: updateError } = await supabase
    .from("courses")
    .update({
      status: "published",
      is_published: true,
      published_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", courseId);

  if (updateError) {
    throw new Error("Failed to publish course");
  }

  revalidatePath(`/educator/courses/${courseId}`);

  return { success: true };
}

// Helper function to check if course is ready
