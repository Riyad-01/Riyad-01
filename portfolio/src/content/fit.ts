/**
 * Transparent rules used by the Recruiter, Resume Selection and Opportunity
 * Fit agents. There is no hidden scoring: these tables ARE the logic, and the
 * interface shows them to the visitor.
 */

export interface Source {
  label: string;
  href: string;
}

export interface Capability {
  id: string;
  label: string;
  /** strong = direct professional or product evidence. partial = adjacent or transferable evidence. */
  strength: "strong" | "partial";
  evidence: string;
  sources: Source[];
  /** Lower-case phrases looked for in a job description. */
  keywords: string[];
}

const S = {
  lax: { label: "Learning Architecture at Scale", href: "/work/learning-architecture-at-scale" },
  media: { label: "AI-Assisted Learning Media Workflow", href: "/work/ai-assisted-learning-media-workflow" },
  osyn: { label: "OsynJobs", href: "/work/osynjobs" },
  study: { label: "StudyHub UK", href: "/work/studyhub-uk" },
  saudi: { label: "Saudi Compliance Institute", href: "/work/saudi-compliance-institute" },
  exp: { label: "Experience", href: "/experience" },
  lab: { label: "Product Lab", href: "/lab" },
  about: { label: "About", href: "/about" },
};

export const capabilities: Capability[] = [
  {
    id: "elearning-scale",
    label: "eLearning development at scale",
    strength: "strong",
    evidence: "Approximately 1,500–2,000+ eLearning courses developed or supported across approximately 20–25 UK marketplace brands.",
    sources: [S.lax],
    keywords: ["elearning", "e-learning", "course development", "course creation", "digital learning", "online courses", "learning content", "content development", "course production", "courseware"],
  },
  {
    id: "learning-architecture",
    label: "Learning architecture and learning design",
    strength: "strong",
    evidence: "Designed the learning architecture and reusable structures used across a large course catalogue.",
    sources: [S.lax],
    keywords: ["learning architecture", "instructional design", "learning design", "curriculum", "learning experience", "lxd", "learning strategy", "learning solutions", "learning programs", "learning programmes", "learning systems"],
  },
  {
    id: "authoring",
    label: "Articulate Storyline and Rise",
    strength: "strong",
    evidence: "Built reusable Storyline and Rise frameworks and template systems.",
    sources: [S.lax],
    keywords: ["storyline", "articulate", "rise", "authoring tool", "authoring tools", "rapid authoring"],
  },
  {
    id: "lms",
    label: "LMS workflows",
    strength: "partial",
    evidence: "Worked with LMS workflows for publishing courses. Specific LMS platforms are not yet listed in the portfolio.",
    sources: [S.lax],
    keywords: ["lms", "learning management system", "learning platform", "learning technology", "learning technologies", "learning tech"],
  },
  {
    id: "templates",
    label: "Template, framework and system building",
    strength: "strong",
    evidence: "Turned repeated production work into reusable frameworks and template systems.",
    sources: [S.lax, S.study],
    keywords: ["template", "templates", "framework", "frameworks", "standardis", "standardiz", "scalable", "scale", "process improvement", "operational efficiency", "systems thinking", "process design"],
  },
  {
    id: "leadership",
    label: "Cross-functional team leadership",
    strength: "strong",
    evidence: "Led a 15–20-person cross-functional project across two shifts, and three functional teams during Saudi Compliance Institute work.",
    sources: [S.media, S.saudi, S.exp],
    keywords: ["cross-functional", "cross functional", "lead a team", "team lead", "leadership", "manage a team", "people management", "team management", "managing teams", "lead teams", "stakeholder", "stakeholders", "collaborat"],
  },
  {
    id: "enablement",
    label: "Training, mentoring and onboarding",
    strength: "strong",
    evidence: "Trained, mentored, or onboarded approximately 30–35 contributors across broader operations.",
    sources: [S.exp, S.media],
    keywords: ["mentor", "mentoring", "coaching", "onboarding", "training", "enablement", "upskill", "develop talent", "team development"],
  },
  {
    id: "ai-workflow",
    label: "AI-assisted workflows",
    strength: "strong",
    evidence: "Led an AI-assisted learning media workflow in production, and builds products AI-natively.",
    sources: [S.media, S.osyn],
    keywords: ["ai-assisted", "ai workflow", "ai workflows", "generative ai", "genai", "gen ai", "llm", "ai tools", "automation", "artificial intelligence", "ai-powered", "ai powered", "ai-enabled", "ai-driven", "ai features", "ai products", "ai product", "prompt"],
  },
  {
    id: "product",
    label: "Product management",
    strength: "partial",
    evidence: "Founder and Product Manager of OsynJobs, a working product in active testing. This is founder-project evidence rather than a formal Product Manager title.",
    sources: [S.osyn, S.lab],
    keywords: ["product manage", "product owner", "roadmap", "product strategy", "product vision", "prioriti", "backlog", "product lifecycle", "product discovery", "product development", "requirements", "user stories", "prd", "mvp", "product-led", "product lead"],
  },
  {
    id: "builder",
    label: "Building working AI products",
    strength: "strong",
    evidence: "Designed and built OsynJobs end to end using AI-assisted development; maintains a Product Lab of prototypes.",
    sources: [S.osyn, S.lab],
    keywords: ["prototype", "prototyping", "build", "hands-on", "0 to 1", "zero to one", "0-1", "ship", "launch", "next.js", "react", "node", "javascript", "no-code", "low-code", "technical"],
  },
  {
    id: "ux",
    label: "UX and interface design",
    strength: "strong",
    evidence: "UI/UX work for StudyHub UK and end-to-end design of OsynJobs.",
    sources: [S.study, S.osyn],
    keywords: ["ux", "ui", "user experience", "user interface", "interaction design", "product design", "wirefram", "figma", "usability", "user-centered", "user-centred", "human-centered", "human-centred", "visual design"],
  },
  {
    id: "design-systems",
    label: "Design systems and brand systems",
    strength: "strong",
    evidence: "Design-system and brand-system work for StudyHub UK; template systems across many brands.",
    sources: [S.study, S.lax],
    keywords: ["design system", "design systems", "component library", "brand", "branding", "style guide", "brand guidelines"],
  },
  {
    id: "research",
    label: "Research and problem framing",
    strength: "partial",
    evidence: "Problem framing and first-hand workflow research on OsynJobs. Formal user-research programmes are not yet evidenced in the portfolio.",
    sources: [S.osyn],
    keywords: ["user research", "research", "customer interviews", "user interviews", "discovery", "market research", "competitive analysis", "user needs", "customer needs", "insights"],
  },
  {
    id: "multi-brand",
    label: "Multi-brand, international delivery",
    strength: "strong",
    evidence: "Delivered for approximately 20–25 UK eLearning marketplace brands and for the Saudi Compliance Institute, from Bangladesh.",
    sources: [S.lax, S.saudi],
    keywords: ["remote", "distributed", "international", "global", "multiple clients", "client-facing", "client facing", "agency", "time zones", "timezones", "multi-brand"],
  },
  {
    id: "media",
    label: "Learning media production",
    strength: "strong",
    evidence: "Voiceover optimization and AI-assisted learning media, including leading the production workflow.",
    sources: [S.media, S.exp],
    keywords: ["video", "voiceover", "voice-over", "multimedia", "media production", "audio", "animation"],
  },
  {
    id: "communication",
    label: "Communicating complex ideas",
    strength: "partial",
    evidence: "Documentation, training and onboarding for 30–35 contributors. No written publications are listed in the portfolio yet.",
    sources: [S.exp, S.about],
    keywords: ["communication", "communicat", "documentation", "presentation", "storytelling", "writing"],
  },
  {
    id: "compliance-learning",
    label: "Compliance learning",
    strength: "partial",
    evidence: "Led three functional teams on learning work for the Saudi Compliance Institute. Scope detail awaits confirmation.",
    sources: [S.saudi],
    keywords: ["compliance", "regulatory", "regulated"],
  },
  {
    id: "operations",
    label: "Production and delivery operations",
    strength: "strong",
    evidence: "Ran a two-shift cross-functional production workflow and supported delivery across many brands.",
    sources: [S.media, S.lax],
    keywords: ["operations", "product operations", "delivery", "project management", "program management", "programme management", "workflow", "process", "quality assurance", "qa "],
  },
];

