"use client";

import { FormEvent, useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { subscribeToNewsletter } from "@/lib/actions/newsletter-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type SubmissionState =
  | { status: "idle"; message: "" }
  | { status: "error" | "success"; message: string };

export default function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [submission, setSubmission] = useState<SubmissionState>({
    status: "idle",
    message: "",
  });

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsPending(true);
    setSubmission({ status: "idle", message: "" });

    const result = await subscribeToNewsletter(email, firstName);

    if (result.success) {
      setSubmission({ status: "success", message: result.message });
      setEmail("");
      setFirstName("");
    } else {
      setSubmission({ status: "error", message: result.error });
    }

    setIsPending(false);
  }

  return (
    <section
      className="border-t border-border bg-secondary/55"
      aria-labelledby="newsletter-heading"
    >
      <div className="mx-auto grid max-w-360 gap-10 px-6 py-20 sm:px-10 sm:py-24 lg:grid-cols-[0.9fr_1.1fr] lg:items-end lg:gap-20 lg:px-16 lg:py-28">
        <div className="max-w-145">
          <p className="mb-5 text-xs font-bold uppercase tracking-[0.23em] text-accent">
            Notes for your nursing journey
          </p>
          <h2
            id="newsletter-heading"
            className="text-[clamp(2.4rem,4vw,4.25rem)] font-semibold leading-[1.08] tracking-[-0.05em]"
          >
            Useful ideas, sent with purpose.
          </h2>
          <p className="mt-6 max-w-125 text-base leading-relaxed text-muted-foreground sm:text-lg">
            Receive practical study guidance, new nursing resources, and Nurexi
            product updates. No crowded inbox.
          </p>
        </div>

        <div className="rounded-[1.75rem] border border-border bg-card p-6 sm:p-8">
          {submission.status === "success" ? (
            <div
              className="flex min-h-45 flex-col items-start justify-center"
              role="status"
            >
              <CheckCircle2
                aria-hidden="true"
                className="size-10 text-accent"
              />
              <h3 className="mt-5 text-2xl font-semibold">
                You&apos;re on the list.
              </h3>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                {submission.message}
              </p>
              <button
                type="button"
                className="mt-6 min-h-11 font-semibold text-accent underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4"
                onClick={() => setSubmission({ status: "idle", message: "" })}
              >
                Add another email
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <label
                  className="grid gap-2 text-sm font-semibold"
                  htmlFor="newsletter-first-name"
                >
                  First name{" "}
                  <span className="font-normal text-muted-foreground">
                    (optional)
                  </span>
                  <Input
                    id="newsletter-first-name"
                    name="firstName"
                    autoComplete="given-name"
                    maxLength={80}
                    value={firstName}
                    onChange={(event) => setFirstName(event.target.value)}
                    className="h-12 bg-background"
                  />
                </label>
                <label
                  className="grid gap-2 text-sm font-semibold"
                  htmlFor="newsletter-email"
                >
                  Email address
                  <Input
                    id="newsletter-email"
                    name="email"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    maxLength={254}
                    required
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="h-12 bg-background"
                  />
                </label>
              </div>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="max-w-85 text-xs leading-relaxed text-muted-foreground">
                  Unsubscribe at any time. We only send updates related to
                  Nurexi and nursing education.
                </p>
                <Button
                  type="submit"
                  size="lg"
                  disabled={isPending}
                  className="h-12 shrink-0 rounded-full px-7"
                >
                  {isPending && (
                    <Loader2 aria-hidden="true" className="animate-spin" />
                  )}
                  {isPending ? "Joining…" : "Join the newsletter"}
                </Button>
              </div>
              <p
                className={
                  submission.status === "error"
                    ? "text-sm text-destructive"
                    : "sr-only"
                }
                role="status"
                aria-live="polite"
              >
                {submission.message}
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
