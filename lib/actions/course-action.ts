"use server";

import { createClient } from "../supabase/server";
import { LessonAsset } from "../types/course";
import { courseOverviewType } from "../validators/courseUpload";

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
    .select("status")
    .eq("id", courseId)
    .single();

  // Only allow deletion of drafts
  if (course?.status !== "draft") {
    throw new Error("Cannot delete published courses. Unpublish first.");
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
  updates: {
    title?: string;
    content_type?: string;
    text_content?: string;
    attachments?: any[];
    quiz_data?: any;
    duration_minutes?: number;
    is_preview?: boolean;
    position?: number;
    asset?: LessonAsset | null;
  },
) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("course_lessons")
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq("id", lessonId)
    .select()
    .single();

  if (error) {
    throw new Error("Failed to update lesson");
  }

  return data;
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
