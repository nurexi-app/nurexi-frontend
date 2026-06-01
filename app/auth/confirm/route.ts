import { type EmailOtpType } from "@supabase/supabase-js";
import { type NextRequest } from "next/server";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { resend } from "@/lib/email/resend";
import { welcomeEmailHtml } from "@/lib/email/templates/Welcome";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const code = searchParams.get("code");
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const next = searchParams.get("next") ?? "/welcome";

  const supabase = await createClient();

  let user = null;

  /* ---------------------------------------------
   * 1️⃣ Preferred flow: PKCE (code)
   * ------------------------------------------- */
  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) redirect("/auth/auth-code-error");

    const { data } = await supabase.auth.getUser();
    user = data.user;
  }

  /* ---------------------------------------------
   * 2️⃣ Fallback flow: OTP / magic link
   * ------------------------------------------- */
  if (!user && token_hash && type) {
    const { data, error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    });

    if (error) redirect("/auth/auth-code-error");
    user = data.user;
  }

  if (!user) redirect("/auth/auth-code-error");

  //  Create profile ONCE

  const { data: existingProfile } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", user.id)
    .single();

  if (!existingProfile) {
    const displayName =
      user.user_metadata?.displayName || user.email?.split("@")[0] || "User";

    await supabase.from("profiles").insert({
      id: user.id,
      email: user.email,
      full_name: displayName,
      roles: ["learner"],
    });

    //  Send welcome email

    const appUrl = process.env.NEXT_PUBLIC_APP_URL!;

    try {
      await resend.emails.send({
        from: "Ochife at Nurexi <welcome@mails.nurexi.com>",
        to: user.email!,
        subject: "Welcome to Nurexi",
        html: welcomeEmailHtml({ displayName, appUrl }),
      });
    } catch (error) {
      console.error("Failed to send welcome email:", error);
    }
  }

  /* ---------------------------------------------
   * 5️⃣ Redirect user
   * ------------------------------------------- */
  redirect(next);
}
