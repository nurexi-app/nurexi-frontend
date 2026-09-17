import Image from "next/image";
import { BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

interface ResourceCoverImageProps {
  src: string | null;
  alt: string;
  sizes: string;
  className?: string;
  priority?: boolean;
}

export function ResourceCoverImage({
  src,
  alt,
  sizes,
  className,
  priority = false,
}: ResourceCoverImageProps) {
  return (
    <div className={cn("relative overflow-hidden bg-secondary", className)}>
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          unoptimized
          className="object-cover transition-transform duration-300 motion-safe:group-hover:scale-[1.03] motion-reduce:transition-none"
        />
      ) : (
        <BookOpen
          aria-hidden="true"
          className="absolute bottom-7 left-7 size-12 text-accent/70"
          strokeWidth={1.25}
        />
      )}
    </div>
  );
}
