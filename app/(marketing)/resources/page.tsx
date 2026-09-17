import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen, Search } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { ResourceCoverImage } from "@/components/marketing/ResourceCoverImage";

export const metadata: Metadata = {
  title: "Resource Centre | Nurexi",
  description:
    "Free nursing resources — study guides, clinical references, career tips, and professional development content for nurses in Nigeria and beyond.",
  openGraph: {
    title: "Nurexi Resource Centre",
    description:
      "Free nursing knowledge hub for student nurses, licensed nurses, and educators.",
    url: "https://nurexi.com/resources",
    type: "website",
  },
};

interface Resource {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  cover_image_url: string | null;
  category: "study" | "clinical" | "career" | "professional" | "community";
  resource_type: "article" | "micro" | "video" | "guide";
  published_at: string | null;
}

const categories = [
  { id: "all", label: "All resources" },
  { id: "study", label: "Study" },
  { id: "clinical", label: "Clinical" },
  { id: "career", label: "Career" },
  { id: "professional", label: "Professional development" },
  { id: "community", label: "Community" },
] as const;

const types = [
  { id: "all", label: "All formats" },
  { id: "article", label: "Articles" },
  { id: "micro", label: "Quick reads" },
  { id: "video", label: "Videos" },
  { id: "guide", label: "Guides" },
] as const;

const categoryLabels: Record<Resource["category"], string> = {
  study: "Study",
  clinical: "Clinical",
  career: "Career",
  professional: "Professional development",
  community: "Community",
};

const typeLabels: Record<Resource["resource_type"], string> = {
  article: "Article",
  micro: "Quick read",
  video: "Video",
  guide: "Guide",
};

function resourceHref(category: string, type: string, q: string) {
  const params = new URLSearchParams();
  if (category !== "all") params.set("category", category);
  if (type !== "all") params.set("type", type);
  if (q) params.set("q", q);
  const query = params.toString();
  return query ? `/resources?${query}` : "/resources";
}

function formatDate(date: string | null) {
  if (!date) return null;
  const parsed = new Date(date);
  return Number.isNaN(parsed.getTime())
    ? null
    : parsed.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
}

function ResourceImage({
  resource,
  featured = false,
}: {
  resource: Resource;
  featured?: boolean;
}) {
  return (
    <ResourceCoverImage
      src={resource.cover_image_url}
      alt={resource.title}
      sizes={
        featured
          ? "(max-width: 1024px) 100vw, 45vw"
          : "(max-width: 768px) 100vw, 33vw"
      }
      priority={featured}
      className={featured ? "min-h-65 lg:min-h-full" : "aspect-16/10"}
    />
  );
}

