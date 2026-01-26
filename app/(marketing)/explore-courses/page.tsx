import { PublicCourseCard } from "@/components/web/PublicCourseCard";
import { publicCourses } from "@/lib/exports/courses";
import { Inbox } from "lucide-react";
import SearchHeader from "./Header";
import { PublicCourseInterface } from "@/lib/types/course";
import { formatPrice } from "@/lib/utils";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export default function PublicCoursesPage() {
  return (
    <div className="p-4 container mt-18 my-6 ">
      {publicCourses.length === 0 ? (
        <div className="flex flex-col items-center py-20 text-center gap-3">
          <Inbox className="text-muted-foreground" size={36} />
          <p className="text-muted-foreground">
            No courses available yet. Check back soon!
          </p>
        </div>
      ) : (
        <>
          <SearchHeader />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3  xl:grid-cols-4 gap-4">
            {publicCourses.map((course: PublicCourseInterface) => (
              <PublicCourseCard
                key={String(course.id)}
                courseId={course.id}
                title={course.title}
                instructor={course.author.name}
                rating={course.rating}
                reviews={course.ratingCount}
                thumbnail={course.thumbnail}
                price={formatPrice(course.price)}
                discountPrice={course.discountPrice}
                verified={course.author.verified}
                duration={course.duration}
                studentsEnrolled={course.studentsEnrolled}
              />
            ))}
          </div>

          <div className="mt-6 md:mt-10">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious href="#" />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">1</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#" isActive>
                    2
                  </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">3</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext href="#" />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </>
      )}
    </div>
  );
}