/**
 * Common requirements the portfolio does NOT yet evidence. When a job
 * description mentions one, the agent says so plainly rather than stretching.
 */
export const knownGaps: { id: string; label: string; keywords: string[] }[] = [
  { id: "sql", label: "SQL and data analysis", keywords: ["sql", "data analysis", "data-driven", "tableau", "power bi", "looker", "excel modelling", "analytics"] },
  { id: "experimentation", label: "A/B testing and experimentation", keywords: ["a/b test", "ab test", "experimentation", "experiments"] },
  { id: "metrics", label: "Product metrics and KPI ownership", keywords: ["kpi", "okr", "north star", "retention", "conversion", "funnel", "growth metrics"] },
  { id: "certs", label: "Formal certifications", keywords: ["pmp", "cspo", "csm", "scrum master", "certified", "certification", "prince2", "cptd", "atd"] },
  { id: "degree", label: "Degree requirements", keywords: ["bachelor", "master's", "masters degree", "mba", "degree in", "phd"] },
  { id: "agile", label: "Agile and Scrum delivery tooling", keywords: ["agile", "scrum", "jira", "sprint", "kanban", "confluence"] },
  { id: "pm-title", label: "Years in a formal Product Manager title", keywords: ["years of product management", "years as a product manager", "years of experience as a product", "years in product"] },
  { id: "revenue", label: "Revenue, P&L or commercial ownership", keywords: ["p&l", "revenue", "pricing", "monetization", "monetisation", "commercial", "go-to-market", "gtm", "sales"] },
  { id: "saas", label: "B2B SaaS product experience", keywords: ["b2b", "saas", "enterprise software", "enterprise customers"] },
  { id: "eng", label: "Managing engineering teams", keywords: ["engineering team", "engineers", "developers", "technical team", "software development lifecycle", "sdlc", "api", "apis"] },
  { id: "ml", label: "Machine-learning model development", keywords: ["machine learning", "ml model", "model training", "data science", "nlp", "fine-tun", "python", "rag", "evals", "evaluation"] },
  { id: "lms-platforms", label: "Named LMS platforms", keywords: ["moodle", "canvas", "docebo", "cornerstone", "workday learning", "blackboard", "totara", "successfactors", "learnupon", "absorb", "360learning", "talentlms"] },
  { id: "standards", label: "SCORM, xAPI and learning standards", keywords: ["scorm", "xapi", "tin can", "cmi5", "lti"] },
  { id: "accessibility", label: "Accessibility standards in learning content", keywords: ["wcag", "accessibility", "section 508", "a11y"] },
  { id: "languages", label: "Specific language requirements", keywords: ["fluent in", "arabic", "french", "german", "spanish", "bilingual", "native speaker"] },
  { id: "budget", label: "Budget and vendor management", keywords: ["budget", "vendor", "procurement", "contract"] },
  { id: "hr-tech", label: "HR technology domain experience", keywords: ["hris", "ats", "applicant tracking", "talent acquisition", "hr tech", "workforce planning", "payroll"] },
  { id: "learning-analytics", label: "Learning analytics and impact measurement", keywords: ["learning analytics", "kirkpatrick", "roi of learning", "learning impact", "completion rates"] },
  { id: "mobile", label: "Native mobile product experience", keywords: ["ios", "android", "mobile app", "react native", "flutter"] },
  { id: "authorization", label: "Work authorization or on-site presence", keywords: ["work authorization", "visa", "on-site", "onsite", "hybrid", "relocat", "security clearance"] },
];

