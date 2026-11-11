import { faqs, resumes } from "@/content/experience";
import { lab } from "@/content/lab";
import { projects } from "@/content/projects";
import { nav } from "@/content/site";

export interface SearchItem {
  id: string;
  group: "Pages" | "Case studies" | "Product Lab" | "Résumés" | "Ask Riyad AI";
  title: string;
  detail: string;
  href?: string;
  ask?: string;
  text: string;
}

/** Global search index, built from the same content the pages render. */
export function buildSearchIndex(): SearchItem[] {
  const items: SearchItem[] = [];
  for (const n of [...nav, { label: "Riyad AI", href: "/ai" }, { label: "Privacy and AI transparency", href: "/privacy" }])
    items.push({ id: `page-${n.href}`, group: "Pages", title: n.label, detail: "Page", href: n.href, text: n.label });
  for (const p of projects)
    items.push({
      id: `cs-${p.slug}`,
      group: "Case studies",
      title: p.title,
      detail: p.summary,
      href: `/work/${p.slug}`,
      text: [p.title, p.headline, p.summary, ...p.classification, ...p.disciplines, ...p.proof, ...p.roles].join(" "),
    });
  for (const l of lab)
    items.push({ id: `lab-${l.slug}`, group: "Product Lab", title: l.name, detail: l.statusLabel, href: `/lab#${l.slug}`, text: `${l.name} ${l.statusLabel} ${l.capability} lab prototype experiment` });
  for (const r of resumes)
    items.push({ id: `resume-${r.slug}`, group: "Résumés", title: `${r.name} résumé`, detail: r.forRoles.join(", "), href: `/resume/${r.slug}`, text: `${r.name} resume résumé cv ${r.forRoles.join(" ")} ${r.skills.join(" ")}` });
  for (const f of faqs)
    items.push({ id: `faq-${f.id}`, group: "Ask Riyad AI", title: f.question, detail: "Ask Riyad AI", ask: f.question, text: `${f.question} ${(f.keywords ?? []).join(" ")}` });
  return items;
}

export function search(items: SearchItem[], query: string): SearchItem[] {
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (terms.length === 0) return [];
  return items
    .map((item) => {
      const title = item.title.toLowerCase();
      const text = item.text.toLowerCase();
      let score = 0;
      for (const t of terms) {
        if (title.includes(t)) score += 3;
        else if (text.includes(t)) score += 1;
        else return { item, score: 0 };
      }
      return { item, score };
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 8)
    .map((r) => r.item);
}
