import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Mail, MessageCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact Nurexi",
  description: "Get in touch with the Nurexi team about nursing education, exam preparation, or account support.",
};

const contactMethods = [
  {
    title: "Email our team",
    description: "A good place for account questions, detailed support requests, and partnership enquiries.",
    detail: "support@mails.nurexi.com",
    href: "mailto:support@mails.nurexi.com",
    action: "Send an email",
    icon: Mail,
    external: false,
  },
  {
    title: "Chat on WhatsApp",
    description: "For a quick question when you would rather start a conversation on your phone.",
    detail: "+234 902 251 7371",
    href: "https://wa.me/2349022517371",
    action: "Open WhatsApp",
    icon: MessageCircle,
    external: true,
  },
];

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="mx-auto max-w-[1440px] px-6 pb-20 pt-20 sm:px-10 sm:pb-28 sm:pt-28 lg:px-16 lg:pb-32 lg:pt-32">
        <div className="max-w-[850px]">
          <p className="mb-7 text-xs font-bold uppercase tracking-[0.23em] text-accent">Contact Nurexi</p>
          <h1 className="text-[clamp(3.2rem,6vw,6.5rem)] font-semibold leading-[1.02] tracking-[-0.06em]">
            A real conversation starts here.
          </h1>
          <p className="mt-8 max-w-[650px] text-lg leading-relaxed text-muted-foreground sm:text-xl">
            Have a question about your learning, an exam preparation option, or your account? Choose the way you would like to reach us.
          </p>
        </div>
      </section>

      <section className="bg-secondary">
        <div className="mx-auto max-w-[1440px] px-6 py-20 sm:px-10 sm:py-24 lg:px-16 lg:py-28">
          <div className="grid gap-6 lg:grid-cols-2">
            {contactMethods.map(({ title, description, detail, href, action, icon: Icon, external }) => (
              <article key={title} className="flex flex-col rounded-[1.75rem] border border-border bg-card p-7 sm:p-10">
                <span className="flex size-12 items-center justify-center rounded-full bg-secondary text-accent">
                  <Icon aria-hidden="true" className="size-6" strokeWidth={1.7} />
                </span>
                <h2 className="mt-9 text-3xl font-semibold tracking-tight">{title}</h2>
                <p className="mt-4 max-w-[420px] flex-1 text-base leading-relaxed text-muted-foreground">{description}</p>
                <p className="mt-8 break-all text-sm font-medium text-foreground sm:text-base">{detail}</p>
                <a
                  href={href}
                  target={external ? "_blank" : undefined}
                  rel={external ? "noopener noreferrer" : undefined}
                  className="arrow-link mt-5 inline-flex min-h-12 w-fit items-center gap-2 rounded-full bg-primary px-6 font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  {action} <ArrowRight aria-hidden="true" data-link-arrow="forward" className="size-4" />
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-[1440px] gap-6 px-6 py-20 sm:px-10 sm:py-24 lg:grid-cols-[1fr_auto] lg:items-center lg:gap-12 lg:px-16">
        <div className="max-w-[700px]">
          <p className="mb-5 text-xs font-bold uppercase tracking-[0.23em] text-accent">Before you write</p>
          <h2 className="text-[clamp(2.3rem,4vw,4rem)] font-semibold leading-[1.1] tracking-[-0.05em]">Your answer may already be here.</h2>
          <p className="mt-5 text-lg leading-relaxed text-muted-foreground">Find quick answers to common questions about Nurexi, learning, purchases, and account access.</p>
        </div>
        <Link href="/faq" className="arrow-link inline-flex min-h-12 w-fit items-center gap-2 border-b border-primary font-semibold text-foreground transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
          Read frequently asked questions <ArrowRight aria-hidden="true" data-link-arrow="forward" className="size-5" />
        </Link>
      </section>
    </main>
  );
}
