import type { ExperienceEntry, Faq, ResumeVariant } from "./types";

/**
 * Experience is organised by scope of responsibility. Official titles,
 * employers and dates are deliberately left as placeholders: they must be
 * supplied by Riyad and never guessed.
 */
export const experience: ExperienceEntry[] = [
  {
    id: "product-building",
    chapter: "Now",
    title: "Founder and AI-Native Product Builder",
    organization: "Independent — Osyn products",
    period: "[VERIFY BEFORE PUBLISHING: start date] — present",
    kind: "Personal product",
    summary:
      "Building and testing my own AI-enabled products, led by OsynJobs, a working AI-assisted job-search product in active testing.",
    responsibilities: [
      "Founder, Product Manager, UX Designer, AI-Native Builder and Product Tester on OsynJobs.",
      "Architecture and prototype exploration for Orchesyn, an AI-native agentic workspace.",
      "Prototypes and experiments across learning, automation and AI media production.",
    ],
    evidence: ["OsynJobs: working product, active testing", "Seven Product Lab initiatives, each with an honest status"],
    related: ["osynjobs"],
    status: "personal-project",
  },
  {
    id: "leadership",
    chapter: "Leadership",
    title: "[VERIFY BEFORE PUBLISHING: official title]",
    organization: "[VERIFY BEFORE PUBLISHING: employer]",
    period: "[VERIFY BEFORE PUBLISHING: dates]",
    kind: "Professional work",
    summary:
      "Cross-functional leadership across learning production, AI-assisted media and client delivery.",
    responsibilities: [
      "Led a 15–20-person cross-functional project operating across two shifts.",
      "Led three functional teams during Saudi Compliance Institute work.",
      "Trained, mentored, or onboarded approximately 30–35 contributors across broader operations.",
      "Introduced an AI-assisted workflow for learning media.",
    ],
    evidence: ["15–20 people led", "3 functional teams led", "30–35 contributors trained, mentored, or onboarded"],
    related: ["ai-assisted-learning-media-workflow", "saudi-compliance-institute"],
    status: "approximate",
  },
  {
    id: "learning-systems",
    chapter: "Systems",
    title: "[VERIFY BEFORE PUBLISHING: official title]",
    organization: "[VERIFY BEFORE PUBLISHING: employer]",
    period: "[VERIFY BEFORE PUBLISHING: dates]",
    kind: "Professional work",
    summary:
      "Learning architecture, template systems and UI/UX for UK eLearning marketplace brands.",
    responsibilities: [
      "Developed or supported approximately 1,500–2,000+ eLearning courses.",
      "Worked across approximately 20–25 UK eLearning marketplace brands.",
      "Built reusable Storyline and Rise frameworks and template systems.",
      "UI/UX, content and brand-system work, including StudyHub UK.",
    ],
    evidence: ["1,500–2,000+ courses", "20–25 UK brands", "Storyline and Rise frameworks"],
    related: ["learning-architecture-at-scale", "studyhub-uk"],
    status: "approximate",
  },
  {
    id: "foundations",
    chapter: "Foundations",
    title: "[VERIFY BEFORE PUBLISHING: official title]",
    organization: "[VERIFY BEFORE PUBLISHING: employer]",
    period: "[VERIFY BEFORE PUBLISHING: dates]",
    kind: "Professional work",
    summary: "Where it started: web publishing, voiceover optimization and course development.",
    responsibilities: [
      "Web publishing.",
      "Voiceover optimization for learning media.",
      "eLearning course development.",
    ],
    evidence: ["The production foundation that later systems were built on"],
    related: ["learning-architecture-at-scale"],
    status: "professional-work",
  },
];

export const experienceNote =
  "More than six years across eLearning content, product design and digital marketing. Official titles, employers and dates are being confirmed and will replace the placeholders on this page.";

