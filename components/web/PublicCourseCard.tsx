"use client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { CheckCircle, Clock5, Star, Zap } from "lucide-react";
import { MdOutlineGroups3 } from "react-icons/md";
import Image from "next/image";
import { cn, formatPrice } from "@/lib/utils";
import Link from "next/link";
import { PublicCourseInterface } from "@/lib/types/course";
import { useCoursePrice } from "@/hooks/useCoursePrice";

export function PublicCourseCard({
  title,
  slug,
  studentsEnrolled = 100,
  author,
  rating = 4.5,
  rating_count = 40,
  price,
  cover_image,
  discount_value,
  discount_expiry,
  is_free,
  discount_type,
  has_discount,
  expected_duration,
}: any) {
  const priceResult = useCoursePrice(price, {
    has_discount: has_discount || false,
    discount_type: discount_type || null,
    discount_value: discount_value || null,
    discount_expiry: discount_expiry || null,
  });

  const { effectivePrice, originalPrice, discountLabel, hasActiveDiscount } =
    priceResult;

  const displayPrice = is_free ? "Free" : formatPrice(effectivePrice);
  const originalDisplayPrice =
    !is_free && hasActiveDiscount ? formatPrice(originalPrice) : null;

  return (
    <Card className="hover:shadow-md transition-all duration-300 ease-in-out group h-full flex flex-col">
      {/* Cover Image */}
      <CardHeader className="md:h-53 h-36 w-full rounded-lg overflow-hidden relative p-0 m-0">
        <Image
          src={cover_image || "/placeholder-course.jpg"}
          alt={title}
          fill
          className="object-cover object-center group-hover:scale-105 transition-all ease-in-out duration-300"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />

        {/* Discount Badge */}
        {!is_free && hasActiveDiscount && discountLabel && (
          <div className="absolute top-2 right-2 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1 shadow-lg">
            <Zap className="h-3 w-3" />
            {discountLabel}
          </div>
        )}

        {is_free && (
          <div className="absolute top-2 right-2 bg-green-500 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-lg">
            Free
          </div>
        )}
      </CardHeader>

      <CardContent className="px-4 py-3 space-y-2 flex-1 flex flex-col">
        {/* Title */}
        <h3 className="font-medium md:text-lg text-base leading-snug line-clamp-2">
          {title}
        </h3>

        {/* Author */}
        <div className="flex items-center gap-1">
          <p className="text-sm text-black font-normal">
            {author?.full_name || "Unknown"}
          </p>
          {author?.verified && (
            <CheckCircle size={14} className="text-primary" />
          )}
        </div>

        {/* Metadata */}
        <div className="space-y-1.5">
          <div className="flex text-muted-foreground items-center gap-1">
            <Clock5 size={12} />
            <p className="text-xs">{expected_duration || "Self-paced"}</p>
          </div>
          <div className="flex text-muted-foreground items-center gap-1">
            <MdOutlineGroups3 size={12} />
            <p className="text-xs">
              {studentsEnrolled.toLocaleString()} students
            </p>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-1 text-sm">
            <Star className="text-yellow-500 fill-yellow-500" size={16} />
            <span className="text-muted-foreground leading-[130%] text-xs">
              {rating}
            </span>
            <span className="text-muted-foreground text-xs">
              ({rating_count})
            </span>
          </div>
        </div>

        {/* Price & Action */}
        <div className="flex items-center gap-2 mt-auto pt-2 border-t">
          <div className="flex-1">
            {!is_free && hasActiveDiscount ? (
              <div>
                <span className="font-bold text-base">{displayPrice}</span>
                <span className="ml-2 text-xs line-through text-muted-foreground">
                  {originalDisplayPrice}
                </span>
              </div>
            ) : (
              <span className="font-bold text-base">{displayPrice}</span>
            )}
          </div>

          <Link
            className={cn(
              buttonVariants({ variant: "default", size: "sm" }),
              "ml-auto shrink-0",
            )}
            href={`/explore-courses/${slug}`}
          >
            View course
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
