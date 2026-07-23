"use server";
import { createClient } from "@/lib/supabase/server";

const EDUCATOR_ROLE = process.env.EDUCATOR_ROLE!;

export type AuthSuccess<T = null> = {
  authorized: true;
  user: { id: string; email?: string };
  data: T;
};

export type AuthFailure = {
  authorized: false;
  error: string;
};

export type AuthResult<T = null> = AuthSuccess<T> | AuthFailure;

export async function requireAuth(): Promise<AuthResult> {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return { authorized: false, error: "Unauthorized: Please log in." };
  }

  return {
    authorized: true,
    user: { id: user.id, email: user.email },
    data: null,
  };
}

/**
 * 2. IsEducator
 * Checks if the logged-in user has the EDUCATOR_ROLE in their profile roles.
 */
export async function requireEducator(): Promise<AuthResult> {
  const authResult = await requireAuth();
  if (!authResult.authorized) return authResult;

  const supabase = await createClient();
  const { data: profile, error } = await supabase
    .from("profiles")
    .select("roles")
    .eq("id", authResult.user.id)
    .single();

  if (error || !profile) {
    return { authorized: false, error: "User profile not found." };
  }
  // Support both an array of roles (profile.roles) or a single role string (profile.role)
  const userRoles: string[] = Array.isArray(profile.roles) ? profile.roles : [];

  const isEducator = userRoles.includes(EDUCATOR_ROLE);

  if (!isEducator) {
    return {
      authorized: false,
      error: "Forbidden: You do not have the required permissions.",
    };
  }

  return { authorized: true, user: authResult.user, data: null };
}

/**
 * 3. HasCoursePermission
 * Checks if the logged-in user is an educator AND owns the specified course.
 * Optionally fetches and returns course data.
 */
export async function requireCoursePermission(
  courseId: string,
): Promise<AuthResult<{ educator_id: string }>> {
  const educatorResult = await requireEducator();
  if (!educatorResult.authorized) return educatorResult;

  const supabase = await createClient();
  const { data: course, error } = await supabase
    .from("courses")
    .select("id, educator_id")
    .eq("id", courseId)
    .single();

  if (error || !course) {
    return { authorized: false, error: "Course not found." };
  }

  if (course.educator_id !== educatorResult.user.id) {
    return {
      authorized: false,
      error: "Forbidden: You do not own this course.",
    };
  }

  return {
    authorized: true,
    user: educatorResult.user,
    data: { educator_id: course.educator_id },
  };
}
