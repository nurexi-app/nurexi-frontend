import type { Metadata } from "next";
import {
  TestimonialSection,
  type MarketingTestimonial,
} from "@/components/marketing/TestimonialSection";
import Hero from "@/components/home/Hero";
import Path from "@/components/home/Path";
import GoBeyond from "@/components/home/GoBeyond";
import NextStep from "@/components/home/NextStep";
import Faq from "@/components/home/Faq";
import Quiz from "@/components/home/Quiz";
import NewsletterSignup from "@/components/_sections/NewsletterSignUp";
import { JsonLd } from "@/components/seo/JsonLd";

const description =
  "Prepare for nursing exams with focused practice questions, clear rationales, exam prep bundles, and free nursing resources from Nurexi.";

export const metadata: Metadata = {
  title: { absolute: "Nurexi | Nursing Exam Preparation and CBT Practice" },
  description,
  alternates: { canonical: "/" },
  openGraph: {
    title: "Nurexi | Nursing Exam Preparation and CBT Practice",
    description,
    url: "/",
    siteName: "Nurexi",
    locale: "en_NG",
    type: "website",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "A nursing learner preparing with Nurexi",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Nurexi | Nursing Exam Preparation and CBT Practice",
    description,
    images: ["/twitter-image.png"],
  },
};

const homeStructuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://nurexi.com/#organization",
      name: "Nurexi",
      url: "https://nurexi.com",
      logo: "https://nurexi.com/icons/icon-512x512.png",
      description,
    },
    {
      "@type": "WebSite",
      "@id": "https://nurexi.com/#website",
      url: "https://nurexi.com",
      name: "Nurexi",
      description,
      publisher: { "@id": "https://nurexi.com/#organization" },
      inLanguage: "en-NG",
    },
  ],
};

const previewTestimonials: MarketingTestimonial[] = [
  {
    id: "preview-1",
    display_name: "Ike Buchi",
    content:
      "I love the practice questions on Nurexi. The explanations are clear and easy to understand.",
    role: "Student",
    rating: 5,
    avatar_url: null,
  },
  {
    id: "preview-2",
    display_name: "Chioma Adebayo",
    content:
      "The mock tests helped me practise under pressure and build confidence before my exam.",
    role: "Nursing student",
    rating: 5,
    avatar_url: null,
  },
];

export default function HomePage() {
  return (
    <>
      <JsonLd data={homeStructuredData} />
      <main className="overflow-hidden bg-background text-foreground">
        <Hero />

        <Path />

        <GoBeyond />

        <Quiz />

        <TestimonialSection testimonials={previewTestimonials} />

        <NextStep />
        <Faq />
        <NewsletterSignup />
      </main>
    </>
  );
}
