export interface UploadedFile {
  file?: File;
  preview?: string;
  progress?: number;
  status?: "pending" | "uploading" | "success" | "error";
  url?: string;
  name?: string;
  size?: number;
}
