import { Star } from "lucide-react";
import { BadgeCheck } from "../animate-ui/icons/badge-check";

export default function CourseHero({ course }: { course: any }) {
  const isVerified =
    course.author.verification.length > 0 &&
    course.author.verification[0].status === "approved";
  return (
    <div className="space-y-3">
      <h1 className="text-2xl md:text-3xl font-bold">{course.title}</h1>

      <p className="text-base font-normal max-w-3xl">{course.description}</p>

      <div className="flex flex-wrap items-center gap-3 text-sm">
        <span className="flex items-center gap-1 font-medium">
          <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
          {course.rating} ({course.rating_count})
        </span>

        <span className="flex items-center gap-1">
          {course.author.full_name}
          {course.author.verified && (
            <BadgeCheck animateOnView size={16} className="text-green-800" />
          )}
        </span>

        {/* <Badge variant="secondary">{course.difficulty_level}</Badge> */}

        {/* {course.isBestSeller && (
          <Badge className="bg-orange-500 text-white">Bestseller</Badge>
        )} */}
      </div>
    </div>
  );
}
