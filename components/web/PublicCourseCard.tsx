import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { CheckCircle, Clock5, Star } from "lucide-react";
import { MdOutlineGroups3 } from "react-icons/md";
import Image from "next/image";
import { cn, formatPrice } from "@/lib/utils";
import Link from "next/link";

interface PublicCourseCardProps {
  title: string;
  courseId: string;
  instructor: string;
  rating: number;
  reviews: number;
  price: string;
  discountPrice: number;
  thumbnail: string;
  verified: boolean;
  duration: string;
  studentsEnrolled: number;
}

export function PublicCourseCard({
  title,
  courseId,
  studentsEnrolled,
  verified,
  instructor,
  rating,
  reviews,
  price,
  thumbnail,
  discountPrice,
  duration,
}: PublicCourseCardProps) {
  return (
    <Card className="hover:shadow-md transition group">
      {/* Thumbnail placeholder */}
      <CardHeader className="h-29 md:h-46 w-full rounded-lg overflow-hidden relative ">
        <Image
          src={thumbnail}
          alt={title}
          fill
          className="object-center object-cover group-hover:scale-105 transition duration-500"
        />
      </CardHeader>
      <CardContent className="px-4 space-y-2">
        <h3 className="font-medium leading-snug line-clamp-2">{title}</h3>

        <div className="flex items-center gap-1">
          <p className="text-sm text-muted-foreground">{instructor}</p>
          {verified && <CheckCircle size={14} className="text-primary" />}
        </div>

        <div className="flex text-muted-foreground items-center gap-1">
          <Clock5 size={12} />
          <p className="text-xs">{duration}</p>
        </div>
        <div className="flex text-muted-foreground items-center gap-1">
          <MdOutlineGroups3 size={12} />
          <p className="text-xs">{studentsEnrolled}</p>
        </div>
        {/* Rating */}
        <div className="flex items-center gap-1 text-sm">
          <Star className="text-yellow-500" size={16} />
          <span className="text-muted-foreground text-xs">{rating}</span>
          <span className="text-muted-foreground">({reviews})</span>
        </div>

        {/* Footer */}
        <div className="flex items-center gap-1 ">
          {discountPrice > 0 ? (
            <>
              <span className="font-semibold">
                {formatPrice(discountPrice)}
              </span>
              <span className="font-regular text-muted-foreground line-through text-xs">
                {price}
              </span>
            </>
          ) : (
            <span className="font-semibold">{price}</span>
          )}
          {/* <span className="font-semibold">{price}</span>
          <span className="font-semibold">{discountPrice}</span> */}
          <Link
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              `ml-auto `,
            )}
            href={`/explore-courses/${courseId}`}
          >
            View course
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
