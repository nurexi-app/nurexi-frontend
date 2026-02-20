import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { FaFloppyDisk, FaPlus, FaTrash } from "react-icons/fa6";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";

/**
 * Data structures for Course Content
 */
interface Chapter {
  id: string;
  title: string;
  content: string; // Text description/content
  file?: File | null; // Placeholder for file upload logic
  videoUrl?: string;
}

interface Section {
  id: string;
  title: string;
  chapters: Chapter[];
}

export default function CourseSection() {
  const [sections, setSections] = useState<Section[]>([
    {
      id: crypto.randomUUID(),
      title: "Section 1",
      chapters: [],
    },
  ]);

  const addSection = () => {
    setSections((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        title: `Section ${prev.length + 1}`,
        chapters: [],
      },
    ]);
  };

  const addChapter = (sectionId: string) => {
    setSections((prev) =>
      prev.map((section) => {
        if (section.id === sectionId) {
          return {
            ...section,
            chapters: [
              ...section.chapters,
              {
                id: crypto.randomUUID(),
                title: `Chapter ${section.chapters.length + 1}`,
                content: "",
              },
            ],
          };
        }
        return section;
      }),
    );
  };

  const updateSectionTitle = (id: string, newTitle: string) => {
    setSections((prev) =>
      prev.map((s) => (s.id === id ? { ...s, title: newTitle } : s)),
    );
  };

  const updateChapter = (
    sectionId: string,
    chapterId: string,
    field: keyof Chapter,
    value: any,
  ) => {
    setSections((prev) =>
      prev.map((section) => {
        if (section.id === sectionId) {
          return {
            ...section,
            chapters: section.chapters.map((chapter) =>
              chapter.id === chapterId
                ? { ...chapter, [field]: value }
                : chapter,
            ),
          };
        }
        return section;
      }),
    );
  };

  const deleteSection = (id: string) => {
    setSections((prev) => prev.filter((s) => s.id !== id));
  };

  const deleteChapter = (sectionId: string, chapterId: string) => {
    setSections((prev) =>
      prev.map((s) => {
        if (s.id === sectionId) {
          return {
            ...s,
            chapters: s.chapters.filter((c) => c.id !== chapterId),
          };
        }
        return s;
      }),
    );
  };

  return (
    <section className="p-4 space-y-8">
      {/* Header */}
      <div className="flex items-center sticky top-16 z-10 bg-background/90 backdrop-blur-md p-4 justify-between">
        <div className="space-y-1 max-sm:basis-1/2">
          <h3>Course Section</h3>
          <p className="bodyText">
            Organize your course content into sections and chapters.
          </p>
        </div>

        <Button
          onClick={addSection}
          className="bg-secondary hover:bg-secondary/90"
        >
          <FaPlus /> Add section
        </Button>
      </div>

      {/* Sections List */}
      <div className="space-y-6">
        {sections.map((section, index) => (
          <div
            key={section.id}
            className="border rounded-lg p-6 space-y-4 bg-card"
          >
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
                    placeholder="e.g. Introduction to Next.js"
                    className="font-medium text-lg"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteSection(section.id)}
                    className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                  >
                    <FaTrash />
                  </Button>
                </div>
              </div>
            </div>

            {/* Chapters */}
            <div className="pl-4 border-l-2 border-border space-y-6">
              <div className="space-y-4">
                {section.chapters.map((chapter, cIndex) => (
                  <div
                    key={chapter.id}
                    className="bg-muted/30 p-4 rounded-md space-y-4 relative group"
                  >
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteChapter(section.id, chapter.id)}
                        className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                      >
                        <FaTrash className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="space-y-2">
                      <Label>Chapter Title</Label>
                      <Input
                        value={chapter.title}
                        onChange={(e) =>
                          updateChapter(
                            section.id,
                            chapter.id,
                            "title",
                            e.target.value,
                          )
                        }
                        placeholder={`Chapter ${cIndex + 1}`}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Content / Description</Label>
                        <Textarea
                          value={chapter.content}
                          onChange={(e) =>
                            updateChapter(
                              section.id,
                              chapter.id,
                              "content",
                              e.target.value,
                            )
                          }
                          placeholder="What is this chapter about?"
                          className="min-h-[100px]"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Video URL / File (Placeholder)</Label>
                        <div className="border border-dashed border-input rounded-md h-[100px] flex items-center justify-center text-muted-foreground text-sm bg-background">
                          File Upload / Video URL Input Area
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => addChapter(section.id)}
                className="w-full border-dashed"
              >
                <FaPlus className="mr-2 h-3 w-3" /> Add Chapter
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Footer Navigation */}
      <div className="flex items-center justify-between mt-8 lg:mt-16 pt-6 border-t">
        <Button variant={"outline"}>
          <MdKeyboardArrowLeft /> Previous{" "}
        </Button>

        <div className="flex gap-4 items-center">
          <Button variant={"outline"}>
            <FaFloppyDisk /> Save as Draft{" "}
          </Button>
          <Button>
            Next <MdKeyboardArrowRight />
          </Button>
        </div>
      </div>
    </section>
  );
}
