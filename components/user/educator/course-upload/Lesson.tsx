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
  GripVertical,
  Loader2,
  Play,
  Info,
  ChevronDown,
  ChevronRight,
  MoreVertical,
  RefreshCw,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useCallback, useEffect, useRef, useState, Suspense } from "react";
import { Lesson, LessonType } from "@/lib/types/course";
import { debounce, cn } from "@/lib/utils";
import { useDeleteWithUndo } from "@/hooks/useDeleteWithUndo";
import { deleteLesson } from "@/lib/actions/course-action";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ReactPlayer from "react-player";
import { ReplaceAssetDialog } from "./ReplaceAssetsDialogue";

// ─── constants ────────────────────────────────────────────────────────────────

const MAX_PREVIEW_LESSONS = 2;

// ─── helpers ──────────────────────────────────────────────────────────────────

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

function ContentTypeIcon({ type }: { type: LessonType }) {
  if (type === "video") return <Video className="h-3.5 w-3.5" />;
  if (type === "pdf") return <File className="h-3.5 w-3.5" />;
  return <FileText className="h-3.5 w-3.5" />;
}

// ─── video preview ────────────────────────────────────────────────────────────

function VideoPreview({
  asset,
  onRemove,
  isDraft,
  lesson,
  sectionId,
  replaceDialogOpen,
  setReplaceDialogOpen,
}: {
  asset: Lesson["asset"];
  onRemove: () => void;
  isDraft: boolean;
  lesson: Lesson;
  sectionId: string;
  setReplaceDialogOpen: (open: boolean) => void;
  replaceDialogOpen: boolean;
}) {
  const [playerOpen, setPlayerOpen] = useState(false);
  if (!asset || asset.type !== "video") return null;

  // ← use stored playback_url directly, no reconstruction needed
  const streamUrl = asset.playback_url ?? asset.secure_url ?? null;

  return (
    <>
      <div className="rounded-xl border border-border bg-muted/30 overflow-hidden">
        {/* thumbnail */}
        <div className="relative w-65 aspect-video bg-black/80 group/thumb">
          {asset.thumbnail_url ? (
            <img
              src={asset.thumbnail_url}
              alt="Video thumbnail"
              className="w-full h-full object-cover opacity-80"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Video className="h-10 w-10 text-white/30" />
            </div>
          )}

          {/* play overlay — only shows on hover */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover/thumb:opacity-100 transition-opacity">
            <button
              type="button"
              onClick={() => setPlayerOpen(true)}
              className="flex items-center gap-2 bg-white/90 hover:bg-white text-black font-semibold text-sm px-4 py-2 rounded-full transition-colors shadow-lg"
            >
              <Play className="h-4 w-4 fill-black" />
              Play video
            </button>
          </div>

          {asset.duration_seconds && (
            <span className="absolute bottom-2 right-2 bg-black/70 text-white text-[11px] font-mono px-1.5 py-0.5 rounded">
              {formatDuration(asset.duration_seconds)}
            </span>
          )}
        </div>

        {/* footer */}
        <div className="flex items-center justify-between px-3 py-2 gap-2">
          <div className="min-w-0">
            <p className="text-[12px] text-muted-foreground truncate">
              {asset.public_id?.split("/").pop() ?? "Video uploaded"}
            </p>
            {asset.duration_seconds && (
              <p className="text-[11px] text-muted-foreground">
                {formatDuration(asset.duration_seconds)} · Cloudinary
              </p>
            )}
          </div>

          <div className="flex items-center gap-1 shrink-0">
            {streamUrl && (
              <Button
                type="button"
                size="sm"
                variant="ghost"
                className="h-7 w-7 p-0 text-muted-foreground"
                onClick={() => setPlayerOpen(true)}
                title="Preview"
              >
                <Play className="h-3.5 w-3.5" />
              </Button>
            )}

            {isDraft ? (
              // draft — can remove entirely
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={onRemove}
                className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive"
                title="Remove video"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            ) : (
              <ReplaceAssetDialog
                open={replaceDialogOpen}
                onOpenChange={setReplaceDialogOpen}
                lesson={lesson}
                sectionId={sectionId}
                isDraft={isDraft}
              />
            )}
          </div>
        </div>
      </div>

      {/* player dialog — ReactPlayer only mounts when open */}
      <Dialog open={playerOpen} onOpenChange={setPlayerOpen}>
        <DialogContent className="max-w-3xl p-0 overflow-hidden">
          <DialogHeader className="px-4 pt-4 pb-2">
            <DialogTitle className="text-sm font-semibold">
              {asset.public_id?.split("/").pop() ?? "Video preview"}
            </DialogTitle>
          </DialogHeader>
          <div className="aspect-video bg-black w-full">
            {playerOpen && streamUrl && (
              <Suspense
                fallback={
                  <div className="w-full h-full flex items-center justify-center">
                    <Loader2 className="h-6 w-6 animate-spin text-white/50" />
                  </div>
                }
              >
                <ReactPlayer
                  src={streamUrl}
                  width="100%"
                  height="100%"
                  controls
                  playing
                />
              </Suspense>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

// ─── pdf preview ──────────────────────────────────────────────────────────────

function PdfPreview({
  asset,
  signedUrl,
  onRemove,
  isDraft,
  replaceDialogOpen,
  setReplaceDialogOpen,

  lesson,
  sectionId,
}: {
  asset: Lesson["asset"];
  signedUrl: string | null;
  onRemove: () => void;
  isDraft: boolean;
  replaceDialogOpen: boolean;
  setReplaceDialogOpen: (open: boolean) => void;

  lesson: Lesson;
  sectionId: string;
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

        {isDraft ? (
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={onRemove}
            className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        ) : (
          <ReplaceAssetDialog
            open={replaceDialogOpen}
            onOpenChange={setReplaceDialogOpen}
            lesson={lesson}
            sectionId={sectionId}
            isDraft={isDraft}
          />
        )}
      </div>
    </div>
  );
}

// ─── preview toggle ───────────────────────────────────────────────────────────

function PreviewToggle({
  lesson,
  sectionId,
  previewCount,
}: {
  lesson: Lesson;
  sectionId: string;
  previewCount: number;
}) {
  const { handleUpdateLesson } = useCourse();

  const isVideo = lesson.content_type === "video";
  const hasAsset = !!lesson.asset && Object.keys(lesson.asset).length > 0;
  const atLimit = previewCount >= MAX_PREVIEW_LESSONS && !lesson.is_preview;
  const canBePreview = isVideo && hasAsset;

  let disabledReason: string | null = null;
  if (!isVideo)
    disabledReason = "Only video lessons can be set as free preview";
  else if (!hasAsset)
    disabledReason = "Upload a video first to enable free preview";
  else if (atLimit)
    disabledReason = `Max ${MAX_PREVIEW_LESSONS} preview lessons per course`;

  const isDisabled = !canBePreview || atLimit;

  return (
    <div className="pt-1 space-y-1">
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id={`preview-${lesson.id}`}
          checked={lesson.is_preview && canBePreview}
          disabled={isDisabled}
          onChange={(e) =>
            handleUpdateLesson(sectionId, lesson.id, {
              is_preview: e.target.checked,
            })
          }
          className="h-4 w-4 rounded border-border accent-primary cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
        />
        <Label
          htmlFor={`preview-${lesson.id}`}
          className={cn(
            "text-[12px] font-normal cursor-pointer",
            isDisabled
              ? "text-muted-foreground/50 cursor-not-allowed"
              : "text-muted-foreground",
          )}
        >
          Allow free preview before purchase
        </Label>

        {/* preview usage counter */}
        {isVideo && hasAsset && (
          <span className="ml-auto text-[10px] text-muted-foreground shrink-0">
            {previewCount}/{MAX_PREVIEW_LESSONS} used
          </span>
        )}
      </div>

      {disabledReason && (
        <p className="text-[11px] text-muted-foreground/60 flex items-center gap-1 pl-6">
          <Info className="h-3 w-3 shrink-0" />
          {disabledReason}
        </p>
      )}
    </div>
  );
}

// ─── main lesson component ────────────────────────────────────────────────────

const ActualLesson = ({
  lesson,
  sectionId,
  previewCount,
}: {
  lesson: Lesson;
  sectionId: string;
  previewCount: number;
}) => {
  const {
    handleUpdateLesson,
    handleUpdateLessonLocally,
    courseId,
    userId,
    courseData,
  } = useCourse();

  const supabase = createClient();
  // ← fix: check .status not === object
  const isDraft = courseData?.status === "draft";

  const { executeDelete, isLoading: isDeleting } = useDeleteWithUndo({
    deleteFn: deleteLesson,
    onSuccess: () => {},
    onError: (message) => toast.error(message),
  });

  // ── collapsed state — simple boolean ─────────────────────────────────────────
  const [isOpen, setIsOpen] = useState(true);

  // ── PDF signed URL ───────────────────────────────────────────────────────────
  const [pdfSignedUrl, setPdfSignedUrl] = useState<string | null>(null);

  useEffect(() => {
    if (lesson.asset?.type !== "pdf" || !lesson.asset.filename) return;
    const filePath = `${userId}/${courseId}/${lesson.id}/${lesson.asset.filename}`;
    supabase.storage
      .from("courses")
      .createSignedUrl(filePath, 3600)
      .then(({ data, error }) => {
        if (data?.signedUrl) setPdfSignedUrl(data.signedUrl);
        if (error) console.error("[pdf signed url]", error);
      });
  }, [lesson.asset?.filename, lesson.asset?.type]);

  // ── file upload ──────────────────────────────────────────────────────────────
  const lessonFileUpload = useSupabaseUpload({
    bucketName: "courses",
    path: `${userId}/${courseId}/${lesson.id}`,
    allowedMimeTypes: ["application/pdf"],
    maxFileSize: 5 * 1024 * 1024,
    upsert: true,
    clearExisting: true,
  });

  const prevSuccess = useRef(false);
  useEffect(() => {
    if (!lessonFileUpload.isSuccess || lessonFileUpload.successes.length === 0)
      return;
    if (prevSuccess.current) return;
    prevSuccess.current = true;

    const fileName = lessonFileUpload.successes[0];
    const filePath = `${userId}/${courseId}/${lesson.id}/${fileName}`;

    supabase.storage
      .from("courses")
      .createSignedUrl(filePath, 3600)
      .then(({ data, error }) => {
        if (error) {
          toast.error("Upload succeeded but failed to generate preview link");
          return;
        }
        if (data?.signedUrl) setPdfSignedUrl(data.signedUrl);
        handleUpdateLesson(sectionId, lesson.id, {
          asset: { provider: "supabase", type: "pdf", filename: fileName },
        });
        toast.success("PDF uploaded");
      });
  }, [lessonFileUpload.isSuccess, lessonFileUpload.successes]);

  useEffect(() => {
    if (!lessonFileUpload.isSuccess) prevSuccess.current = false;
  }, [lessonFileUpload.isSuccess]);

  // ── debounced title ──────────────────────────────────────────────────────────
  const [localTitle, setLocalTitle] = useState(lesson.title);

  useEffect(() => {
    setLocalTitle(lesson.title);
  }, [lesson.title]);

  const debouncedUpdate = useCallback(
    debounce((newTitle: string) => {
      console.log("setting title");
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
    if (!window.confirm("Remove this asset?")) return;
    handleUpdateLessonLocally(sectionId, lesson.id, {
      asset: null,
      is_preview: false,
    });
    setPdfSignedUrl(null);
    lessonFileUpload.setFiles([]);
    prevSuccess.current = false;
  };

  const hasAsset = !!lesson.asset && Object.keys(lesson.asset).length > 0;

  const [replaceDialogOpen, setReplaceDialogOpen] = useState(false);

  return (
    <div className="bg-background rounded-xl border border-border shadow-sm overflow-hidden">
      {/* ── header ── */}
      <div className="flex items-center gap-2 px-3 py-2 bg-muted/30 border-b border-border/60">
        <GripVertical className="h-3.5 w-3.5 text-muted-foreground/40 cursor-grab shrink-0" />

        {/* collapse toggle */}
        <button
          type="button"
          onClick={() => setIsOpen((p) => !p)}
          className="h-6 w-6 flex items-center justify-center rounded-md hover:bg-muted transition-colors shrink-0"
          aria-label={isOpen ? "Collapse lesson" : "Expand lesson"}
        >
          {isOpen ? (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          )}
        </button>

        {/* title preview — visible when collapsed */}
        {!isOpen && (
          <span className="text-[13px] font-medium text-foreground truncate flex-1 min-w-0">
            {localTitle || "Untitled lesson"}
          </span>
        )}

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

        {lesson.is_preview && lesson.content_type === "video" && (
          <Badge
            variant="outline"
            className="text-[10px] px-1.5 py-0.5 border-green-300 text-green-700 bg-green-50"
          >
            Preview
          </Badge>
        )}

        {hasAsset && (
          <Badge
            variant="outline"
            className={cn(
              "text-[10px] px-1.5 py-0.5 shrink-0",
              !isOpen ? "" : "ml-auto",
              "border-blue-300 text-blue-700 bg-blue-50",
            )}
          >
            ✓ Asset
          </Badge>
        )}

        {/* ellipsis menu — secondary actions */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "h-7 w-7 p-0 text-muted-foreground shrink-0",
                !hasAsset && !lesson.is_preview && "ml-auto",
              )}
            >
              <MoreVertical className="h-3.5 w-3.5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {isDraft && (
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={() => executeDelete(lesson.id)}
                disabled={isDeleting}
              >
                <Trash2 className="h-3.5 w-3.5 mr-2" />
                Delete lesson
              </DropdownMenuItem>
            )}
            {!isDraft && (
              <DropdownMenuItem
                disabled
                className="text-muted-foreground text-[12px]"
              >
                Deletion disabled on published courses
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* ── collapsible body ── */}
      <div
        className={cn(
          "overflow-hidden transition-all duration-200 ease-in-out",
          isOpen ? "max-h-[9999px] opacity-100" : "max-h-0 opacity-0",
        )}
      >
        <div className="p-4 space-y-4 ">
          <div className="flex items-center gap-4">
            {/* title */}
            <div className="space-y-1.5 basis-1/2">
              <Label className="text-[12px]">Lesson title</Label>
              <Input
                value={localTitle}
                onChange={handleTitleChange}
                placeholder="e.g. Introduction to Anatomy"
                className="h-9 text-sm"
              />
            </div>

            {/* content type */}
            {courseData.status === "draft" && (
              <div className="space-y-1.5 basis-1/2">
                <Label className="text-[12px]">Content type</Label>
                <select
                  value={lesson.content_type}
                  onChange={(e) =>
                    handleUpdateLessonLocally(sectionId, lesson.id, {
                      content_type: e.target.value as LessonType,
                      asset: null,
                      is_preview: false,
                    })
                  }
                  className="w-full h-9 px-3 text-sm border border-input rounded-md bg-background focus:outline-none focus:ring-1 focus:ring-ring"
                >
                  <option value="video">Video</option>
                  <option value="text">Text / Article</option>
                  <option value="pdf">PDF Document</option>
                </select>
              </div>
            )}
          </div>

          {/* ── video ── */}
          {lesson.content_type === "video" && (
            <div className="space-y-2">
              {hasAsset && lesson.asset?.type === "video" ? (
                <VideoPreview
                  asset={lesson.asset}
                  onRemove={handleRemoveAsset}
                  isDraft={isDraft}
                  lesson={lesson}
                  sectionId={sectionId}
                  setReplaceDialogOpen={setReplaceDialogOpen}
                  replaceDialogOpen={replaceDialogOpen}
                />
              ) : (
                <CldUploadWidget
                  options={{
                    maxFiles: 1,
                    resourceType: "video",
                    folder: `courses/${courseId}/${lesson.id}`,
                    publicId: `courses/${lesson.id}/lesson_video`,
                    sources: ["local", "dropbox", "google_drive"],
                    clientAllowedFormats: ["mp4", "webm", "mov"],
                    maxFileSize: 50_000_000,
                  }}
                  signatureEndpoint="/api/cloudinary/signature"
                  onSuccess={(result: any) => {
                    if (result?.info?.resource_type !== "video") {
                      toast.error("Only videos are allowed");
                      return;
                    }
                    // ← fix: all fields are on result.info
                    handleUpdateLesson(sectionId, lesson.id, {
                      asset: {
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

          {/* ── text ── */}
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

          {/* ── pdf ── */}
          {lesson.content_type === "pdf" && (
            <div className="space-y-2">
              {hasAsset && lesson.asset?.type === "pdf" ? (
                <PdfPreview
                  asset={lesson.asset}
                  signedUrl={pdfSignedUrl}
                  onRemove={handleRemoveAsset}
                  isDraft={isDraft}
                  lesson={lesson}
                  sectionId={sectionId}
                  replaceDialogOpen={replaceDialogOpen}
                  setReplaceDialogOpen={setReplaceDialogOpen}
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

          {/* preview toggle */}
          <PreviewToggle
            lesson={lesson}
            sectionId={sectionId}
            previewCount={previewCount}
          />
        </div>
      </div>
    </div>
  );
};

export default ActualLesson;
