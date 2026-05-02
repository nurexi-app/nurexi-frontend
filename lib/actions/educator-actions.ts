"use server";

import { createClient } from "@/lib/supabase/server";

export async function getVerificationDetails(userId: string) {
  const supabase = await createClient();
  const { data: verificationDetails } = await supabase
    .from("educator_verifications")
    .select("*")
    .eq("user_id", userId)
    .single();

  return verificationDetails;
}

interface UpdateProfileParams {
  userId: string;
  bio: string;
  specialization: string;
  professionalTitle: string;
  yearsOfExperience: number;
}

export async function updateProfile(data: UpdateProfileParams) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("profiles")
    .update({
      bio: data.bio,
      specialization: data.specialization ? [data.specialization] : null,
      professional_title: data.professionalTitle,
      years_of_experience: data.yearsOfExperience,
    })
    .eq("id", data.userId);

  if (error) throw new Error(error.message);
  return { success: true };
}

interface SubmitVerificationParams {
  userId: string;
  licenseUrl: string;
  governmentIdUrl: string;
  additionalDocsUrls?: string[];
}

export async function submitVerification(data: SubmitVerificationParams) {
  const supabase = await createClient();

  // Check if verification already exists
  const { data: existing } = await supabase
    .from("educator_verifications")
    .select("id")
    .eq("user_id", data.userId)
    .single();

  if (existing) {
    // Update existing
    const { error } = await supabase
      .from("educator_verifications")
      .update({
        license_url: data.licenseUrl,
        government_id_url: data.governmentIdUrl,
        additional_docs_urls: data.additionalDocsUrls || [],
        status: "pending",
        submitted_at: new Date().toISOString(),
      })
      .eq("user_id", data.userId);

    if (error) throw new Error(error.message);
  } else {
    // Insert new
    const { error } = await supabase.from("educator_verifications").insert({
      user_id: data.userId,
      license_url: data.licenseUrl,
      government_id_url: data.governmentIdUrl,
      additional_docs_urls: data.additionalDocsUrls || [],
      status: "pending",
      submitted_at: new Date().toISOString(),
    });

    if (error) throw new Error(error.message);
  }

  return { success: true };
}
