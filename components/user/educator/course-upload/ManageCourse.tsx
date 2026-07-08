"use client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pencil, FileText, BookOpen, Clock, MoreVertical } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { cn } from "@/lib/utils";

type FilterType = "all" | "published" | "draft";

const ManageCourse = ({ allCourses }: { allCourses: any[] }) => {
  const [filter, setFilter] = useState<FilterType>("all");

  const filtered = allCourses.filter((c) => {
    if (filter === "all") return true;
    return c.status === filter;
  });

  return (
    <div className="mt-4 px-2 py-7 space-y-6">
      {/* ── header ── */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="font-semibold text-foreground">My Courses</h3>
          <p className="text-[12px] text-muted-foreground mt-0.5">
            {allCourses.length} course{allCourses.length !== 1 ? "s" : ""} total
          </p>
        </div>

        {/* filter pills — more accessible than a dropdown for 3 options */}
        <div className="flex items-center gap-1.5 bg-muted rounded-xl p-1">
          {(["all", "published", "draft"] as FilterType[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "px-3 py-1 rounded-lg text-[12px] font-semibold capitalize transition-all",
                filter === f
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* ── course list ── */}
      {filtered.length > 0 ? (
        <div className="flex flex-col gap-3">
          {filtered.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <div className="h-14 w-14 rounded-2xl bg-muted flex items-center justify-center">
            <BookOpen className="h-6 w-6 text-muted-foreground/50" />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-foreground">
              {filter === "all" ? "No courses yet" : `No ${filter} courses`}
            </p>
            <p className="text-[12px] text-muted-foreground mt-1">
              {filter === "all"
                ? "Create your first course to get started."
                : `You have no ${filter} courses right now.`}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── course card ──────────────────────────────────────────────────────────────

function CourseCard({ course }: { course: any }) {
  const isPublished = course.status === "published";

  return (
    <div className="flex items-start gap-3 p-3 rounded-xl border border-border bg-card hover:bg-muted/30 transition-colors group">
      {/* thumbnail */}
      <div className="h-16 w-24 shrink-0 rounded-lg overflow-hidden bg-muted flex items-center justify-center">
        {course?.cover_image ? (
          <Image
            src={course.cover_image}
            alt={course.title}
            width={96}
            height={64}
            className="w-full h-full object-cover"
          />
        ) : (
          <FileText className="h-6 w-6 text-muted-foreground/40" />
        )}
      </div>

      {/* content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-[14px] font-semibold text-foreground leading-snug line-clamp-1">
              {course.title}
            </p>

            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <Badge
                variant={isPublished ? "default" : "secondary"}
                className={cn(
                  "text-[10px] font-semibold rounded-full px-2",
                  isPublished && "bg-green-600/90 hover:bg-green-600",
                )}
              >
                {isPublished ? "Published" : "Draft"}
              </Badge>

              {course.difficulty_level && (
                <span className="text-[11px] text-muted-foreground">
                  {course.difficulty_level}
                </span>
              )}
            </div>

            {/* meta row */}
            <div className="flex items-center gap-3 mt-1.5 text-[11px] text-muted-foreground">
              {course?.sections_count != null && (
                <span className="flex items-center gap-1">
                  <BookOpen className="h-3 w-3" />
                  {course.sections_count} section
                  {course.sections_count !== 1 ? "s" : ""}
                </span>
              )}
              {course?.updatedAt && (
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {course.updatedAt}
                </span>
              )}
            </div>
          </div>

          {/* actions */}
          <div className="flex items-center gap-1 shrink-0">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
              asChild
            >
              <Link
                href={`/educator/courses/${course.id}/edit?section=course-overview`}
              >
                <Pencil className="h-3.5 w-3.5" />
              </Link>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
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
                  <Link
                    href={`/educator/courses/${course.id}/edit?section=course-overview`}
                  >
                    Edit overview
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    href={`/educator/courses/${course.id}/edit?section=course-content`}
                  >
                    Edit content
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    href={`/educator/courses/${course.id}/edit?section=course-pricing`}
                  >
                    Edit pricing
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ManageCourse;
