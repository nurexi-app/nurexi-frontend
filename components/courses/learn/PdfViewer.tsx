"use client";

import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, FileText } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useLearnContext } from "@/context/LearnProvider";
import { Lesson } from "@/lib/types/course";

interface PdfViewerProps {
  lesson: Partial<Lesson>;
  bucket?: string;
  expiresIn?: number;
}

export function PdfViewer({
  lesson,
  bucket = "courses",
  expiresIn = 3600,
}: PdfViewerProps) {
  const supabase = createClient();
  const { course } = useLearnContext();

  const educatorId = course?.educator_id;
  const courseId = course?.id;

  if (!educatorId || !courseId || !lesson.asset?.filename) {
    return (
      <p className="text-muted-foreground">Missing document path parameters.</p>
    );
  }

  const filePath = `${educatorId}/${courseId}/${lesson.id}/${lesson.asset.filename}`;

  const {
    data: signedUrl,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["pdf-signed-url", bucket, filePath],
    queryFn: async () => {
      const { data, error } = await supabase.storage
        .from(bucket)
        .createSignedUrl(filePath, expiresIn);

      if (error) {
        throw new Error(error.message);
      }

      return data.signedUrl;
    },
    // Cache for 50 mins so it doesn't refetch on re-renders while the 1-hour link is valid
    staleTime: 1000 * 60 * 50,
    enabled: Boolean(filePath),
  });

  if (isLoading) {
    return (
      <div className="w-full aspect-video rounded-lg overflow-hidden border border-border">
        <Skeleton className="w-full h-full" />
      </div>
    );
  }

  if (isError || !signedUrl) {
    return (
      <div className="w-full aspect-video bg-muted/20 border border-dashed border-border rounded-lg flex flex-col items-center justify-center p-6 text-center">
        <AlertCircle className="h-8 w-8 text-destructive mb-2" />
        <p className="font-medium text-foreground">Could not load document</p>
        <p className="text-xs text-muted-foreground mt-1 max-w-sm">
          {error?.message ||
            "Failed to generate a secure access link for this PDF."}
        </p>
      </div>
    );
  }

  return (
    <iframe
      src={signedUrl}
      className="w-full aspect-video bg-white rounded-lg border border-border shadow-sm"
      title={lesson.title}
    />
  );
}
