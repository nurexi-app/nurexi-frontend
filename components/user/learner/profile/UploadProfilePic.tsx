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
import { useEffect } from "react";
import { updateAvatarUrl } from "@/lib/actions/Settings-action";
import { toast } from "sonner";

const UploadProfilePic = ({ userId }: { userId: string }) => {
  const supabase = createClient();

  const props = useSupabaseUpload({
    bucketName: "profile-pics",
    path: userId,
    allowedMimeTypes: ["image/*"],
    maxFiles: 1,
    maxFileSize: 1000 * 1000 * 2, // 2MB,
    upsert: true,
    clearExisting: true,
  });

  const getPublicUrl = (fileName: string) => {
    const { data } = supabase.storage
      .from("profile-pics")
      .getPublicUrl(`${userId}/${fileName}`);

    return data.publicUrl;
  };
  const { successes, onUpload, isSuccess, files, loading } = props;

  useEffect(() => {
    if (isSuccess && successes.length > 0) {
      const uploadedFileName = successes[0];
      const { data } = supabase.storage
        .from("profile-pics")
        .getPublicUrl(`${userId}/${uploadedFileName}`);

      const avatarUrl = data.publicUrl;

      // Update profile with new avatar URL
      updateAvatarUrl(avatarUrl).then((result) => {
        if (result.success) {
          toast.success("Profile picture updated!");
        } else {
          toast.error(result.error || "Failed to update profile");
        }
      });
    }
  }, [isSuccess, successes, userId]);

  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant={"outline"}
            size={"lg"}
            className="rounded-2xl max-sm:max-w-[138px] max-sm:bg-transparent max-sm:text-[10px] border-black/70 hover:border-primary py-1.5 md:py-2.5! px-1 md:px-4!"
          >
            Upload Profile Picture
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Upload Profile Picture</DialogTitle>
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

export default UploadProfilePic;
