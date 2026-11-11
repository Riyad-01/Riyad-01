import type { Metric, Perspective } from "./types";

/**
 * Central site configuration. Change availability, contact details and
 * navigation here — nothing else needs to be touched.
 */
export const site = {
  name: "Riyad Ahmed",
  role: "AI Product & Learning Systems Architect",
  roles: ["AI Product & Learning Systems Architect", "Product Manager", "AI-Native Builder"],
  location: "Sylhet, Bangladesh",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  statement: ["From human needs", "to working systems."],
  promise:
    "I design and build AI-enabled products, learning systems, and intelligent workflows that make learning and work easier.",
  mission:
    "Build useful products and scalable systems that help people learn faster, work smarter, and access better opportunities.",
  description:
    "Riyad Ahmed is an AI Product & Learning Systems Architect. 1,500–2,000+ eLearning courses developed or supported, cross-functional teams led, and working AI products built — from human needs to working systems.",
  /** Single editable opportunity-status value. Set `open: false` to switch the indicator off site-wide. */
  availability: {
    open: true,
    label: "Available for selected international remote opportunities",
    short: "Open to remote roles",
  },
  contact: {
    email: "riyadahmed646@gmail.com",
    linkedin: "https://www.linkedin.com/in/riyad-ahmed-357182162",
    linkedinLabel: "linkedin.com/in/riyad-ahmed-357182162",
    github: "https://github.com/Riyad-01",
  },
  lastReviewed: "2026-11-11",
} as const;

export const nav = [
  { label: "Work", href: "/work" },
  { label: "Product Lab", href: "/lab" },
  { label: "About", href: "/about" },
  { label: "Experience", href: "/experience" },
  { label: "Resume", href: "/resume" },
  { label: "Contact", href: "/contact" },
] as const;

export const metricsNote =
  "Figures represent approximate professional scope based on project, leadership, and operational responsibilities.";

export const metrics: Metric[] = [
  {
    id: "courses",
    value: "1,500–2,000+",
    label: "eLearning courses developed or supported",
    detail: "Across course development, learning architecture and template systems.",
    evidence: "approximate",
    source: { label: "Learning Architecture at Scale", href: "/work/learning-architecture-at-scale" },
  },
  {
    id: "brands",
    value: "20–25",
    label: "UK eLearning marketplace brands",
    detail: "One production system serving many brands rather than one-off builds.",
    evidence: "approximate",
    source: { label: "Learning Architecture at Scale", href: "/work/learning-architecture-at-scale" },
  },
  {
    id: "team",
    value: "15–20",
    label: "People led across a two-shift cross-functional project",
    detail: "Coordinated across roles and shifts on an AI-assisted media workflow.",
    evidence: "approximate",
    source: { label: "AI-Assisted Learning Media Workflow", href: "/work/ai-assisted-learning-media-workflow" },
  },
  {
    id: "mentored",
    value: "30–35",
    label: "Contributors trained, mentored, or onboarded",
    detail: "Giving teams tools and shared methods, not dependency on one person.",
    evidence: "approximate",
    source: { label: "Experience", href: "/experience" },
  },
  {
    id: "functions",
    value: "3",
    label: "Functional teams led during Saudi Compliance Institute work",
    detail: "Three functions aligned around one delivery.",
    evidence: "approximate",
    source: { label: "Saudi Compliance Institute", href: "/work/saudi-compliance-institute" },
  },
];

export const perspectives: Record<
  Perspective,
  { label: string; intro: string; priorities: string[]; order: string[]; resume: string }
> = {
  product: {
    label: "Product",
    intro:
      "Read me as a product builder: problems framed, decisions made, working software tested against real use.",
    priorities: [
      "OsynJobs — a working AI-assisted job-search product in active testing",
      "Orchesyn — architecture and prototype exploration",
      "Product decisions, research and prioritisation",
      "AI products built end to end",
      "Cross-functional delivery",
    ],
    order: [
      "osynjobs",
      "ai-assisted-learning-media-workflow",
      "saudi-compliance-institute",
      "learning-architecture-at-scale",
      "studyhub-uk",
    ],
    resume: "product-manager-ai-products",
  },
  learning: {
    label: "Learning Technology",
    intro:
      "Read me as a learning-systems lead: architecture, authoring frameworks and teams that deliver learning at scale.",
    priorities: [
      "Learning architecture across 1,500–2,000+ courses",
      "Storyline and Rise systems",
      "LMS workflows",
      "AI-assisted learning media",
      "Team enablement: 30–35 contributors trained, mentored, or onboarded",
    ],
    order: [
      "learning-architecture-at-scale",
      "ai-assisted-learning-media-workflow",
      "saudi-compliance-institute",
      "studyhub-uk",
      "osynjobs",
    ],
    resume: "learning-technology-manager",
  },
  creative: {
    label: "Creative UX",
    intro:
      "Read me as a creative product designer: interfaces, design systems and learning experiences people can actually use.",
    priorities: [
      "StudyHub UK — interface and brand system work",
      "Design systems and reusable templates",
      "Interactive learning experiences",
      "Brand systems",
      "Interface design and prototyping",
    ],
    order: [
      "studyhub-uk",
      "osynjobs",
      "learning-architecture-at-scale",
      "ai-assisted-learning-media-workflow",
      "saudi-compliance-institute",
    ],
    resume: "creative-product-ux-designer",
  },
};

