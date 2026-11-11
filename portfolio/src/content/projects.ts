import type { CaseStudy } from "./types";

/**
 * Case studies. Every section carries an evidence status.
 * - Anything marked "awaiting-confirmation" is shown with a visible draft label
 *   and is NOT available to Riyad AI until it is confirmed.
 * - Placeholders in [SQUARE BRACKETS] are deliberate: replace them with real,
 *   approved material. Never fill them with invented content.
 */

const REVIEWED = "2026-11-11";

export const projects: CaseStudy[] = [
  {
    slug: "osynjobs",
    title: "OsynJobs",
    headline: "Building the job-search product I needed myself.",
    summary:
      "OsynJobs is a working AI-assisted job-search product designed to organize and improve a fragmented job-search workflow.",
    classification: ["AI Product", "Career Technology", "Founder Project", "Active Testing"],
    kind: "Personal product",
    status: "testing",
    statusLabel: "Active testing",
    timeline: "[VERIFY BEFORE PUBLISHING: start date] — present",
    accent: "product",
    perspectives: ["product", "creative"],
    disciplines: ["Product", "AI", "UX"],
    proof: ["Working product", "Founder-built", "In active testing"],
    roles: ["Founder", "Product Manager", "UX Designer", "AI-Native Builder", "Product Tester"],
    sections: {
      context: {
        body: [
          "OsynJobs is a personal founder project. I started it while running my own international job search and finding that the work of searching was scattered across too many places.",
          "It is a working product in active testing. It is not commercially launched, and this page describes it at that stage.",
        ],
        evidence: "personal-project",
      },
      problem: {
        body: [
          "A serious job search is a workflow, not a single task: finding roles, judging fit, adapting a résumé, applying, and keeping track of what happened. Each step tends to live in a different tool, so the person doing the search becomes the integration layer.",
          "The problem OsynJobs addresses is that fragmentation — the lost context, repeated effort and missed follow-ups it causes.",
        ],
        evidence: "personal-project",
      },
      whyItMattered: {
        body: [
          "I needed it myself. That gave the project an honest first test: if the product did not make my own search easier, it was not working.",
          "It also matters beyond me. Access to better opportunities is part of my professional mission, and job search is where that access is won or lost.",
        ],
        evidence: "personal-project",
      },
      users: {
        body: [
          "The first user is me: a professional searching for international remote roles. The wider intended audience is job seekers managing a search across many sources.",
        ],
        placeholders: ["[ADD REAL TESTING INSIGHT: who else has used it, and how]"],
        evidence: "personal-project",
      },
      constraints: {
        list: [
          "Built by one person acting as founder, product manager, designer, builder and tester.",
          "Built AI-natively: AI tools are part of how the product is made, not only a feature inside it.",
          "Tested through real use rather than a formal research programme.",
        ],
        evidence: "personal-project",
      },
      role: {
        body: [
          "I hold every role on this product: Founder, Product Manager, UX Designer, AI-Native Builder and Product Tester. The value of the project as evidence is exactly that — it shows the whole chain from need to working software.",
        ],
        evidence: "personal-project",
      },
      collaborators: {
        body: ["None. OsynJobs is a solo project built with AI-assisted development."],
        placeholders: ["[VERIFY BEFORE PUBLISHING: confirm no collaborators or advisors to credit]"],
        evidence: "personal-project",
      },
      research: {
        body: [
          "The primary research input is first-hand: my own job-search workflow, documented as I went.",
        ],
        placeholders: [
          "[ADD SANITIZED PROCESS: workflow map of the search before OsynJobs]",
          "[ADD REAL TESTING INSIGHT: competitor or alternative-tool review, if carried out]",
        ],
        evidence: "personal-project",
      },
      strategy: {
        body: [
          "Product vision: one calm place where a job search is organised from first sighting to final outcome.",
          "The strategy is to organise the workflow first and add AI assistance where it removes repeated effort — not to lead with AI as the product.",
        ],
        list: [
          "Organise before automating.",
          "AI should improve the workflow, not decorate it.",
          "The job seeker stays in control of every application.",
          "Honest scope: a focused tool, not a super app.",
        ],
        evidence: "awaiting-confirmation",
        note: {
          title: "Why these principles are marked as draft",
          body: "These principles were drafted from the project brief to give the case study its structure. Riyad should confirm or rewrite them in his own words before publishing.",
        },
      },
      ia: {
        body: [
          "The information architecture follows the search itself, so the structure of the product mirrors the structure of the task.",
        ],
        placeholders: ["[ADD APPROVED SCREENSHOT: navigation or sitemap of the current product]"],
        evidence: "awaiting-confirmation",
      },
      architecture: {
        body: [
          "The core workflow is modelled as a sequence of stages a role passes through. The walkthrough on this page shows that model.",
        ],
        placeholders: [
          "[VERIFY BEFORE PUBLISHING: confirm the stages match the shipped product]",
          "[ADD SANITIZED PROCESS: system architecture and where AI is called]",
        ],
        evidence: "awaiting-confirmation",
      },
      visualDesign: {
        body: ["The interface system is designed to be quiet and legible: a job search is stressful enough without the tool adding noise."],
        placeholders: ["[ADD APPROVED SCREENSHOT: real product interface]", "[ADD APPROVED SCREENSHOT: interface components]"],
        evidence: "awaiting-confirmation",
      },
      implementation: {
        body: [
          "OsynJobs exists as working software, built AI-natively by me. It is used and tested as a real product rather than presented as a mock-up.",
        ],
        placeholders: ["[VERIFY BEFORE PUBLISHING: technology stack]", "[ADD VERIFIED RESULT: list of AI-assisted features that are live]"],
        evidence: "personal-project",
      },
      testing: {
        body: [
          "Testing is continuous and practical: I use the product for real job-search work and record where it helps and where it gets in the way.",
        ],
        placeholders: ["[ADD REAL TESTING INSIGHT: three specific findings from testing]"],
        evidence: "personal-project",
      },
      iteration: {
        body: ["The product changes in response to use. An iteration log belongs here once the entries are approved."],
        placeholders: ["[ADD SANITIZED PROCESS: iteration log — what changed, and why]"],
        evidence: "awaiting-confirmation",
      },
      challenges: {
        list: [
          "Holding every role at once makes it easy to build instead of validate.",
          "Being my own first user is useful and also a bias: my needs are not everyone's.",
          "AI-assisted features must be reliable enough to trust with something as consequential as a job application.",
        ],
        evidence: "personal-project",
      },
      tradeoffs: {
        list: [
          "Focus over breadth: a narrower product that works, rather than a broad one that does not.",
          "Real use over polish: testing a working product early rather than perfecting screens.",
          "Human control over full automation: assistance, not auto-applying on someone's behalf.",
        ],
        evidence: "awaiting-confirmation",
      },
      outcome: {
        body: [
          "The outcome so far is a working product in active testing and a complete, first-hand record of taking a problem from personal need to software.",
          "There are no usage, revenue or adoption figures to report, and none are claimed.",
        ],
        placeholders: ["[ADD VERIFIED RESULT]"],
        evidence: "personal-project",
      },
      evidence: {
        list: [
          "Working product, built by Riyad — Personal project.",
          "Status: active testing — Personal project.",
          "Roles held: Founder, Product Manager, UX Designer, AI-Native Builder, Product Tester.",
        ],
        placeholders: ["[ADD REAL SCREENSHOT]", "[ADD VERIFIED METRIC]"],
        evidence: "personal-project",
      },
      limitations: {
        list: [
          "Not commercially launched.",
          "No verified external user data yet.",
          "Tested primarily by its builder.",
          "Features and roadmap on this page await confirmation against the live product.",
        ],
        evidence: "personal-project",
      },
      lessons: {
        list: [
          "Building the product you need is the fastest route to an honest brief.",
          "Organising a workflow is often more valuable than adding intelligence to a broken one.",
          "Labelling status honestly is a product decision, not a weakness.",
        ],
        evidence: "awaiting-confirmation",
      },
      currentStatus: {
        body: ["Active testing. OsynJobs is a working product being tested through real use."],
        evidence: "personal-project",
      },
      nextSteps: {
        body: ["The next milestone is to move from self-testing to structured testing with other job seekers."],
        placeholders: ["[VERIFY BEFORE PUBLISHING: confirmed next milestone and roadmap]"],
        evidence: "awaiting-confirmation",
      },
    },
    diagram: {
      title: "A job search, as one connected workflow",
      caption: "Concept visualization. Not current production interface.",
      conceptual: true,
      steps: [
        { label: "Discover", detail: "Roles arrive from many sources. The first job is to get them into one place." },
        { label: "Evaluate", detail: "Decide whether a role is worth pursuing, with the reasons kept alongside it." },
        { label: "Tailor", detail: "Prepare the right version of a résumé and message for this role." },
        { label: "Apply", detail: "Submit — always by the person, never automatically on their behalf." },
        { label: "Track", detail: "Know what was sent, when, and what should happen next." },
        { label: "Reflect", detail: "Learn from outcomes so the next application is better than the last." },
      ],
    },
    related: ["ai-assisted-learning-media-workflow", "studyhub-uk"],
    lastReviewed: REVIEWED,
  },
  {
    slug: "learning-architecture-at-scale",
    title: "Learning Architecture at Scale",
    headline: "One learning system. Twenty-plus brands. Well over a thousand courses.",
    summary:
      "Learning architecture, authoring frameworks and template systems behind 1,500–2,000+ eLearning courses for approximately 20–25 UK marketplace brands.",
    classification: ["Learning Technology", "Learning Architecture", "Professional Work"],
    kind: "Professional work",
    status: "completed",
    statusLabel: "Completed",
    timeline: "[VERIFY BEFORE PUBLISHING: employer and dates]",
    accent: "learning",
    perspectives: ["learning", "creative"],
    disciplines: ["Learning", "Systems", "Leadership"],
    proof: ["1,500–2,000+ courses", "20–25 UK brands", "Storyline and Rise frameworks"],
    roles: ["Learning architecture", "Course development", "Template and framework systems"],
    sections: {
      context: {
        body: [
          "This work covers eLearning production for UK eLearning marketplace brands. Across it, I developed or supported approximately 1,500–2,000+ courses for approximately 20–25 brands.",
        ],
        placeholders: ["[VERIFY BEFORE PUBLISHING: employer name, official title and dates]"],
        evidence: "approximate",
      },
      problem: {
        body: [
          "At that volume, building each course as a one-off does not work. Quality drifts, every brand looks slightly different for no good reason, and new contributors take too long to become useful.",
          "The problem was how to produce learning at scale without losing consistency — and without making the output depend on a few experienced individuals.",
        ],
        evidence: "professional-work",
      },
      whyItMattered: {
        body: [
          "A marketplace lives on the breadth and reliability of its catalogue. A production system that scales is what makes a catalogue of that size possible.",
        ],
        evidence: "professional-work",
      },
      users: {
        list: [
          "Learners taking the courses.",
          "Course developers and contributors building them.",
          "The brands whose catalogues the courses belonged to.",
        ],
        evidence: "professional-work",
      },
      constraints: {
        list: [
          "High volume across many brands at once.",
          "Authoring in Articulate Storyline and Rise.",
          "Contributors with varied levels of experience.",
        ],
        placeholders: ["[ADD SANITIZED PROCESS: delivery timelines and quality requirements]"],
        evidence: "professional-work",
      },
      role: {
        body: [
          "My role grew from building individual courses into designing the structures other people built with: learning architecture, and reusable Storyline and Rise frameworks and templates.",
        ],
        placeholders: ["[VERIFY BEFORE PUBLISHING: official title(s) held]"],
        evidence: "professional-work",
      },
      collaborators: {
        body: ["Course developers, voiceover and media contributors, and the wider production operation."],
        placeholders: ["[VERIFY BEFORE PUBLISHING: team structure, without naming individuals]"],
        evidence: "awaiting-confirmation",
      },
      research: {
        body: ["A framework for many brands has to start from how courses are really being built, not from how the process document says they are."],
        placeholders: ["[ADD SANITIZED PROCESS: what was reviewed before the frameworks were designed]"],
        evidence: "awaiting-confirmation",
      },
      strategy: {
        body: [
          "The learning strategy was to move effort from individual assets to shared systems: decide the structure once, encode it in templates, and let each course inherit it.",
        ],
        evidence: "professional-work",
      },
      ia: {
        body: ["Courses were given a consistent architecture so that learners meet a familiar structure and developers start from a known shape."],
        placeholders: ["[ADD SANITIZED PROCESS: standard course structure diagram]"],
        evidence: "awaiting-confirmation",
      },
      architecture: {
        body: [
          "The production system connects a learning architecture, authoring frameworks in Storyline and Rise, and the LMS workflows used to publish courses.",
        ],
        placeholders: ["[ADD SANITIZED PROCESS: production workflow from brief to published course]"],
        evidence: "professional-work",
      },
      visualDesign: {
        body: ["Template systems carried the visual layer, so brand differences were handled by the system rather than rebuilt by hand."],
        placeholders: ["[ADD APPROVED SCREENSHOT: sanitized template examples]"],
        evidence: "awaiting-confirmation",
      },
      implementation: {
        body: ["The frameworks were built in Articulate Storyline and Rise and used in day-to-day course production."],
        evidence: "professional-work",
      },
      testing: {
        body: ["The real test of a template system is production: whether people other than its author can build good courses with it."],
        placeholders: ["[ADD REAL TESTING INSIGHT: how frameworks were reviewed and quality-checked]"],
        evidence: "awaiting-confirmation",
      },
      iteration: {
        placeholders: ["[ADD SANITIZED PROCESS: how the frameworks changed over time]"],
        evidence: "awaiting-confirmation",
      },
      challenges: {
        list: [
          "Keeping quality consistent while volume grows.",
          "Serving many brands without multiplying the work.",
          "Bringing new contributors up to standard quickly.",
        ],
        evidence: "professional-work",
      },
      tradeoffs: {
        list: [
          "Standardisation over bespoke design: a consistent structure, with less freedom per course.",
          "Investing in frameworks first, which costs time before it saves any.",
        ],
        evidence: "awaiting-confirmation",
      },
      outcome: {
        body: [
          "Approximately 1,500–2,000+ courses developed or supported across approximately 20–25 UK eLearning marketplace brands, built on shared learning architecture and authoring frameworks.",
        ],
        placeholders: ["[ADD VERIFIED RESULT: production-time or quality change, if measured]"],
        evidence: "approximate",
      },
      evidence: {
        list: [
          "1,500–2,000+ eLearning courses developed or supported — Approximate scope.",
          "20–25 UK eLearning marketplace brands — Approximate scope.",
          "Storyline and Rise framework development — Professional work.",
        ],
        placeholders: ["[ADD APPROVED SCREENSHOT]", "[ADD APPROVED FEEDBACK]"],
        evidence: "approximate",
      },
      limitations: {
        list: [
          "Figures are approximate professional scope, not audited counts.",
          "Employer materials are not shown; examples must be sanitized before publishing.",
          "No learner-outcome data is claimed.",
        ],
        evidence: "verified",
      },
      lessons: {
        list: [
          "Scale is a design problem before it is a staffing problem.",
          "A template is a decision made once so it does not have to be made a thousand times.",
          "Build systems, not isolated assets.",
        ],
        evidence: "awaiting-confirmation",
      },
      currentStatus: {
        body: ["Completed professional work. The approach now informs how I design learning systems and products."],
        evidence: "professional-work",
      },
      nextSteps: {
        body: ["Publish sanitized examples of the frameworks and course structure once approved."],
        evidence: "verified",
      },
    },
    diagram: {
      title: "From single courses to a production system",
      caption: "Simplified model of the system. Sanitized; not an internal document.",
      conceptual: true,
      steps: [
        { label: "Learning architecture", detail: "A consistent course structure decided once." },
        { label: "Authoring frameworks", detail: "Storyline and Rise templates that encode the structure." },
        { label: "Course production", detail: "Contributors build on the frameworks instead of starting from blank." },
        { label: "LMS workflow", detail: "Courses are published through a repeatable workflow." },
        { label: "Catalogue", detail: "1,500–2,000+ courses across 20–25 brands." },
      ],
    },
    related: ["ai-assisted-learning-media-workflow", "studyhub-uk", "saudi-compliance-institute"],
    lastReviewed: REVIEWED,
  },
  {
    slug: "ai-assisted-learning-media-workflow",
    title: "AI-Assisted Learning Media Workflow",
    headline: "Putting AI inside the production line, with people around it.",
    summary:
      "An AI-assisted learning media workflow delivered by a 15–20-person cross-functional team working across two shifts.",
    classification: ["AI Workflow", "Learning Media", "Cross-Functional Leadership", "Professional Work"],
    kind: "Professional work",
    status: "completed",
    statusLabel: "Completed",
    timeline: "[VERIFY BEFORE PUBLISHING: employer and dates]",
    accent: "ai",
    perspectives: ["learning", "product"],
    disciplines: ["AI", "Leadership", "Learning"],
    proof: ["15–20 people led", "Two shifts", "AI-assisted media"],
    roles: ["Project lead", "Workflow design", "Team enablement"],
    sections: {
      context: {
        body: [
          "Learning media — voiceover, video and supporting assets — is one of the slowest parts of course production. This project introduced AI assistance into that work.",
          "I led the project: a cross-functional team of approximately 15–20 people operating across two shifts.",
        ],
        placeholders: ["[VERIFY BEFORE PUBLISHING: employer, official title and dates]"],
        evidence: "approximate",
      },
      problem: {
        body: [
          "Media production at volume is repetitive and hard to keep consistent. AI tools can help, but dropped into a team without a workflow they create new inconsistency instead of removing it.",
        ],
        evidence: "professional-work",
      },
      whyItMattered: {
        body: ["Media is where production time goes. Improving that step improves the whole pipeline — if quality holds."],
        evidence: "professional-work",
      },
      users: {
        list: ["The production team using the workflow each day.", "Learners receiving the finished media."],
        evidence: "professional-work",
      },
      constraints: {
        list: [
          "Two shifts, so work had to hand over cleanly between people who are never online together.",
          "Several functions involved in one output.",
          "AI output needs human review before it reaches a learner.",
        ],
        evidence: "professional-work",
      },
      role: {
        body: [
          "I led the 15–20-person cross-functional project across both shifts, and trained and supported contributors in the workflow.",
        ],
        placeholders: ["[VERIFY BEFORE PUBLISHING: official title]"],
        evidence: "approximate",
      },
      collaborators: {
        body: ["A cross-functional production team working in two shifts."],
        placeholders: ["[VERIFY BEFORE PUBLISHING: the functions involved, without naming individuals]"],
        evidence: "professional-work",
      },
      research: {
        placeholders: ["[ADD SANITIZED PROCESS: how the existing media process was assessed]", "[VERIFY BEFORE PUBLISHING: AI tools evaluated]"],
        evidence: "awaiting-confirmation",
      },
      strategy: {
        body: [
          "The principle was simple: AI should improve the workflow, not decorate it. That meant designing the human steps — briefing, review, correction, sign-off — as carefully as the AI ones.",
        ],
        evidence: "professional-work",
      },
      ia: {
        body: ["Shared structure for briefs, files and handovers so that either shift could pick up any piece of work."],
        placeholders: ["[ADD SANITIZED PROCESS: handover and file structure]"],
        evidence: "awaiting-confirmation",
      },
      architecture: {
        body: ["The workflow places AI generation between human preparation and human review, with a clean handover point between shifts."],
        placeholders: ["[ADD SANITIZED PROCESS: confirmed workflow diagram]"],
        evidence: "awaiting-confirmation",
      },
      visualDesign: {
        body: ["Not primarily a visual design project. Media standards were set so output from different people stayed consistent."],
        placeholders: ["[ADD APPROVED SCREENSHOT: sanitized media example]"],
        evidence: "awaiting-confirmation",
      },
      implementation: {
        body: ["The workflow ran in production with the full team across both shifts."],
        placeholders: ["[VERIFY BEFORE PUBLISHING: specific AI tools used]"],
        evidence: "professional-work",
      },
      testing: {
        placeholders: ["[ADD REAL TESTING INSIGHT: how output quality was checked]"],
        evidence: "awaiting-confirmation",
      },
      iteration: {
        placeholders: ["[ADD SANITIZED PROCESS: what changed after the first weeks of use]"],
        evidence: "awaiting-confirmation",
      },
      challenges: {
        list: [
          "Coordinating people who work at different times.",
          "Introducing AI tools to a team with different levels of confidence.",
          "Keeping quality consistent when part of the output is generated.",
        ],
        evidence: "professional-work",
      },
      tradeoffs: {
        list: ["Human review on every output: slower than full automation, and the reason the result can be trusted."],
        evidence: "awaiting-confirmation",
      },
      outcome: {
        body: ["A working AI-assisted media workflow, run by a 15–20-person cross-functional team across two shifts."],
        placeholders: ["[ADD VERIFIED RESULT: time, volume or quality change]"],
        evidence: "approximate",
      },
      evidence: {
        list: [
          "15–20 people led across a two-shift cross-functional project — Approximate scope.",
          "Part of the 30–35 contributors trained, mentored, or onboarded across broader operations — Approximate scope.",
        ],
        placeholders: ["[ADD APPROVED FEEDBACK]", "[ADD VERIFIED METRIC]"],
        evidence: "approximate",
      },
      limitations: {
        list: ["No measured efficiency figures are claimed.", "Tools and internal process are not shown until sanitized and approved."],
        evidence: "verified",
      },
      lessons: {
        list: [
          "An AI tool is not a workflow. The workflow is the product.",
          "Handover quality decides whether a two-shift team is one team or two.",
          "Give teams tools, not dependency.",
        ],
        evidence: "awaiting-confirmation",
      },
      currentStatus: { body: ["Completed professional work."], evidence: "professional-work" },
      nextSteps: {
        body: ["I continue this line of work independently in the Product Lab as the eLearning Video Studio experiment."],
        evidence: "personal-project",
      },
    },
    diagram: {
      title: "AI in the middle, people on both sides",
      caption: "Concept visualization of the workflow principle. Not an internal process document.",
      conceptual: true,
      steps: [
        { label: "Prepare", detail: "People define what is needed and to what standard." },
        { label: "Generate", detail: "AI assists with producing the media." },
        { label: "Review", detail: "People check and correct every output." },
        { label: "Hand over", detail: "Work passes cleanly between shifts." },
        { label: "Publish", detail: "Approved media goes into the course." },
      ],
    },
    related: ["learning-architecture-at-scale", "saudi-compliance-institute", "osynjobs"],
    lastReviewed: REVIEWED,
  },
  {
    slug: "studyhub-uk",
    title: "StudyHub UK",
    headline: "Design as a system: interface, brand and learning experience together.",
    summary:
      "Creative product and UX work for a UK learning brand — interface design, design systems, brand systems and interactive learning experiences.",
    classification: ["Creative UX", "Design Systems", "Learning Experience", "Professional Work"],
    kind: "Professional work",
    status: "completed",
    statusLabel: "Completed",
    timeline: "[VERIFY BEFORE PUBLISHING: dates]",
    accent: "creative",
    perspectives: ["creative", "learning"],
    disciplines: ["UX", "Design systems", "Brand"],
    proof: ["Interface design", "Design systems", "Brand systems"],
    roles: ["UI/UX design", "Design systems", "Prototyping"],
    sections: {
      context: {
        body: ["StudyHub UK is a UK learning brand. My work on it sits at the creative end of my practice: interface design, design systems, brand systems and interactive learning experiences."],
        placeholders: ["[VERIFY BEFORE PUBLISHING: engagement type, official title and dates]"],
        evidence: "professional-work",
      },
      problem: {
        body: ["A learning brand has to feel coherent everywhere a learner meets it — site, course and content. Without a system, every new page or course becomes a fresh design decision."],
        evidence: "awaiting-confirmation",
      },
      whyItMattered: {
        body: ["For a learner choosing a course, clarity and consistency are signals of quality before they have seen a single lesson."],
        evidence: "awaiting-confirmation",
      },
      users: { list: ["Prospective learners browsing courses.", "Enrolled learners using the learning experience."], evidence: "awaiting-confirmation" },
      constraints: { placeholders: ["[ADD SANITIZED PROCESS: platform, brand and delivery constraints]"], evidence: "awaiting-confirmation" },
      role: {
        body: ["UI/UX design, design-system and brand-system work, and prototyping of interactive learning experiences."],
        placeholders: ["[VERIFY BEFORE PUBLISHING: official title]"],
        evidence: "professional-work",
      },
      collaborators: { placeholders: ["[VERIFY BEFORE PUBLISHING: collaborating roles]"], evidence: "awaiting-confirmation" },
      research: { placeholders: ["[ADD SANITIZED PROCESS: what informed the design direction]"], evidence: "awaiting-confirmation" },
      strategy: {
        body: ["Treat the brand, the interface and the learning experience as one system with shared components, rather than three separate design jobs."],
        evidence: "awaiting-confirmation",
      },
      ia: { placeholders: ["[ADD APPROVED SCREENSHOT: site or course structure]"], evidence: "awaiting-confirmation" },
      architecture: {
        body: ["A design system links brand foundations to interface components and on to learning-experience patterns."],
        evidence: "awaiting-confirmation",
      },
      visualDesign: {
        body: ["This is the centre of the project: a visual language applied consistently across interface and learning content."],
        placeholders: ["[ADD APPROVED SCREENSHOT: interface designs]", "[ADD APPROVED SCREENSHOT: design-system components]"],
        evidence: "awaiting-confirmation",
      },
      implementation: {
        body: ["Designs were prototyped so that interactions could be judged in use, not only on a static page."],
        placeholders: ["[ADD APPROVED SCREENSHOT: prototype]"],
        evidence: "awaiting-confirmation",
      },
      testing: { placeholders: ["[ADD REAL TESTING INSIGHT]"], evidence: "awaiting-confirmation" },
      iteration: { placeholders: ["[ADD SANITIZED PROCESS: before-and-after design iterations]"], evidence: "awaiting-confirmation" },
      challenges: { list: ["Keeping a brand coherent across marketing pages and learning content, which have different jobs to do."], evidence: "awaiting-confirmation" },
      tradeoffs: { list: ["System consistency over one-off expressive pages."], evidence: "awaiting-confirmation" },
      outcome: {
        body: ["Interface, design-system and brand-system work delivered for StudyHub UK."],
        placeholders: ["[ADD VERIFIED RESULT]"],
        evidence: "professional-work",
      },
      evidence: {
        list: ["UI/UX, design-system and brand-system work for StudyHub UK — Professional work."],
        placeholders: ["[ADD REAL SCREENSHOT]", "[ADD APPROVED FEEDBACK]"],
        evidence: "professional-work",
      },
      limitations: {
        list: ["Visual evidence is not yet published; approved screenshots are required.", "No conversion or engagement results are claimed."],
        evidence: "verified",
      },
      lessons: {
        list: ["A design system is how a small team stays consistent.", "Learning content is part of the product interface, not separate from it."],
        evidence: "awaiting-confirmation",
      },
      currentStatus: { body: ["Professional work. Visual case-study material is awaiting approval for publication."], evidence: "professional-work" },
      nextSteps: { body: ["Add approved screenshots and a sanitized design-system overview."], evidence: "verified" },
    },
    diagram: {
      title: "One system, three surfaces",
      caption: "Concept visualization. Not a client deliverable.",
      conceptual: true,
      steps: [
        { label: "Brand system", detail: "Foundations: colour, type, tone." },
        { label: "Design system", detail: "Reusable interface components." },
        { label: "Interface", detail: "Pages and flows built from components." },
        { label: "Learning experience", detail: "Courses that feel like the same product." },
      ],
    },
    related: ["learning-architecture-at-scale", "osynjobs"],
    lastReviewed: REVIEWED,
  },
  {
    slug: "saudi-compliance-institute",
    title: "Saudi Compliance Institute",
    headline: "Three functional teams, one delivery.",
    summary:
      "Cross-functional leadership of three functional teams delivering learning work for the Saudi Compliance Institute.",
    classification: ["Cross-Functional Leadership", "Compliance Learning", "Professional Work"],
    kind: "Professional work",
    status: "completed",
    statusLabel: "Completed",
    timeline: "[VERIFY BEFORE PUBLISHING: dates]",
    accent: "learning",
    perspectives: ["learning", "product"],
    disciplines: ["Leadership", "Learning", "Delivery"],
    proof: ["3 functional teams led", "International client", "Compliance learning"],
    roles: ["Cross-functional lead"],
    sections: {
      context: {
        body: ["Learning work delivered for the Saudi Compliance Institute. During this work I led three functional teams."],
        placeholders: ["[VERIFY BEFORE PUBLISHING: engagement description, official title and dates]"],
        evidence: "approximate",
      },
      problem: {
        body: ["Compliance learning has to be accurate and consistent, and delivering it involves several functions that each see only part of the picture. The leadership problem is keeping those parts moving as one delivery."],
        evidence: "awaiting-confirmation",
      },
      whyItMattered: { body: ["In compliance training, an error is not a cosmetic issue. Coordination is part of quality."], evidence: "awaiting-confirmation" },
      users: { placeholders: ["[VERIFY BEFORE PUBLISHING: learner audience]"], evidence: "awaiting-confirmation" },
      constraints: {
        list: ["An international client.", "Several functions contributing to one output."],
        placeholders: ["[ADD SANITIZED PROCESS: language, regulatory or timeline constraints]"],
        evidence: "awaiting-confirmation",
      },
      role: {
        body: ["I led three functional teams during the Saudi Compliance Institute work."],
        placeholders: ["[VERIFY BEFORE PUBLISHING: which three functions, and official title]"],
        evidence: "approximate",
      },
      collaborators: { body: ["Three functional teams."], placeholders: ["[VERIFY BEFORE PUBLISHING: functions and client-side roles]"], evidence: "approximate" },
      research: { placeholders: ["[ADD SANITIZED PROCESS]"], evidence: "awaiting-confirmation" },
      strategy: { body: ["Align three functions around a shared definition of done, so that handoffs do not become the place where quality is lost."], evidence: "awaiting-confirmation" },
      ia: { placeholders: ["[ADD SANITIZED PROCESS: programme or course structure]"], evidence: "awaiting-confirmation" },
      architecture: { body: ["A delivery workflow connecting three functions with shared checkpoints."], placeholders: ["[ADD SANITIZED PROCESS: confirmed workflow]"], evidence: "awaiting-confirmation" },
      visualDesign: { placeholders: ["[ADD APPROVED SCREENSHOT]"], evidence: "awaiting-confirmation" },
      implementation: { placeholders: ["[VERIFY BEFORE PUBLISHING: what was delivered]"], evidence: "awaiting-confirmation" },
      testing: { placeholders: ["[ADD REAL TESTING INSIGHT: review and sign-off process]"], evidence: "awaiting-confirmation" },
      iteration: { placeholders: ["[ADD SANITIZED PROCESS]"], evidence: "awaiting-confirmation" },
      challenges: { list: ["Leading across functions with different priorities and working methods."], evidence: "professional-work" },
      tradeoffs: { placeholders: ["[ADD SANITIZED PROCESS]"], evidence: "awaiting-confirmation" },
      outcome: {
        body: ["Three functional teams led through delivery for the Saudi Compliance Institute."],
        placeholders: ["[ADD VERIFIED RESULT]"],
        evidence: "approximate",
      },
      evidence: {
        list: ["3 functional teams led during Saudi Compliance Institute work — Approximate scope."],
        placeholders: ["[ADD APPROVED FEEDBACK]", "[ADD APPROVED SCREENSHOT]"],
        evidence: "approximate",
      },
      limitations: {
        list: ["Client material is confidential and is not shown.", "Details of scope and deliverables await confirmation before publishing."],
        evidence: "verified",
      },
      lessons: {
        list: ["Cross-functional leadership is mostly the design of handoffs.", "Make complexity understandable — for the team first, then the learner."],
        evidence: "awaiting-confirmation",
      },
      currentStatus: { body: ["Professional work."], evidence: "professional-work" },
      nextSteps: { body: ["Confirm publishable scope with the client relationship in mind, then add sanitized detail."], evidence: "verified" },
    },
    diagram: {
      title: "Three functions, shared checkpoints",
      caption: "Concept visualization. Function names await confirmation.",
      conceptual: true,
      steps: [
        { label: "Function A", detail: "[VERIFY BEFORE PUBLISHING]" },
        { label: "Function B", detail: "[VERIFY BEFORE PUBLISHING]" },
        { label: "Function C", detail: "[VERIFY BEFORE PUBLISHING]" },
        { label: "Shared delivery", detail: "One definition of done across all three." },
      ],
    },
    related: ["ai-assisted-learning-media-workflow", "learning-architecture-at-scale"],
    lastReviewed: REVIEWED,
  },
];

