"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ChevronRight, Shield, FileText, Cookie } from "lucide-react";

// ─── types ────────────────────────────────────────────────────────────────────

interface Section {
  id: string;
  title: string;
  icon: React.ElementType;
  lastUpdated: string;
}

const SECTIONS: Section[] = [
  {
    id: "privacy",
    title: "Privacy Policy",
    icon: Shield,
    lastUpdated: "May 2026",
  },
  {
    id: "terms",
    title: "Terms of Service",
    icon: FileText,
    lastUpdated: "May 2026",
  },
  {
    id: "cookies",
    title: "Cookie Policy",
    icon: Cookie,
    lastUpdated: "May 2026",
  },
];

// ─── sticky nav ───────────────────────────────────────────────────────────────

function LegalNav({ activeId }: { activeId: string }) {
  return (
    <nav className="sticky top-20 flex flex-col gap-1">
      <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-3 px-3">
        On this page
      </p>
      {SECTIONS.map(({ id, title, icon: Icon }) => (
        <a
          key={id}
          href={`#${id}`}
          className={cn(
            "flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 no-underline",
            activeId === id
              ? "bg-primary/10 text-primary"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
          )}
        >
          <Icon className="h-3.5 w-3.5 shrink-0" />
          {title}
          {activeId === id && (
            <ChevronRight className="h-3 w-3 ml-auto text-primary" />
          )}
        </a>
      ))}
    </nav>
  );
}

// ─── section wrapper ──────────────────────────────────────────────────────────

function PolicySection({
  id,
  title,
  icon: Icon,
  lastUpdated,
  children,
}: {
  id: string;
  title: string;
  icon: React.ElementType;
  lastUpdated: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24">
      <div className="flex items-center gap-3 mb-2">
        <div
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
          style={{ background: "oklch(78.07% 0.117 166.71 / 0.1)" }}
        >
          <Icon
            className="h-4 w-4"
            style={{ color: "oklch(55% 0.117 166.71)" }}
          />
        </div>
        <div>
          <h2 className="text-xl font-bold text-foreground tracking-tight">
            {title}
          </h2>
          <p className="text-[11px] text-muted-foreground">
            Last updated: {lastUpdated}
          </p>
        </div>
      </div>

      <div
        className="mt-5 rounded-2xl border border-border/60 bg-card p-6 md:p-8 space-y-5"
        style={{ boxShadow: "0 1px 8px rgba(0,0,0,0.04)" }}
      >
        {children}
      </div>
    </section>
  );
}

// ─── prose helpers ────────────────────────────────────────────────────────────

function H3({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-[15px] font-semibold text-foreground mt-6 mb-2 first:mt-0">
      {children}
    </h3>
  );
}

function P({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-sm text-muted-foreground leading-relaxed">{children}</p>
  );
}

function UL({ children }: { children: React.ReactNode }) {
  return (
    <ul className="space-y-1.5 text-sm text-muted-foreground leading-relaxed list-none pl-0">
      {children}
    </ul>
  );
}

function LI({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2">
      <span
        className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
        style={{ background: "oklch(78.07% 0.117 166.71)" }}
      />
      <span>{children}</span>
    </li>
  );
}

function Highlight({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-medium" style={{ color: "oklch(50% 0.117 166.71)" }}>
      {children}
    </span>
  );
}

// ─── main page ────────────────────────────────────────────────────────────────