export const valueChain = [
  {
    id: "need",
    label: "Human Need",
    purpose: "Start with a person and the thing they are struggling to do.",
    activity: "Listening, observing real workflows, and using the problem myself where I can.",
    example: "OsynJobs started from my own job search: too many tabs, versions and trackers for one task.",
    related: "osynjobs",
  },
  {
    id: "research",
    label: "Research",
    purpose: "Replace assumptions with evidence before committing effort.",
    activity: "Workflow mapping, reviewing existing material, comparing how the work is done today.",
    example: "A framework for 20–25 brands has to start from how courses are really built, not how the process document says they are.",
    related: "learning-architecture-at-scale",
  },
  {
    id: "definition",
    label: "Problem Definition",
    purpose: "Name the real problem in one sentence everyone can agree on.",
    activity: "Framing, scoping, and deciding what is explicitly out of scope.",
    example: "OsynJobs is framed as organising a fragmented job-search workflow — not as a do-everything app.",
    related: "osynjobs",
  },
  {
    id: "strategy",
    label: "Product Strategy",
    purpose: "Choose where to focus and what to leave out.",
    activity: "Principles, prioritisation, sequencing and honest status labels.",
    example: "In the Product Lab, every idea carries a status so prototypes are never presented as launches.",
    related: "osynjobs",
  },
  {
    id: "learning",
    label: "Learning Architecture",
    purpose: "Structure knowledge so it can be taught, reused and scaled.",
    activity: "Course structures, reusable frameworks and templates for authoring tools.",
    example: "Storyline and Rise frameworks that supported 1,500–2,000+ courses across 20–25 UK brands.",
    related: "learning-architecture-at-scale",
  },
  {
    id: "experience",
    label: "Experience Design",
    purpose: "Make the system understandable to the person using it.",
    activity: "Interface design, design systems, prototyping and interaction detail.",
    example: "StudyHub UK: interface, brand and design-system work for a learning marketplace.",
    related: "studyhub-uk",
  },
  {
    id: "ai",
    label: "AI Workflow",
    purpose: "Use AI where it improves the workflow, not where it decorates it.",
    activity: "Designing AI-assisted steps with human review around them.",
    example: "An AI-assisted learning media workflow run by a 15–20-person team across two shifts.",
    related: "ai-assisted-learning-media-workflow",
  },
  {
    id: "enablement",
    label: "Team Enablement",
    purpose: "Give teams tools and methods, not dependency.",
    activity: "Training, mentoring, onboarding and documentation.",
    example: "Approximately 30–35 contributors trained, mentored, or onboarded across operations.",
    related: "ai-assisted-learning-media-workflow",
  },
  {
    id: "solution",
    label: "Working Solution",
    purpose: "Ship something real enough to be tested by use.",
    activity: "Building prototypes and working products, then testing them myself.",
    example: "OsynJobs is a working product in active testing, not a slide deck.",
    related: "osynjobs",
  },
  {
    id: "outcome",
    label: "Business Outcome",
    purpose: "Connect the work back to what the organisation needed.",
    activity: "Delivery at scale, consistent quality, and teams that can keep going.",
    example: "Three functional teams aligned around one delivery for the Saudi Compliance Institute.",
    related: "saudi-compliance-institute",
  },
] as const;

export const workSteps = [
  { n: "01", label: "Understand", body: "Start with the people and the work as it really happens. I look for the friction nobody has written down yet." },
  { n: "02", label: "Frame", body: "Turn a vague need into a stated problem, a scope, and a clear list of what is not being solved." },
  { n: "03", label: "Architect", body: "Design the structure first: information, workflow, roles and reusable parts. Systems, not isolated assets." },
  { n: "04", label: "Prototype", body: "Make the idea tangible quickly — an interface, a template, a workflow — so it can be judged by use rather than opinion." },
  { n: "05", label: "Test", body: "Put it in front of real work. Ideas become valuable when they survive contact with reality." },
  { n: "06", label: "Enable", body: "Train, document and hand over. The goal is a team that can run the system without me in the room." },
  { n: "07", label: "Improve", body: "Keep what works, remove what does not, and feed what was learned into the next version." },
] as const;

export const career = [
  { label: "Web Publishing", gain: "Getting content live, correctly and on time." },
  { label: "Voiceover Optimization", gain: "Improving how learning media is produced and refined." },
  { label: "Course Development", gain: "Building complete eLearning courses." },
  { label: "Learning Architecture", gain: "Structuring courses so they can be built consistently." },
  { label: "Template Systems", gain: "Turning repeated work into reusable frameworks." },
  { label: "UI/UX", gain: "Designing the interfaces people learn and work in." },
  { label: "Cross-Functional Leadership", gain: "Leading people across roles, functions and shifts." },
  { label: "Content and Brand Systems", gain: "Keeping many brands coherent through shared systems." },
  { label: "AI Workflows", gain: "Putting AI inside real production workflows." },
  { label: "Product Building", gain: "Taking a problem all the way to a working product." },
] as const;

export const principles = [
  "Make complexity understandable.",
  "Build systems, not isolated assets.",
  "AI should improve the workflow, not decorate it.",
  "Test ideas against real use.",
  "Give teams tools, not dependency.",
] as const;

export const tools = {
  verified: [
    { group: "Learning", items: ["Articulate Storyline", "Articulate Rise", "LMS workflows"] },
    { group: "Design", items: ["Figma", "Design systems", "Prototyping"] },
    { group: "Build", items: ["Next.js", "React", "Node.js", "HTML and CSS", "JavaScript", "Git and GitHub"] },
    { group: "AI", items: ["AI-assisted development", "AI-assisted media production"] },
  ],
  placeholder: "[VERIFY BEFORE PUBLISHING: specific AI tools and models used]",
} as const;