export const projectBySlug = (slug: string) => projects.find((p) => p.slug === slug);

/** OsynJobs-only additions for the flagship case study. */
export const osynjobsExtras = {
  fragmented: [
    "Job boards and company pages",
    "Saved links and browser tabs",
    "Multiple résumé versions",
    "A spreadsheet or notes for tracking",
    "Email for follow-ups",
  ],
  featureMap: {
    note: "[VERIFY BEFORE PUBLISHING] Workflow areas drafted from the brief. Confirm each against the live product and add real feature names.",
    areas: [
      { area: "Organise", detail: "Bring roles and their context into one place." },
      { area: "Assess", detail: "Support the decision about whether to pursue a role." },
      { area: "Prepare", detail: "AI-assisted help with application materials, reviewed by the person." },
      { area: "Track", detail: "Status and next action for every application." },
    ],
  },
  roadmap: ["[VERIFY BEFORE PUBLISHING: now]", "[VERIFY BEFORE PUBLISHING: next]", "[VERIFY BEFORE PUBLISHING: later]"],
  excluded: [
    "It is not a super app.",
    "It does not apply to jobs automatically on someone's behalf.",
    "It makes no promise of job outcomes.",
    "[VERIFY BEFORE PUBLISHING: other features deliberately excluded]",
  ],
};
