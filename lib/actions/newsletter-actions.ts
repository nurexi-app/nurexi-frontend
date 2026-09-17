"use server";

import { resend } from "@/lib/email/resend";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function subscribeToNewsletter(email: string, firstName?: string) {
  const normalizedEmail = email.trim().toLowerCase();
  const normalizedFirstName = firstName?.trim().slice(0, 80) || undefined;

  if (
    normalizedEmail.length > 254 ||
    !EMAIL_PATTERN.test(normalizedEmail)
  ) {
    return {
      success: false as const,
      error: "Enter a valid email address.",
    };
  }

  try {
    const { data: contact, error: contactError } = await resend.contacts.create({
      email: normalizedEmail,
      firstName: normalizedFirstName,
      unsubscribed: false,
    });

    if (contactError) {
      console.error("Newsletter contact creation failed", contactError.name);
      return {
        success: false as const,
        error: "We could not add you right now. Please try again.",
      };
    }

    const segmentId = process.env.RESEND_SEGMENT_ID;

    if (segmentId && contact?.id) {
      const { error: segmentError } = await resend.contacts.segments.add({
        contactId: contact.id,
        segmentId,
      });

      if (segmentError) {
        console.error("Newsletter segment assignment failed", segmentError.name);
      }
    }

    return {
      success: true as const,
      message: "Thanks for subscribing. We’ll send the next useful update to your inbox.",
    };
  } catch (error) {
    console.error(
      "Newsletter subscription failed",
      error instanceof Error ? error.name : "UnknownError",
    );
    return {
      success: false as const,
      error: "Something went wrong. Please try again.",
    };
  }
}
