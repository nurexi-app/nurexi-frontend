"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/animate-ui/components/radix/accordion";
import {
  PlayCircle,
  FileText,
  CheckCircle2,
  Circle,
  HelpCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toggleLessonProgress } from "@/lib/actions/learner-course-actions";
import { useLearnContext } from "@/context/LearnProvider";

interface Lesson {
  id: string;
  title: string;
  content_type: "video" | "pdf" | "text";
  position: number;
}

interface Section {
  id: string;
  title: string;
  position: number;
  course_lessons: Lesson[];
  quiz_data: any;
}

interface LearnSidebarProps {
  sections: Section[];
}

export function LearnSidebarAccordion({ sections }: LearnSidebarProps) {
  const params = useParams();
  const currentLessonId = params.lessonId as string;

  const { course, completedLessons, setCompletedLessons } = useLearnContext();

  const courseSlug = course?.slug;
  const courseId = course?.id;

  const defaultOpenSection = sections.find((s) =>
    s.course_lessons.some((l) => l.id === currentLessonId),
  )?.id;

  const { mutate } = useMutation({
    mutationFn: ({
      lessonId,
      isCompleted,
    }: {
      lessonId: string;
      isCompleted: boolean;
    }) => toggleLessonProgress(lessonId, courseId, isCompleted),

    onError: (error, variables) => {
      console.error(error);
      setCompletedLessons((prev) => {
        const newSet = new Set(prev);
        variables.isCompleted
          ? newSet.add(variables.lessonId)
          : newSet.delete(variables.lessonId);
        return newSet;
      });
    },
  });
  const handleToggleComplete = (e: React.MouseEvent, lessonId: string) => {
    e.preventDefault();
    e.stopPropagation();

    const isCurrentlyCompleted = completedLessons.has(lessonId);

    // 1. Optimistic Update (Immediate UI change)
    setCompletedLessons((prev) => {
      const newSet = new Set(prev);
      isCurrentlyCompleted ? newSet.delete(lessonId) : newSet.add(lessonId);
      return newSet;
    });

    // 2. Background Server Mutation
    mutate({ lessonId, isCompleted: isCurrentlyCompleted });
  };

  return (
    <Accordion
      type="multiple"
      defaultValue={defaultOpenSection ? [defaultOpenSection] : []}
      className="w-full"
    >
      {sections
        .sort((a, b) => a.position - b.position)
        .map((section, index) => (
          <AccordionItem
            value={section.id}
            key={section.id}
            className="border-b-0 mb-1"
          >
            <AccordionTrigger className="bg-muted/30 px-4 py-3 hover:bg-muted/50 data-[state=open]:bg-muted/50 transition-colors rounded-sm hover:no-underline">
              <div className="flex flex-col items-start text-left gap-1">
                <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                  Section {index + 1}
                </span>
                <span className="font-semibold text-sm leading-tight">
                  {section.title}
                </span>
              </div>
            </AccordionTrigger>

            <AccordionContent className="pt-1 pb-2 px-2">
              <div className="flex flex-col space-y-1">
                {section.course_lessons
                  .sort((a, b) => a.position - b.position)
                  .map((lesson) => {
                    const isActive = currentLessonId === lesson.id;
                    const isCompleted = completedLessons.has(lesson.id);

                    return (
                      <Link
                        key={lesson.id}
                        href={`/learner/courses/${courseSlug}/learn/${lesson.id}`}
                        className={cn(
                          "group flex items-start gap-3 p-2 rounded-md transition-all duration-200",
                          isActive
                            ? "bg-primary/10 text-primary"
                            : "hover:bg-muted text-muted-foreground hover:text-foreground",
                        )}
                      >
                        <button
                          onClick={(e) => handleToggleComplete(e, lesson.id)}
                          className="mt-0.5 shrink-0 text-muted-foreground hover:text-primary transition-colors disabled:opacity-50"
                        >
                          {completedLessons.has(lesson.id) ? (
                            <CheckCircle2 className="h-5 w-5 text-primary fill-primary/10" />
                          ) : (
                            <Circle className="h-5 w-5" />
                          )}
                        </button>

                        {/* Lesson Info Area */}
                        <div className="flex flex-col flex-1 gap-1 min-w-0">
                          <span
                            className={cn(
                              "text-sm leading-snug line-clamp-2",
                              isActive && "font-medium",
                            )}
                          >
                            {lesson.title}
                          </span>

                          <div className="flex items-center gap-1.5 text-[11px] opacity-70">
                            {lesson.content_type === "video" ? (
                              <PlayCircle className="h-3 w-3" />
                            ) : (
                              <FileText className="h-3 w-3" />
                            )}
                            <span className="capitalize">
                              {lesson.content_type}
                            </span>
                          </div>
                        </div>
                      </Link>
                    );
                  })}

                {section.quiz_data && (
                  <Link
                    href={`/learner/courses/${courseSlug}/learn/section/${section.id}/quiz`}
                    className={cn(
                      "group flex items-start gap-3 p-2 rounded-md transition-all duration-200 mt-1 border-t border-border/40",
                      params.quizSectionId === section.id
                        ? "bg-primary/10 text-primary font-medium"
                        : "hover:bg-muted text-muted-foreground hover:text-foreground",
                    )}
                  >
                    <div className="mt-0.5 shrink-0">
                      <HelpCircle className="h-5 w-5 text-primary" />
                    </div>

                    <div className="flex flex-col flex-1 gap-0.5 min-w-0">
                      <span className="text-sm leading-snug font-medium line-clamp-1">
                        Section Quiz
                      </span>
                      <span className="text-[11px] opacity-70">
                        {section.quiz_data.questions?.length || 0} Questions
                      </span>
                    </div>
                  </Link>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
    </Accordion>
  );
}
