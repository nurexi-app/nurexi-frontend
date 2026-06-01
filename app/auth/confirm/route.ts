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
      full_name:
        user.user_metadata?.displayName || user.email?.split("@")[0] || "User",
      roles: ["learner"],
    });

    //  Send welcome email

    const appUrl = process.env.NEXT_PUBLIC_APP_URL;

    try {
      const result = await resend.emails.send({
        from: "Nurexi <welcome@mails.nurexi.com>",
        to: user.email!,
        subject: "Welcome to Nurexi — glad you’re here",
        html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    @media only screen and (max-width: 480px) {
      .container { width: 100% !important; padding: 16px !important; }
      .button { display: block !important; text-align: center !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 20px; background-color: #f4f6f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;">
  <div class="container" style="max-width: 520px; margin: 0 auto; background: white; border-radius: 16px; padding: 32px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
    <h2 style="color: #1a8a5c; margin-top: 0;">Welcome to Nurexi 👋</h2>
    <p>Hi ${user.user_metadata?.displayName ?? "there"},</p>
    <p>I'm excited to have you on Nurexi. We're building tools to help nurses prepare smarter and grow confidently.</p>
    <div class="button" style="margin: 32px 0; text-align: center;">
      <a href="${appUrl}/welcome" style="background-color: #1a8a5c; color: white; text-decoration: none; padding: 12px 32px; border-radius: 999px; display: inline-block; font-weight: 600;">Go to your dashboard →</a>
    </div>
    <p style="color: #666;">— Ochife<br>Founder, Nurexi</p>
    <hr style="margin: 32px 0 16px; border: none; border-top: 1px solid #e2e8f0;">
    <p style="font-size: 12px; color: #94a3b8;">Need help? Reply to this email or visit our <a href="${appUrl}/faq" style="color: #1a8a5c;">help center</a>.</p>
  </div>
</body>
</html>
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
