import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { CartItem } from "./types/cart";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatPrice = (value: number) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(value);

export const formatTime = (totalSeconds: number) => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return [hours, minutes, seconds]
    .map((unit) => String(unit).padStart(2, "0"))
    .join(":");
};

export function calculateNewStreak(
  currentStreak: number,
  lastActivityDate: string | null,
  today: Date = new Date(),
): number {
  if (!lastActivityDate) {
    return 1;
  }

  const lastDate = new Date(lastActivityDate);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  // Check if last exam was yesterday
  if (lastDate.toDateString() === yesterday.toDateString()) {
    return currentStreak + 1;
  }

  if (lastDate.toDateString() === today.toDateString()) {
    return currentStreak;
  }

  return 1;
}

export function handleSearchParamsChange(
  searchParams: URLSearchParams,
  key: string,
  value: string,
) {
  const params = new URLSearchParams(searchParams);
  params.set(key, value);
  return params.toString();
}

// Save cart to localStorage
export const saveCartToLocalStorage = (items: CartItem[]) => {
  if (typeof window === "undefined") return;
  localStorage.setItem("cart", JSON.stringify(items));
};

// Load cart from localStorage
export const loadCartFromLocalStorage = (): CartItem[] => {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem("cart");
  return stored ? JSON.parse(stored) : [];
};

// Generate slug from title
export const generateSlug = (title: string) => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
};

export function getInitials(name?: string) {
  if (!name) return "?";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function debounce<T extends (...args: any[]) => void>(
  func: T,
  delay: number,
): ((...args: Parameters<T>) => void) & { cancel: () => void } {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  const debounced = (...args: Parameters<T>): void => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };

  debounced.cancel = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  };

  return debounced;
}

export const getUUID = (): string => {
  if (typeof window === "undefined") {
    // Server-side environment fallback
    const crypto = require("crypto");
    return crypto.randomUUID();
  }
  // Client-side environment
  return window.crypto.randomUUID();
};

export interface ExtractedHeading {
  id: string;
  text: string;
  level: number;
}

// turn heading text into a url-safe id, same slugify logic as your db
function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// recursively extract plain text from a Tiptap node's content array
function extractText(node: any): string {
  if (!node) return "";
  if (node.type === "text") return node.text ?? "";
  if (!node.content) return "";
  return node.content.map(extractText).join("");
}

/**
 * Extracts all headings from Tiptap JSON content.
 * Deduplicates ids by appending -2, -3 etc if the same heading text repeats.
 */
export function extractHeadings(content: any): ExtractedHeading[] {
  if (!content?.content) return [];

  const headings: ExtractedHeading[] = [];
  const seenIds = new Map<string, number>();

  for (const node of content.content) {
    if (node.type !== "heading") continue;

    const text = extractText(node).trim();
    if (!text) continue;

    let id = slugifyHeading(text);

    // handle duplicate heading text
    if (seenIds.has(id)) {
      const count = seenIds.get(id)! + 1;
      seenIds.set(id, count);
      id = `${id}-${count}`;
    } else {
      seenIds.set(id, 1);
    }

    headings.push({
      id,
      text,
      level: node.attrs?.level ?? 2,
    });
  }

  return headings;
}

export function calcDiscountedPrice(
  price: number,
  type: "percentage" | "fixed",
  value: number,
): number {
  if (type === "percentage") return price - (price * value) / 100;
  return price - value;
}

interface PublishValidationResult {
  ready: boolean;
  message?: string;
  details?: {
    missingTitle?: boolean;
    missingDescription?: boolean;
    missingPrice?: boolean;
    missingSections?: boolean;
    emptySections?: string[];
    emptyLessons?: string[];
    invalidLessons?: string[];
  };
}

