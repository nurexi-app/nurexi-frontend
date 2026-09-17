import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Clock,
  Globe,
  Instagram,
  Linkedin,
  Link as LinkIcon,
  Twitter,
  Youtube,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { createClient as createPublicClient } from "@/lib/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ResourceCoverImage } from "@/components/marketing/ResourceCoverImage";
import OnThisPage from "@/components/web/Onthispage";
import ResourceContent from "@/components/web/ResourceContent";
import { extractHeadings } from "@/lib/utils";
import nursingBlog from "@/public/assets/nursingblog.jpg";

interface CreatorLink {
  label: string;
  url: string;
  icon: string;
}

interface ResourceDetail {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  content: unknown;
  cover_image_url: string | null;
  category: string;
  resource_type: string;
  published_at: string | null;
  creator_links: CreatorLink[] | null;
  created_by: string | null;
  author_name?: string | null;
  author_avatar?: string | null;
}

const linkIcons: Record<string, React.ElementType> = {
  globe: Globe,
  instagram: Instagram,
  twitter: Twitter,
  youtube: Youtube,
  linkedin: Linkedin,
  link: LinkIcon,
};

const categoryLabels: Record<string, string> = {
  study: "Study",
  clinical: "Clinical",
  career: "Career",
  professional: "Professional development",
  community: "Community",
};

const typeLabels: Record<string, string> = {
  article: "Article",
  micro: "Quick read",
  video: "Video",
  guide: "Guide",
};

async function getResource(slug: string) {
  const supabase = await createClient();
  const { data: resource, error } = await supabase
    .from("resources")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (!resource || error) return null;

  let authorName: string | null = null;
  let authorAvatar: string | null = null;

  if (resource.created_by) {
    const { data: profile } = await supabase
      .from("public_profiles")
      .select("full_name, avatar_url")
      .eq("id", resource.created_by)
      .single();

    authorName = profile?.full_name ?? null;
    authorAvatar = profile?.avatar_url ?? null;
  }

  return {
    ...resource,
    author_name: authorName,
    author_avatar: authorAvatar,
  } as ResourceDetail;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const resource = await getResource(slug);
  if (!resource) return { title: "Resource not found | Nurexi" };

  const coverImage = resource.cover_image_url || nursingBlog.src;

  return {
    metadataBase: new URL("https://nurexi.com"),
    title: resource.title,
    description: resource.excerpt || resource.title,
    openGraph: {
      title: resource.title,
      description: resource.excerpt || resource.title,
      url: `https://nurexi.com/resources/${resource.slug}`,
      type: "article",
      images: [{ url: coverImage }],
    },
    twitter: {
      card: "summary_large_image",
      title: resource.title,
      description: resource.excerpt || resource.title,
      images: [coverImage],
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

  return (data ?? []).map((resource) => ({ slug: resource.slug }));
}

function initials(name: string | null | undefined) {
  if (!name) return "N";
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function CreatorLinkButton({ link }: { link: CreatorLink }) {
  const Icon = linkIcons[link.icon] ?? LinkIcon;

  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group inline-flex min-h-11 items-center gap-2 rounded-full border border-border bg-card px-4 text-sm font-medium text-foreground transition-colors hover:border-accent hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <Icon aria-hidden="true" className="size-4 text-muted-foreground transition-colors group-hover:text-accent" />
      {link.label}
    </a>
  );
}

export default async function ResourcePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const resource = await getResource(slug);
  if (!resource) notFound();

  const headings = extractHeadings(resource.content);
  const publishedDate = resource.published_at
    ? new Date(resource.published_at).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="mx-auto max-w-300 px-6 pb-12 pt-14 sm:px-10 sm:pb-16 sm:pt-20 lg:px-16 lg:pt-24">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/resources" className="transition-colors hover:text-accent">Resources</Link>
          <ArrowRight aria-hidden="true" className="size-3.5" />
          <span className="max-w-56 truncate text-foreground sm:max-w-md">{resource.title}</span>
        </nav>

        <div className="mt-12 max-w-235">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent">
            {categoryLabels[resource.category] ?? resource.category} · {typeLabels[resource.resource_type] ?? resource.resource_type}
          </p>
          <h1 className="mt-6 text-[clamp(2.8rem,5.7vw,5.8rem)] font-semibold leading-[1.03] tracking-[-0.06em]">
            {resource.title}
          </h1>
          {resource.excerpt && (
            <p className="mt-7 max-w-195 text-lg leading-relaxed text-muted-foreground sm:text-xl">{resource.excerpt}</p>
          )}

          <div className="mt-9 flex items-center gap-4 border-t border-border pt-7">
            <Avatar className="size-12">
              <AvatarImage src={resource.author_avatar || undefined} alt="" />
              <AvatarFallback className="bg-secondary font-semibold text-foreground shadow-none">{initials(resource.author_name)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold">{resource.author_name ?? "Nurexi"}</p>
              {publishedDate && (
                <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Clock aria-hidden="true" className="size-3.5" /> {publishedDate}
                </p>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-328 px-6 sm:px-10 lg:px-16">
        <ResourceCoverImage
          src={resource.cover_image_url}
          alt={resource.title}
          sizes="(max-width: 1312px) 100vw, 1184px"
          priority
          className="aspect-16/9 rounded-3xl sm:rounded-4xl"
        />
      </div>

      <div className="mx-auto grid max-w-300 gap-12 px-6 py-16 sm:px-10 sm:py-20 lg:grid-cols-[minmax(0,1fr)_15rem] lg:gap-20 lg:px-16 lg:py-24">
        <article className="min-w-0 max-w-190">
          {headings.length >= 2 && (
            <div className="mb-10 rounded-2xl border border-border bg-secondary/50 p-5 lg:hidden">
              <OnThisPage headings={headings} />
            </div>
          )}

          <ResourceContent content={resource.content} />

          {resource.creator_links && resource.creator_links.length > 0 && (
            <section className="mt-16 border-t border-border pt-10" aria-labelledby="contributor-heading">
              <div className="flex items-center gap-4">
                <Avatar className="size-12">
                  <AvatarImage src={resource.author_avatar || undefined} alt="" />
                  <AvatarFallback className="bg-secondary font-semibold text-foreground shadow-none">{initials(resource.author_name)}</AvatarFallback>
                </Avatar>
                <div>
                  <h2 id="contributor-heading" className="text-lg font-semibold">{resource.author_name ?? "Nurexi"}</h2>
                  <p className="text-sm text-muted-foreground">Resource contributor</p>
                </div>
              </div>
              <div className="mt-6 flex flex-wrap gap-2">
                {resource.creator_links.map((link) => <CreatorLinkButton key={`${link.label}-${link.url}`} link={link} />)}
              </div>
            </section>
          )}

          <Link href="/resources" className="arrow-link mt-16 inline-flex min-h-11 items-center gap-2 border-b border-primary font-semibold text-foreground transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
            <ArrowLeft aria-hidden="true" data-link-arrow="back" className="size-4" /> Back to all resources
          </Link>
        </article>

        {headings.length >= 2 && (
          <aside className="hidden lg:block" aria-label="Article contents">
            <OnThisPage headings={headings} />
          </aside>
        )}
      </div>
    </main>
  );
}
