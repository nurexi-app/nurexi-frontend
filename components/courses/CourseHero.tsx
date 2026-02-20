import { CheckCircle, Star } from "lucide-react";
import { PublicCourseInterface } from "@/lib/types/course";
import { Badge } from "../ui/badge";

export default function CourseHero({
  course,
}: {
  course: PublicCourseInterface;
}) {
  return (
    <div className="space-y-3">
      <h1 className="text-2xl md:text-3xl font-bold">{course.title}</h1>

      <p className="text-muted-foreground max-w-3xl">{course.description}</p>

      <div className="flex flex-wrap items-center gap-3 text-sm">
        <span className="flex items-center gap-1 font-medium">
          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          {course.rating} ({course.ratingCount})
        </span>

        <span className="flex items-center gap-1">
          {course.author.name}
          {course.author.verified && (
            <CheckCircle className="h-4 w-4 text-primary" />
          )}
        </span>

        <Badge variant="secondary">{course.level}</Badge>

        {course.isBestSeller && (
          <Badge className="bg-orange-500 text-white">Bestseller</Badge>
        )}
      </div>
    </div>
  );
}
