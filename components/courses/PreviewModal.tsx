"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/animate-ui/components/radix/dialog";
import { Badge } from "@/components/ui/badge";
import { getCloudinaryStreamUrl } from "@/lib/utils";
import { CldVideoPlayer } from "next-cloudinary";
import "next-cloudinary/dist/cld-video-player.css";

interface LessonAsset {
  public_id?: string;
  playback_url?: string;
  secure_url?: string;
  file_url?: string;
}

export interface Lesson {
  id: string;
  title: string;
  content_type: "video" | "pdf" | "text";
  duration_seconds: number | null;
  is_preview: boolean;
  position: number;
  asset?: LessonAsset | null;
  content?: string | null;
}

interface PreviewModalProps {
  lesson: Lesson | null;
  isOpen: boolean;
  onClose: () => void;
}

export function PreviewModal({ lesson, isOpen, onClose }: PreviewModalProps) {
  if (!lesson) return null;

  // Construct stream URL if it's a video
  const videoSrc =
    lesson.content_type === "video"
      ? getCloudinaryStreamUrl({
          streamUrl: lesson.asset?.playback_url ?? lesson.asset?.secure_url,
          publicId: lesson.asset?.public_id,
        })
      : "";
  console.log("video url", videoSrc);
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl overflow-hidden p-0 gap-0">
        <DialogHeader className="p-4 border-b">
          <div className="flex items-center gap-2">
            <Badge
              variant="secondary"
              className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
            >
              Free Preview
            </Badge>
            <DialogTitle className="text-base font-semibold leading-tight">
              {lesson.title}
            </DialogTitle>
          </div>
        </DialogHeader>

        <div className="bg-black/95 flex items-center justify-center min-h-[300px] max-h-[60vh] overflow-y-auto">
          {lesson.content_type === "video" && videoSrc ? (
            <CldVideoPlayer
              className="w-full h-full"
              width={520}
              height={500}
              src={lesson.asset?.public_id!}
            />
          ) : lesson.content_type === "pdf" && lesson.asset?.file_url ? (
            <iframe
              src={lesson.asset.file_url}
              className="w-full h-125 border-none"
              title={lesson.title}
            />
          ) : (
            <div className="p-6 text-white w-full text-sm leading-relaxed whitespace-pre-wrap">
              {lesson.content || "No preview content available."}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