export function isReadyToPublish(course: any): PublishValidationResult {
  const details: PublishValidationResult["details"] = {};

  // 1. Check title
  if (!course.title || course.title.toLowerCase() === "untitled course") {
    return {
      ready: false,
      message: "Please give your course a proper title.",
      details: { missingTitle: true },
    };
  }

  // 2. Check description
  if (!course.description) {
    return {
      ready: false,
      message: "Please add a course description.",
      details: { missingDescription: true },
    };
  }

  // 3. Check price
  if (!course.is_free && !course.price) {
    return {
      ready: false,
      message: "Please set a price for your course (or mark it as free).",
      details: { missingPrice: true },
    };
  }

  // 4. Check sections
  const sections = course.sections || [];
  if (sections.length === 0) {
    return {
      ready: false,
      message: "Please add at least one section to your course.",
      details: { missingSections: true },
    };
  }

  // 5. Check each section and lesson
  const emptySections: string[] = [];
  const emptyLessons: string[] = [];
  const invalidLessons: string[] = [];

  for (const section of sections) {
    if (!section.title || section.title.toLowerCase() === "untitled section") {
      emptySections.push(section.id);
      continue;
    }

    const lessons = section.lessons || [];
    if (lessons.length === 0) {
      emptySections.push(section.id);
      continue;
    }

    for (const lesson of lessons) {
      if (!lesson.title || lesson.title.toLowerCase() === "untitled lesson") {
        emptyLessons.push(lesson.id);
        continue;
      }

      // Check content based on type
      if (lesson.content_type === "video" && !lesson.video_url) {
        invalidLessons.push(lesson.title);
      } else if (lesson.content_type === "text" && !lesson.text_content) {
        invalidLessons.push(lesson.title);
      } else if (lesson.content_type === "pdf" && !lesson.asset.filename) {
        invalidLessons.push(lesson.title);
      } else if (lesson.content_type === "image" && !lesson.image_url) {
        invalidLessons.push(lesson.title);
      } else if (
        lesson.content_type === "quiz" &&
        !lesson.quiz_data?.questions?.length
      ) {
        invalidLessons.push(lesson.title);
      }
    }
  }

  // 6. Return detailed messages
  if (emptySections.length > 0) {
    return {
      ready: false,
      message: `Please complete the following sections: ${emptySections.length} section(s) have no title or lessons.`,
      details: { emptySections },
    };
  }

  if (emptyLessons.length > 0) {
    return {
      ready: false,
      message: `Please complete the following lessons: ${emptyLessons.length} lesson(s) have no title.`,
      details: { emptyLessons },
    };
  }

  if (invalidLessons.length > 0) {
    return {
      ready: false,
      message: `Please add content to these lessons: ${invalidLessons.join(", ")}.`,
      details: { invalidLessons },
    };
  }

  return {
    ready: true,
    message: "Your course is ready to publish! 🎉",
  };
}

interface BuildStreamUrlOptions {
  cloudName?: string;
  publicId?: string;
  streamUrl?: string | null; // Direct URL option (e.g. asset.playback_url or asset.secure_url)
  format?: "m3u8" | "mp4" | "webm" | "auto";
  quality?: "auto" | "720p" | "1080p";
}

export function getCloudinaryStreamUrl({
  cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  publicId,
  streamUrl,
  format = "m3u8",
  quality,
}: BuildStreamUrlOptions): string {
  // 1. If explicit streamUrl (playback_url / secure_url) is provided, use it
  if (streamUrl) {
    return streamUrl;
  }

  // 2. Return empty string if missing required identifiers
  if (!publicId || !cloudName) {
    return "";
  }

  // 3. Clean public_id in case a full path/leading slash was stored
  const cleanPublicId = publicId
    .replace(/^https?:\/\/res\.cloudinary\.com\/[^/]+\/video\/upload\//, "")
    .replace(/^\//, "");

  // 4. Construct transformation string (e.g., q_auto,f_m3u8 or f_m3u8)
  const transformations = [quality ? `q_${quality}` : null, `f_${format}`]
    .filter(Boolean)
    .join(",");

  return `https://res.cloudinary.com/${cloudName}/video/upload/${transformations}/${cleanPublicId}.${format}`;
}
