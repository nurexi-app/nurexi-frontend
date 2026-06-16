"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function submitTestimonial(
  rating: number,
  content: string,
  userId: string,
  displayName?: string,
) {
  const supabase = await createClient();

  // Check if user already submitted a testimonial
  const { data: existing } = await supabase
    .from("testimonials")
    .select("id")
    .eq("user_id", userId)
    .single();

  if (existing) {
    return { success: false, error: "You have already submitted a review" };
  }

  // Get user profile for display name
  const { data: profile } = await supabase
    .from("profiles")
    .select("avatar_url")
    .eq("id", userId)
    .single();
  const { error } = await supabase.from("testimonials").insert({
    user_id: userId,
    rating,
    content,
    display_name: displayName || "Anonymous",
    avatar_url: profile?.avatar_url,
    is_approved: false,
  });

  if (error) {
    return { success: false, error: error.message };
  }

  return {
    success: true,
    message: "Thank you! Your review will be reviewed soon.",
  };
}

export async function getTestimonialStats() {
  const supabase = await createClient();

  // Get ALL approved testimonials for average calculation
  const { data: allRatings, error } = await supabase
    .from("testimonials")
    .select("rating")
    .eq("is_approved", true);

  if (error) {
    return { success: false, error: error.message };
  }

  const total = allRatings?.length || 0;
  const sum = allRatings?.reduce((acc, curr) => acc + curr.rating, 0) || 0;
  const averageRating = total > 0 ? (sum / total).toFixed(1) : "0.0";

  return {
    success: true,
    stats: {
      averageRating: parseFloat(averageRating),
      totalReviews: total,
    },
  };
}

export async function getApprovedTestimonials(limit: number = 6) {
  const supabase = await createClient();

  // Get limited testimonials for display (not for average)
  const { data, error } = await supabase
    .from("testimonials")
    .select("content, rating, display_name, created_at")
    .eq("is_approved", true)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    return { success: false, error: error.message, data: [] };
  }

  return { success: true, data: data || [] };
}

export async function hasUserRated(userId: string): Promise<boolean> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("testimonials")
    .select("id")
    .eq("user_id", userId)
    .maybeSingle();

  return !!data;
}
