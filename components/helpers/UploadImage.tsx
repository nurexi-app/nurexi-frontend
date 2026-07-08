"use client";

import {
  Dropzone,
  DropzoneContent,
  DropzoneEmptyState,
} from "@/components/dropzone";
import { Button } from "@/components/ui/button";
import { useSupabaseUpload } from "@/hooks/use-supabase-upload";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/animate-ui/components/radix/dialog";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface LocalProps {
  userId: string;
  bucket: string;
  label: string;
  uploadFn?: (url: string) => Promise<{ success: boolean; error?: string }>;
  path: string;
}
const UploadImage = ({ userId, bucket, label, path, uploadFn }: LocalProps) => {
  const supabase = createClient();

  const props = useSupabaseUpload({
    bucketName: bucket,
    path: `${path}`,
    allowedMimeTypes: ["image/*"],
    maxFiles: 1,
    maxFileSize: 1000 * 1000 * 2, // 2MB,
    upsert: true,
    clearExisting: true,
  });

  const getPublicUrl = (fileName: string) => {
    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(`${path}/${fileName}`);

    return data.publicUrl;
  };
  const { successes, onUpload, isSuccess, files, loading } = props;

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isSuccess && successes.length > 0) {
      const uploadedFileName = successes[0];
      const { data } = supabase.storage
        .from(bucket)
        .getPublicUrl(`${path}/${uploadedFileName}`);

      const imageUrl = data.publicUrl;

      uploadFn &&
        uploadFn(imageUrl).then((result) => {
          if (result.success) {
            toast.success("Success!");
            setIsOpen(false);
          } else {
            toast.error(result.error || "Failed to upload");
          }
        });
    }
  }, [isSuccess, successes, userId, bucket, uploadFn, supabase.storage]);

  return (
    <div>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button
            variant={"outline"}
            size={"lg"}
            className="rounded-2xl max-sm:max-w-[138px] max-sm:bg-transparent max-sm:text-[10px] border-black/70 hover:border-primary py-1.5 md:py-2.5! px-1 md:px-4!"
          >
            Upload
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Upload {label}</DialogTitle>
          </DialogHeader>
          <Dropzone {...props}>
            <DropzoneEmptyState />
            <DropzoneContent />
          </Dropzone>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UploadImage;
