import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createClient as createPublicClient } from "@/lib/supabase/client";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  Clock,
  Globe,
  Instagram,
  Twitter,
  Youtube,
  Linkedin,
  Link as LinkIcon,
  ArrowLeft,
} from "lucide-react";
import { extractHeadings } from "@/lib/utils";
import OnThisPage from "@/components/web/Onthispage";
import ResourceContent from "@/components/web/ResourceContent";
import nursingBlog from "@/public/assets/nursingblog.jpg";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// ─── types matching your live schema ──────────────────────────────────────────

interface CreatorLink {
  label: string;
  url: string;
  icon: string;
}

interface ResourceDetail {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: any;
  cover_image_url: string | null;
  category: string;
  resource_type: string;
  published_at: string | null;
  creator_links: CreatorLink[];
  created_by: string | null;
  subject_id: number | null;
  // joined fields from profiles
  author_name?: string | null;
  author_avatar?: string | null;
}

const LINK_ICONS: Record<string, React.ElementType> = {
  globe: Globe,
  instagram: Instagram,
  twitter: Twitter,
  youtube: Youtube,
  linkedin: Linkedin,
  link: LinkIcon,
};

const CATEGORY_LABELS: Record<string, string> = {
  study: "Study Resources",
  clinical: "Clinical Resources",
  career: "Career Resources",
  professional: "Professional Development",
  community: "Community Resources",
};

const TYPE_LABELS: Record<string, string> = {
  article: "Article",
  micro: "Quick Read",
  video: "Video",
  guide: "Guide",
};

// ─── data fetch helper — joins profiles manually

async function getResource(slug: string) {
  const supabase = await createClient();

  const { data: resource, error } = await supabase
    .from("resources")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (!resource || error) return null;

  // fetch author separately
  let author_name: string | null = null;
  let author_avatar: string | null = null;

  if (resource.created_by) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name, avatar_url")
      .eq("id", resource.created_by)
      .single();

    author_name = profile?.full_name ?? null;
    author_avatar = profile?.avatar_url ?? null;
  }

  return { ...resource, author_name, author_avatar } as ResourceDetail;
}

// ─── metadata ──────────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const resource = await getResource(slug);
  if (!resource) return { title: "Resource Not Found " };

  const coverImage = resource.cover_image_url || nursingBlog;
  return {
    metadataBase: new URL("https://nurexi.com"),

    title: `${resource.title}`,
    description: resource.excerpt || resource.title,

    openGraph: {
      title: resource.title,
      description: resource.excerpt || resource.title,
      url: `https://nurexi.com/resources/${resource.slug}`,
      type: "article",

      images: coverImage
        ? [
            {
              url: typeof coverImage === "string" ? coverImage : coverImage.src,
            },
          ]
        : [],
    },

    twitter: {
      card: "summary_large_image",
      title: resource.title,
      description: resource.excerpt || resource.title,

      images: coverImage
        ? [typeof coverImage === "string" ? coverImage : coverImage.src]
        : [],
    },
  };
}

export async function generateStaticParams() {
  const supabase = createPublicClient();
  const { data } = await supabase
    .from("resources")
    .select("slug")
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(50);

  return (data ?? []).map((r) => ({ slug: r.slug }));
}

// ─── creator link button ──────────────────────────────────────────────────────

function CreatorLinkButton({ link }: { link: CreatorLink }) {
  const Icon = LINK_ICONS[link.icon] ?? LinkIcon;
  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-border bg-card hover:bg-muted/50 hover:border-primary/40 transition-all duration-150 no-underline group"
    >
      <Icon className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
      <span className="text-[12px] font-medium text-foreground">
        {link.label}
      </span>
    </a>
  );
}

// ─── page ─────────────────────────────────────────────────────────────────────

