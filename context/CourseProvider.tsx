"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  ReactNode,
} from "react";
import { toast } from "sonner";
import {
  addNewSection,
  deleteSection,
  getAllCourseSections,
  addLesson,
  deleteLesson,
  getSectionLessons,
  updateLesson,
} from "@/lib/actions/course-action";
import { Lesson, Section } from "@/lib/types/course";

interface CourseContextType {
  sections: Section[];
  isLoading: boolean;
  errorState: string;
  courseId: string;
  handleAddSection: () => Promise<void>;
  handleDeleteSection: (sectionId: string) => Promise<void>;
  updateSectionTitle: (id: string, newTitle: string) => void;
  handleAddLesson: (sectionId: string) => Promise<void>;
  handleUpdateLesson: (
    sectionId: string,
    lessonId: string,
    updates: Partial<Lesson>,
  ) => Promise<void>;
  handleDeleteLesson: (sectionId: string, lessonId: string) => Promise<void>;
  userId: string;
}

const CourseContext = createContext<CourseContextType | undefined>(undefined);

export const CourseProvider = ({
  children,
  courseId,
  userId,
}: {
  children: ReactNode;
  courseId: string;
  userId: string;
}) => {
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

    if (courseId) {
      fetchCourseData();
    }
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
    <CourseContext.Provider
      value={{
        sections,
        isLoading,
        errorState,
        courseId,
        handleAddSection,
        handleDeleteSection,
        updateSectionTitle,
        handleAddLesson,
        handleUpdateLesson,
        handleDeleteLesson,
        userId,
      }}
    >
      {children}
    </CourseContext.Provider>
  );
};

export const useCourse = () => {
  const context = useContext(CourseContext);
  if (!context) {
    throw new Error("useCourse must be used within a CourseProvider");
  }
  return context;
};
