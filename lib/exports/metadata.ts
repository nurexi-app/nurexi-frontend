import { Metadata } from "next";

export const rootMetadata: Metadata = {
  title: {
    default: "Nurexi | Nigeria's #1 NMCN CBT Practice & Exam Prep Platform",
    template: "%s | Nurexi",
  },
  description:
    "Pass your NMCN Professional Qualifying Exam on the first attempt. Practice with realistic CBT mock exams, real nursing past questions, detailed rationales, and NCLEX prep.",
  metadataBase: new URL("https://nurexi.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Nurexi | Nigeria's #1 NMCN CBT Practice & Exam Prep Platform",
    description:
      "Pass your NMCN Professional Qualifying Exam on your first attempt. Access timed CBT mock exams, real nursing past questions, and smart performance analytics tailored for Nigerian nursing students.",
    url: "https://nurexi.com",
    siteName: "Nurexi",
    locale: "en_NG",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nurexi | NMCN CBT Practice & Nursing Exam Prep",
    description:
      "Master your nursing council exams with Nurexi. Timed CBT simulations, verified past questions, and deep rationales for Nigerian nursing students.",
    images: ["/og.png"],
    creator: "@nurexiForNurses",
  },
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
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  keywords: [
    "NMCN exam preparation",
    "nursing past questions Nigeria",
    "online NMCN CBT practice",
    "nursing council exam app",
    "NCLEX preparation Nigeria",
    "nursing mock exams",
    "nursing students Nigeria",
    "basic nursing qualifying exam",
    "midwifery council past questions",
    "medical surgical nursing questions",
  ],
  authors: [
    { name: "Ochife Ogechukwu", url: "https://buildwithochife.vercel.app" },
  ],
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
  title: "Learner Dashboard",
  description:
    "Track your nursing exam progress, analyze performance stats, and master high-yield topics. Monitor your study streak and NMCN CBT test readiness.",
};
