"use server";

import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ResetPasswordSchema, UpdatePasswordSchema } from "../validators/auth";

export async function SignUp(payload: {
  email: string;
  password: string;
  fullName: string;
}) {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signUp({
    email: payload.email,
    password: payload.password,

    options: {
      data: {
        displayName: payload.fullName,
      },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/confirm?next=/welcome&type=signup`,
    },
  });

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/learner", "layout");
  redirect("/check-email");
}

export async function Login(payload: {
  email: string;
  password: string;
  //   rememberMe: boolean;
}) {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email: payload.email,
    password: payload.password,
  });

  if (error) {
    if (error.message.includes("Email not confirmed")) {
      redirect("/check-email");
    }
    throw new Error(error.message);
  }

  // const { data: userProfileData, error: userProfileError } = await supabase
  //   .from("profiles")
  //   .select("*")
  //   .eq("id", data.user.id)
  //   .single();

  // if (userProfileError) {
  //   throw new Error(userProfileError.message);
  // }

  // const roles = userProfileData.roles || [];
  // Handle both array (roles) and single string (role) cases, defaulting to learner
  // const userRoles = Array.isArray(roles)
  //   ? roles
  //   : [userProfileData.role || "learner"];

  // let redirectPath = "/learner";

  // If user is strictly an educator (and not a learner), send them to educator dashboard
  // Otherwise (learner or both), send to learner dashboard
  // if (userRoles.includes("educator") && !userRoles.includes("learner")) {
  //   redirectPath = "/educator";
  // }

  revalidatePath("/", "layout");
  redirect("/learner");
}

export async function Logout() {
  const supabase = await createClient();

  const { error } = await supabase.auth.signOut();

  if (error) {
    throw new Error(error.message);
  }

  redirect("/login");
}

export async function InitializeResetPassword(payload: ResetPasswordSchema) {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.resetPasswordForEmail(
    payload.email,
  );
  if (error) {
    throw new Error(error.message);
  }
}

export async function UpdatePassword(confirmedPassword: string) {
  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({
    password: confirmedPassword,
  });

  if (error) {
    throw new Error(error.message);
  }

  redirect("/login");
}

export async function AuthenticateWithGoogle() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback?next=/welcome`,
      queryParams: {
        access_type: "offline",
        prompt: "consent",
      },
    },
  });

  if (data.url) {
    redirect(data.url); // use the redirect API for your server framework
  }
}

export async function AuthenticateWithX() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "x",
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback?next=/welcome`,
    },
  });

  if (data.url) {
    redirect(data.url); // use the redirect API for your server framework
  }
}

export async function GetUserProfile() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error) {
    throw new Error(error.message);
  }
  const { data: existingProfile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", data.user.id)
    .single();

  return existingProfile;
}

export async function Welcome() {
  const user = await GetUserProfile();
  const supabase = await createClient();
  if (user?.onboarding_completed) {
    return { success: true, complete: true };
  }

  const { error } = await supabase
    .from("profiles")
    .update({
      onboarding_completed: true,
    })
    .eq("id", user.id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/learner", "layout");
  return { success: true };
}

export async function DeleteAccountAction(password: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not authenticated");
  }

  // Verify password first
  const { error: signInError } = await supabase.auth.signInWithPassword({
    email: user.email!,
    password: password,
  });

  if (signInError) {
    throw new Error("Incorrect password");
  }
  await supabase.auth.signOut();

  const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(
    user.id,
  );

  if (authError) {
    throw new Error(authError.message);
  }

  revalidatePath("/", "layout");
  redirect("/login");
}
