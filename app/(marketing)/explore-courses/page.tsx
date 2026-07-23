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
import { createClient } from "@/lib/supabase/server";

export default async function PublicCoursesPage() {
  const supabase = await createClient();
  const { data: courses, error } = await supabase
    .from("courses")
    .select(
      `id,title,price,discount_value,description,expected_duration,cover_image,discount_expiry,has_discount, discount_type, slug, is_free,difficulty_level, target_audience, author:educator_id(full_name,avatar_url)`,
    )
    .eq("is_published", true)
    .eq("is_approved", true);

  if (error) console.log(error);
  console.log(courses);
  return (
    <div className="p-4 container mt-18 my-6 ">
      {!courses ? (
        <div className="flex flex-col items-center py-20 text-center gap-3">
          <Inbox className="text-muted-foreground" size={36} />
          <p className="text-muted-foreground">
            No courses available yet. Check back soon!
          </p>
        </div>
      ) : (
        <>
          <SearchHeader />
          <div className="grid grid-cols-2 md:grid-cols-3  xl:grid-cols-4 gap-4">
            {courses?.map((course: any) => (
              <PublicCourseCard key={course.id} {...course} />
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
