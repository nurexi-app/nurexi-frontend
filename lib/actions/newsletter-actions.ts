"use server";

import { resend } from "../email/resend";

export async function subscribeToNewsletter(email: string, firstName?: string) {
  try {
    // Create contact in Resend (global contact, no segment yet)
    const { data: contact, error: contactError } = await resend.contacts.create(
      {
        email,
        firstName: firstName || undefined,
        unsubscribed: false,
      },
    );

    if (contactError) {
      return {
        success: false,
        error: "Failed to subscribe. Please try again.",
      };
    }

    // Add contact to your segment
    const segmentId = process.env.RESEND_SEGMENT_ID;

    if (segmentId && contact?.id) {
      await resend.contacts.segments.add({
        contactId: contact.id,
        segmentId: segmentId,
      });
    }

    return {
      success: true,
      message: "Thanks for subscribing! Check your email for confirmation.",
    };
  } catch (error) {
    console.error("Newsletter error:", error);
    return { success: false, error: "Something went wrong. Please try again." };
  }
}