export const resumes: ResumeVariant[] = [
  {
    slug: "product-manager-ai-products",
    name: "Product Manager and AI Products",
    short: "Product",
    forRoles: ["Product Manager", "AI Product Manager", "EdTech Product Lead", "Product Operations"],
    headline: "AI Product & Learning Systems Architect — Product Manager, AI-Native Builder",
    summary:
      "Product builder who takes problems from human need to working software. Founder of OsynJobs, a working AI-assisted job-search product in active testing, with a background leading cross-functional teams and delivering learning products at scale.",
    reasons: [
      "Highlights OsynJobs",
      "Emphasizes product discovery",
      "Surfaces research and problem framing",
      "Prioritizes product delivery",
      "Shows cross-functional leadership",
    ],
    highlights: [
      "Founder, Product Manager, UX Designer and AI-Native Builder of OsynJobs — a working product in active testing.",
      "Led a 15–20-person cross-functional project across two shifts.",
      "Led three functional teams during Saudi Compliance Institute work.",
      "Introduced an AI-assisted workflow into learning media production.",
      "Runs a Product Lab of seven initiatives, each labelled with its real status.",
    ],
    leadCaseStudies: ["osynjobs", "ai-assisted-learning-media-workflow", "saudi-compliance-institute"],
    skills: ["Product strategy", "Problem framing", "Prioritisation", "UX design", "AI-native building", "Cross-functional delivery"],
  },
  {
    slug: "learning-technology-manager",
    name: "Learning Technology Manager",
    short: "Learning Technology",
    forRoles: ["Learning Technology Manager", "Learning Systems Architect", "Learning Experience Lead", "EdTech Product Lead"],
    headline: "Learning Systems Architect — Learning Technology Manager",
    summary:
      "Learning-systems lead with experience developing or supporting 1,500–2,000+ eLearning courses for 20–25 UK marketplace brands, building Storyline and Rise frameworks, and leading and enabling production teams.",
    reasons: [
      "Leads with learning at scale: 1,500–2,000+ courses",
      "Emphasizes learning architecture and authoring frameworks",
      "Surfaces team leadership and enablement",
      "Shows AI-assisted learning media",
      "Covers LMS workflows",
    ],
    highlights: [
      "Developed or supported approximately 1,500–2,000+ eLearning courses.",
      "Worked across approximately 20–25 UK eLearning marketplace brands.",
      "Built reusable Storyline and Rise frameworks and template systems.",
      "Led a 15–20-person cross-functional project across two shifts.",
      "Trained, mentored, or onboarded approximately 30–35 contributors.",
    ],
    leadCaseStudies: ["learning-architecture-at-scale", "ai-assisted-learning-media-workflow", "studyhub-uk"],
    skills: ["Learning architecture", "Articulate Storyline", "Articulate Rise", "LMS workflows", "Template systems", "Team enablement"],
  },
  {
    slug: "creative-product-ux-designer",
    name: "Creative Product and UX Designer",
    short: "Creative UX",
    forRoles: ["Product Designer", "Creative UX Designer", "Creative Product Designer", "Learning Experience Lead"],
    headline: "Creative Product and UX Designer — Design Systems, Learning Experience",
    summary:
      "Designer who treats interface, brand and learning experience as one system. UI/UX and design-system work for StudyHub UK, template systems used across a large course catalogue, and a self-designed AI product.",
    reasons: [
      "Leads with StudyHub UK interface and brand work",
      "Emphasizes design systems and reusable templates",
      "Shows interactive learning experiences",
      "Includes OsynJobs as end-to-end product design",
      "Surfaces prototyping",
    ],
    highlights: [
      "UI/UX, design-system and brand-system work for StudyHub UK.",
      "Template systems behind 1,500–2,000+ eLearning courses.",
      "Designed and built OsynJobs end to end.",
      "Interactive learning experiences in Storyline and Rise.",
    ],
    leadCaseStudies: ["studyhub-uk", "osynjobs", "learning-architecture-at-scale"],
    skills: ["Interface design", "Design systems", "Brand systems", "Prototyping", "Figma", "Interactive learning design"],
  },
];

export const resumeBySlug = (slug: string) => resumes.find((r) => r.slug === slug);

export const resumeShared = {
  education: "[ADD VERIFIED EDUCATION]",
  certifications: "[ADD VERIFIED CERTIFICATIONS, IF ANY]",
  languages: "[ADD VERIFIED LANGUAGES]",
};