export interface RoleProfile {
  id: string;
  label: string;
  alignment: "Strong alignment" | "Relevant evidence" | "Transferable experience";
  why: string;
  strongest: string[];
  caseStudies: string[];
  resume: string;
  transferable: string[];
  discussion: string[];
}

export const roles: RoleProfile[] = [
  {
    id: "product-manager",
    label: "Product Manager",
    alignment: "Transferable experience",
    why: "Hands-on product evidence from a founder project, plus professional cross-functional leadership. No formal Product Manager title is claimed.",
    strongest: [
      "Founder and Product Manager of OsynJobs, a working product in active testing",
      "15–20-person cross-functional project led across two shifts",
      "3 functional teams led during Saudi Compliance Institute work",
      "Product Lab with honest status labels across seven initiatives",
    ],
    caseStudies: ["osynjobs", "ai-assisted-learning-media-workflow", "saudi-compliance-institute"],
    resume: "product-manager-ai-products",
    transferable: ["Problem framing", "Systems thinking from learning architecture", "Team enablement", "Delivery at scale"],
    discussion: ["Experience in a formal Product Manager title", "Product metrics and experimentation", "Working with engineering teams"],
  },
  {
    id: "ai-product-manager",
    label: "AI Product Manager",
    alignment: "Relevant evidence",
    why: "Has built an AI-assisted product end to end and led an AI-assisted workflow in production. Evidence is practical rather than from an AI PM title.",
    strongest: [
      "OsynJobs: a working AI-assisted product, built AI-natively",
      "Led an AI-assisted learning media workflow with a 15–20-person team",
      "Orchesyn: architecture exploration for an AI-native agentic workspace",
      "Principle in practice: AI should improve the workflow, not decorate it",
    ],
    caseStudies: ["osynjobs", "ai-assisted-learning-media-workflow"],
    resume: "product-manager-ai-products",
    transferable: ["Human-in-the-loop workflow design", "Introducing AI tools to teams", "Honest scoping of AI features"],
    discussion: ["Specific AI tools and models used", "Evaluation of AI output quality", "Experience in a formal AI PM title"],
  },
  {
    id: "learning-technology-manager",
    label: "Learning Technology Manager",
    alignment: "Strong alignment",
    why: "Direct professional evidence across scale, authoring systems, team leadership and AI-assisted media.",
    strongest: [
      "1,500–2,000+ courses developed or supported",
      "Approximately 20–25 UK eLearning marketplace brands",
      "Learning architecture",
      "Storyline and Rise framework development",
      "15–20-person cross-functional leadership",
      "AI-assisted learning media",
      "Mentoring and onboarding of 30–35 contributors",
    ],
    caseStudies: ["learning-architecture-at-scale", "ai-assisted-learning-media-workflow", "studyhub-uk"],
    resume: "learning-technology-manager",
    transferable: ["Product thinking applied to learning systems", "Design-system discipline", "AI-native building"],
    discussion: ["Named LMS platforms administered", "SCORM and xAPI standards", "Learning analytics and impact measurement"],
  },
  {
    id: "learning-systems-architect",
    label: "Learning Systems Architect",
    alignment: "Strong alignment",
    why: "Designing reusable learning structures and production systems is the centre of Riyad's professional work.",
    strongest: [
      "Learning architecture across 1,500–2,000+ courses",
      "Reusable Storyline and Rise frameworks and template systems",
      "One production system serving 20–25 brands",
      "AI-assisted media workflow design",
    ],
    caseStudies: ["learning-architecture-at-scale", "ai-assisted-learning-media-workflow", "saudi-compliance-institute"],
    resume: "learning-technology-manager",
    transferable: ["Product architecture from OsynJobs", "Team enablement"],
    discussion: ["Enterprise learning-ecosystem integration", "Learning standards and data"],
  },
  {
    id: "edtech-product-lead",
    label: "EdTech Product Lead",
    alignment: "Relevant evidence",
    why: "Combines deep learning-production experience with hands-on product building. Product leadership evidence comes from a founder project.",
    strongest: [
      "1,500–2,000+ courses across 20–25 UK brands",
      "OsynJobs: working AI-assisted product in active testing",
      "15–20-person cross-functional leadership",
      "AI-assisted learning media workflow",
    ],
    caseStudies: ["learning-architecture-at-scale", "osynjobs", "ai-assisted-learning-media-workflow"],
    resume: "product-manager-ai-products",
    transferable: ["Understands learners, content and production together", "Design and UX capability"],
    discussion: ["Ownership of a commercial EdTech product roadmap", "Product metrics and growth"],
  },
  {
    id: "product-designer",
    label: "Product Designer",
    alignment: "Relevant evidence",
    why: "Real interface and design-system work, with a self-designed product. Approved visual evidence is still being added.",
    strongest: [
      "UI/UX and design-system work for StudyHub UK",
      "End-to-end design of OsynJobs",
      "Template systems across a large course catalogue",
    ],
    caseStudies: ["studyhub-uk", "osynjobs", "learning-architecture-at-scale"],
    resume: "creative-product-ux-designer",
    transferable: ["Product and systems thinking", "Can build what is designed"],
    discussion: ["Published visual case-study material", "Formal usability testing"],
  },
  {
    id: "creative-ux-designer",
    label: "Creative UX Designer",
    alignment: "Relevant evidence",
    why: "Interface, brand and learning-experience design treated as one system.",
    strongest: [
      "StudyHub UK: interface, design-system and brand-system work",
      "Interactive learning experiences in Storyline and Rise",
      "Brand systems across many marketplace brands",
    ],
    caseStudies: ["studyhub-uk", "learning-architecture-at-scale", "osynjobs"],
    resume: "creative-product-ux-designer",
    transferable: ["Learning design", "Prototyping in code"],
    discussion: ["Published visual case-study material", "Motion or illustration specialisms"],
  },
  {
    id: "learning-experience-lead",
    label: "Learning Experience Lead",
    alignment: "Strong alignment",
    why: "Learning design, interface design and team leadership are all directly evidenced.",
    strongest: [
      "Learning architecture across 1,500–2,000+ courses",
      "Interactive learning experiences and template systems",
      "30–35 contributors trained, mentored, or onboarded",
      "UI/UX work including StudyHub UK",
    ],
    caseStudies: ["learning-architecture-at-scale", "studyhub-uk", "ai-assisted-learning-media-workflow"],
    resume: "learning-technology-manager",
    transferable: ["AI-assisted production", "Product thinking"],
    discussion: ["Learner research and outcome measurement"],
  },
];

