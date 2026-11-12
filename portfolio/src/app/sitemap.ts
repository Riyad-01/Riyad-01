import type { MetadataRoute } from "next";
import { resumes } from "@/content/experience";
import { projects } from "@/content/projects";
import { site } from "@/content/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date(site.lastReviewed);
  const page = (path: string, priority: number) => ({ url: `${site.url}${path}`, lastModified, changeFrequency: "monthly" as const, priority });
  return [
    page("", 1),
    page("/work", 0.9),
    ...projects.map((p) => page(`/work/${p.slug}`, 0.8)),
    page("/lab", 0.7),
    page("/about", 0.7),
    page("/experience", 0.8),
    page("/resume", 0.8),
    ...resumes.map((r) => page(`/resume/${r.slug}`, 0.7)),
    page("/ai", 0.5),
    page("/contact", 0.6),
    page("/privacy", 0.3),
  ];
}