/** Approved FAQs. These are first-class knowledge records for Riyad AI. */
export const faqs: Faq[] = [
  {
    id: "who",
    question: "Who is Riyad?",
    answer:
      "Riyad Ahmed is an AI Product & Learning Systems Architect based in Sylhet, Bangladesh. He designs and builds AI-enabled products, learning systems, and intelligent workflows that make learning and work easier. His work connects human needs, learning, product strategy, design, AI and team enablement.",
    sources: [{ label: "About", href: "/about" }],
    evidence: "verified",
    keywords: ["introduction", "summary", "overview", "background", "about"],
  },
  {
    id: "roles",
    question: "What roles best match Riyad?",
    answer:
      "Riyad is open to selected international remote roles such as Product Manager, AI Product Manager, Learning Technology Manager, Learning Systems Architect, EdTech Product Lead, Product Operations, Creative Product Designer and Learning Experience Lead.",
    sources: [{ label: "Resume", href: "/resume" }, { label: "Contact", href: "/contact" }],
    evidence: "verified",
    keywords: ["role", "position", "job", "fit", "hiring", "title", "opportunities", "available", "availability", "remote"],
  },
  {
    id: "strongest",
    question: "What is Riyad's strongest experience?",
    answer:
      "The strongest evidence is learning at scale: approximately 1,500–2,000+ eLearning courses developed or supported across approximately 20–25 UK eLearning marketplace brands, built on learning architecture and reusable Storyline and Rise frameworks. Alongside it sits cross-functional leadership of a 15–20-person, two-shift project.",
    sources: [
      { label: "Learning Architecture at Scale", href: "/work/learning-architecture-at-scale" },
      { label: "Experience", href: "/experience" },
    ],
    evidence: "approximate",
    keywords: ["strongest", "best", "main", "biggest", "strength", "scale"],
  },
  {
    id: "leadership",
    question: "Has Riyad managed or led teams?",
    answer:
      "Yes. Riyad led a 15–20-person cross-functional project operating across two shifts, led three functional teams during Saudi Compliance Institute work, and trained, mentored, or onboarded approximately 30–35 contributors across broader operations.",
    sources: [
      { label: "Experience", href: "/experience" },
      { label: "AI-Assisted Learning Media Workflow", href: "/work/ai-assisted-learning-media-workflow" },
      { label: "Saudi Compliance Institute", href: "/work/saudi-compliance-institute" },
    ],
    evidence: "approximate",
    keywords: ["lead", "led", "manage", "managed", "team", "teams", "leadership", "cross-functional", "mentor", "people", "management"],
  },
  {
    id: "learning-tech",
    question: "What learning technology experience does Riyad have?",
    answer:
      "Riyad has developed or supported approximately 1,500–2,000+ eLearning courses for approximately 20–25 UK marketplace brands. He designed learning architecture, built reusable frameworks in Articulate Storyline and Rise, worked with LMS workflows, and led an AI-assisted learning media workflow.",
    sources: [
      { label: "Learning Architecture at Scale", href: "/work/learning-architecture-at-scale" },
      { label: "AI-Assisted Learning Media Workflow", href: "/work/ai-assisted-learning-media-workflow" },
    ],
    evidence: "approximate",
    keywords: ["learning", "elearning", "edtech", "lms", "storyline", "rise", "articulate", "instructional", "course", "courses", "authoring"],
  },
  {
    id: "product",
    question: "What product experience does Riyad have?",
    answer:
      "Riyad's product experience is founder-led. He is Founder, Product Manager, UX Designer, AI-Native Builder and Product Tester of OsynJobs, a working AI-assisted job-search product in active testing, and runs a Product Lab of further prototypes and experiments. Interpretation: this is hands-on product evidence from personal products rather than a formal Product Manager title, combined with professional experience leading cross-functional delivery.",
    sources: [
      { label: "OsynJobs", href: "/work/osynjobs" },
      { label: "Product Lab", href: "/lab" },
    ],
    evidence: "personal-project",
    keywords: ["product", "pm", "manager", "roadmap", "discovery", "prioritisation", "prioritization", "founder", "startup"],
  },
  {
    id: "ai-tools",
    question: "What AI tools has Riyad used?",
    answer:
      "Riyad builds AI-natively: AI-assisted development is how OsynJobs and his Product Lab prototypes are built, and he led an AI-assisted learning media workflow in a professional setting. I do not have verified portfolio evidence for the specific AI tools or models yet — the named tool list is awaiting confirmation.",
    sources: [
      { label: "OsynJobs", href: "/work/osynjobs" },
      { label: "AI-Assisted Learning Media Workflow", href: "/work/ai-assisted-learning-media-workflow" },
      { label: "About — tools", href: "/about#tools" },
    ],
    evidence: "verified",
    keywords: ["ai", "tools", "tool", "llm", "models", "automation", "stack", "technology", "technologies", "software", "skills"],
  },
  {
    id: "ux",
    question: "What UX and design work has Riyad done?",
    answer:
      "Riyad's UX work includes UI/UX, design-system and brand-system work for StudyHub UK, template systems used across a large eLearning catalogue, interactive learning experiences, and the end-to-end design of OsynJobs. Approved screenshots are still being added to the case studies.",
    sources: [
      { label: "StudyHub UK", href: "/work/studyhub-uk" },
      { label: "OsynJobs", href: "/work/osynjobs" },
    ],
    evidence: "professional-work",
    keywords: ["ux", "ui", "design", "designer", "figma", "interface", "prototype", "prototyping", "brand", "creative", "visual"],
  },
  {
    id: "first-read",
    question: "Which case study should I read first?",
    answer:
      "It depends on what you are hiring for. For product roles, start with OsynJobs. For learning technology roles, start with Learning Architecture at Scale. For design roles, start with StudyHub UK. For leadership evidence, read AI-Assisted Learning Media Workflow.",
    sources: [{ label: "Work", href: "/work" }],
    evidence: "verified",
    keywords: ["first", "start", "recommend", "case study", "read", "begin"],
  },
  {
    id: "edtech",
    question: "How could Riyad contribute to an EdTech company?",
    answer:
      "Fact: Riyad has built learning at scale (1,500–2,000+ courses, 20–25 UK brands), led production teams, introduced AI-assisted media workflows, and built his own AI product. Interpretation: that combination is relevant to EdTech work that needs someone who understands learning content, production systems and product building together — for example scaling a course catalogue, or adding AI to a learning workflow responsibly.",
    sources: [
      { label: "Learning Architecture at Scale", href: "/work/learning-architecture-at-scale" },
      { label: "AI-Assisted Learning Media Workflow", href: "/work/ai-assisted-learning-media-workflow" },
      { label: "OsynJobs", href: "/work/osynjobs" },
    ],
    evidence: "approximate",
    keywords: ["edtech", "contribute", "company", "value", "bring", "help", "education"],
  },
  {
    id: "contact",
    question: "How can I contact Riyad?",
    answer:
      "Use the contact page, email riyadahmed646@gmail.com, or connect on LinkedIn at linkedin.com/in/riyad-ahmed-357182162. I can also help you prepare a message, which you review and send yourself.",
    sources: [{ label: "Contact", href: "/contact" }],
    evidence: "verified",
    keywords: ["contact", "email", "reach", "linkedin", "message", "hire", "talk", "call", "interview"],
  },
  {
    id: "location",
    question: "Where is Riyad based, and does he work remotely?",
    answer:
      "Riyad is based in Sylhet, Bangladesh, and is available for selected international remote opportunities. His professional work has served UK eLearning brands and the Saudi Compliance Institute.",
    sources: [{ label: "About", href: "/about" }],
    evidence: "verified",
    keywords: ["location", "based", "where", "remote", "timezone", "country", "bangladesh", "sylhet", "relocate"],
  },
  {
    id: "philosophy",
    question: "How does Riyad work?",
    answer:
      "Riyad works in seven steps: Understand, Frame, Architect, Prototype, Test, Enable, Improve. The principles behind them: make complexity understandable; build systems, not isolated assets; AI should improve the workflow, not decorate it; test ideas against real use; give teams tools, not dependency.",
    sources: [{ label: "About", href: "/about" }, { label: "Home — How Riyad works", href: "/#process" }],
    evidence: "verified",
    keywords: ["process", "approach", "method", "philosophy", "principles", "work style", "how"],
  },
  {
    id: "experience-years",
    question: "How many years of experience does Riyad have?",
    answer:
      "Riyad has more than six years of experience across eLearning content, product design and digital marketing. Exact dates and official titles for each role are being confirmed on the Experience page.",
    sources: [{ label: "Experience", href: "/experience" }],
    evidence: "approximate",
    keywords: ["years", "experience", "long", "seniority", "senior", "career"],
  },
];
