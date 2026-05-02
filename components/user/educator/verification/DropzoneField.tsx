import { Label } from "@/components/ui/label";
import { UploadedFile } from "@/lib/types/educator";
import { cn } from "@/lib/utils";
import { AlertCircle, CheckCircle, File, Upload } from "lucide-react";
import { useDropzone } from "react-dropzone";

const DropzoneField = ({
  onDrop,
  label,
  required,
  file,
  maxSize = 5 * 1024 * 1024,
  accept = {
    "application/pdf": [".pdf"],
    "image/jpeg": [".jpg", ".jpeg"],
    "image/png": [".png"],
  },
}: {
  onDrop: (files: File[]) => void;
  label: string;
  required?: boolean;
  file?: UploadedFile | null;
  maxSize?: number;
  accept?: Record<string, string[]>;
}) => {
  const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
    onDrop,
    accept,
    maxFiles: 1,
    maxSize,
    multiple: false,
  });

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">
        {label} {required && <span className="text-destructive">*</span>}
      </Label>
      {!file ? (
        <>
          <div
            {...getRootProps()}
            className={cn(
              "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
              isDragActive
                ? "border-primary bg-primary/5"
                : "border-muted-foreground/25 hover:border-primary/50",
            )}
          >
            <input {...getInputProps()} />
            <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">
              {isDragActive
                ? "Drop your file here"
                : "Drag & drop or click to browse"}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              PDF, JPG, PNG (max 5MB)
            </p>
          </div>
          {fileRejections.length > 0 && (
            <p className="text-xs text-destructive mt-1">
              {fileRejections[0].errors[0].code === "file-too-large"
                ? `File is too large. Max size is ${(maxSize / 1024 / 1024).toFixed(0)}MB.`
                : fileRejections[0].errors[0].message}
            </p>
          )}
        </>
      ) : (
        <div className="border rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <File className="h-8 w-8 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium truncate max-w-[200px]">
                {file?.name || file?.file?.name}
              </p>
              <p className="text-xs text-muted-foreground">
                {((file?.size! || file?.file?.size!) / 1024 / 1024).toFixed(2)}
                MB
              </p>
            </div>
          </div>
          {file?.status === "uploading" && (
            <div className="text-sm text-muted-foreground">Uploading...</div>
          )}
          {file?.status === "success" && (
            <CheckCircle className="h-5 w-5 text-green-500" />
          )}
          {file?.status === "error" && (
            <AlertCircle className="h-5 w-5 text-destructive" />
          )}
        </div>
      )}
    </div>
  );
};

export default DropzoneField;
