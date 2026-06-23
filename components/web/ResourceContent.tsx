"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Youtube from "@tiptap/extension-youtube";
import LinkExt from "@tiptap/extension-link";
import ImageExt from "@tiptap/extension-image";
import Highlight from "@tiptap/extension-highlight";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
// import { Extension } from "@tiptap/core";
import { useEffect } from "react";
import "@/styles/editor.css";

// ─── same slugify logic as extractHeadings.ts — must stay in sync ────────────

function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// ─── custom extension: injects id="..." onto every heading node ──────────────
// Tiptap doesn't expose heading text at render time per-node easily via attrs,
// so we post-process the rendered DOM instead (simpler and reliable).

interface ResourceContentProps {
  content: any;
}

export default function ResourceContent({ content }: ResourceContentProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Youtube.configure({ controls: true, nocookie: true }),
      LinkExt.configure({
        openOnClick: true,
        HTMLAttributes: { rel: "noopener noreferrer", target: "_blank" },
      }),
      ImageExt,
      Highlight.configure({ multicolor: false }),
      Underline,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    content: content ?? null,
    editable: false,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: "resource-editor-content resource-content-readonly",
      },
    },
  });

  // after render, walk the DOM and attach ids to headings matching extractHeadings()
  useEffect(() => {
    if (!editor) return;

    const dom = editor.view.dom;
    const headings = dom.querySelectorAll("h1, h2, h3");
    const seen = new Map<string, number>();

    headings.forEach((heading) => {
      const text = heading.textContent?.trim() ?? "";
      if (!text) return;

      let id = slugifyHeading(text);
      if (seen.has(id)) {
        const count = seen.get(id)! + 1;
        seen.set(id, count);
        id = `${id}-${count}`;
      } else {
        seen.set(id, 1);
      }

      heading.setAttribute("id", id);
      // offset for sticky header when jumping via anchor link
      (heading as HTMLElement).style.scrollMarginTop = "100px";
    });
  }, [editor, content]);

  if (!content) {
    return (
      <p className="text-muted-foreground italic text-sm">
        No content available.
      </p>
    );
  }

  if (!editor) return null;

  return <EditorContent editor={editor} />;
}
