import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { resend } from "@/lib/email/resend";
import { welcomeEmailHtml } from "@/lib/email/templates/Welcome";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  let next = searchParams.get("next") ?? "/welcome";
  // guard against open redirects
  if (!next.startsWith("/")) next = "/welcome";

  if (!code) {
    return NextResponse.redirect(`${origin}/auth/auth-code-error`);
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error("[auth/callback] exchangeCodeForSession error:", error);
    return NextResponse.redirect(`${origin}/auth/auth-code-error`);
  }

  const { data } = await supabase.auth.getUser();
  const user = data.user;

  if (!user) {
    return NextResponse.redirect(`${origin}/auth/auth-code-error`);
  }

  // ── Create profile if first time ─────────────────────────────────
  const { data: existingProfile } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", user.id)
    .single();

  if (!existingProfile) {
    const displayName =
      user.user_metadata?.full_name ||
      user.user_metadata?.name ||
      user.email?.split("@")[0] ||
      "User";

    await supabase.from("profiles").insert({
      id: user.id,
      email: user.email,
      full_name: displayName,
      avatar_url: user.user_metadata?.avatar_url ?? null,
      roles: ["learner"],
    });

    // ── Send welcome email ──────────────────────────────────────────
    const appUrl = process.env.NEXT_PUBLIC_APP_URL!;

    try {
      await resend.emails.send({
        from: "Ochife at Nurexi <welcome@mails.nurexi.com>",
        to: user.email!,
        subject: "Welcome to Nurexi 👋",
        html: welcomeEmailHtml({ displayName, appUrl }),
      });
    } catch (err) {
      // non-fatal — user is already created, email failure shouldn't block them
      console.error("[welcome email] failed to send:", err);
    }

    // new user → always go to welcome
    return buildRedirect(request, "/welcome");
  }

  // returning user → go to their intended destination
  return buildRedirect(request, next);
}

// ── helper: respects load balancer x-forwarded-host ──────────────────────────
function buildRedirect(request: NextRequest, path: string): NextResponse {
  const { origin } = new URL(request.url);
  const forwardedHost = request.headers.get("x-forwarded-host");
  const isLocal = process.env.NODE_ENV === "development";

  if (isLocal || !forwardedHost) {
    return NextResponse.redirect(`${origin}${path}`);
  }
  return NextResponse.redirect(`https://${forwardedHost}${path}`);
}
