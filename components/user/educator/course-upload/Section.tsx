"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { FaPlus, FaTrash } from "react-icons/fa6";
import ActualLesson from "./Lesson";

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
const ActualSection = ({
  sections,
  updateSectionTitle,
  handleDeleteSection,
  handleDeleteLesson,
  handleUpdateLesson,
  handleAddLesson,
}: {
  sections: Section[];
  updateSectionTitle: (id: string, title: string) => void;
  handleDeleteSection: (id: string) => void;
  handleDeleteLesson: (sectionId: string, lessonId: string) => void;
  handleUpdateLesson: (
    sectionId: string,
    lessonId: string,
    updates: Partial<Lesson>,
  ) => void;
  handleAddLesson: (sectionId: string) => void;
}) => {
  return (
    <section className="space-y-6">
      {sections.map((section) => (
        <div
          key={section.id}
          className="border rounded-lg p-6 space-y-4 bg-card"
        >
          {/* Section Header */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1 space-y-2">
              <Label htmlFor={`section-${section.id}`}>Section Title</Label>
              <div className="flex gap-2">
                <Input
                  id={`section-${section.id}`}
                  value={section.title}
                  onChange={(e) =>
                    updateSectionTitle(section.id, e.target.value)
                  }
                  placeholder="e.g. Introduction to Biostatistics"
                  className="font-medium text-lg"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDeleteSection(section.id)}
                  className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                >
                  <FaTrash />
                </Button>
              </div>
            </div>
          </div>

          {/* Lessons Container */}
          <div className="pl-4 border-l-2 border-border space-y-4">
            {/* Lessons List */}
            <div className="space-y-3">
              {section.lessons.map((lesson) => (
                <ActualLesson
                  key={lesson.id}
                  lesson={lesson}
                  sectionId={section.id}
                  handleUpdateLesson={handleUpdateLesson}
                  handleDeleteLesson={handleDeleteLesson}
                />
              ))}
            </div>

            {/* Add Lesson Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleAddLesson(section.id)}
              className="w-full border-dashed"
            >
              <FaPlus className="mr-2 h-3 w-3" /> Add Lesson
            </Button>
          </div>
        </div>
      ))}
    </section>
  );
};

export default ActualSection;
