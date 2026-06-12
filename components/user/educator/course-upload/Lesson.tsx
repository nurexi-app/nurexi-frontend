"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { CldUploadWidget } from "next-cloudinary";
import { toast } from "sonner";
import DropzoneField from "../verification/DropzoneField";
import { useSupabaseUpload } from "@/hooks/use-supabase-upload";
import { useCourse } from "@/context/CourseProvider";
import {
  Eye,
  File,
  Trash2,
  Video,
  FileText,
  ChevronDown,
  ChevronUp,
  GripVertical,
  Loader2,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useCallback, useEffect, useRef, useState } from "react";
import { Lesson, LessonType } from "@/lib/types/course";
import { debounce } from "@/lib/utils";
import { cn } from "@/lib/utils";

import ReactPlayer from "react-player";
import { useDeleteWithUndo } from "@/hooks/useDeleteWithUndo";
import { deleteLesson } from "@/lib/actions/course-action";

// ─── content type icon ────────────────────────────────────────────────────────
function ContentTypeIcon({ type }: { type: LessonType }) {
  if (type === "video") return <Video className="h-3.5 w-3.5" />;
  if (type === "pdf") return <File className="h-3.5 w-3.5" />;
  return <FileText className="h-3.5 w-3.5" />;
}

// ─── video asset preview ──────────────────────────────────────────────────────
function VideoPreview({
  asset,
  onRemove,
}: {
  asset: Lesson["asset"];
  onRemove: () => void;
}) {
  if (!asset || asset.type !== "video") return null;

  return (
    <div className="rounded-xl border border-border bg-muted/30 overflow-hidden">
      {asset.thumbnail_url && (
        <>
          <div className="relative aspect-video bg-black">
            <img
              src={asset.thumbnail_url}
              alt="Video thumbnail"
              className="w-full h-full object-cover opacity-80"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-black/50 rounded-full p-3">
                <Video className="h-6 w-6 text-white" />
              </div>
            </div>
            {asset.duration_seconds && (
              <span className="absolute bottom-2 right-2 bg-black/70 text-white text-[11px] font-mono px-1.5 py-0.5 rounded">
                {Math.floor(asset.duration_seconds / 60)}:
                {String(asset.duration_seconds % 60).padStart(2, "0")}
              </span>
            )}
          </div>
          {/* <ReactPlayer
            src={`https://res.cloudinary.com/douvlyzys/video/upload/sp_auto/v1781033153/courses/7775b7c0-b595-4c61-9825-4c2f3e1f1c22/c465ad42-d709-49eb-bd12-b5dea559aba7/courses/c465ad42-d709-49eb-bd12-b5dea559aba7/lesson_video.m3u8`}
            playing={true}
            width="100%"
            height="auto"
            playIcon={<Video className="h-6 w-6 text-white" />}
            controls={true}
          /> */}
        </>
      )}
      <div className="flex items-center justify-between px-3 py-2">
        <span className="text-[12px] text-muted-foreground truncate">
          {asset.public_id?.split("/").pop() ?? "Video uploaded"}
        </span>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={onRemove}
          className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}

// ─── pdf asset preview ────────────────────────────────────────────────────────
function PdfPreview({
  asset,
  signedUrl,
  onRemove,
}: {
  asset: Lesson["asset"];
  signedUrl: string | null;
  onRemove: () => void;
}) {
  if (!asset || asset.type !== "pdf") return null;

  return (
    <div className="rounded-xl border border-border bg-muted/30 p-3 flex items-center justify-between gap-3">
      <div className="flex items-center gap-2 min-w-0">
        <div className="h-8 w-8 shrink-0 rounded-lg bg-red-50 dark:bg-red-950/40 flex items-center justify-center">
          <File className="h-4 w-4 text-red-500" />
        </div>
        <div className="min-w-0">
          <p className="text-[13px] font-medium text-foreground truncate">
            {asset.filename ?? "PDF Document"}
          </p>
          <p className="text-[11px] text-muted-foreground">PDF · Uploaded</p>
        </div>
      </div>
      <div className="flex items-center gap-1 shrink-0">
        {signedUrl && (
          <a href={signedUrl} target="_blank" rel="noopener noreferrer">
            <Button
              type="button"
              size="sm"
              variant="ghost"
              className="h-8 w-8 p-0"
            >
              <Eye className="h-3.5 w-3.5" />
            </Button>
          </a>
        )}
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={onRemove}
          className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}

// ─── main lesson component ────────────────────────────────────────────────────
const ActualLesson = ({
  lesson,
  sectionId,
}: {
  lesson: Lesson;
  sectionId: string;
}) => {
  const { handleUpdateLesson, handleDeleteLesson, courseId, userId } =
    useCourse();

  const supabase = createClient();

  const { executeDelete, isLoading } = useDeleteWithUndo({
    deleteFn: deleteLesson,
    onSuccess: () => {
      handleDeleteLesson(sectionId, lesson.id);
    },
    onError: (message) => {
      toast.error(message);
    },
  });

  // ── signed URL for PDF preview ──────────────────────────────────────────────
  const [pdfSignedUrl, setPdfSignedUrl] = useState<string | null>(null);

  useEffect(() => {
    if (lesson.asset?.type !== "pdf" || !lesson.asset.filename) return;

    const filePath = `${userId}/${courseId}/${lesson.id}/${lesson.asset.filename}`;
    supabase.storage
      .from("courses")
      .createSignedUrl(filePath, 60 * 60) // 1 hour
      .then(({ data, error }) => {
        if (data?.signedUrl) setPdfSignedUrl(data.signedUrl);
        if (error) console.error("[pdf signed url]", error);
      });
  }, [lesson.asset?.filename, lesson.asset?.type]);

  // ── file upload hook ────────────────────────────────────────────────────────
  const lessonFileUpload = useSupabaseUpload({
    bucketName: "courses",
    path: `${userId}/${courseId}/${lesson.id}`,
    allowedMimeTypes: ["application/pdf"],
    maxFileSize: 5 * 1024 * 1024,
    upsert: true,
    clearExisting: true,
  });

  // after successful upload — get signed URL and save asset metadata
  const prevSuccess = useRef(false);
  useEffect(() => {
    if (!lessonFileUpload.isSuccess || lessonFileUpload.successes.length === 0)
      return;
    if (prevSuccess.current) return; // prevent double-fire
    prevSuccess.current = true;

    const fileName = lessonFileUpload.successes[0];
    const filePath = `${userId}/${courseId}/${lesson.id}/${fileName}`;

    supabase.storage
      .from("courses")
      .createSignedUrl(filePath, 60 * 60)
      .then(({ data, error }) => {
        if (error) {
          toast.error("Upload succeeded but failed to generate preview link");
          return;
        }
        if (data?.signedUrl) setPdfSignedUrl(data.signedUrl);

        handleUpdateLesson(sectionId, lesson.id, {
          asset: {
            provider: "supabase",
            type: "pdf",
            filename: fileName,
          },
        });
        toast.success("PDF uploaded successfully");
      });
  }, [lessonFileUpload.isSuccess, lessonFileUpload.successes]);

  // reset prevSuccess if user replaces the file
  useEffect(() => {
    if (!lessonFileUpload.isSuccess) prevSuccess.current = false;
  }, [lessonFileUpload.isSuccess]);

  // ── debounced title update ───────────────────────────────────────────────────
  const [localTitle, setLocalTitle] = useState(lesson.title);

  useEffect(() => {
    setLocalTitle(lesson.title);
  }, [lesson.title]);

  const debouncedUpdate = useCallback(
    debounce((newTitle: string) => {
      handleUpdateLesson(sectionId, lesson.id, { title: newTitle });
    }, 800),
    [sectionId, lesson.id],
  );

  useEffect(() => () => debouncedUpdate.cancel(), [debouncedUpdate]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalTitle(e.target.value);
    debouncedUpdate(e.target.value);
  };

  // ── remove asset ─────────────────────────────────────────────────────────────
  const handleRemoveAsset = () => {
    handleUpdateLesson(sectionId, lesson.id, { asset: null });
    setPdfSignedUrl(null);
    lessonFileUpload.setFiles([]);
    prevSuccess.current = false;
  };

  const hasAsset = !!lesson.asset;

  return (
    <div className="bg-background rounded-xl border border-border shadow-sm overflow-hidden group">
      {/* ── lesson header bar ── */}
      <div className="flex items-center gap-2 px-3 py-2 bg-muted/30 border-b border-border/60">
        <GripVertical className="h-3.5 w-3.5 text-muted-foreground/40 cursor-grab shrink-0" />

        {/* content type badge */}
        <Badge
          variant="secondary"
          className="gap-1 text-[10px] font-medium px-1.5 py-0.5 shrink-0"
        >
          <ContentTypeIcon type={lesson.content_type as LessonType} />
          {lesson.content_type === "pdf"
            ? "PDF"
            : lesson.content_type === "video"
              ? "Video"
              : "Text"}
        </Badge>

        {/* preview badge */}
        {lesson.is_preview && (
          <Badge
            variant="outline"
            className="text-[10px] px-1.5 py-0.5 border-green-300 text-green-700 bg-green-50 dark:bg-green-950/30"
          >
            Free preview
          </Badge>
        )}

        {/* asset status */}
        {hasAsset && (
          <Badge
            variant="outline"
            className="text-[10px] px-1.5 py-0.5 border-blue-300 text-blue-700 bg-blue-50 dark:bg-blue-950/30 ml-auto shrink-0"
          >
            ✓ Asset ready
          </Badge>
        )}

        {/* delete */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => executeDelete(lesson.id)}
          disabled={isLoading}
          className={cn(
            "h-7 w-7 p-0 text-muted-foreground hover:text-destructive ml-auto shrink-0",
            hasAsset && "ml-1",
          )}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>

      {/* ── lesson body ── */}
      <div className="p-4 space-y-4">
        {/* title */}
        <div className="space-y-1.5">
          <Label className="text-[12px]">Lesson title</Label>
          <Input
            value={localTitle}
            onChange={handleTitleChange}
            placeholder="e.g. Introduction to Anatomy"
            className="h-9 text-sm"
          />
        </div>

        {/* content type selector */}
        <div className="space-y-1.5">
          <Label className="text-[12px]">Content type</Label>
          <select
            value={lesson.content_type}
            onChange={(e) =>
              handleUpdateLesson(sectionId, lesson.id, {
                content_type: e.target.value as LessonType,
                asset: null,
              })
            }
            className="w-full h-9 px-3 text-sm border border-input rounded-md bg-background focus:outline-none focus:ring-1 focus:ring-ring"
          >
            <option value="video">Video</option>
            <option value="text">Text / Article</option>
            <option value="pdf">PDF Document</option>
          </select>
        </div>

        {/* ── video upload ── */}
        {lesson.content_type === "video" && (
          <div className="space-y-2">
            {lesson.asset?.type === "video" ? (
              <VideoPreview asset={lesson.asset} onRemove={handleRemoveAsset} />
            ) : (
              <CldUploadWidget
                options={{
                  maxFiles: 1,
                  resourceType: "video",
                  folder: `courses/${courseId}/${lesson.id}`,
                  publicId: `courses/${lesson.id}/lesson_video`,
                  tags: [],
                  context: {},
                  sources: ["local", "dropbox", "google_drive"],
                  clientAllowedFormats: ["mp4", "webm", "mov"],
                  maxFileSize: 50000000,
                }}
                signatureEndpoint="/api/cloudinary/signature"
                onSuccess={(result: any) => {
                  if (result?.info?.resource_type !== "video") {
                    toast.error("Only videos are allowed");
                    return;
                  }
                  console.log(result);
                  handleUpdateLesson(sectionId, lesson.id, {
                    asset: {
                      provider: "cloudinary",
                      type: "video",
                      lessonId: lesson.id,
                      public_id: result.info.public_id,
                      asset_id: result.info.asset_id,
                      thumbnail_url: result.info.thumbnail_url,
                      duration_seconds: Math.ceil(result.info.duration),
                    },
                  });
                  toast.success("Video uploaded");
                }}
                onError={() => toast.error("Failed to upload video")}
              >
                {({ open }) => (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="w-full gap-2"
                    onClick={() => open()}
                  >
                    <Video className="h-4 w-4" />
                    Upload video
                  </Button>
                )}
              </CldUploadWidget>
            )}
          </div>
        )}

        {/* ── text / article ── */}
        {lesson.content_type === "text" && (
          <div className="space-y-1.5">
            <Label className="text-[12px]">Content</Label>
            <Textarea
              value={lesson.text_content || ""}
              onChange={(e) =>
                handleUpdateLesson(sectionId, lesson.id, {
                  text_content: e.target.value,
                })
              }
              placeholder="Write your lesson content here..."
              rows={5}
              className="text-sm resize-none"
            />
          </div>
        )}

        {/* ── pdf upload ── */}
        {lesson.content_type === "pdf" && (
          <div className="space-y-2">
            {lesson.asset?.type === "pdf" ? (
              <PdfPreview
                asset={lesson.asset}
                signedUrl={pdfSignedUrl}
                onRemove={handleRemoveAsset}
              />
            ) : (
              <>
                <DropzoneField
                  onDrop={(files) =>
                    lessonFileUpload.setFiles(
                      files.map((f) =>
                        Object.assign(f, {
                          preview: URL.createObjectURL(f),
                          errors: [],
                        }),
                      ),
                    )
                  }
                  label="Upload a PDF document (max 5MB)"
                  required
                  file={lessonFileUpload.files[0] as any}
                />
                {lessonFileUpload.files.length > 0 && (
                  <Button
                    type="button"
                    onClick={lessonFileUpload.onUpload}
                    disabled={lessonFileUpload.loading}
                    size="sm"
                    className="w-full gap-2"
                  >
                    {lessonFileUpload.loading ? (
                      <>
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <File className="h-3.5 w-3.5" />
                        Upload PDF
                      </>
                    )}
                  </Button>
                )}
              </>
            )}
          </div>
        )}

        {/* ── free preview toggle ── */}
        <div className="flex items-center gap-2 pt-1">
          <input
            type="checkbox"
            id={`preview-${lesson.id}`}
            checked={lesson.is_preview}
            onChange={(e) =>
              handleUpdateLesson(sectionId, lesson.id, {
                is_preview: e.target.checked,
              })
            }
            className="h-4 w-4 rounded border-border accent-primary cursor-pointer"
          />
          <Label
            htmlFor={`preview-${lesson.id}`}
            className="text-[12px] font-normal cursor-pointer text-muted-foreground"
          >
            Allow free preview before purchase
          </Label>
        </div>
      </div>
    </div>
  );
};

export default ActualLesson;
