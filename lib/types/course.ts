import { Quiz } from "./questions";

export interface BaseCourse {
  id: string;
  title: string;
  description: string;
  author: {
    full_name: string;
    avatar_url: string;
  };
  expected_duration?: string;
  verified?: boolean;
  cover_image: string;
  slug: string;
}

export interface PublicCourse extends BaseCourse {
  is_free: boolean;
  price: number;
  discount_type: string | null;
  discount_value: number | null;
  has_discount: boolean;
  discount_expiry: string | null;
  difficulty_level: string | null;
  target_audience: string;
  language?: string | null;
  rating?: number;
  rating_count?: number;
  what_you_will_learn?: string[];
  verification: { status: string }[];
  sections: Section[];
}

export interface PublicCourseInterface extends BaseCourse {
  price: number;
  is_free: boolean;
  discount_type: string | null;
  discount_value: number | null;
  discount_expiry: string | null;
  difficulty_level: string | null;
  target_audience: string;
  language?: string | null;
  rating?: number;
  rating_count?: number;
  studentsEnrolled?: number;
  isBestSeller?: boolean;
}

export interface DashboardCourseInterface extends BaseCourse {
  progress: number;
  totalLessons: number;
  completedLessons: number;
  lastAccessed: string | null;
}

// lib/types/course.ts for educator
export interface Course {
  id: string;
  created_at: string;
  educator_id: string;
  title: string | null;
  slug: string | null;
  description: string | null;
  what_you_will_learn: string[] | null;
  requirements: string[] | null;
  target_audience: string | null;
  price: number | null; // bigint → number
  is_free: boolean | null;
  is_published: boolean | null;
  cover_image: string | null;
  status: "draft" | "published" | "archived";
  published_at: string | null;
  updated_at: string | null;
  difficulty_level: "beginner" | "intermediate" | "advanced" | null;
  expected_duration: string | null;
  language: string | null;

  // Discount fields (to be added)
  has_discount?: boolean | null;
  discount_type?: "percentage" | "fixed" | null;
  discount_value?: number | null;
  discount_expiry?: string | null;

  educator?: {
    id: string;
    full_name: string;
    avatar_url?: string;
  };
}

// export interface CourseWithSections extends Course {
//   sections: (CourseSection & {
//     lessons: CourseLesson[];
//   })[];
// }

export interface CourseCreateInput {
  title: string;
  slug?: string;
  description?: string;
  what_you_will_learn?: string[];
  requirements?: string[];
  target_audience?: string;
  price?: number;
  is_free?: boolean;
  cover_image?: string;
  difficulty_level?: "beginner" | "intermediate" | "advanced";
  expected_duration?: string;
  language?: string;
}

export interface CoursePricingInput {
  is_free: boolean;
  price?: number;
  has_discount?: boolean;
  discount_type?: "percentage" | "fixed";
  discount_value?: number;
  discount_expiry?: string | null;
}

export interface LessonAsset {
  provider: "cloudinary" | "supabase";

  type: "video" | "pdf";

  public_id?: string;
  playback_url?: string;
  secure_url?: string;
  width?: number;
  height?: number;

  asset_id?: string;

  thumbnail_url?: string;

  lessonId?: string;

  duration_seconds?: number;

  filename?: string;
}
export type LessonType = "video" | "pdf" | "text";

export interface Lesson {
  id: string;

  title: string;

  content_type: LessonType;

  asset?: LessonAsset | null;
  pending_asset: LessonAsset | null;
  is_preview: boolean;
  text_content?: string;
}

export interface Section {
  id: string;
  title: string;
  position?: number;
  quiz_data: Quiz[] | null;
  lessons: Lesson[];
}
