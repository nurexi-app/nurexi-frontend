"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";
import { Check, Zap } from "lucide-react";
import { useCoursePrice } from "@/hooks/useCoursePrice";
import { DiscountTimer } from "@/components/ui/discountTimer";

interface EnrollCardProps {
  course: any;
}

export default function EnrollCard({ course }: EnrollCardProps) {
  const priceResult = useCoursePrice(course.price, {
    has_discount: course.has_discount || false,
    discount_type: course.discount_type || null,
    discount_value: course.discount_value || null,
    discount_expiry: course.discount_expiry || null,
  });

  const {
    effectivePrice,
    originalPrice,
    discountLabel,
    hasActiveDiscount,
    isExpired,
    daysRemaining,
  } = priceResult;

  return (
    <Card className="md:sticky border top-20">
      {/* Cover Image */}
      <div className="relative aspect-video rounded-t-lg overflow-hidden bg-muted">
        {course.cover_image ? (
          <Image
            src={course.cover_image}
            alt={course.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 400px"
            priority
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-primary/10 to-primary/5">
            <span className="text-muted-foreground text-sm">
              No cover image
            </span>
          </div>
        )}

        {/* Discount Badge */}
        {hasActiveDiscount && discountLabel && (
          <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5">
            <Zap className="h-3 w-3" />
            {discountLabel}
          </div>
        )}
      </div>

      <CardContent className="p-4 space-y-4">
        {/* Features List */}
        <ul className="text-sm space-y-2">
          <li className="flex items-center gap-2">
            <Check className="text-green-500 h-4 w-4 shrink-0" />
            <span className="text-muted-foreground">Full lifetime access</span>
          </li>
          <li className="flex items-center gap-2">
            <Check className="text-green-500 h-4 w-4 shrink-0" />
            <span className="text-muted-foreground">Quizzes & assessments</span>
          </li>
          <li className="flex items-center gap-2">
            <Check className="text-green-500 h-4 w-4 shrink-0" />
            <span className="text-muted-foreground">
              Mobile & desktop access
            </span>
          </li>
        </ul>

        {/* Pricing */}
        <div className="space-y-1">
          <div className="flex items-end gap-2 flex-wrap">
            <span className="text-2xl font-bold">
              {course.is_free ? "Free" : formatPrice(effectivePrice)}
            </span>
            {hasActiveDiscount && originalPrice > effectivePrice && (
              <span className="text-sm line-through text-muted-foreground">
                {formatPrice(originalPrice)}
              </span>
            )}
          </div>

          {/* Discount Timer */}
          {hasActiveDiscount && course.discount_expiry && !isExpired && (
            <div className="flex items-center gap-2">
              <DiscountTimer expiryDate={course.discount_expiry} />
              {daysRemaining && daysRemaining > 0 && (
                <span className="text-xs text-muted-foreground">
                  ({daysRemaining} day{daysRemaining > 1 ? "s" : ""} left)
                </span>
              )}
            </div>
          )}

          {isExpired && (
            <span className="text-xs text-red-500">Discount expired</span>
          )}

          {course.is_free && (
            <span className="text-xs text-green-600">Free course</span>
          )}
        </div>

        {/* Enroll Button */}
        <Button size="lg" className="w-full" asChild>
          <Link href={`/courses/${course.slug}/enroll`}>
            {course.is_free ? "Enroll Now (Free)" : "Enroll Now"}
          </Link>
        </Button>

        {/* Guarantee */}
        <p className="text-xs text-center text-muted-foreground">
          30-day money-back guarantee
        </p>
      </CardContent>
    </Card>
  );
}