export default async function ResourcePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const r = await getResource(slug);
  if (!r) notFound();

  const headings = extractHeadings(r.content);

  const formattedDate = r.published_at
    ? new Date(r.published_at).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  return (
    <main className="min-h-screen bg-background">
      <div className="container mt-8 md:mt-10 py-10">
        {r.cover_image_url && (
          <div className="h-64 md:h-80 mb-4 rounded-xl overflow-hidden relative">
            <Image
              src={r.cover_image_url || nursingBlog}
              alt={r.title}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="w-full h-full object-center object-cover"
            />
          </div>
        )}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_220px] gap-10">
          {/* ── main article column ── */}
          <article>
            {/* breadcrumb */}
            <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground mb-6">
              <Link
                href="/"
                className="hover:text-foreground transition-colors no-underline"
              >
                Home
              </Link>
              <ArrowRight className="h-3 w-3" />
              <Link
                href="/resources"
                className="hover:text-foreground transition-colors no-underline"
              >
                Resources
              </Link>
              <ArrowRight className="h-3 w-3" />
              <span className="text-foreground truncate max-w-[200px]">
                {r.title}
              </span>
            </div>

            {/* badges */}
            <div className="flex items-center gap-2 flex-wrap mb-4">
              <Badge
                variant="secondary"
                className="text-[11px] font-semibold rounded-full"
              >
                {CATEGORY_LABELS[r.category] ?? r.category}
              </Badge>
              <Badge variant="outline" className="text-[11px] rounded-full">
                {TYPE_LABELS[r.resource_type] ?? r.resource_type}
              </Badge>
            </div>

            {/* title */}
            <h1 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight leading-tight mb-4">
              {r.title}
            </h1>

            {/* excerpt */}
            {r.excerpt && (
              <p className="text-base text-muted-foreground leading-relaxed mb-6 border-l-2 border-primary/40 pl-4">
                {r.excerpt}
              </p>
            )}

            {/* author + date */}
            <div className="flex items-center gap-3 mb-8 pb-8 border-b border-border">
              <Avatar className="size-10">
                <AvatarImage src={r?.author_avatar || ""} />
                <AvatarFallback className="uppercase">
                  {r.author_name?.[0]?.toUpperCase() ?? "N"}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-[13px] font-semibold text-foreground">
                  {r.author_name ?? "Nurexi"}
                </p>
                {formattedDate && (
                  <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {formattedDate}
                  </div>
                )}
              </div>
            </div>

            {/* ── mobile-only "on this page" — shown above content on small screens ── */}
            {headings.length >= 2 && (
              <div className="lg:hidden mb-8 rounded-xl border border-border bg-muted/20 p-4">
                <OnThisPage headings={headings} />
              </div>
            )}

            {/* main content */}
            <div className="mb-12">
              <ResourceContent content={r.content} />
            </div>

            {/* creator links */}
            {r.creator_links && r.creator_links.length > 0 && (
              <div
                className="rounded-2xl border border-border p-6 mb-10"
                style={{
                  background:
                    "linear-gradient(135deg, oklch(78.07% 0.117 166.71 / 0.06) 0%, transparent 100%)",
                }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <Avatar className="size-10">
                    <AvatarImage src={r?.author_avatar || ""} />
                    <AvatarFallback className="uppercase">
                      {r.author_name?.[0]?.toUpperCase() ?? "N"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-[13px] font-semibold text-foreground">
                      {r.author_name ?? "Nurexi"}
                    </p>
                    <p className="text-[12px] text-muted-foreground">
                      Resource contributor
                    </p>
                  </div>
                </div>

                <p className="text-[12px] text-muted-foreground mb-3 font-medium uppercase tracking-wide">
                  Connect with the contributor
                </p>
                <div className="flex flex-wrap gap-2">
                  {r.creator_links.map((link, i) => (
                    <CreatorLinkButton key={i} link={link} />
                  ))}
                </div>
              </div>
            )}

            <Link
              href="/resources"
              className="inline-flex items-center gap-2 text-[13px] font-medium text-muted-foreground hover:text-foreground transition-colors no-underline"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to all resources
            </Link>
          </article>

          {/* ── desktop sidebar — "on this page" ── */}
          <aside className="hidden lg:block">
            <OnThisPage headings={headings} />
          </aside>
        </div>
      </div>
    </main>
  );
}
