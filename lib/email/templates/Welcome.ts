// lib/email/templates/welcome.ts
// Reusable welcome email template for Nurexi
// Used in both email/OTP signups and Google OAuth signups

interface WelcomeEmailProps {
  displayName: string;
  appUrl: string;
}

export function welcomeEmailHtml({
  displayName,
  appUrl,
}: WelcomeEmailProps): string {
  const firstName = displayName.split(" ")[0] || "there";
  const year = new Date().getFullYear();

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <title>Welcome to Nurexi</title>
</head>
<body style="margin:0;padding:0;background-color:#f0f4f0;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">

  <!-- preheader (hidden preview text) -->
  <div style="display:none;max-height:0;overflow:hidden;mso-hide:all;">
    Welcome to Nurexi — your nursing exam prep starts here. 🎉
    &nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;
  </div>

  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f0f4f0;padding:32px 16px;">
    <tr>
      <td align="center">

        <!-- outer card -->
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:540px;">

          <!-- logo bar -->
          <tr>
            <td align="center" style="padding-bottom:24px;">
              <table cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="background-color:#0f2d1a;border-radius:12px;padding:10px 20px;">
                    <span style="color:#7dcf90;font-size:20px;font-weight:700;letter-spacing:-0.5px;">
                      Nurexi
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- hero card -->
          <tr>
            <td style="background:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.07);">

              <!-- green top strip -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="background:linear-gradient(135deg,#1a7a45 0%,#2aad63 100%);padding:36px 40px 32px;">
                    <p style="margin:0 0 8px;color:rgba(255,255,255,0.7);font-size:12px;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;">
                      You're in 🎉
                    </p>
                    <h1 style="margin:0;color:#ffffff;font-size:28px;font-weight:700;line-height:1.2;letter-spacing:-0.5px;">
                      Welcome to Nurexi,<br/>${firstName}
                    </h1>
                  </td>
                </tr>
              </table>

              <!-- body content -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="padding:36px 40px;">

                    <p style="margin:0 0 20px;color:#374151;font-size:15px;line-height:1.7;">
                      I'm glad you're here. Nurexi is built to help nurses like you 
                      prepare smarter, build confidence, and ace your exams — whether 
                      it's your first attempt or you're coming back stronger.
                    </p>

                    <!-- what you can do section -->
                    <table width="100%" cellpadding="0" cellspacing="0" border="0"
                      style="background:#f8fdf9;border:1px solid #d1fae5;border-radius:12px;margin-bottom:28px;">
                      <tr>
                        <td style="padding:20px 24px;">
                          <p style="margin:0 0 14px;color:#065f46;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;">
                            What you can do today
                          </p>
                          <!-- item 1 -->
                          <table cellpadding="0" cellspacing="0" border="0" style="margin-bottom:10px;">
                            <tr>
                              <td style="width:24px;vertical-align:top;padding-top:1px;">
                                <span style="color:#16a34a;font-size:16px;">✓</span>
                              </td>
                              <td style="color:#374151;font-size:14px;line-height:1.5;padding-left:8px;">
                                Practice with <strong>free questions</strong> across 10+ nursing subjects
                              </td>
                            </tr>
                          </table>
                          <!-- item 2 -->
                          <table cellpadding="0" cellspacing="0" border="0" style="margin-bottom:10px;">
                            <tr>
                              <td style="width:24px;vertical-align:top;padding-top:1px;">
                                <span style="color:#16a34a;font-size:16px;">✓</span>
                              </td>
                              <td style="color:#374151;font-size:14px;line-height:1.5;padding-left:8px;">
                                Take <strong>timed mock exams</strong> that simulate the real thing
                              </td>
                            </tr>
                          </table>
                          <!-- item 3 -->
                          <table cellpadding="0" cellspacing="0" border="0">
                            <tr>
                              <td style="width:24px;vertical-align:top;padding-top:1px;">
                                <span style="color:#16a34a;font-size:16px;">✓</span>
                              </td>
                              <td style="color:#374151;font-size:14px;line-height:1.5;padding-left:8px;">
                                Review <strong>clinical explanations</strong> for every answer
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>

                    <!-- CTA button -->
                    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:28px;">
                      <tr>
                        <td align="center">
                          <a href="${appUrl}/welcome"
                            style="display:inline-block;background:linear-gradient(135deg,#1a7a45,#2aad63);color:#ffffff;text-decoration:none;padding:14px 40px;border-radius:999px;font-size:15px;font-weight:700;letter-spacing:0.01em;box-shadow:0 4px 14px rgba(26,122,69,0.35);">
                            Start practising now →
                          </a>
                        </td>
                      </tr>
                    </table>

                    <p style="margin:0 0 6px;color:#374151;font-size:14px;line-height:1.6;">
                      If you have any questions, just reply to this email — I read every one.
                    </p>
                    <p style="margin:0;color:#374151;font-size:14px;line-height:1.6;">
                      Good luck,<br/>
                      <strong style="color:#1a7a45;">Ochife</strong><br/>
                      <span style="color:#6b7280;font-size:13px;">Founder, Nurexi</span>
                    </p>

                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- footer -->
          <tr>
            <td style="padding:24px 8px 8px;text-align:center;">
              <p style="margin:0 0 8px;color:#9ca3af;font-size:12px;line-height:1.6;">
                You're receiving this because you created a Nurexi account.<br/>
                <a href="${appUrl}/legal#privacy" style="color:#6b7280;text-decoration:underline;">Privacy Policy</a>
                &nbsp;·&nbsp;
                <a href="${appUrl}/legal#terms" style="color:#6b7280;text-decoration:underline;">Terms of Service</a>
              </p>
              <p style="margin:0;color:#d1d5db;font-size:11px;">
                © ${year} Nurexi · Nigeria
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>`;
}
