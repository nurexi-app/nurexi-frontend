import type { Metadata } from "next";

const siteDescription =
  "Prepare for nursing exams with focused CBT practice, clear rationales, exam prep bundles, and free nursing resources from Nurexi.";

export const rootMetadata: Metadata = {
  metadataBase: new URL("https://nurexi.com"),
  title: {
    default: "Nurexi | Nursing Exam Preparation and CBT Practice",
    template: "%s | Nurexi",
  },
  description: siteDescription,
  applicationName: "Nurexi",
  alternates: { canonical: "/" },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Nurexi",
  },
  formatDetection: { telephone: false },
  openGraph: {
    title: "Nurexi | Nursing Exam Preparation and CBT Practice",
    description: siteDescription,
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
    description: siteDescription,
    images: ["/twitter-image.png"],
    creator: "@nurexiForNurses",
  },
  icons: {
    icon: "/icons/icon-192x192.png",
    apple: "/icons/icon-192x192.png",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  keywords: [
    "nursing exam preparation",
    "NMCN CBT practice",
    "nursing practice questions",
    "nursing mock exams",
    "nursing students Nigeria",
    "NCLEX practice",
    "nursing study resources",
  ],
  authors: [{ name: "Nurexi", url: "https://nurexi.com" }],
  creator: "Nurexi",
  publisher: "Nurexi",
  category: "education",
};

export const dashboardMetadata: Metadata = {
  title: "Learner Dashboard",
  description:
    "Track your nursing exam progress, review performance, and continue your Nurexi preparation.",
};
