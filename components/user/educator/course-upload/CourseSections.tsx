"use client";
import { Button } from "@/components/ui/button";
import {
  addNewSection,
  deleteSection,
  getAllCourseSections,
  addLesson,
  deleteLesson,
  getSectionLessons,
  updateLesson,
} from "@/lib/actions/course-action";
import { useEffect, useRef, useState } from "react";
import { FaFloppyDisk, FaPlus } from "react-icons/fa6";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import { toast } from "sonner";
import ActualSection from "./Section";

interface Lesson {
  id: string;
  title: string;
  content_type: string;
  video_url?: string;
  pdf_url?: string;
  image_url?: string;
  text_content?: string;
  is_preview: boolean;
  position: number;
}

interface Section {
  id: string;
  title: string;
  lessons: Lesson[];
}

export default function CourseSection({ courseId }: { courseId: string }) {
  const [sections, setSections] = useState<Section[]>([]);
  const [errorState, setErrorState] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Fetch sections and lessons on load
  useEffect(() => {
    async function fetchCourseData() {
      setIsLoading(true);
      try {
        const allSections = await getAllCourseSections(courseId);
        if (allSections) {
          const sectionsWithLessons = await Promise.all(
            allSections.map(async (section: any) => {
              const lessons = await getSectionLessons(section.id);
              return { ...section, lessons: lessons || [] };
            }),
          );
          setSections(sectionsWithLessons);
        }
      } catch (error) {
        toast.error("Failed to load course data");
      } finally {
        setIsLoading(false);
      }
    }

    fetchCourseData();
  }, [courseId]);

  // Add new section
  async function handleAddSection() {
    setIsLoading(true);
    try {
      const newSection = await addNewSection(courseId);
      if (newSection) {
        setSections((prev) => [...prev, { ...newSection, lessons: [] }]);
        toast.success("Section added");
      }
    } catch (error: unknown) {
      const msg =
        error instanceof Error ? error.message : "Error adding section";
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  }

  // Delete section with undo
  const deleteTimerRef = useRef<NodeJS.Timeout | null>(null);
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);

  async function handleDeleteSection(sectionId: string) {
    if (deleteTimerRef.current) clearTimeout(deleteTimerRef.current);
    if (countdownIntervalRef.current)
      clearInterval(countdownIntervalRef.current);

    let timeLeft = 5;

    const toastId = toast.loading(`Deleting section in ${timeLeft}s...`, {
      description: "This action will be permanent.",
      action: {
        label: "Undo",
        onClick: () => {
          if (deleteTimerRef.current) clearTimeout(deleteTimerRef.current);
          if (countdownIntervalRef.current)
            clearInterval(countdownIntervalRef.current);
          toast.dismiss(toastId);
          toast.success("Deletion cancelled");
        },
      },
    });

    countdownIntervalRef.current = setInterval(() => {
      timeLeft -= 1;
      if (timeLeft > 0) {
        toast.loading(`Deleting section in ${timeLeft}s...`, { id: toastId });
      } else {
        if (countdownIntervalRef.current)
          clearInterval(countdownIntervalRef.current);
      }
    }, 1000);

    deleteTimerRef.current = setTimeout(async () => {
      if (countdownIntervalRef.current)
        clearInterval(countdownIntervalRef.current);
      setIsLoading(true);
      toast.loading("Processing deletion...", { id: toastId });

      try {
        const response = await deleteSection(sectionId);
        if (response.success) {
          setSections((prev) => prev.filter((s) => s.id !== sectionId));
          toast.success("Section deleted successfully", { id: toastId });
        }
      } catch (error: unknown) {
        const msg = error instanceof Error ? error.message : "Error deleting";
        setErrorState(msg);
        toast.error(msg, { id: toastId });
      } finally {
        setIsLoading(false);
        deleteTimerRef.current = null;
      }
    }, 5000);
  }

  // Update section title
  const updateSectionTitle = (id: string, newTitle: string) => {
    setSections((prev) =>
      prev.map((s) => (s.id === id ? { ...s, title: newTitle } : s)),
    );
  };

  // Add lesson to section
  async function handleAddLesson(sectionId: string) {
    try {
      const newLesson = await addLesson(sectionId, courseId);
      if (newLesson) {
        setSections((prev) =>
          prev.map((section) =>
            section.id === sectionId
              ? { ...section, lessons: [...section.lessons, newLesson] }
              : section,
          ),
        );
        toast.success("Lesson added");
      }
    } catch (error) {
      toast.error("Failed to add lesson");
    }
  }

  // Update lesson
  async function handleUpdateLesson(
    sectionId: string,
    lessonId: string,
    updates: Partial<Lesson>,
  ) {
    try {
      const updatedLesson = await updateLesson(lessonId, updates);
      if (updatedLesson) {
        setSections((prev) =>
          prev.map((section) =>
            section.id === sectionId
              ? {
                  ...section,
                  lessons: section.lessons.map((lesson) =>
                    lesson.id === lessonId
                      ? { ...lesson, ...updatedLesson }
                      : lesson,
                  ),
                }
              : section,
          ),
        );
      }
    } catch (error) {
      toast.error("Failed to update lesson");
    }
  }

  // Delete lesson
  async function handleDeleteLesson(sectionId: string, lessonId: string) {
    try {
      await deleteLesson(lessonId);
      setSections((prev) =>
        prev.map((section) =>
          section.id === sectionId
            ? {
                ...section,
                lessons: section.lessons.filter((l) => l.id !== lessonId),
              }
            : section,
        ),
      );
      toast.success("Lesson deleted");
    } catch (error) {
      toast.error("Failed to delete lesson");
    }
  }

  return (
    <section className="p-4 space-y-8">
      {/* Header */}
      <div className="flex items-center sticky top-16 z-10 bg-background/90 backdrop-blur-md p-4 justify-between">
        <div className="space-y-1 max-sm:basis-1/2">
          <h3>Course Section</h3>
          <p className="bodyText">
            Organize your course content into sections and lessons.
          </p>
        </div>

        <Button
          onClick={handleAddSection}
          className="bg-secondary hover:bg-secondary/90"
          disabled={isLoading}
        >
          <FaPlus /> Add section
        </Button>
      </div>

      {/* Sections List */}
      <ActualSection
        sections={sections}
        updateSectionTitle={updateSectionTitle}
        handleDeleteSection={handleDeleteSection}
        handleDeleteLesson={handleDeleteLesson}
        handleUpdateLesson={handleUpdateLesson}
        handleAddLesson={handleAddLesson}
      />

      {/* Empty State */}
      {sections.length === 0 && !isLoading && (
        <div className="text-center py-16 text-muted-foreground border-2 border-dashed rounded-lg">
          No sections yet. Click "Add section" to get started.
        </div>
      )}

      {/* Loading State */}
      {isLoading && sections.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          Loading course content...
        </div>
      )}

      {/* Footer Navigation */}
      <div className="flex items-center justify-between mt-8 lg:mt-16 pt-6 border-t">
        <Button variant="outline">
          <MdKeyboardArrowLeft /> Previous
        </Button>

        <div className="flex gap-4 items-center">
          <Button variant="outline">
            <FaFloppyDisk /> Save as Draft
          </Button>
          <Button>
            Next <MdKeyboardArrowRight />
          </Button>
        </div>
      </div>
    </section>
  );
}
