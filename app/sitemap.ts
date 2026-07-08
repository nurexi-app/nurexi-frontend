import { createClient } from "@/lib/supabase/server";
import { MetadataRoute } from "next";
const siteUrl = "https://nurexi.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient();
  const { data: resources } = await supabase
    .from("resources")
    .select("slug, updated_at")
    .eq("status", "published");

  const resourceRoutes = (resources ?? []).map((r) => ({
    url: `${siteUrl}/resources/${r.slug}`,
    lastModified: new Date(r.updated_at),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const staticRoutes = [
    {
      url: siteUrl,
      lastModified: new Date(),
      priority: 1,
    },
    {
      url: `${siteUrl}/verify-payment`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.5,
    },
    {
      url: `${siteUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.5,
    },
    {
      url: `${siteUrl}/faq`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    },
    {
      url: `${siteUrl}/policies`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.3,
    },
    {
      url: `${siteUrl}/resources`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    },
  ];

  return [...staticRoutes, ...resourceRoutes];
}
