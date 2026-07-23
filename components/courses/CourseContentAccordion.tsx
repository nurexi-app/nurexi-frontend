import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import {
  BadgeCheck,
  Lock,
  PlayCircle,
  FileText,
  BookOpen,
  Clock,
  Eye,
} from "lucide-react";
import { Badge } from "../ui/badge";
import { cn } from "@/lib/utils";

// ─── types ────────────────────────────────────────────────────────────────────

interface Lesson {
  id: string;
  title: string;
  content_type: "video" | "pdf" | "text";
  duration_seconds: number | null;
  is_preview: boolean;
  position: number;
}

interface Section {
  id: string;
  title: string;
  position: number;
  course_lessons: Lesson[];
}

interface CourseContentAccordionProps {
  sections: Section[];
  whatYouWillLearn?: string[];
  isEnrolled?: boolean;
}

// ─── helpers ──────────────────────────────────────────────────────────────────

function formatDuration(seconds: number | null): string {
  if (!seconds) return "";
  if (seconds < 60) return `${seconds}s`;
  const mins = Math.floor(seconds / 60);
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  const remaining = mins % 60;
  return remaining > 0 ? `${hrs}h ${remaining}m` : `${hrs}h`;
}

function totalSectionDuration(lessons: Lesson[]): number {
  return lessons.reduce((acc, l) => acc + (l.duration_seconds ?? 0), 0);
}

function ContentTypeIcon({ type }: { type: Lesson["content_type"] }) {
  if (type === "video")
    return (
      <PlayCircle className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
    );
  if (type === "pdf")
    return <FileText className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />;
  return <BookOpen className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />;
}

// ─── lesson row ───────────────────────────────────────────────────────────────

function LessonRow({
  lesson,
  isEnrolled,
}: {
  lesson: Lesson;
  isEnrolled: boolean;
}) {
  const accessible = isEnrolled || lesson.is_preview;

  return (
    <li
      className={cn(
        "flex items-center gap-2.5 py-2 px-1 rounded-lg text-sm transition-colors",
        accessible ? "text-foreground" : "text-muted-foreground",
      )}
    >
      <ContentTypeIcon type={lesson.content_type} />

      <span className="flex-1 leading-snug">{lesson.title}</span>

      <div className="flex items-center gap-2 shrink-0">
        {lesson.is_preview && !isEnrolled && (
          <Badge
            variant="outline"
            className="text-[10px] px-1.5 py-0 h-4 border-primary/40 text-primary gap-1"
          >
            <Eye className="h-2.5 w-2.5" />
            Preview
          </Badge>
        )}

        {lesson.duration_seconds ? (
          <span className="text-[11px] text-muted-foreground flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {formatDuration(lesson.duration_seconds)}
          </span>
        ) : null}

        {!accessible && (
          <Lock className="h-3.5 w-3.5 text-muted-foreground/50" />
        )}
      </div>
    </li>
  );
}

// ─── main component ───────────────────────────────────────────────────────────

export default function CourseContentAccordion({
  sections,
  whatYouWillLearn,
  isEnrolled = false,
}: CourseContentAccordionProps) {
  const totalLessons = sections.reduce(
    (acc, s) => acc + s.course_lessons.length,
    0,
  );
  const totalDuration = sections.reduce(
    (acc, s) => acc + totalSectionDuration(s.course_lessons),
    0,
  );

  // open all sections by default so the curriculum is visible
  const defaultOpen = sections.map((s) => s.id);

  return (
    <div className="space-y-6">
      {/* ── what you'll learn ── */}
      {whatYouWillLearn && whatYouWillLearn.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-3">What you'll learn</h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
            {whatYouWillLearn.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <BadgeCheck className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* ── course content accordion ── */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">Course content</h2>
          <span className="text-[12px] text-muted-foreground">
            {sections.length} section{sections.length !== 1 ? "s" : ""} ·{" "}
            {totalLessons} lesson{totalLessons !== 1 ? "s" : ""}
            {totalDuration > 0 && ` · ${formatDuration(totalDuration)}`}
          </span>
        </div>

        {sections.length === 0 ? (
          <div className="flex items-center justify-center py-10 text-sm text-muted-foreground border rounded-xl border-dashed">
            No content added yet
          </div>
        ) : (
          <Accordion
            type="multiple"
            defaultValue={defaultOpen}
            className="w-full border rounded-xl overflow-hidden divide-y divide-border"
          >
            {sections
              .slice()
              .sort((a, b) => a.position - b.position)
              .map((section) => {
                const lessons = section.course_lessons
                  .slice()
                  .sort((a, b) => a.position - b.position);
                const sectionDuration = totalSectionDuration(lessons);
                const previewCount = lessons.filter((l) => l.is_preview).length;

                return (
                  <AccordionItem
                    key={section.id}
                    value={section.id}
                    className="border-none"
                  >
                    <AccordionTrigger className="px-4 py-3 hover:bg-muted/30 hover:no-underline data-[state=open]:bg-muted/20">
                      <div className="flex items-center justify-between w-full pr-2 gap-3">
                        <span className="font-semibold text-[14px] text-left leading-snug">
                          {section.title}
                        </span>
                        <div className="flex items-center gap-2 shrink-0 text-[11px] text-muted-foreground">
                          <span>
                            {lessons.length} lesson
                            {lessons.length !== 1 ? "s" : ""}
                          </span>
                          {sectionDuration > 0 && (
                            <>
                              <span>·</span>
                              <span>{formatDuration(sectionDuration)}</span>
                            </>
                          )}
                          {!isEnrolled && previewCount > 0 && (
                            <>
                              <span>·</span>
                              <span className="text-primary">
                                {previewCount} free
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </AccordionTrigger>

                    <AccordionContent className="px-4 pb-3 pt-1">
                      {lessons.length === 0 ? (
                        <p className="text-[12px] text-muted-foreground py-2">
                          No lessons in this section yet
                        </p>
                      ) : (
                        <ul className="space-y-0.5">
                          {lessons.map((lesson) => (
                            <LessonRow
                              key={lesson.id}
                              lesson={lesson}
                              isEnrolled={isEnrolled}
                            />
                          ))}
                        </ul>
                      )}
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
          </Accordion>
        )}
      </div>
    </div>
  );
}
