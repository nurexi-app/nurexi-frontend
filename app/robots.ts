import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/docs", "/_next/", "/auth", "/learner", "/educator"],
    },
    sitemap: "https://nurexi.com/sitemap.xml",
  };
}
