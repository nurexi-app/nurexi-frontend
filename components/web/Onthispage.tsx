"use client";

import { useEffect, useState } from "react";
import { cn, ExtractedHeading } from "@/lib/utils";
import { List } from "lucide-react";
interface OnThisPageProps {
  headings: ExtractedHeading[];
}

export default function OnThisPage({ headings }: OnThisPageProps) {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // pick the heading closest to the top that's currently intersecting
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      {
        // trigger when heading is in the top 30% of viewport
        rootMargin: "-100px 0px -70% 0px",
        threshold: 0,
      },
    );

    headings.forEach((h) => {
      const el = document.getElementById(h.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length < 2) return null; // not worth showing for 0-1 headings

  const handleClick = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });

      window.history.pushState(null, "", `#${id}`);
    }
  };

  return (
    <nav className="sticky top-24">
      <div className="flex items-center gap-2 mb-3 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
        <List className="h-3.5 w-3.5" />
        On this page
      </div>

      <ul className="space-y-1.5 border-l border-border">
        {headings.map((h) => (
          <li
            key={h.id}
            style={{ paddingLeft: h.level === 3 ? "1.5rem" : "1rem" }}
          >
            <a
              href={`#${h.id}`}
              onClick={handleClick(h.id)}
              className={cn(
                "block text-[13px] leading-snug py-1 border-l-2 -ml-px pl-3 transition-colors duration-150 no-underline",
                activeId === h.id
                  ? "border-primary text-primary font-medium"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-border",
              )}
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
