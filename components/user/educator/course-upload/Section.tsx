"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  ChevronDown,
  ChevronRight,
  Plus,
  Trash2,
  GripVertical,
  BookOpen,
  MoreVertical,
} from "lucide-react";
import { useCourse } from "@/context/CourseProvider";
import { Section } from "@/lib/types/course";
import { cn, debounce } from "@/lib/utils";
import ActualLesson from "./Lesson";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const ActualSection = ({ section }: { section: Section }) => {
  const {
    handleDeleteSection,
    handleUpdateSection,
    updateSectionTitle,
    handleAddLesson,
    isLoading,
    openSection,
    courseData,
    handleOpenSection,
  } = useCourse();

  const openedSection = openSection.find((s) => s.sectionId === section.id);

  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [localTitle, setLocalTitle] = useState(
    section.title || "Untitled section",
  );

  const lessonCount = section.lessons?.length ?? 0;

  const handleTitleBlur = () => {
    setIsEditingTitle(false);
    if (localTitle.trim() !== section.title) {
      updateSectionTitle(section.id, localTitle.trim() || "Untitled section");
    }
  };

  useEffect(() => {
    setLocalTitle(section.title);
  }, [section.title]);

  const debouncedUpdate = useCallback(
    debounce((newTitle: string) => {
      handleUpdateSection(section.id, { title: newTitle });
    }, 1000),
    [section.id],
  );

  useEffect(() => () => debouncedUpdate.cancel(), [debouncedUpdate]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalTitle(e.target.value);
    debouncedUpdate(e.target.value);
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === "Escape") {
      (e.target as HTMLInputElement).blur();
    }
  };

  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-card shadow-sm overflow-hidden transition-shadow",
        openedSection?.isOpen && "shadow-md",
      )}
    >
      {/* ── section header ── */}
      <div className="flex items-center gap-2 px-4 py-3 bg-muted/20 border-b border-border/60">
        {/* drag handle */}
        <GripVertical className="h-4 w-4 text-muted-foreground/30 cursor-grab shrink-0" />

        {/* collapse toggle */}
        <button
          onClick={() => handleOpenSection(section.id)}
          className="h-6 w-6 flex items-center justify-center rounded-md hover:bg-muted transition-colors shrink-0"
          aria-label={
            openedSection?.isOpen ? "Collapse section" : "Expand section"
          }
        >
          {openedSection?.isOpen ? (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          )}
        </button>

        {/* title — click to edit inline */}
        <div className="flex-1 min-w-0">
          {isEditingTitle ? (
            <Input
              autoFocus
              value={localTitle}
              onChange={handleTitleChange}
              onBlur={handleTitleBlur}
              onKeyDown={handleTitleKeyDown}
              className="h-7 min-w-12 text-sm font-medium px-2 py-0 border-primary"
            />
          ) : (
            <button
              onClick={() => setIsEditingTitle(true)}
              className="text-sm font-semibold text-foreground hover:text-primary transition-colors truncate block w-full text-left"
              title="Click to rename"
            >
              {localTitle}
            </button>
          )}
        </div>

        {/* lesson count badge */}
        <Badge
          variant="ghost"
          className="gap-1 text-[10px] font-medium shrink-0"
        >
          <BookOpen className="h-3 w-3 hidden md:block" />
          {lessonCount} {lessonCount === 1 ? "lesson" : "lessons"}
        </Badge>

        {/* add lesson */}
        <Button
          variant="outline"
          size="sm"
          className="gap-1  items-center text-[12px] h-7 px-2 shrink-0 hidden md:flex"
          onClick={() => {
            handleAddLesson(section.id);
            if (!openedSection?.isOpen) handleOpenSection(section.id);
          }}
          disabled={isLoading}
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Add lesson</span>
        </Button>

        {/* delete section */}

        {courseData.status === "draft" && (
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 hidden md:block p-0 text-muted-foreground hover:text-destructive shrink-0"
            onClick={() => handleDeleteSection(section.id)}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger className="md:hidden" asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
            >
              <MoreVertical className="h-3.5 w-3.5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Button
                variant="outline"
                size="sm"
                className="gap-1 text-[12px] h-7 px-2 shrink-0 md:hidden"
                onClick={() => {
                  handleAddLesson(section.id);
                  if (!openedSection?.isOpen) handleOpenSection(section.id);
                }}
                disabled={isLoading}
              >
                <Plus className="h-3.5 w-3.5" />
                Add lesson
              </Button>

              {/* delete section */}
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Button
                variant="destructive"
                size="sm"
                className="h-7 text-white md:hidden p-0 hover:text-destructive shrink-0"
                onClick={() => handleDeleteSection(section.id)}
              >
                Delete <Trash2 className="h-3.5 text-white w-3.5" />
              </Button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* ── collapsible lessons area ── */}
      <div
        className={cn(
          "overflow-hidden transition-all duration-300 ease-in-out",
          openedSection?.isOpen
            ? "max-h-[9999px] opacity-100"
            : "max-h-0 opacity-0",
        )}
      >
        <div className="p-4 space-y-3">
          {section.lessons && section.lessons.length > 0 ? (
            section.lessons.map((lesson) => {
              const previewCount = section.lessons.filter(
                (l) => l.is_preview && l.content_type === "video",
              ).length;

              return (
                <ActualLesson
                  key={lesson.id}
                  lesson={lesson}
                  sectionId={section.id}
                  previewCount={previewCount}
                />
              );
            })
          ) : (
            <button
              onClick={() => handleAddLesson(section.id)}
              className="w-full py-8 rounded-xl border-2 border-dashed border-border text-muted-foreground text-sm hover:border-primary/50 hover:text-primary hover:bg-primary/5 transition-all duration-150 flex flex-col items-center gap-2"
            >
              <Plus className="h-5 w-5" />
              Add your first lesson
            </button>
          )}
        </div>
      </div>
      {openedSection?.isOpen && (
        <div className="p-4 ml-2">
          <Button
            variant="outline"
            size="sm"
            className="gap-1  items-center text-[12px] h-7 px-2 shrink-0 hidden md:flex"
            onClick={() => {
              handleAddLesson(section.id);
              if (!openedSection?.isOpen) handleOpenSection(section.id);
            }}
            disabled={isLoading}
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add lesson</span>
          </Button>
        </div>
      )}

      {/* collapsed summary — show lesson titles when closed */}
      {!openedSection?.isOpen && lessonCount > 0 && (
        <div className="px-4 py-2 flex items-center gap-1.5 flex-wrap">
          {section.lessons.slice(0, 4).map((lesson, i) => (
            <span
              key={lesson.id}
              className="text-[11px] text-muted-foreground bg-muted px-2 py-0.5 rounded-full truncate max-w-35"
            >
              {i + 1}. {lesson.title || "Untitled"}
            </span>
          ))}
          {lessonCount > 4 && (
            <span className="text-[11px] text-muted-foreground">
              +{lessonCount - 4} more
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default ActualSection;
