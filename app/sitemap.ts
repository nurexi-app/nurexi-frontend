import { MetadataRoute } from "next";
const siteUrl = "https://nurexi.com";
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: siteUrl,
      lastModified: new Date(),
      priority: 1,
    },
  ];
}
