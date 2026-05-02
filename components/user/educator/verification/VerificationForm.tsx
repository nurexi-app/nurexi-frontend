"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { File, X, CheckCircle, Eye, AlertCircle, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { UploadedFile } from "@/lib/types/educator";
import DropzoneField from "./DropzoneField";
import { useSupabaseUpload } from "@/hooks/use-supabase-upload";
import {
  updateProfile,
  submitVerification,
} from "@/lib/actions/educator-actions";
import { createClient } from "@/lib/supabase/client";
import { BadgeCheck } from "@/components/animate-ui/icons/badge-check";
import { AnimateIcon } from "@/components/animate-ui/icons/icon";

interface VerificationFormProps {
  user: any;
  verificationDetails: {
    license_url: string | null;
    government_id_url: string | null;
    additional_docs_urls?: string[];
    status: string;
    admin_notes: string | null;
  };
}

export default function VerificationForm({
  user,
  verificationDetails,
}: VerificationFormProps) {
  const supabase = createClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [profileSet, setProfileSet] = useState(false);
  const [formData, setFormData] = useState({
    professionalTitle: "",
    specialization: "",
    yearsOfExperience: "",
    bio: "",
  });

  // Check if user already has profile info
  useEffect(() => {
    const { bio, specialization, professional_title, years_of_experience } =
      user;
    function setUserData() {
      if (bio && specialization && professional_title && years_of_experience) {
        setProfileSet(true);
        console.log("user obj :", {
          bio,
          specialization,
          professional_title,
          years_of_experience,
        });
        setFormData({
          bio: bio || "",
          specialization: specialization || "",
          professionalTitle: professional_title || "",
          yearsOfExperience: years_of_experience || "",
        });
      }
    }
    setUserData();
  }, []);

  // Government ID upload hook
  const govIdUpload = useSupabaseUpload({
    bucketName: "educator-verifications",
    path: `${user.id}/government-id`,
    allowedMimeTypes: ["application/pdf", "image/jpeg", "image/png"],
    maxFileSize: 5 * 1024 * 1024,
    upsert: true,
  });

  // Nursing License upload hook
  const licenseUpload = useSupabaseUpload({
    bucketName: "educator-verifications",
    path: `${user.id}/license`,
    allowedMimeTypes: ["application/pdf", "image/jpeg", "image/png"],
    maxFileSize: 5 * 1024 * 1024,
    upsert: true,
  });

  // Track when uploads complete
  const [govIdUploaded, setGovIdUploaded] = useState(false);
  const [licenseUploaded, setLicenseUploaded] = useState(false);
  const [govIdUrl, setGovIdUrl] = useState<string | null>(
    verificationDetails?.government_id_url || null,
  );
  const [licenseUrl, setLicenseUrl] = useState<string | null>(
    verificationDetails?.license_url || null,
  );
  const [additionalDocs, setAdditionalDocs] = useState<UploadedFile[]>([]);
  const [isUploadingAdditional, setIsUploadingAdditional] = useState(false);
  const [additionalUploadedUrls, setAdditionalUploadedUrls] = useState<
    string[]
  >(verificationDetails?.additional_docs_urls || []);

  // Check if already verified
  const isAlreadyVerified = verificationDetails?.status === "approved";
  const isPending = verificationDetails?.status === "pending";
  const isRejected = verificationDetails?.status === "rejected";

  // Generate signed URL for existing government ID on load
  useEffect(() => {
    if (verificationDetails?.government_id_url && !govIdUrl) {
      const getSignedUrl = async () => {
        const { data } = await supabase.storage
          .from("educator-verifications")
          .createSignedUrl(verificationDetails.government_id_url!, 3600);
        if (data) {
          setGovIdUrl(data.signedUrl);
        }
      };
      getSignedUrl();
    }
  }, [verificationDetails, govIdUrl]);

  // Generate signed URL for existing license on load
  useEffect(() => {
    if (verificationDetails?.license_url && !licenseUrl) {
      const getSignedUrl = async () => {
        const { data } = await supabase.storage
          .from("educator-verifications")
          .createSignedUrl(verificationDetails.license_url!, 3600);
        if (data) {
          setLicenseUrl(data.signedUrl);
        }
      };
      getSignedUrl();
    }
  }, [verificationDetails, licenseUrl]);

  // Generate signed URLs for existing additional docs on load
  useEffect(() => {
    if (
      verificationDetails?.additional_docs_urls?.length &&
      additionalUploadedUrls.length === 0
    ) {
      const getSignedUrls = async () => {
        const signedUrls = await Promise.all(
          verificationDetails.additional_docs_urls!.map(async (filePath) => {
            const { data } = await supabase.storage
              .from("educator-verifications")
              .createSignedUrl(filePath, 3600);
            return data?.signedUrl || filePath;
          }),
        );
        setAdditionalUploadedUrls(signedUrls);
        // Also create UploadedFile objects for display
        const docs = signedUrls.map((url, idx) => ({
          file: {
            name:
              verificationDetails.additional_docs_urls![idx].split("/").pop() ||
              "Document",
          } as File,
          preview: url,
          progress: 100,
          status: "success" as const,
          url: url,
        }));
        setAdditionalDocs(docs);
      };
      getSignedUrls();
    }
  }, [verificationDetails, additionalUploadedUrls.length]);

  // When govId upload succeeds, get signed URL
  useEffect(() => {
    if (govIdUpload.isSuccess && govIdUpload.successes.length > 0) {
      const fileName = govIdUpload.successes[0];
      const getSignedUrl = async () => {
        const { data, error } = await supabase.storage
          .from("educator-verifications")
          .createSignedUrl(`${user.id}/government-id/${fileName}`, 3600);
        if (data) {
          setGovIdUrl(data.signedUrl);
          setGovIdUploaded(true);
          toast.success("Government ID uploaded successfully");
        }
        if (error) {
          toast.error("Error getting signed URL");
        }
      };
      getSignedUrl();
    }
  }, [govIdUpload.isSuccess, govIdUpload.successes, user.id]);

  // When license upload succeeds, get signed URL
  useEffect(() => {
    if (licenseUpload.isSuccess && licenseUpload.successes.length > 0) {
      const fileName = licenseUpload.successes[0];
      const getSignedUrl = async () => {
        const { data, error } = await supabase.storage
          .from("educator-verifications")
          .createSignedUrl(`${user.id}/license/${fileName}`, 3600);
        if (data) {
          setLicenseUrl(data.signedUrl);
          setLicenseUploaded(true);
          toast.success("Nursing License uploaded successfully");
        }
        if (error) {
          toast.error("Error getting signed URL");
        }
      };
      getSignedUrl();
    }
  }, [licenseUpload.isSuccess, licenseUpload.successes, user.id]);

  // Upload additional documents function
  const uploadAdditionalDocs = async () => {
    setIsUploadingAdditional(true);
    const newUrls: string[] = [];

    for (const doc of additionalDocs) {
      if (doc.status === "pending" && doc.file) {
        setAdditionalDocs((prev) =>
          prev.map((d) =>
            d === doc ? { ...d, status: "uploading" as const } : d,
          ),
        );

        const filePath = `${user.id}/additional/${Date.now()}_${doc.file.name}`;
        const { error } = await supabase.storage
          .from("educator-verifications")
          .upload(filePath, doc.file);

        if (error) {
          setAdditionalDocs((prev) =>
            prev.map((d) =>
              d === doc ? { ...d, status: "error" as const } : d,
            ),
          );
          toast.error(`Failed to upload ${doc.file?.name ?? "file"}`);
        } else {
          const { data: signedData } = await supabase.storage
            .from("educator-verifications")
            .createSignedUrl(filePath, 3600);

          if (signedData) {
            newUrls.push(filePath);
            setAdditionalDocs((prev) =>
              prev.map((d) =>
                d === doc
                  ? {
                      ...d,
                      status: "success" as const,
                      url: signedData.signedUrl,
                    }
                  : d,
              ),
            );
          }
        }
      }
    }

    setAdditionalUploadedUrls((prev) => [...prev, ...newUrls]);
    setIsUploadingAdditional(false);
    if (newUrls.length > 0) {
      toast.success(`${newUrls.length} document(s) uploaded successfully`);
    }
  };

  // Remove additional document
  const removeAdditionalDoc = (index: number) => {
    setAdditionalDocs((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!govIdUploaded && !govIdUrl) {
      toast.error("Please upload Government ID");
      return;
    }
    if (!licenseUploaded && !licenseUrl) {
      toast.error("Please upload Nursing License");
      return;
    }

    setIsSubmitting(true);

    try {
      // Update profile with professional info
      if (!profileSet) {
        await updateProfile({
          userId: user.id,
          bio: formData.bio,
          specialization: formData.specialization,
          professionalTitle: formData.professionalTitle,
          yearsOfExperience: parseInt(formData.yearsOfExperience),
        });
      }

      // Submit verification documents
      await submitVerification({
        userId: user.id,
        licenseUrl: licenseUrl!,
        governmentIdUrl: govIdUrl!,
        additionalDocsUrls: additionalUploadedUrls,
      });

      toast.success(
        "Verification submitted! We'll review within 3-5 business days.",
      );
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Submission failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  // If already approved, show success message
  if (isAlreadyVerified) {
    return (
      <div className="text-center py-8">
        <AnimateIcon animateOnView>
          <BadgeCheck
            animation="check"
            className="size-12! text-green-500! mx-auto"
          />
        </AnimateIcon>
        <h3 className="text-lg font-semibold mb-1">Verification Approved!</h3>
        <p className="text-muted-foreground">
          You are now a verified educator. You can start creating courses.
        </p>
      </div>
    );
  }

  // If pending, show waiting message
  if (isPending) {
    return (
      <div className="text-center py-8">
        <div className="h-12 w-12 rounded-full border-2 border-primary border-t-transparent animate-spin mx-auto mb-3" />
        <h3 className="text-lg font-semibold mb-1">Verification Pending</h3>
        <p className="text-muted-foreground">
          Your documents are being reviewed. We'll notify you once completed.
        </p>
      </div>
    );
  }

  return (
    <>
      {isRejected && (
        <div className="text-center py-8">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-3" />
          <h3 className="text-lg font-semibold mb-1">Verification Rejected</h3>
          <p className="text-muted-foreground">
            {verificationDetails?.admin_notes}
          </p>
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Professional Information Section */}
        {profileSet && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Professional Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="professionalTitle">Professional Title *</Label>
                <Input
                  id="professionalTitle"
                  placeholder="e.g., Registered Nurse, Nurse Educator"
                  value={formData.professionalTitle}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      professionalTitle: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="specialization">Specialization</Label>
                <Input
                  id="specialization"
                  placeholder="e.g., Medical-Surgical, Pediatrics"
                  value={formData.specialization}
                  onChange={(e) =>
                    setFormData({ ...formData, specialization: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="yearsOfExperience">Years of Experience</Label>
                <Input
                  id="yearsOfExperience"
                  type="number"
                  placeholder="e.g., 5"
                  value={formData.yearsOfExperience}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      yearsOfExperience: e.target.value,
                    })
                  }
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio">Bio / Professional Background</Label>
              <Textarea
                id="bio"
                placeholder="Tell us about your nursing background..."
                value={formData.bio}
                onChange={(e) =>
                  setFormData({ ...formData, bio: e.target.value })
                }
              />
            </div>
          </div>
        )}

        {/* Documents Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Verification Documents</h3>
          <p className="text-sm text-muted-foreground">
            Please upload clear, readable copies of your documents
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Government ID */}
            <div className="space-y-2">
              <Label>Government ID *</Label>
              {govIdUrl ? (
                <div className="border rounded-lg p-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <File className="h-5 w-5 text-green-500" />
                    <span className="text-sm">Government ID (uploaded)</span>
                  </div>
                  <div className="flex items-center gap-0.5">
                    <a
                      href={govIdUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button type="button" size="sm" variant="ghost">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </a>
                    <Button
                      type="button"
                      size="sm"
                      variant="destructive"
                      onClick={() => {
                        setGovIdUrl(null);
                        // govIdUpload.clearFiles();
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <DropzoneField
                    onDrop={(files) => {
                      govIdUpload.setFiles(
                        files.map((f) =>
                          Object.assign(f, {
                            preview: URL.createObjectURL(f),
                            errors: [],
                          }),
                        ),
                      );
                    }}
                    label="Upload Government ID"
                    required
                    file={govIdUpload.files[0] as any}
                  />
                  {govIdUpload.files.length > 0 && (
                    <Button
                      type="button"
                      onClick={govIdUpload.onUpload}
                      disabled={govIdUpload.loading}
                      size="sm"
                      className="w-full"
                    >
                      {govIdUpload.loading ? "Uploading..." : "Upload"}
                    </Button>
                  )}
                </div>
              )}
            </div>

            {/* Nursing License */}
            <div className="space-y-2">
              <Label>Nursing License *</Label>
              {licenseUrl ? (
                <div className="border rounded-lg p-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <File className="h-5 w-5 text-green-500" />
                    <span className="text-sm">Nursing License (uploaded)</span>
                  </div>
                  <div className="flex items-center gap-0.5">
                    <a
                      href={licenseUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button type="button" size="sm" variant="ghost">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </a>
                    <Button
                      type="button"
                      size="sm"
                      variant="destructive"
                      onClick={() => {
                        setLicenseUrl(null);
                        // licenseUpload.clearFiles();
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <DropzoneField
                    onDrop={(files) => {
                      licenseUpload.setFiles(
                        files.map((f) =>
                          Object.assign(f, {
                            preview: URL.createObjectURL(f),
                            errors: [],
                          }),
                        ),
                      );
                    }}
                    label="Upload Nursing License"
                    required
                    file={licenseUpload.files[0] as any}
                  />
                  {licenseUpload.files.length > 0 && (
                    <Button
                      type="button"
                      onClick={licenseUpload.onUpload}
                      disabled={licenseUpload.loading}
                      size="sm"
                      className="w-full"
                    >
                      {licenseUpload.loading ? "Uploading..." : "Upload"}
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Additional Documents (Optional) */}
          <div className="space-y-3">
            <Label>Additional Documents (Optional)</Label>
            <p className="text-xs text-muted-foreground">
              Upload certificates, CV, or other credentials (max 2 files, PDF
              only)
            </p>

            {/* Additional Upload Dropzone */}
            {additionalDocs.length < 2 && (
              <DropzoneField
                onDrop={(files) => {
                  const newFiles = files.slice(0, 2 - additionalDocs.length);
                  const uploads = newFiles.map((file) => ({
                    file,
                    preview: URL.createObjectURL(file),
                    progress: 0,
                    status: "pending" as const,
                  }));
                  setAdditionalDocs((prev) => [...prev, ...uploads]);
                }}
                label="Upload additional credentials"
                file={null}
              />
            )}

            {/* Additional Documents List */}
            {additionalDocs.length > 0 && (
              <div className="space-y-2 mt-3">
                {additionalDocs.map((doc, idx) => (
                  <div
                    key={idx}
                    className="border rounded-lg p-3 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <File className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium truncate max-w-[200px]">
                          {doc.name || doc.file?.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {(
                            (doc.size ?? doc.file?.size ?? 0) /
                            1024 /
                            1024
                          ).toFixed(2)}{" "}
                          MB
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {doc.status === "uploading" && (
                        <span className="text-xs text-muted-foreground">
                          Uploading...
                        </span>
                      )}
                      {doc.status === "success" && (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      )}
                      {doc.status === "error" && (
                        <AlertCircle className="h-4 w-4 text-destructive" />
                      )}
                      {doc.status !== "uploading" &&
                        doc.status !== "success" && (
                          <button
                            type="button"
                            onClick={() => removeAdditionalDoc(idx)}
                            className="text-muted-foreground hover:text-destructive"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Upload button for additional docs */}
            {additionalDocs.length > 0 &&
              additionalDocs.some((doc) => doc.status === "pending") && (
                <Button
                  type="button"
                  onClick={uploadAdditionalDocs}
                  disabled={isUploadingAdditional}
                  size="sm"
                  className="w-full"
                >
                  {isUploadingAdditional
                    ? "Uploading..."
                    : `Upload ${additionalDocs.length} Document${additionalDocs.length > 1 ? "s" : ""}`}
                </Button>
              )}
          </div>
        </div>

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? "Submitting..." : "Submit Verification"}
        </Button>
      </form>
    </>
  );
}
