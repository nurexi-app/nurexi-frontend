"use client";

import { Button } from "@/components/ui/button";
import { FaFloppyDisk, FaPlus } from "react-icons/fa6";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
// import ActualSection from "./Section";
import { useCourse } from "@/context/CourseProvider";
import ActualSection from "./Section";

export default function CourseSection() {
  const { sections, isLoading, handleAddSection } = useCourse();

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
          <FaPlus /> {isLoading ? "Adding..." : "Add section"}
        </Button>
      </div>

      {/* Sections List */}
      <section className="space-y-6">
        {sections.map((section) => (
          <ActualSection section={section} key={section.id} />
        ))}
      </section>

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