export const otherRole: RoleProfile = {
  id: "other",
  label: "Other",
  alignment: "Transferable experience",
  why: "For a role not listed, the fairest route is to compare the job description directly against the portfolio evidence.",
  strongest: [
    "1,500–2,000+ eLearning courses developed or supported",
    "15–20-person cross-functional project led across two shifts",
    "OsynJobs: working AI-assisted product in active testing",
  ],
  caseStudies: ["osynjobs", "learning-architecture-at-scale", "ai-assisted-learning-media-workflow"],
  resume: "product-manager-ai-products",
  transferable: ["Systems thinking", "Team enablement", "AI-native building"],
  discussion: ["Paste the job description to compare specific requirements"],
};

/** Transparent résumé rules: keyword → variant. Shown to the visitor. */
export const resumeRules: { resume: string; when: string; keywords: string[] }[] = [
  {
    resume: "learning-technology-manager",
    when: "The role is centred on learning, training, eLearning, instructional design or learning platforms.",
    keywords: ["learning", "elearning", "e-learning", "training", "instructional", "lms", "l&d", "curriculum", "education", "course", "storyline", "enablement"],
  },
  {
    resume: "creative-product-ux-designer",
    when: "The role is centred on design: UX, UI, product design, design systems or brand.",
    keywords: ["design", "designer", "ux", "ui", "creative", "brand", "visual", "figma", "interface"],
  },
  {
    resume: "product-manager-ai-products",
    when: "The role is centred on product management, AI products, product operations or founding work.",
    keywords: ["product", "pm", "ai", "roadmap", "startup", "founder", "operations", "saas", "automation", "strategy"],
  },
];
