import { Quiz } from "./questions";

export interface BaseCourse {
  id: string;
  title: string;
  description: string;
  author: {
    name: string;
    verified: boolean;
  };
  thumbnail: string;
  duration: string;
  level: string;
  tags: string[];
}

export interface PublicCourseInterface extends BaseCourse {
  rating: number;
  ratingCount: number;
  price: number;
  discountPrice: number;
  studentsEnrolled: number;
  isBestSeller: boolean;
}

export interface DashboardCourseInterface extends BaseCourse {
  progress: number;
  totalLessons: number;
  completedLessons: number;
  lastAccessed: string | null;
}

export interface LessonAsset {
  provider: "cloudinary" | "supabase";

  type: "video" | "pdf";

  public_id?: string;

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
