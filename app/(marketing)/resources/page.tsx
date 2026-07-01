import { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  BookOpen,
  Stethoscope,
  Briefcase,
  GraduationCap,
  Users,
  Clock,
  ArrowRight,
  Search,
} from "lucide-react";
import Image from "next/image";

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

// ─── types — matches your live schema exactly ─────────────────────────────────

interface Resource {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  cover_image_url: string | null;
  category: "study" | "clinical" | "career" | "professional" | "community";
  resource_type: "article" | "micro" | "video" | "guide";
  published_at: string;
  subject_id: number | null;
  created_by: string | null;
}

const CATEGORIES = [
  { id: "all", label: "All", icon: BookOpen },
  { id: "study", label: "Study", icon: GraduationCap },
  { id: "clinical", label: "Clinical", icon: Stethoscope },
  { id: "career", label: "Career", icon: Briefcase },
  { id: "professional", label: "Professional Dev", icon: BookOpen },
  { id: "community", label: "Community", icon: Users },
];

const TYPE_LABELS: Record<string, string> = {
  article: "Article",
  micro: "Quick Read",
  video: "Video",
  guide: "Guide",
};

const CATEGORY_LABELS: Record<string, string> = {
  study: "Study",
  clinical: "Clinical",
  career: "Career",
  professional: "Professional Dev",
  community: "Community",
};

// ─── resource card ────────────────────────────────────────────────────────────

function ResourceCard({ resource }: { resource: Resource }) {
  const formattedDate = resource.published_at
    ? new Date(resource.published_at).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : null;

  return (
    <Link
      href={`/resources/${resource.slug}`}
      className="group flex flex-col bg-card border border-border rounded-2xl overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 no-underline"
    >
      {resource.cover_image_url ? (
        <div className="h-44 relative w-full overflow-hidden">
          <Image
            src={resource.cover_image_url}
            alt={resource.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      ) : (
        <div
          className="h-16"
          style={{
            background:
              "linear-gradient(135deg, oklch(78.07% 0.117 166.71 / 0.15) 0%, oklch(78.07% 0.117 166.71 / 0.05) 100%)",
          }}
        />
      )}

      <div className="flex flex-col flex-1 p-5 gap-3">
        <div className="flex items-center gap-1.5 flex-wrap">
          <Badge
            variant="secondary"
            className="text-[10px] font-semibold rounded-full px-2 py-0.5"
          >
            {CATEGORY_LABELS[resource.category] ?? resource.category}
          </Badge>
          <Badge
            variant="outline"
            className="text-[10px] font-medium rounded-full px-2 py-0.5"
          >
            {TYPE_LABELS[resource.resource_type] ?? resource.resource_type}
          </Badge>
        </div>

        <h2 className="text-[15px] font-semibold text-foreground leading-snug line-clamp-2 group-hover:text-primary transition-colors">
          {resource.title}
        </h2>

        {resource.excerpt && (
          <p className="text-[13px] text-muted-foreground leading-relaxed line-clamp-3 flex-1">
            {resource.excerpt}
          </p>
        )}

        {formattedDate && (
          <div className="flex items-center gap-1 text-[11px] text-muted-foreground pt-2 border-t border-border/50 mt-auto">
            <Clock className="h-3 w-3" />
            {formattedDate}
          </div>
        )}
      </div>
    </Link>
  );
}

// ─── page ─────────────────────────────────────────────────────────────────────

export default async function ResourcesPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; type?: string; q?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const supabase = await createClient();
  const activeCategory = resolvedSearchParams.category ?? "all";
  const activeType = resolvedSearchParams.type ?? "all";
  const searchQuery = resolvedSearchParams.q ?? "";

  let query = supabase
    .from("resources")
    .select(
      "id, title, slug, excerpt, cover_image_url, category, resource_type, published_at, subject_id, created_by",
    )
    .eq("status", "published")
    .order("published_at", { ascending: false });

  if (activeCategory !== "all") query = query.eq("category", activeCategory);
  if (activeType !== "all") query = query.eq("resource_type", activeType);
  if (searchQuery.trim()) {
    query = query.or(
      `title.ilike.%${searchQuery}%,excerpt.ilike.%${searchQuery}%`,
    );
  }

  const { data: resources } = await query;

  return (
    <main className="min-h-screen bg-background">
      {/* ── hero ── */}
      <section
        className="border-b border-border/50 py-14 md:py-20"
        style={{
          background:
            "linear-gradient(to bottom, oklch(78.07% 0.117 166.71 / 0.07) 0%, transparent 100%)",
        }}
      >
        <div className="container max-w-5xl">
          <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground mb-5">
            <Link
              href="/"
              className="hover:text-foreground transition-colors no-underline"
            >
              Home
            </Link>
            <ArrowRight className="h-3 w-3" />
            <span className="text-foreground">Resources</span>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-3">
            Nurexi Resource Centre
          </h1>
          <p className="text-base text-muted-foreground max-w-xl leading-relaxed mb-6">
            Free nursing knowledge — study guides, clinical references, career
            tips, and professional development content for nurses at every
            stage.
          </p>

          <form method="GET" className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              name="q"
              defaultValue={searchQuery}
              placeholder="Search resources..."
              className="pl-9 h-10 rounded-xl"
            />
          </form>
        </div>
      </section>

      <div className="container max-w-5xl py-10">
        {/* category filters */}
        <div className="flex items-center gap-2 flex-wrap mb-6">
          {CATEGORIES.map(({ id, label, icon: Icon }) => {
            const isActive = activeCategory === id;
            const href =
              id === "all" ? "/resources" : `/resources?category=${id}`;
            return (
              <Link
                key={id}
                href={href}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-medium transition-all duration-150 no-underline border ${
                  isActive
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground"
                }`}
              >
                <Icon className="h-3 w-3" />
                {label}
              </Link>
            );
          })}
        </div>

        {/* type filters */}
        <div className="flex items-center gap-2 flex-wrap mb-8">
          {["all", "article", "micro", "video", "guide"].map((type) => {
            const label =
              type === "all" ? "All types" : (TYPE_LABELS[type] ?? type);
            const isActive = activeType === type;
            const params = new URLSearchParams(resolvedSearchParams as any);
            type === "all" ? params.delete("type") : params.set("type", type);
            return (
              <Link
                key={type}
                href={`/resources${params.toString() ? `?${params}` : ""}`}
                className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-all no-underline ${
                  isActive
                    ? "bg-foreground text-background"
                    : "bg-muted text-muted-foreground hover:bg-muted/70"
                }`}
              >
                {label}
              </Link>
            );
          })}
        </div>

        {!resources || resources.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-24 text-center">
            <BookOpen className="h-10 w-10 text-muted-foreground/25" />
            <p className="text-sm font-medium text-muted-foreground">
              No resources found
            </p>
            {searchQuery && (
              <p className="text-xs text-muted-foreground/70">
                Try a different search term or browse all categories.
              </p>
            )}
          </div>
        ) : (
          <>
            <p className="text-[12px] text-muted-foreground mb-5">
              {resources.length} resource{resources.length !== 1 ? "s" : ""}
              {activeCategory !== "all" &&
                ` in ${CATEGORY_LABELS[activeCategory]}`}
            </p>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {resources.map((r) => (
                <ResourceCard key={r.id} resource={r as Resource} />
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
