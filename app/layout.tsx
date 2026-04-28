import { Geist, Outfit } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { rootMetadata } from "@/lib/exports/metadata";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { GoogleAnalytics } from "@next/third-parties/google";
import StoreProvider from "@/context/StoreProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata = rootMetadata;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID!} />
      <Analytics />
      <SpeedInsights />
      <body className={`${geistSans.variable} ${outfit.variable} antialiased`}>
        <Toaster
          richColors
          closeButton
          toastOptions={{
            classNames: {
              toast: "border bg-background text-foreground shadow-lg",
              success: "border-green-500/30 bg-green-500/10 text-green-600",
              error: "border-red-500/30 bg-red-500/10 text-red-600",
              warning: "border-yellow-500/30 bg-yellow-500/10 text-yellow-600",
              info: "border-blue-500/30 bg-blue-500/10 text-blue-600",
            },
          }}
        />
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
}
