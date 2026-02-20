import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PublicCourseInterface } from "@/lib/types/course";

export default function EnrollCard({
  course,
}: {
  course: PublicCourseInterface;
}) {
  return (
    <Card className=" md:sticky top-20 p-4 space-y-4">
      <img
        src={course.thumbnail}
        alt={course.title}
        className="rounded-md aspect-video object-cover"
      />

      <div>
        <p className="text-xl font-bold">
          ₦{course.discountPrice.toLocaleString()}
          <span className="ml-2 text-sm line-through text-muted-foreground">
            ₦{course.price.toLocaleString()}
          </span>
        </p>
      </div>

      <Button size="lg" className="w-full">
        Enroll now
      </Button>

      <ul className="text-sm text-muted-foreground space-y-1">
        <li>✔ Full lifetime access</li>
        <li>✔ Quizzes & assessments</li>
        <li>✔ Mobile & desktop access</li>
      </ul>
    </Card>
  );
}
