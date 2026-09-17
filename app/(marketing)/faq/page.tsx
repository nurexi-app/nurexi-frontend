import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/animate-ui/components/radix/accordion";

const description =
  "Find clear answers about Nurexi nursing exam preparation, practice questions, exam bundles, educator accounts, payments, and learner support.";

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description,
  alternates: { canonical: "/faq" },
  openGraph: {
    title: "Frequently Asked Questions | Nurexi",
    description,
    url: "/faq",
    siteName: "Nurexi",
    locale: "en_NG",
    type: "website",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "Nurexi nursing exam preparation",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Frequently Asked Questions | Nurexi",
    description,
    images: ["/twitter-image.png"],
  },
};

const faqs = [
  {
    category: "General Information",
    questions: [
      {
        q: "What is Nurexi?",
        a: "Nurexi is a specialized platform designed to help nursing students prepare for their exams and enable nursing educators to create, share, and monetize high-quality practice questions and courses.",
      },
      {
        q: "How is Nurexi different from other nursing prep platforms?",
        a: "Unlike traditional platforms, Nurexi offers a community-driven marketplace where verified educators can publish specialized exam bundles. This ensures a diverse, up-to-date, and highly relevant pool of questions for learners. Furthermore, learners can access specific exams with a one-time purchase rather than being locked into expensive monthly subscriptions.",
      },
      {
        q: "Who can use Nurexi?",
        a: "Nurexi is built for two main groups: Nursing students (learners) looking for rigorous exam preparation, and qualified nursing professionals (educators) who want to share their expertise and earn income.",
      },
    ],
  },
  {
    category: "For Learners (Students)",
    questions: [
      {
        q: "Are the practice exams up-to-date with current nursing standards?",
        a: "Yes. Our exams are created by verified nursing professionals and educators. We regularly review and encourage content updates to align with the latest NCLEX and general nursing guidelines.",
      },
      {
        q: "How does the pricing work? Is there a monthly subscription?",
        a: "We believe in flexible, accessible learning. Rather than a monthly subscription, Nurexi allows you to make one-time purchases for specific exam bundles or courses. Once purchased, you get lifetime access to that content.",
      },
      {
        q: "Can I customize my practice sessions?",
        a: "Absolutely! You can choose the specific number of questions you want to tackle in a session, allowing you to practice according to your schedule, whether you have 10 minutes or 2 hours.",
      },
      {
        q: "Do I get rationales for both correct and incorrect answers?",
        a: "Yes. Understanding the 'why' is crucial in nursing. Every question comes with detailed rationales for all options to help you understand the core concepts behind the correct answer.",
      },
      {
        q: "Can I access my exams on mobile devices?",
        a: "Nurexi is fully responsive and optimized for all devices. You can practice on your phone, tablet, or desktop computer seamlessly.",
      },
    ],
  },
  {
    category: "For Educators",
    questions: [
      {
        q: "How can I become an educator on Nurexi?",
        a: "You can sign up as an educator and complete our verification process. This typically involves submitting your nursing credentials (like a government ID and nursing license) for our team to review and approve.",
      },
      {
        q: "How do I get paid for the content I create?",
        a: "Educators earn money every time a learner purchases their exam bundles. We handle the payment processing, and your earnings are directly credited to your educator wallet, which you can withdraw to your bank account.",
      },
      {
        q: "What kind of content can I upload?",
        a: "You can create comprehensive exams consisting of multiple-choice, select-all-that-apply (SATA), and true/false questions. You can group these exams into thematic bundles for learners to purchase.",
      },
      {
        q: "Is there a review process for the exams I create?",
        a: "While educators have the freedom to publish, we maintain a community-reporting and internal audit system to ensure all content meets our high standards for accuracy and quality.",
      },
    ],
  },
  {
    category: "Account & Support",
    questions: [
      {
        q: "How do I reset my password?",
        a: "You can reset your password by clicking the 'Forgot Password' link on the login page. We'll send a secure reset link to your registered email address.",
      },
      {
        q: "Can I delete my account?",
        a: "Yes, you can request account deletion from your account settings. Please note that this action is irreversible and you will lose access to all purchased content.",
      },
      {
        q: "What should I do if I find an error in a question?",
        a: "We value accuracy! Each question has a reporting feature. If you spot an error, please report it, and our review team will address it promptly.",
      },
      {
        q: "How fast is customer support?",
        a: "We typically respond to all support inquiries within 24 hours. You can reach us via email or WhatsApp as detailed on our Contact Us page.",
      },
    ],
  },
];

