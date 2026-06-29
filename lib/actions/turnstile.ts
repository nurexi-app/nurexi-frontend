"use server";

export async function verifyTurnstileToken(
  token: string | undefined | null,
): Promise<boolean> {
  if (!token) return false;

  try {
    const verifyResponse = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          secret: process.env.TURNSTILE_SECRET_KEY,
          response: token,
        }),
      },
    );

    const outcome = await verifyResponse.json();

    return !!outcome.success;
  } catch (error) {
    return false;
  }
}
