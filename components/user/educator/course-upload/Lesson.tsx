"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FaTrash } from "react-icons/fa6";
import { Textarea } from "@/components/ui/textarea";

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
const ActualLesson = ({
  lesson,
  sectionId,
  handleUpdateLesson,
  handleDeleteLesson,
}: {
  lesson: Lesson;
  sectionId: string;
  handleUpdateLesson: (
    sectionId: string,
    lessonId: string,
    updates: Partial<Lesson>,
  ) => void;
  handleDeleteLesson: (sectionId: string, lessonId: string) => void;
}) => {
  return (
    <div className="bg-muted/30 p-4 rounded-md space-y-3 relative group">
      {/* Delete Button */}
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleDeleteLesson(sectionId, lesson.id)}
          className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
        >
          <FaTrash className="w-4 h-4" />
        </Button>
      </div>

      {/* Lesson Title */}
      <div className="space-y-2">
        <Label>Lesson Title</Label>
        <Input
          value={lesson.title}
          onChange={(e) =>
            handleUpdateLesson(sectionId, lesson.id, {
              title: e.target.value,
            })
          }
          placeholder="e.g. Introduction to Anatomy"
        />
      </div>

      {/* Content Type Selector */}
      <div className="space-y-2">
        <Label>Content Type</Label>
        <select
          value={lesson.content_type}
          onChange={(e) =>
            handleUpdateLesson(sectionId, lesson.id, {
              content_type: e.target.value,
            })
          }
          className="w-full p-2 border rounded-md bg-background"
        >
          <option value="video">Video</option>
          <option value="text">Text</option>
          <option value="pdf">PDF Document</option>
          <option value="image">Image</option>
        </select>
      </div>

      {/* Dynamic Fields Based on Content Type */}
      {lesson.content_type === "video" && (
        <div className="space-y-2">
          <Label>Video URL</Label>
          <Input
            value={lesson.video_url || ""}
            onChange={(e) =>
              handleUpdateLesson(sectionId, lesson.id, {
                video_url: e.target.value,
              })
            }
            placeholder="https://youtube.com/... or https://vimeo.com/..."
          />
        </div>
      )}

      {lesson.content_type === "text" && (
        <div className="space-y-2">
          <Label>Text Content</Label>
          <Textarea
            value={lesson.text_content || ""}
            onChange={(e) =>
              handleUpdateLesson(sectionId, lesson.id, {
                text_content: e.target.value,
              })
            }
            placeholder="Write your lesson content here..."
            rows={5}
          />
        </div>
      )}

      {lesson.content_type === "pdf" && (
        <div className="space-y-2">
          <Label>PDF URL</Label>
          <Input
            value={lesson.pdf_url || ""}
            onChange={(e) =>
              handleUpdateLesson(sectionId, lesson.id, {
                pdf_url: e.target.value,
              })
            }
            placeholder="https://example.com/document.pdf"
          />
        </div>
      )}

      {lesson.content_type === "image" && (
        <div className="space-y-2">
          <Label>Image URL</Label>
          <Input
            value={lesson.image_url || ""}
            onChange={(e) =>
              handleUpdateLesson(sectionId, lesson.id, {
                image_url: e.target.value,
              })
            }
            placeholder="https://example.com/image.jpg"
          />
        </div>
      )}

      {/* Free Preview Toggle */}
      <div className="flex items-center gap-2 pt-2">
        <input
          type="checkbox"
          id={`preview-${lesson.id}`}
          checked={lesson.is_preview}
          onChange={(e) =>
            handleUpdateLesson(sectionId, lesson.id, {
              is_preview: e.target.checked,
            })
          }
          className="h-4 w-4 rounded border-gray-300"
        />
        <Label
          htmlFor={`preview-${lesson.id}`}
          className="text-sm font-normal cursor-pointer"
        >
          Free preview (users can watch before purchasing)
        </Label>
      </div>
    </div>
  );
};

export default ActualLesson;