const faqStructuredData = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.flatMap((group) =>
    group.questions.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  ),
};

export default function FAQPage() {
  return (
    <>
      <JsonLd data={faqStructuredData} />
      <main className="min-h-screen bg-background text-foreground">
      <section className="mx-auto max-w-[1440px] px-6 pb-16 pt-20 sm:px-10 sm:pb-20 sm:pt-28 lg:px-16 lg:pt-32">
        <div className="max-w-[850px]">
          <p className="mb-7 text-xs font-bold uppercase tracking-[0.23em] text-accent">Helpful answers</p>
          <h1 className="text-[clamp(3.2rem,6vw,6.5rem)] font-semibold leading-[1.02] tracking-[-0.06em]">
            Questions, answered clearly.
          </h1>
          <p className="mt-8 max-w-[650px] text-lg leading-relaxed text-muted-foreground sm:text-xl">
            Find what you need to know about learning, exam preparation, educator accounts, and support.
          </p>
        </div>
        <nav aria-label="FAQ topics" className="mt-12 flex flex-wrap gap-2">
          {faqs.map((group, index) => (
            <a
              key={group.category}
              href={`#topic-${index}`}
              className="inline-flex min-h-11 items-center rounded-full border border-border bg-card px-5 text-sm font-medium text-foreground transition-colors hover:border-accent hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {group.category}
            </a>
          ))}
        </nav>
      </section>

      <section className="border-t border-border bg-secondary/45">
        <div className="mx-auto max-w-[1440px] px-6 py-16 sm:px-10 sm:py-20 lg:px-16 lg:py-24">
          <div className="max-w-[980px] space-y-16 lg:space-y-20">
            {faqs.map((group, index) => (
              <section key={group.category} id={`topic-${index}`} className="scroll-mt-24 lg:grid lg:grid-cols-[0.38fr_0.62fr] lg:gap-12">
                <h2 className="mb-7 text-2xl font-semibold tracking-tight lg:mb-0">{group.category}</h2>
                <Accordion type="single" collapsible className="border-t border-border">
                  {group.questions.map((faq, questionIndex) => (
                    <AccordionItem key={faq.q} value={`question-${index}-${questionIndex}`} className="border-border">
                      <AccordionTrigger className="py-6 text-left text-base font-semibold leading-snug text-foreground hover:text-accent hover:no-underline sm:text-lg">
                        {faq.q}
                      </AccordionTrigger>
                      <AccordionContent className="pb-6 text-base leading-relaxed text-muted-foreground">
                        {faq.a}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </section>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-primary text-primary-foreground">
        <div className="mx-auto grid max-w-[1440px] gap-8 px-6 py-20 sm:px-10 sm:py-24 lg:grid-cols-[1fr_auto] lg:items-center lg:px-16">
          <div className="max-w-[650px]">
            <p className="mb-5 text-xs font-bold uppercase tracking-[0.23em] text-primary-foreground/70">Still need help?</p>
            <h2 className="text-[clamp(2.4rem,4vw,4rem)] font-semibold leading-[1.1] tracking-[-0.05em]">We&apos;re here to help you find an answer.</h2>
          </div>
          <Link href="/contact" className="arrow-link inline-flex min-h-12 w-fit items-center justify-center gap-2 rounded-full bg-primary-foreground px-6 font-semibold text-primary transition-colors hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-primary">
            Contact Nurexi <ArrowRight aria-hidden="true" data-link-arrow="forward" className="size-4" />
          </Link>
        </div>
      </section>
      </main>
    </>
  );
}
