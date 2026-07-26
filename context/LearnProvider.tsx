"use client";
import { createContext, useContext, useState } from "react";

export interface CourseLesson {
  id: string;
  title: string;
  content_type: "video" | "pdf" | "text";
  position: number;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correct_answer_index: number;
  explanation?: string;
}

export interface CourseSection {
  id: string;
  title: string;
  position: number;
  quiz_data?: {
    questions: QuizQuestion[];
  };
  course_lessons: CourseLesson[];
}

export interface Course {
  id: string;
  title: string;
  slug: string;
  cover_image?: string | null;
  educator_id?: string;
  course_sections?: CourseSection[];
}

interface LearnProviderProps {
  children: React.ReactNode;
  course: Course;
  initialCompletedLessons: string[];
}

interface LessonContextType {
  course: Course;
  progressPercentage: number;
  initialCompletedLessons: string[];

  completedLessons: Set<string>;
  setCompletedLessons: React.Dispatch<React.SetStateAction<Set<string>>>;
}

const LearnContext = createContext<LessonContextType | undefined>(undefined);

export default function LearnProvider({
  children,
  course,
  initialCompletedLessons,
}: LearnProviderProps) {
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(
    new Set(initialCompletedLessons),
  );

  const totalLessons =
    course?.course_sections?.reduce(
      (acc, section) => acc + (section.course_lessons?.length || 0),
      0,
    ) || 0;

  const progressPercentage =
    totalLessons > 0
      ? Math.round((completedLessons.size / totalLessons) * 100)
      : 0;
  return (
    <LearnContext.Provider
      value={{
        course,
        progressPercentage,
        initialCompletedLessons,

        completedLessons,
        setCompletedLessons,
      }}
    >
      {children}
    </LearnContext.Provider>
  );
}

export function useLearnContext() {
  const context = useContext(LearnContext);

  if (!context) {
    throw new Error("useLearnContext must be used within a LearnProvider");
  }

  return context;
}
