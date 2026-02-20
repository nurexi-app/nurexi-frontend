import { type EmailOtpType } from "@supabase/supabase-js";
import { type NextRequest } from "next/server";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { resend } from "@/lib/email/resend";

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
    await supabase.from("profiles").insert({
      id: user.id,
      email: user.email,
      full_name: user.user_metadata?.displayName ?? null,
      roles: ["learner"],
    });

    //  Send welcome email

    try {
      const result = await resend.emails.send({
        from: "Nurexi <onboarding@resend.dev>",
        to: user.email!,
        subject: "Welcome to Nurexi — glad you’re here",
        html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6">
          <h2>Welcome to Nurexi 👋</h2>
          <p>Hi ${user.user_metadata?.displayName ?? "there"},</p>

          <p>
            I’m excited to have you on Nurexi. We’re building tools to help
            nurses prepare smarter and grow confidently.
          </p>

          <p>
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/welcome">
              Go to your dashboard →
            </a>
          </p>

          <p>
            — Ochife<br />
            Founder, Nurexi
          </p>
        </div>
      `,
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
