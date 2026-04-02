import { Metadata } from "next";

export const rootMetadata: Metadata = {
  title: {
    default:
      "Nurexi - Nigeria's #1 Nursing Education & Exam Preparation Platform",
    template: "%s | Nurexi",
  },
  description:
    "Empowering nursing students across Nigeria to excel in NMCN, NCLEX, and nursing school exams. Practice with realistic mock exams, personalized feedback, and curriculum-aligned question banks. Coming soon: Educator courses and community learning.",

  openGraph: {
    title:
      "Nurexi - Nigeria's #1 Nursing Education & Exam Preparation Platform",
    description:
      "Empowering nursing students across Nigeria to excel in nursing licensing exams. Practice with realistic mock exams, personalized feedback, and curriculum-aligned question banks. Study smarter, perform better, and confidently achieve licensure.",
    url: "https://nurexi.com",
    siteName: "Nurexi",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Nurexi - Transform your nursing education journey",
      },
    ],
    locale: "en_NG",
    type: "website",
  },

  // Twitter
  twitter: {
    card: "summary_large_image",
    title:
      "Nurexi - Nigeria's #1 Nursing Education & Exam Preparation Platform",
    description:
      "Empowering nursing students across Nigeria to excel in nursing licensing exams. Practice with realistic mock exams, personalized feedback, and curriculum-aligned question banks.",
    images: ["/twitter-image.png"],
    creator: "@nurexi",
    site: "@nurexi",
  },

  // Icons
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },

  verification: {
    google: "your-google-verification-code",
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  alternates: {
    canonical: "https://nurexi.com",
  },

  keywords: [
    "nursing education Nigeria",
    "NMCN exam preparation",
    "NCLEX preparation",
    "nursing licensing exam",
    "nursing mock exams",
    "nursing past questions",
    "nursing students Nigeria",
    "nursing school study tool",
    "nursing board exam prep",
    "nursing study platform",
    "healthcare education Nigeria",
    "nursing exam practice",
  ],

  authors: [{ name: "Ochife Ogechukwu", url: "https://nurexi.com" }],
  creator: "Ochife Ogechukwu",
  publisher: "Nurexi",

  category: "education",

  appleWebApp: {
    title: "Nurexi",
    statusBarStyle: "black-translucent",
    capable: true,
  },
};

export const dashboardMetadata: Metadata = {
  title: "Dashboard",
  description:
    "Track your nursing exam progress, view your performance stats, and continue your preparation journey. Monitor your streak, weekly practice, and topic mastery.",
};
