import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/api/",
        "/docs",
        "/_next/",
        "/auth",
        "/learner",
        "/educator",
        "/cart",
        "/checkout",
        "/payment/",
        "/verify-payment",
        "/test-home",
      ],
    },
    sitemap: "https://nurexi.com/sitemap.xml",
  };
}
