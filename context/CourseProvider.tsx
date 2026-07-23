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
  getSectionLessons,
  updateSection,
  reorderSections,
  reorderLessons,
  updateLesson,
} from "@/lib/actions/course-action";
import { Course, Lesson, Section } from "@/lib/types/course";
import { QuestionType, Quiz } from "@/lib/types/questions";
import { getUUID } from "@/lib/utils";

interface CourseContextType {
  courseData: any;
  sections: Section[];
  openSection: {
    sectionId: string;
    isOpen: boolean;
  }[];
  handleOpenSection: (sectionId: string) => void;

  isLoading: boolean;
  errorState: string;
  courseId: string;
  userId: string;

  setSections: React.Dispatch<React.SetStateAction<Section[]>>;
  handleAddSection: () => Promise<void>;
  handleDeleteSection: (sectionId: string) => Promise<void>;
  updateSectionTitle: (id: string, newTitle: string) => void;
  handleUpdateSection: (id: string, update: Partial<Section>) => Promise<void>;

  handleAddLesson: (sectionId: string) => Promise<void>;
  handleUpdateLesson: (
    sectionId: string,
    lessonId: string,
    updates: Partial<Lesson>,
  ) => Promise<void>;
  handleUpdateLessonLocally: (
    sectionId: string,
    lessonId: string,
    updates: Partial<Lesson>,
  ) => void;
  handleDeleteLesson: (sectionId: string, lessonId: string) => void;

  addQuiz: (sectionId: string) => void;
  handleRemoveQuiz: (sectionId: string, id: string) => void;
  updateQuiz: (sectionId: string, id: string, updates: Partial<Quiz>) => void;
  quizSection: { sectionId: string; quizArray: Quiz[] }[];

  handleReorderSections: (newSection: Section[]) => void;
  handleReorderLessons: (sectionId: string, newLessons: Lesson[]) => void;
}

const CourseContext = createContext<CourseContextType | undefined>(undefined);

export const CourseProvider = ({
  children,
  courseData,
  userId,
}: {
  children: ReactNode;
  courseData: Course;
  userId: string;
}) => {
  const courseId = courseData.id || "";

  const [sections, setSections] = useState<Section[]>([]);
  const [openSection, setOpenSection] = useState<
    {
      sectionId: string;
      isOpen: boolean;
    }[]
  >([]);

  function handleOpenSection(sectionId: string) {
    setOpenSection((prev) =>
      prev.map((section) =>
        section.sectionId === sectionId
          ? {
              ...section,
              isOpen: !section.isOpen,
            }
          : section,
      ),
    );
  }
  const [errorState, setErrorState] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [quizSection, setQuizSection] = useState([
    {
      sectionId: "",
      quizArray: [
        {
          id: "1",
          question: "",
          questionType: "mcq" as QuestionType,
          options: ["", "", "", ""],
          answer: "",
        },
      ],
    },
  ]);

  //
  // ===================QUIZ===========
  //
  const addQuiz = (sectionId: string) => {
    console.log("adding quiz to section", sectionId);
    setQuizSection((prev) =>
      prev.map((section) =>
        section.sectionId === sectionId
          ? {
              ...section,
              quizArray: [
                ...section.quizArray,
                {
                  id: getUUID(),
                  question: "",
                  questionType: "mcq",
                  options: ["", "", "", ""],
                  answer: "",
                },
              ],
            }
          : section,
      ),
    );
  };

  const handleRemoveQuiz = (sectionId: string, id: string) => {
    const confirm = window.confirm(
      "Are you sure you want to remove this quiz?",
    );
    if (!confirm) return;
    setQuizSection((prev) =>
      prev.map((section) =>
        section.sectionId === sectionId
          ? {
              ...section,
              quizArray: section.quizArray.filter((quiz) => quiz.id !== id),
            }
          : section,
      ),
    );
  };

  const updateQuiz = (
    sectionId: string,
    id: string,
    updates: Partial<Quiz>,
  ) => {
    setQuizSection((prev) =>
      prev.map((section) =>
        section.sectionId === sectionId
          ? {
              ...section,
              quizArray: section.quizArray.map((quiz) =>
                quiz.id === id ? { ...quiz, ...updates } : quiz,
              ),
            }
          : section,
      ),
    );
  };

  // Fetch sections and lessons on load
  useEffect(() => {
    async function fetchCourseData() {
      setIsLoading(true);
      try {
        const allSections = await getAllCourseSections(courseId);

        if (allSections) {
          const quizSection = allSections.map((section: Section) => {
            return {
              sectionId: section.id,
              quizArray: section.quiz_data || [],
            };
          });
          setQuizSection(quizSection);
          const sectionsForIsOpened = allSections.map((section: Section) => {
            return {
              sectionId: section.id,
              isOpen: false,
            };
          });
          setOpenSection(sectionsForIsOpened);
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
        setQuizSection((prev) => [
          ...prev,
          { sectionId: newSection.id, quizArray: [] },
        ]);
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
          setQuizSection((prev) =>
            prev.filter((s) => s.sectionId !== sectionId),
          );
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

  const handleUpdateSection = async (id: string, updates: Partial<Section>) => {
    try {
      setIsLoading(true);
      const response = await updateSection(id, updates);
      if (response.success) {
        setSections((prev) =>
          prev.map((s) => (s.id === id ? { ...s, ...updates } : s)),
        );
      }
    } catch (error) {
      toast.error("Failed to update section");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReorderSections = async (newSection: Section[]) => {
    try {
      setSections(newSection);

      await reorderSections(
        courseId,
        newSection.map((s) => s.id),
      );
    } catch (error: any) {
      toast.error(error.message || "failed to reorder");
    }
  };

  // =================== LESSONS=================== //
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
      const updatedLesson = await updateLesson(lessonId, courseId, updates);
      if (updatedLesson) {
        console.log("success for lessons update");
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

  function handleUpdateLessonLocally(
    sectionId: string,
    lessonId: string,
    updates: Partial<Lesson>,
  ) {
    setSections((prev) =>
      prev.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              lessons: section.lessons.map((lesson) =>
                lesson.id === lessonId ? { ...lesson, ...updates } : lesson,
              ),
            }
          : section,
      ),
    );
  }

  // Delete lesson
  function handleDeleteLesson(sectionId: string, lessonId: string) {
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
  }
  const handleReorderLessons = async (
    sectionId: string,
    newLessons: Lesson[],
  ) => {
    //  Keep a backup of the current state for rollback
    const previousSections = [...sections];

    try {
      setSections((prevSections) =>
        prevSections.map((s) => {
          if (s.id === sectionId) {
            return {
              ...s,
              lessons: newLessons,
            };
          }
          return s;
        }),
      );

      await reorderLessons(
        sectionId,
        newLessons.map((lesson) => lesson.id),
      );

      toast.success("Lessons reordered successfully");
    } catch (error: any) {
      setSections(previousSections);
      toast.error(error.message || "Failed to reorder lessons");
    }
  };

  return (
    <CourseContext.Provider
      value={{
        courseData,

        sections,
        setSections,
        openSection,
        handleOpenSection,

        isLoading,
        errorState,
        courseId,
        userId,

        handleAddSection,
        handleDeleteSection,
        handleUpdateSection,
        updateSectionTitle,
        handleReorderSections,

        handleAddLesson,
        handleUpdateLesson,
        handleUpdateLessonLocally,
        handleDeleteLesson,
        handleReorderLessons,

        addQuiz,
        handleRemoveQuiz,
        updateQuiz,
        quizSection,
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
