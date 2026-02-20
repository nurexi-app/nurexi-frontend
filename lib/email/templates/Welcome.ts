export function welcomeEmail({
  firstName,
  appUrl,
}: {
  firstName: string;
  appUrl: string;
}) {
  return `
  <div style="font-family: Arial, sans-serif; line-height: 1.6;">
    <h2>Welcome to Nurexi 👋</h2>

    <p>Hi ${firstName || "there"},</p>

    <p>
      I’m really glad you joined <strong>Nurexi</strong>.
      We’re building this platform to help nurses learn smarter,
      prepare better, and grow with confidence.
    </p>

    <p>
      <a href="${appUrl}/welcome"
         style="
           display: inline-block;
           padding: 12px 18px;
           background: #0ea5e9;
           color: white;
           text-decoration: none;
           border-radius: 6px;
         ">
        Go to your dashboard
      </a>
    </p>

    <p>
      If you ever have feedback or questions, just reply to this email.
    </p>

    <p>
      — Ochife<br/>
      Founder, Nurexi
    </p>
  </div>
  `;
}