function ResourceCard({ resource }: { resource: Resource }) {
  const date = formatDate(resource.published_at);

  return (
    <article className="group flex min-w-0 flex-col overflow-hidden rounded-[1.5rem] border border-border bg-card">
      <Link
        href={`/resources/${resource.slug}`}
        className="arrow-link flex h-full flex-col focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
      >
        <ResourceImage resource={resource} />
        <div className="flex flex-1 flex-col p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">
            {categoryLabels[resource.category]} ·{" "}
            {typeLabels[resource.resource_type]}
          </p>
          <h3 className="mt-4 text-xl font-semibold leading-snug tracking-tight text-foreground transition-colors group-hover:text-accent">
            {resource.title}
          </h3>
          {resource.excerpt && (
            <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
              {resource.excerpt}
            </p>
          )}
          <div className="mt-auto flex items-center justify-between gap-3 pt-7 text-sm text-muted-foreground">
            {date && <span>{date}</span>}
            <span className="ml-auto inline-flex items-center gap-1 font-semibold text-foreground">
              Read resource <ArrowRight aria-hidden="true" data-link-arrow="forward" className="size-4" />
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}

export default async function ResourcesPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; type?: string; q?: string }>;
}) {
  const params = await searchParams;
  const category = categories.some((item) => item.id === params.category)
    ? params.category!
    : "all";
  const type = types.some((item) => item.id === params.type)
    ? params.type!
    : "all";
  const searchQuery = (params.q ?? "").trim().slice(0, 100);
  const safeSearch = searchQuery.replace(/[^\p{L}\p{N}\s-]/gu, " ").trim();
  const supabase = await createClient();

  let query = supabase
    .from("resources")
    .select(
      "id, title, slug, excerpt, cover_image_url, category, resource_type, published_at",
    )
    .eq("status", "published")
    .order("published_at", { ascending: false });

  if (category !== "all") query = query.eq("category", category);
  if (type !== "all") query = query.eq("resource_type", type);
  if (safeSearch)
    query = query.or(
      `title.ilike.%${safeSearch}%,excerpt.ilike.%${safeSearch}%`,
    );

  const { data, error } = await query;
  console.log(data);
  const resources = (data ?? []) as Resource[];
  const featured = resources[0];
  const remaining = resources.slice(1);
  const filtered = category !== "all" || type !== "all" || !!searchQuery;

  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="mx-auto max-w-[1440px] px-6 pb-16 pt-20 sm:px-10 sm:pb-20 sm:pt-28 lg:px-16 lg:pt-32">
        <div className="max-w-[850px]">
          <p className="mb-7 text-xs font-bold uppercase tracking-[0.23em] text-accent">
            Nurexi resources
          </p>
          <h1 className="text-[clamp(3.2rem,6vw,6.5rem)] font-semibold leading-[1.02] tracking-[-0.06em]">
            Good learning starts with a question.
          </h1>
          <p className="mt-8 max-w-[650px] text-lg leading-relaxed text-muted-foreground sm:text-xl">
            Explore free nursing articles, guides, and practical ideas for your
            studies and professional growth.
          </p>
        </div>
        <form
          method="GET"
          action="/resources"
          role="search"
          className="mt-10 flex max-w-[670px] flex-col gap-3 sm:flex-row"
        >
          {category !== "all" && (
            <input type="hidden" name="category" value={category} />
          )}
          {type !== "all" && <input type="hidden" name="type" value={type} />}
          <label className="relative block flex-1">
            <span className="sr-only">Search nursing resources</span>
            <Search
              aria-hidden="true"
              className="absolute left-5 top-1/2 size-5 -translate-y-1/2 text-muted-foreground"
            />
            <input
              type="search"
              name="q"
              maxLength={100}
              defaultValue={searchQuery}
              placeholder="Search nursing resources"
              className="min-h-14 w-full rounded-full border border-border bg-card pl-13 pr-5 text-base text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </label>
          <button
            type="submit"
            className="min-h-14 rounded-full bg-primary px-8 font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            Search
          </button>
        </form>
      </section>

      <section className="border-t border-border bg-secondary/35">
        <div className="mx-auto max-w-[1440px] px-6 py-16 sm:px-10 sm:py-20 lg:px-16">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.23em] text-accent">
                Browse the library
              </p>
              <h2 className="text-[clamp(2.3rem,3.7vw,3.8rem)] font-semibold leading-[1.1] tracking-[-0.05em]">
                Find what matters to you.
              </h2>
            </div>
            {filtered && (
              <Link
                href="/resources"
                className="w-fit text-sm font-semibold text-accent underline underline-offset-4"
              >
                Clear filters
              </Link>
            )}
          </div>

          <nav
            aria-label="Resource categories"
            className="mt-10 flex gap-2 overflow-x-auto pb-2"
          >
            {categories.map((item) => (
              <Link
                key={item.id}
                href={resourceHref(item.id, type, searchQuery)}
                aria-current={category === item.id ? "page" : undefined}
                className={`inline-flex min-h-11 shrink-0 items-center rounded-full border px-5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${category === item.id ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-foreground hover:border-accent hover:text-accent"}`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div
            className="mt-6 flex flex-wrap items-center gap-2"
            aria-label="Resource formats"
          >
            <span className="mr-2 text-sm font-medium text-muted-foreground">
              Format
            </span>
            {types.map((item) => (
              <Link
                key={item.id}
                href={resourceHref(category, item.id, searchQuery)}
                aria-current={type === item.id ? "page" : undefined}
                className={`inline-flex min-h-10 items-center rounded-full px-4 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${type === item.id ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:bg-secondary hover:text-foreground"}`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {error ? (
            <div
              className="mt-14 rounded-[1.5rem] border border-border bg-card p-8 sm:p-12"
              role="status"
            >
              <h3 className="text-2xl font-semibold">
                Resources are unavailable right now.
              </h3>
              <p className="mt-3 text-muted-foreground">
                Please try again in a moment.
              </p>
            </div>
          ) : resources.length === 0 ? (
            <div
              className="mt-14 rounded-[1.5rem] border border-border bg-card p-8 sm:p-12"
              role="status"
            >
              <BookOpen
                aria-hidden="true"
                className="size-10 text-accent"
                strokeWidth={1.5}
              />
              <h3 className="mt-6 text-2xl font-semibold">
                No resources match this search.
              </h3>
              <p className="mt-3 text-muted-foreground">
                Try another phrase or clear your filters to browse everything
                available.
              </p>
              <Link
                href="/resources"
                className="arrow-link mt-6 inline-flex min-h-11 items-center gap-2 font-semibold text-accent underline underline-offset-4"
              >
                Browse all resources{" "}
                <ArrowRight aria-hidden="true" data-link-arrow="forward" className="size-4" />
              </Link>
            </div>
          ) : (
            <div className="mt-14">
              <p className="mb-6 text-sm text-muted-foreground">
                {resources.length} resource{resources.length === 1 ? "" : "s"}{" "}
                found
              </p>
              {featured && (
                <article className="group overflow-hidden rounded-[1.75rem] border border-border bg-card">
                  <Link
                    href={`/resources/${featured.slug}`}
                    className="arrow-link grid focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring lg:grid-cols-[0.9fr_1.1fr]"
                  >
                    <ResourceImage resource={featured} featured />
                    <div className="flex flex-col justify-center p-7 sm:p-10 lg:p-14">
                      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">
                        Latest resource · {categoryLabels[featured.category]}
                      </p>
                      <h3 className="mt-5 text-[clamp(1.7rem,3vw,3.2rem)] font-semibold leading-[1.14] tracking-[-0.045em] transition-colors group-hover:text-accent">
                        {featured.title}
                      </h3>
                      {featured.excerpt && (
                        <p className="mt-5 line-clamp-3 text-base leading-relaxed text-muted-foreground">
                          {featured.excerpt}
                        </p>
                      )}
                      <span className="mt-8 inline-flex items-center gap-2 font-semibold text-foreground">
                        Read resource{" "}
                        <ArrowRight aria-hidden="true" data-link-arrow="forward" className="size-5" />
                      </span>
                    </div>
                  </Link>
                </article>
              )}
              {remaining.length > 0 && (
                <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                  {remaining.map((resource) => (
                    <ResourceCard key={resource.id} resource={resource} />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
