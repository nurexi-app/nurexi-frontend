"use client";

import { useState, useRef, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/animate-ui/components/radix/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { CldUploadWidget } from "next-cloudinary";
import DropzoneField from "../verification/DropzoneField";
import { useSupabaseUpload } from "@/hooks/use-supabase-upload";
import { useCourse } from "@/context/CourseProvider";
import { Lesson, LessonAsset, LessonType } from "@/lib/types/course";
import { Loader2, Video, File, RefreshCw, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";

interface ReplaceAssetDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lesson: Lesson;
  sectionId: string;
  isDraft: boolean;
}

export function ReplaceAssetDialog({
  open,
  onOpenChange,
  lesson,
  sectionId,
  isDraft,
}: ReplaceAssetDialogProps) {
  const { handleUpdateLesson, courseId, userId } = useCourse();
  const supabase = createClient();

  const [selectedType, setSelectedType] = useState<LessonType>(
    (lesson.content_type as LessonType) || "video",
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ── PDF Upload Setup ──
  const pdfUpload = useSupabaseUpload({
    bucketName: "courses",
    path: `${userId}/${courseId}/${lesson.id}`,
    allowedMimeTypes: ["application/pdf"],
    maxFileSize: 5 * 1024 * 1024,
    upsert: true,
    clearExisting: true,
  });

  const prevSuccess = useRef(false);

  useEffect(() => {
    if (!pdfUpload.isSuccess || pdfUpload.successes.length === 0) return;
    if (prevSuccess.current) return;
    prevSuccess.current = true;

    const fileName = pdfUpload.successes[0];
    const newAsset: LessonAsset = {
      provider: "supabase",
      type: "pdf",
      filename: fileName,
    };

    handleAssetReplacement(newAsset);
  }, [pdfUpload.isSuccess, pdfUpload.successes]);

  useEffect(() => {
    if (!pdfUpload.isSuccess) prevSuccess.current = false;
  }, [pdfUpload.isSuccess]);

  // ── Asset Replacement Handler ──
  const handleAssetReplacement = async (newAsset: LessonAsset) => {
    setIsSubmitting(true);
    try {
      const updates: Partial<Lesson> = {
        ...(isDraft ? { asset: newAsset } : { pending_asset: newAsset }),
      };

      await handleUpdateLesson(sectionId, lesson.id, updates);

      toast.success(
        isDraft
          ? "Asset replaced successfully!"
          : "Replacement submitted for admin review.",
      );
      onOpenChange(false);
    } catch (err) {
      toast.error("Failed to replace asset.");
    } finally {
      setIsSubmitting(false);
    }
  };
  if (lesson.pending_asset !== null) {
    return (
      <p className="text-sm font-medium text-yellow-600">
        Asset already pending approval
      </p>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="text-xs">
          Replace Asset
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base">
            <RefreshCw className="h-4 w-4 text-primary" />
            Replace Lesson Media
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            {isDraft
              ? "Upload a new video or PDF to replace the current asset."
              : "Submitting a new file for a published course requires admin approval before students see it."}
          </DialogDescription>
        </DialogHeader>

        {!isDraft && (
          <div className="flex items-start gap-2 p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 rounded-lg text-amber-800 dark:text-amber-200 text-xs">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
            <span>
              The current media will remain visible to students until your
              replacement is reviewed.
            </span>
          </div>
        )}

        <div className="space-y-4 py-2">
          {/* Asset Type Selector */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium">Select Media Type</Label>
            <div className="grid grid-cols-2 gap-2">
              <Button
                type="button"
                variant={selectedType === "video" ? "default" : "outline"}
                size="sm"
                className="gap-2 text-xs"
                onClick={() => setSelectedType("video")}
              >
                <Video className="h-3.5 w-3.5" />
                Video
              </Button>
              <Button
                type="button"
                variant={selectedType === "pdf" ? "default" : "outline"}
                size="sm"
                className="gap-2 text-xs"
                onClick={() => setSelectedType("pdf")}
              >
                <File className="h-3.5 w-3.5" />
                PDF Document
              </Button>
            </div>
          </div>

          {/* Video Upload Section */}
          {selectedType === "video" && (
            <div className="pt-2">
              <CldUploadWidget
                options={{
                  maxFiles: 1,
                  resourceType: "video",
                  folder: `courses/${courseId}/${lesson.id}`,
                  publicId: `courses/${lesson.id}/lesson_video_${Date.now()}`,
                  sources: ["local", "dropbox", "google_drive"],
                  clientAllowedFormats: ["mp4", "webm", "mov"],
                  maxFileSize: 50_000_000,
                  styles: {
                    palette: {
                      window: "#FFFFFF",
                    },
                    zIndex: 100000,
                  },
                }}
                onOpen={() => onOpenChange(false)}
                signatureEndpoint="/api/cloudinary/signature"
                onSuccess={(result: any) => {
                  if (result?.info?.resource_type !== "video") {
                    toast.error("Only videos are allowed");
                    return;
                  }
                  const newAsset: LessonAsset = {
                    provider: "cloudinary",
                    type: "video",
                    public_id: result.info.public_id,
                    asset_id: result.info.asset_id,
                    playback_url: result.info.playback_url,
                    secure_url: result.info.secure_url,
                    thumbnail_url: result.info.thumbnail_url,
                    duration_seconds: Math.ceil(result.info.duration),
                    width: result.info.width,
                    height: result.info.height,
                  };
                  handleAssetReplacement(newAsset);
                }}
                onError={() => toast.error("Failed to upload video")}
              >
                {({ open }) => (
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full gap-2 text-xs py-6"
                    onClick={() => open()}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Video className="h-4 w-4" />
                    )}
                    Upload New Video
                  </Button>
                )}
              </CldUploadWidget>
            </div>
          )}

          {/* PDF Upload Section */}
          {selectedType === "pdf" && (
            <div className="space-y-3 pt-2">
              <DropzoneField
                onDrop={(files) =>
                  pdfUpload.setFiles(
                    files.map((f) =>
                      Object.assign(f, {
                        preview: URL.createObjectURL(f),
                        errors: [],
                      }),
                    ),
                  )
                }
                label="Upload replacement PDF (max 5MB)"
                required
                file={pdfUpload.files[0] as any}
              />
              {pdfUpload.files.length > 0 && (
                <Button
                  type="button"
                  onClick={pdfUpload.onUpload}
                  disabled={pdfUpload.loading || isSubmitting}
                  size="sm"
                  className="w-full gap-2 text-xs"
                >
                  {pdfUpload.loading || isSubmitting ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <File className="h-3.5 w-3.5" />
                      Confirm & Replace PDF
                    </>
                  )}
                </Button>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
