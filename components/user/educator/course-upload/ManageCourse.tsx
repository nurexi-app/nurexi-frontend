import { Button } from "@/components/ui/button";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { Badge } from "@/components/ui/badge";
import { Pencil, FileText } from "lucide-react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

/* ------------------ dummy data ------------------ */
const courses = [
  {
    id: "1",
    title: "NMCN Mock Exam – Fundamentals",
    pages: 12,
    status: "published",
    updatedAt: "2 days ago",
  },
  {
    id: "2",
    title: "Clinical Pharmacology Crash Course",
    pages: 6,
    status: "draft",
    updatedAt: "Yesterday",
  },
  {
    id: "3",
    title: "Medical–Surgical Nursing Review",
    pages: 18,
    status: "published",
    updatedAt: "5 days ago",
  },
];

const ManageCourse = () => {
  return (
    <div className="mt-4 px-2 py-7 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="bodyText font-semibold">Course Information</p>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="lg">
              Filter by
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>All</DropdownMenuItem>
            <DropdownMenuItem>Published</DropdownMenuItem>
            <DropdownMenuItem>Draft</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Course List */}
      <div className="flex flex-col gap-2">
        {courses.map((course) => (
          <Item key={course.id} variant="outline" className="rounded-xl">
            {/* LEFT ICON */}
            <ItemMedia>
              <FileText className="size-15 text-muted-foreground" />
            </ItemMedia>

            {/* MAIN CONTENT */}
            <ItemContent>
              <div className="flex items-center gap-2">
                <ItemTitle className="leading-tight">{course.title}</ItemTitle>

                <Badge
                  variant={
                    course.status === "published" ? "default" : "secondary"
                  }
                  className={
                    course.status === "published"
                      ? "bg-green-600/90 hover:bg-green-600"
                      : ""
                  }
                >
                  {course.status === "published" ? "Published" : "Draft"}
                </Badge>
              </div>

              <ItemDescription>
                {course.pages} pages • Updated {course.updatedAt}
              </ItemDescription>
            </ItemContent>

            {/* RIGHT ACTION */}
            <ItemActions>
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-foreground"
                onClick={() => {
                  const params = new URLSearchParams(window.location.search);
                  params.set("type", "edit");
                  params.set("courseId", course.id);
                  // Reset to first section when entering edit mode
                  params.set("section", "course-overview");
                  window.history.pushState(null, "", `?${params.toString()}`);
                  // Force re-render or use router if parent doesn't detect pushState (Next.js Link/Router is better)
                  // But since this is a client component inside a page that uses searchParams,
                  // the clean way is to use the Next.js router.
                }}
              >
                <Link
                  href={`?type=edit&courseId=${course.id}&section=course-overview`}
                >
                  <Pencil size={16} />
                </Link>
              </Button>
            </ItemActions>
          </Item>
        ))}
      </div>
    </div>
  );
};

export default ManageCourse;
