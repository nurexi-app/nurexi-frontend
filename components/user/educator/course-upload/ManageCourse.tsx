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
import Image from "next/image";

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

const ManageCourse = ({ allCourses }: { allCourses: any[] }) => {
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
        {allCourses.map((course) => (
          <Item key={course.id} variant="outline" className="rounded-xl">
            {/* LEFT ICON */}
            <ItemMedia>
              {course?.cover_image ? (
                <Image
                  src={course.cover_image}
                  alt="cover-image"
                  className="size-15 object-cover"
                  width={100}
                  height={100}
                />
              ) : (
                <FileText className="size-15 text-muted-foreground" />
              )}
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
                  {course?.status === "published" ? "Published" : "Draft"}
                </Badge>
              </div>

              <ItemDescription>
                {course?.pages} pages • Updated {course.updatedAt}
              </ItemDescription>
            </ItemContent>

            {/* RIGHT ACTION */}
            <ItemActions>
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-foreground"
              >
                <Link
                  href={`/educator/courses/${course.id}/edit?section=course-overview`}
                >
                  <Pencil size={16} />
                </Link>
              </Button>
            </ItemActions>
          </Item>
        ))}
      </div>
      {allCourses.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12">
          <p className="bodyText text-muted-foreground">No courses found</p>
        </div>
      )}
    </div>
  );
};

export default ManageCourse;