export default function LegalPage() {
  const [activeId, setActiveId] = useState("privacy");
  const observerRef = useRef<IntersectionObserver | null>(null);

  // scroll spy — highlights the nav item for whichever section is in view
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "-30% 0px -60% 0px" },
    );

    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observerRef.current?.observe(el);
    });

    return () => observerRef.current?.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* ── hero banner ── */}
      <div
        className="border-b border-border/50"
        style={{
          background:
            "linear-gradient(to bottom, oklch(78.07% 0.117 166.71 / 0.06) 0%, transparent 100%)",
        }}
      >
        <div className="container max-w-5xl py-14 md:py-20">
          <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground mb-4">
            <Link
              href="/"
              className="hover:text-foreground transition-colors no-underline"
            >
              Home
            </Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-foreground">Legal</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-3">
            Legal &amp; Policies
          </h1>
          <p className="text-base text-muted-foreground max-w-xl leading-relaxed">
            We believe in being transparent about how Nurexi works, what data we
            collect, and your rights as a user. Read through our policies below.
          </p>
        </div>
      </div>

      {/* ── body ── */}
      <div className="container max-w-5xl py-12">
        <div className="flex gap-12">
          {/* sidebar nav — hidden on mobile */}
          <aside className="hidden lg:block w-52 shrink-0">
            <LegalNav activeId={activeId} />
          </aside>

          {/* content */}
          <div className="flex-1 min-w-0 space-y-16">
            {/* ── PRIVACY POLICY ── */}
            <PolicySection
              id="privacy"
              title="Privacy Policy"
              icon={Shield}
              lastUpdated="May 2026"
            >
              <P>
                Nurexi ("we", "us", or "our") is committed to protecting your
                personal information. This Privacy Policy explains how we
                collect, use, and safeguard your data when you use our platform.
                By using Nurexi, you agree to the practices described here.
              </P>

              <H3>1. Information We Collect</H3>
              <UL>
                <LI>
                  <Highlight>Account information</Highlight> — your name and
                  email address when you register.
                </LI>
                <LI>
                  <Highlight>Exam activity</Highlight> — questions answered,
                  scores, and session progress to track your learning.
                </LI>
                <LI>
                  <Highlight>Purchase history</Highlight> — transaction records
                  when you unlock premium exam sessions via Paystack.
                </LI>
                <LI>
                  <Highlight>Usage data</Highlight> — pages visited, time spent,
                  and interactions collected via Google Analytics, Vercel
                  Analytics, and Sentry (error monitoring).
                </LI>
                <LI>
                  <Highlight>Device information</Highlight> — browser type,
                  operating system, and IP address for security and analytics
                  purposes.
                </LI>
              </UL>

              <H3>2. How We Use Your Information</H3>
              <UL>
                <LI>To create and manage your account on Nurexi.</LI>
                <LI>
                  To provide access to exam sessions you have purchased or
                  unlocked.
                </LI>
                <LI>To process payments securely through Paystack.</LI>
                <LI>
                  To monitor platform performance and fix errors via Sentry.
                </LI>
                <LI>
                  To improve the platform using anonymised analytics data.
                </LI>
                <LI>
                  To send you important account-related emails (e.g. purchase
                  confirmations).
                </LI>
              </UL>

              <H3>3. Data Sharing</H3>
              <P>
                We do not sell your personal data. We share data only with the
                following trusted third-party services that are necessary to run
                Nurexi:
              </P>
              <UL>
                <LI>
                  <Highlight>Supabase</Highlight> — database and authentication
                  infrastructure.
                </LI>
                <LI>
                  <Highlight>Paystack</Highlight> — payment processing. We do
                  not store your card details.
                </LI>
                <LI>
                  <Highlight>Google Analytics &amp; Vercel Analytics</Highlight>{" "}
                  — anonymised usage analytics.
                </LI>
                <LI>
                  <Highlight>Sentry</Highlight> — error tracking and performance
                  monitoring.
                </LI>
                <LI>
                  <Highlight>Resend</Highlight> — transactional email delivery.
                </LI>
              </UL>

              <H3>4. Data Retention</H3>
              <P>
                We retain your personal data for as long as your account is
                active. If you delete your account, your personal data is
                permanently removed from our systems within 30 days, except
                where we are required by law to retain certain records.
              </P>

              <H3>5. Your Rights (NDPR)</H3>
              <P>
                Under Nigeria's National Data Protection Regulation (NDPR), you
                have the right to:
              </P>
              <UL>
                <LI>Access the personal data we hold about you.</LI>
                <LI>Request correction of inaccurate data.</LI>
                <LI>Request deletion of your account and associated data.</LI>
                <LI>Object to certain processing of your data.</LI>
              </UL>
              <P>
                To exercise any of these rights, contact us at{" "}
                <a
                  href="mailto:legal@nurexi.com"
                  className="underline"
                  style={{ color: "oklch(55% 0.117 166.71)" }}
                >
                  legal@nurexi.com
                </a>
                .
              </P>

              <H3>6. Security</H3>
              <P>
                We use industry-standard security practices including encrypted
                connections (HTTPS), Supabase Row Level Security (RLS), and
                regular security monitoring via Sentry. No method of
                transmission over the internet is 100% secure, but we take every
                reasonable precaution to protect your data.
              </P>

              <H3>7. Contact</H3>
              <P>
                For any privacy-related questions, email us at{" "}
                <a
                  href="mailto:legal@nurexi.com"
                  className="underline"
                  style={{ color: "oklch(55% 0.117 166.71)" }}
                >
                  legal@nurexi.com
                </a>
                .
              </P>
            </PolicySection>

            {/* ── TERMS OF SERVICE ── */}
            <PolicySection
              id="terms"
              title="Terms of Service"
              icon={FileText}
              lastUpdated="May 2026"
            >
              <P>
                These Terms of Service govern your use of Nurexi. By creating an
                account or using our platform, you agree to these terms. Please
                read them carefully.
              </P>

              <H3>1. Who Can Use Nurexi</H3>
              <P>
                Nurexi is intended for nursing students, qualified nurses, and
                healthcare educators preparing for professional nursing
                examinations. You must be at least 16 years old to create an
                account.
              </P>

              <H3>2. Your Account</H3>
              <UL>
                <LI>
                  You are responsible for keeping your login credentials secure.
                </LI>
                <LI>You must not share your account with others.</LI>
                <LI>You must provide accurate information when registering.</LI>
                <LI>
                  You can delete your account at any time from your account
                  settings.
                </LI>
              </UL>

              <H3>3. Exam Content &amp; Intellectual Property</H3>
              <UL>
                <LI>
                  Questions created by{" "}
                  <Highlight>educators and super-educators</Highlight> on Nurexi
                  remain the intellectual property of Nurexi and the creating
                  educator, as agreed at the time of content submission.
                </LI>
                <LI>
                  You may not copy, reproduce, or redistribute exam questions
                  outside the platform.
                </LI>
                <LI>
                  Nurexi's branding, design, and software are owned by Nurexi
                  and may not be reused.
                </LI>
              </UL>

              <H3>4. Payments &amp; Access</H3>
              <UL>
                <LI>
                  Premium exam sessions require a one-time purchase processed
                  via Paystack.
                </LI>
                <LI>
                  Once an exam session is unlocked, access is granted to your
                  account only.
                </LI>
                <LI>
                  <Highlight>Refund policy:</Highlight> Refunds are available
                  within 24 hours of purchase if you have not attempted any
                  questions in the session. Contact{" "}
                  <a
                    href="mailto:legal@nurexi.com"
                    className="underline"
                    style={{ color: "oklch(55% 0.117 166.71)" }}
                  >
                    legal@nurexi.com
                  </a>{" "}
                  to request a refund.
                </LI>
              </UL>

              <H3>5. Acceptable Use</H3>
              <P>You agree not to:</P>
              <UL>
                <LI>
                  Use the platform to cheat in real professional examinations.
                </LI>
                <LI>Attempt to access other users' accounts or data.</LI>
                <LI>Scrape, copy, or automate requests to the platform.</LI>
                <LI>Upload or share false, harmful, or misleading content.</LI>
              </UL>

              <H3>6. Account Suspension</H3>
              <P>
                We reserve the right to suspend or terminate accounts that
                violate these terms, abuse the platform, or engage in fraudulent
                activity. We will notify you by email before taking action where
                possible.
              </P>

              <H3>7. Disclaimer</H3>
              <P>
                Nurexi is a study aid platform. We do not guarantee that using
                Nurexi will result in passing any professional examination. Exam
                content is provided for educational purposes only and should not
                replace official study materials or professional guidance.
              </P>

              <H3>8. Governing Law</H3>
              <P>
                These terms are governed by the laws of the Federal Republic of
                Nigeria. Any disputes shall be resolved in Nigerian courts.
              </P>

              <H3>9. Changes to These Terms</H3>
              <P>
                We may update these terms from time to time. We will notify you
                by email of any significant changes. Continued use of Nurexi
                after changes constitutes acceptance of the updated terms.
              </P>

              <H3>10. Contact</H3>
              <P>
                Questions about these terms? Email{" "}
                <a
                  href="mailto:legal@nurexi.com"
                  className="underline"
                  style={{ color: "oklch(55% 0.117 166.71)" }}
                >
                  legal@nurexi.com
                </a>
                .
              </P>
            </PolicySection>

            {/* ── COOKIE POLICY ── */}
            <PolicySection
              id="cookies"
              title="Cookie Policy"
              icon={Cookie}
              lastUpdated="May 2026"
            >
              <P>
                This Cookie Policy explains how Nurexi uses cookies and similar
                technologies. By using our platform, you consent to the use of
                cookies as described here.
              </P>

              <H3>1. What Are Cookies</H3>
              <P>
                Cookies are small text files stored on your device when you
                visit a website. They help the site remember your preferences
                and understand how you use it.
              </P>

              <H3>2. Cookies We Use</H3>

              <div className="space-y-3 mt-1">
                {[
                  {
                    name: "Authentication cookies",
                    provider: "Supabase",
                    purpose:
                      "Keep you logged in between sessions. These are strictly necessary — the platform cannot function without them.",
                    type: "Strictly necessary",
                    color: "oklch(78.07% 0.117 166.71 / 0.1)",
                    textColor: "oklch(42% 0.117 166.71)",
                  },
                  {
                    name: "Analytics cookies",
                    provider: "Google Analytics, Vercel Analytics",
                    purpose:
                      "Collect anonymised data about how users navigate Nurexi so we can improve the experience. No personally identifiable information is shared.",
                    type: "Analytics",
                    color: "oklch(78% 0.15 240 / 0.08)",
                    textColor: "oklch(42% 0.15 240)",
                  },
                  {
                    name: "Error monitoring",
                    provider: "Sentry",
                    purpose:
                      "Track application errors and performance issues. Data is anonymised and used only for debugging.",
                    type: "Functional",
                    color: "oklch(78% 0.15 30 / 0.08)",
                    textColor: "oklch(42% 0.15 30)",
                  },
                ].map((cookie) => (
                  <div
                    key={cookie.name}
                    className="rounded-xl border border-border/50 p-4"
                    style={{ background: cookie.color }}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <span className="text-[13px] font-semibold text-foreground">
                        {cookie.name}
                      </span>
                      <span
                        className="text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0"
                        style={{
                          background: cookie.color,
                          color: cookie.textColor,
                          border: `1px solid ${cookie.textColor}30`,
                        }}
                      >
                        {cookie.type}
                      </span>
                    </div>
                    <p className="text-[11px] text-muted-foreground mb-1">
                      <span className="font-medium text-foreground">
                        Provider:
                      </span>{" "}
                      {cookie.provider}
                    </p>
                    <p className="text-[12px] text-muted-foreground leading-relaxed">
                      {cookie.purpose}
                    </p>
                  </div>
                ))}
              </div>

              <H3>3. Managing Cookies</H3>
              <P>
                You can control cookies through your browser settings. Note that
                disabling authentication cookies will prevent you from logging
                in to Nurexi. Analytics cookies can be disabled without
                affecting platform functionality.
              </P>
              <UL>
                <LI>
                  <a
                    href="https://support.google.com/chrome/answer/95647"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline"
                    style={{ color: "oklch(55% 0.117 166.71)" }}
                  >
                    Chrome cookie settings
                  </a>
                </LI>
                <LI>
                  <a
                    href="https://support.mozilla.org/en-US/kb/cookies-information-websites-store-on-your-computer"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline"
                    style={{ color: "oklch(55% 0.117 166.71)" }}
                  >
                    Firefox cookie settings
                  </a>
                </LI>
                <LI>
                  <a
                    href="https://support.apple.com/en-gb/guide/safari/sfri11471/mac"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline"
                    style={{ color: "oklch(55% 0.117 166.71)" }}
                  >
                    Safari cookie settings
                  </a>
                </LI>
              </UL>

              <H3>4. Google Analytics Opt-out</H3>
              <P>
                You can opt out of Google Analytics tracking across all websites
                by installing the{" "}
                <a
                  href="https://tools.google.com/dlpage/gaoptout"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                  style={{ color: "oklch(55% 0.117 166.71)" }}
                >
                  Google Analytics Opt-out Browser Add-on
                </a>
                .
              </P>

              <H3>5. Changes to This Policy</H3>
              <P>
                We may update this Cookie Policy as we add new features or
                services. We will notify you of significant changes via email or
                a notice on the platform.
              </P>

              <H3>6. Contact</H3>
              <P>
                Questions about cookies? Email{" "}
                <a
                  href="mailto:legal@nurexi.com"
                  className="underline"
                  style={{ color: "oklch(55% 0.117 166.71)" }}
                >
                  legal@nurexi.com
                </a>
                .
              </P>
            </PolicySection>

            {/* ── footer note ── */}
            <div className="rounded-2xl border border-border/50 bg-muted/30 p-6 text-center">
              <p className="text-sm text-muted-foreground">
                Have questions about any of our policies?{" "}
                <a
                  href="mailto:legal@nurexi.com"
                  className="font-medium underline"
                  style={{ color: "oklch(55% 0.117 166.71)" }}
                >
                  Contact us at legal@nurexi.com
                </a>
              </p>
              <p className="text-[11px] text-muted-foreground/60 mt-2">
                Nurexi · Nigeria · These policies were last reviewed January
                2025
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
