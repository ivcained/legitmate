export type HermesCapability = { slug: string; name: string; description: string; kind: "skill" | "plugin" };
export const HERMES_SKILLS: readonly HermesCapability[] = [
  {
    "slug": "ab-testing",
    "name": "ab testing",
    "description": "When the user wants to plan, design, or implement an A/B test or experiment, or build a growth experimentation program. Also use when the user mentions \"A/B test,\" \"split test,\" \"e",
    "kind": "skill"
  },
  {
    "slug": "ad-account-auditor",
    "name": "ad account auditor",
    "description": "'Use when auditing a paid ad account for incremental contribution, wasted spend, or measurement integrity before scaling; runs a typed 20-item ROAS profile with verified vetoes and",
    "kind": "skill"
  },
  {
    "slug": "ad-creative",
    "name": "ad creative",
    "description": "When the user wants to generate, iterate, or scale ad creative — headlines, descriptions, primary text, or full ad variations — for any paid advertising platform. Also use when the",
    "kind": "skill"
  },
  {
    "slug": "ad-creative-builder",
    "name": "ad creative builder",
    "description": "'Use when the user asks to \"write ad copy\", \"generate RSA headlines\", or \"build ad creative at volume\"; produces ad units — RSA headlines/descriptions, hooks, and an angle matrix —",
    "kind": "skill"
  },
  {
    "slug": "ad-test-designer",
    "name": "ad test designer",
    "description": "'Use when the user asks to \"design an A/B test\", \"set up a creative/landing test\", \"run an incrementality test\", or \"is this result statistically and practically material?\"; produc",
    "kind": "skill"
  },
  {
    "slug": "add-mouse-driven-orbit",
    "name": "add mouse driven orbit",
    "description": "Add restrained mouse-driven orbit and parallax depth to a Three.js hero by damping one pointer target and splitting it across camera translation, look-at, and small object rotation",
    "kind": "skill"
  },
  {
    "slug": "add-shader-cursor-trail",
    "name": "add shader cursor trail",
    "description": "Add the Shaders WebGPU mouse effect used for the Tidal Commons hero: a white twinkling halftone cursor trail driven by ChromaFlow, masked through a DotGrid, finished with chromatic",
    "kind": "skill"
  },
  {
    "slug": "addresses",
    "name": "addresses",
    "description": "Verified contract addresses for major Ethereum protocols across mainnet and L2s. Use this instead of guessing or hallucinating addresses. Includes Uniswap, Aave, Compound, Aerodrom",
    "kind": "skill"
  },
  {
    "slug": "ads",
    "name": "ads",
    "description": "When the user wants help with paid advertising campaigns on Google Ads, Meta (Facebook/Instagram), LinkedIn, Twitter/X, or other ad platforms. Also use when the user mentions 'PPC,",
    "kind": "skill"
  },
  {
    "slug": "advocacy-program-designer",
    "name": "advocacy program designer",
    "description": "'Use when the user asks to \"design an employee advocacy program\", \"set up founder-led sharing\", or \"build a share kit for the team\"; produces an advocacy program blueprint in two m",
    "kind": "skill"
  },
  {
    "slug": "afk",
    "name": "afk",
    "description": ">-",
    "kind": "skill"
  },
  {
    "slug": "agency-grid-layout-minimal",
    "name": "agency grid layout minimal",
    "description": "Create a minimal agency design system with a disciplined editorial grid, oversized typography, quiet uppercase utility labels, restrained image blocks, and subtle structural detail",
    "kind": "skill"
  },
  {
    "slug": "agent-reach",
    "name": "agent reach",
    "description": ">",
    "kind": "skill"
  },
  {
    "slug": "ahoy",
    "name": "ahoy",
    "description": "Recap visible session events and guide the captain through visibly unanswered decisions when the captain explicitly invokes /ahoy, with a Bearings fallback when /ahoy is the sessio",
    "kind": "skill"
  },
  {
    "slug": "ai-seo",
    "name": "ai seo",
    "description": "When the user wants to optimize content for AI search engines, get cited by LLMs, or appear in AI-generated answers. Also use when the user mentions 'AI SEO,' 'AEO,' 'GEO,' 'LLMO,'",
    "kind": "skill"
  },
  {
    "slug": "ambient-section-particles",
    "name": "ambient section particles",
    "description": "Add a restrained particle atmosphere inside one section with configurable shapes, density, gravity, wind, sway, rotation, recycling or settling, pointer disturbance, visibility pau",
    "kind": "skill"
  },
  {
    "slug": "analytics",
    "name": "analytics",
    "description": "When the user wants to set up, improve, or audit analytics tracking and measurement. Also use when the user mentions \"set up tracking,\" \"GA4,\" \"Google Analytics,\" \"conversion track",
    "kind": "skill"
  },
  {
    "slug": "animate",
    "name": "animate",
    "description": "Build an animation from scratch, making the decisions in the order that determines whether it feels right — should it animate at all, what purpose, which tool, which properties, wh",
    "kind": "skill"
  },
  {
    "slug": "animate-expo",
    "name": "animate expo",
    "description": "Build animations in React Native and Expo, making the decisions in the order that determines whether they feel right — should it animate, which thread it runs on, which properties,",
    "kind": "skill"
  },
  {
    "slug": "animation-on-scroll",
    "name": "animation on scroll",
    "description": "Create an on-scroll animation trigger using IntersectionObserver with Tailwind-friendly animation classes and keyframes. Use when asked for scroll-reveal, animate-on-scroll, or seq",
    "kind": "skill"
  },
  {
    "slug": "animation-systems",
    "name": "animation systems",
    "description": "Use when designing or implementing product-grade web motion like Stripe, Linear, Apple, and Vercel. Covers motion principles, easing/duration defaults, choreography patterns, scrol",
    "kind": "skill"
  },
  {
    "slug": "animation-vocabulary",
    "name": "animation vocabulary",
    "description": "Reverse-lookup glossary that turns a vague description of a web animation or motion effect into its exact term (\"the bouncy thing when a popover opens\" → Pop in; \"the iOS rubber-ba",
    "kind": "skill"
  },
  {
    "slug": "apple-design",
    "name": "apple design",
    "description": "Apple's approach to interface design and fluid, physical motion, translated for the web. Use when building or reviewing gesture-driven UI, spring animations, drag/swipe/sheet inter",
    "kind": "skill"
  },
  {
    "slug": "ask-sonner",
    "name": "ask sonner",
    "description": "Guide to Sonner, the React toast library — install and wire up the Toaster, pick the right toast() call, promise and loading toasts, updating, dismissing and persisting toasts, sty",
    "kind": "skill"
  },
  {
    "slug": "ask-user-authority",
    "name": "ask user authority",
    "description": ">-",
    "kind": "skill"
  },
  {
    "slug": "aso",
    "name": "aso",
    "description": "When the user wants to audit or optimize an App Store or Google Play listing. Also use when the user mentions 'ASO audit,' 'app store optimization,' 'optimize my app listing,' 'imp",
    "kind": "skill"
  },
  {
    "slug": "atmosphere-background",
    "name": "atmosphere background",
    "description": "Create a dark atmospheric background with drifting vertical light folds, screen-blended glow, and a concentrated luminous corner or lower-edge bloom.",
    "kind": "skill"
  },
  {
    "slug": "attribution",
    "name": "attribution",
    "description": "When the user wants to figure out which marketing actually drives conversions and revenue, choose or interpret an attribution model, or reconcile conflicting numbers across tools. ",
    "kind": "skill"
  },
  {
    "slug": "attribution-reconciler",
    "name": "attribution reconciler",
    "description": "'Use when platform-reported conversions disagree with GA4/ecommerce, when you suspect Meta and Google are double-counting the same sales, or for a standing (monthly) reconciliation",
    "kind": "skill"
  },
  {
    "slug": "audience-belief-mapper",
    "name": "audience belief mapper",
    "description": "'Use when the user asks to \"map what our buyers believe\", \"capture the objections we keep hearing\", or \"find the switching forces that move the beachhead\"; produces a belief map of",
    "kind": "skill"
  },
  {
    "slug": "audience-mapper",
    "name": "audience mapper",
    "description": "'Use when the user asks to \"analyze my target audience\", \"build an audience profile for influencer targeting\", \"research a niche community\", or \"deep-dive a subculture before partn",
    "kind": "skill"
  },
  {
    "slug": "audience-segment-builder",
    "name": "audience segment builder",
    "description": "'Use when the user asks to \"build audience segments from my customer list\", \"make value-based / lookalike seed lists\", \"set up exclusion / suppression segments\", or \"map audiences ",
    "kind": "skill"
  },
  {
    "slug": "audit",
    "name": "audit",
    "description": "Deep EVM smart contract security audit system. Use when asked to audit a contract, find vulnerabilities, review code for security issues, or file security issues on a GitHub repo. ",
    "kind": "skill"
  },
  {
    "slug": "audit-ai-design-slop",
    "name": "audit ai design slop",
    "description": "Audit websites, apps, screenshots, mockups, and design code for harmful AI-design clichés, generic generated defaults, and established UI defects. Use when the user wants evidence-",
    "kind": "skill"
  },
  {
    "slug": "background-grid-webgl",
    "name": "background grid webgl",
    "description": "Create a perspective WebGL background grid with fading lines, subtle particle haze, slow forward drift, and gentle camera parallax.",
    "kind": "skill"
  },
  {
    "slug": "beam-glow-states",
    "name": "beam glow states",
    "description": "Create React loading, processing, selected, current, focus, and pressed states with the border-beam package's animated edge glow. Use when a card, button, input, tab, option, task ",
    "kind": "skill"
  },
  {
    "slug": "bearings",
    "name": "bearings",
    "description": ">-",
    "kind": "skill"
  },
  {
    "slug": "beautiful-article",
    "name": "beautiful article",
    "description": "把用户提供的素材（网页 URL / PDF / DOCX / Markdown / 纯文本 / 截图 / 粘贴材料）编辑、设计成一篇美丽的、可离线打开和分享的**单文件 HTML 网页文章**。基于 reacticle 组件协议：不手写裸 HTML/CSS，而用语义组件 + 受主题约束的 Raw 自由层；按 source→规划→双确认→生成→终审→修复的小型",
    "kind": "skill"
  },
  {
    "slug": "beautiful-shadows",
    "name": "beautiful shadows",
    "description": "Apply exact Tailwind arbitrary shadow utilities for polished, layered neutral elevation. Use when compact cards, controls, panels, popovers, hero media, feature callouts, or modal-",
    "kind": "skill"
  },
  {
    "slug": "better-accessibility",
    "name": "better accessibility",
    "description": "Accessibility engineering for product interfaces. Use when building or reviewing UI components and custom widgets, or when the user reports a keyboard or screen-reader problem. Tri",
    "kind": "skill"
  },
  {
    "slug": "better-colors",
    "name": "better colors",
    "description": "Color systems for digital products. Use when creating or extending a palette, theming light and dark appearances, or auditing the colors in a codebase. Triggers on color palette, p",
    "kind": "skill"
  },
  {
    "slug": "better-interface",
    "name": "better interface",
    "description": ">-",
    "kind": "skill"
  },
  {
    "slug": "better-layout",
    "name": "better layout",
    "description": "Layout structure for web interfaces. Use when structuring a page or component, deciding what collapses at small sizes, or reviewing frontend code for layout. Triggers on layout, sp",
    "kind": "skill"
  },
  {
    "slug": "better-typography",
    "name": "better typography",
    "description": "Web typography. Use when picking or pairing typefaces, setting up a type scale, or styling and truncating text in components. Triggers on typography, font loading, woff2, variable ",
    "kind": "skill"
  },
  {
    "slug": "better-ui",
    "name": "better ui",
    "description": "Design engineering principles for making interfaces feel polished. Use when building UI components, implementing animations or hover states, or doing any visual detail work. Trigge",
    "kind": "skill"
  },
  {
    "slug": "better-writing",
    "name": "better writing",
    "description": ">-",
    "kind": "skill"
  },
  {
    "slug": "bid-strategy-planner",
    "name": "bid strategy planner",
    "description": "'Use when the user asks to \"pick a bid strategy\", \"set a tCPA/tROAS target\", or \"plan the learning-phase entry\"; produces a bid-strategy choice (tCPA / tROAS / max-conversions / ma",
    "kind": "skill"
  },
  {
    "slug": "blue-cloudy-clean-modern",
    "name": "blue cloudy clean modern",
    "description": "Create a clean modern design system with a luminous blue sky atmosphere, soft drifting cloud light, minimal white framing, and serene premium typography.",
    "kind": "skill"
  },
  {
    "slug": "blue-laser-clean-glass-layout",
    "name": "blue laser clean glass layout",
    "description": "Create a clean dark glass layout system with a thin blue laser atmosphere, frosted premium shells, and polished dashboard structure.",
    "kind": "skill"
  },
  {
    "slug": "book-serif-index",
    "name": "book serif index",
    "description": "Create an archival book-reader design system with serif-led pages, mono index navigation, aged paper surfaces, margin notes, and a premium catalog frame.",
    "kind": "skill"
  },
  {
    "slug": "book-to-skill",
    "name": "book to skill",
    "description": "Converts books and documents (PDF, EPUB, DOCX, HTML, Markdown, plain text, RTF, MOBI/AZW with Calibre) into structured agent skills, extracting frameworks, mental models, principle",
    "kind": "skill"
  },
  {
    "slug": "bootstrap-diagnostics",
    "name": "bootstrap diagnostics",
    "description": ">-",
    "kind": "skill"
  },
  {
    "slug": "brand-language-codifier",
    "name": "brand language codifier",
    "description": "'Use when the user asks to \"codify our brand voice\", \"define naming rules for our products and tiers\", or \"write the tone-of-voice guide with banned phrases\"; produces the brand-le",
    "kind": "skill"
  },
  {
    "slug": "break",
    "name": "break",
    "description": "Answers \"does this survive?\" for one component. Renders it on a page in every state real use can put it in, and hands that page over as a visual report of what broke.",
    "kind": "skill"
  },
  {
    "slug": "brief-generator",
    "name": "brief generator",
    "description": "'Use when the user asks to \"create an influencer brief\" or \"write a campaign brief\"; produces a structured creator brief with deliverables, key messages, creative direction, timeli",
    "kind": "skill"
  },
  {
    "slug": "bright-green-tech-system-webgl",
    "name": "bright green tech system webgl",
    "description": "Create a bright-green technical design system with structured split layouts, hard-framed dark surfaces, mono utility labels, and a prominent WebGL visualization zone.",
    "kind": "skill"
  },
  {
    "slug": "budget-optimizer",
    "name": "budget optimizer",
    "description": "'Use when the user asks to \"allocate my influencer budget\", \"optimize spend across tiers\", or \"compare budget scenarios\"; produces a tier/platform/content allocation table, ROI and",
    "kind": "skill"
  },
  {
    "slug": "budget-pacing-monitor",
    "name": "budget pacing monitor",
    "description": "'Use when the user asks to \"check pacing\", \"am I over/under-spending\", \"is this campaign on track to hit budget\", or \"why did spend spike/stall mid-flight\"; returns a spend-vs-targ",
    "kind": "skill"
  },
  {
    "slug": "build-awwwards-quality-sites",
    "name": "build awwwards quality sites",
    "description": "Art-direct and implement distinctive, motion-rich marketing, editorial, portfolio, and landing websites with original reference-inspired imagery, standout heroes, GSAP choreography",
    "kind": "skill"
  },
  {
    "slug": "build-interactive-particle-trail",
    "name": "build interactive particle trail",
    "description": "Build a cursor or touch particle interaction that emits by distance along the traveled segment into a recycled GPU point pool, with optional keyboard-triggered bursts. Use for inte",
    "kind": "skill"
  },
  {
    "slug": "build-threejs-scroll-worlds",
    "name": "build threejs scroll worlds",
    "description": "Build rich, scroll-controlled real-time Three.js experiences as one persistent 3D world whose camera, lighting, atmosphere, materials, objects, DOM story, and interactions evolve a",
    "kind": "skill"
  },
  {
    "slug": "build-wireframe-scan-reveal",
    "name": "build wireframe scan reveal",
    "description": "Reveal Three.js geometry with an expanding world-space scan whose wire cage leads the solid surface, then burns away. Use for wireframe scanning, radial mesh reveals, survey pulses",
    "kind": "skill"
  },
  {
    "slug": "building-blocks",
    "name": "building blocks",
    "description": "DeFi legos and protocol composability on Ethereum and L2s. Major protocols per chain — Aerodrome on Base, GMX/Pendle on Arbitrum, Velodrome on Optimism — plus mainnet primitives (U",
    "kind": "skill"
  },
  {
    "slug": "campaign-architect",
    "name": "campaign architect",
    "description": "'Use when the user asks to \"plan my paid account structure\", \"pick Search vs PMax\", \"lay out ad groups / asset groups\", or \"audit paid-vs-organic cannibalization\"; designs campaign",
    "kind": "skill"
  },
  {
    "slug": "campaign-planner",
    "name": "campaign planner",
    "description": "'Use when the user asks to \"plan an influencer campaign\", \"build a campaign blueprint\", or \"launch a product with creators\"; produces campaign objectives, platform and influencer-t",
    "kind": "skill"
  },
  {
    "slug": "captain-hold-lifecycle",
    "name": "captain hold lifecycle",
    "description": ">-",
    "kind": "skill"
  },
  {
    "slug": "category-narrative-mapper",
    "name": "category narrative mapper",
    "description": "'Use when the user asks to \"map the category narrative\", \"tear down how competitors tell their story\", or \"find the language conventions in our market\"; produces a category narrati",
    "kind": "skill"
  },
  {
    "slug": "cavecrew",
    "name": "cavecrew",
    "description": ">",
    "kind": "skill"
  },
  {
    "slug": "caveman",
    "name": "caveman",
    "description": ">",
    "kind": "skill"
  },
  {
    "slug": "caveman-commit",
    "name": "caveman commit",
    "description": ">",
    "kind": "skill"
  },
  {
    "slug": "caveman-compress",
    "name": "caveman compress",
    "description": ">",
    "kind": "skill"
  },
  {
    "slug": "caveman-discover",
    "name": "caveman discover",
    "description": ">",
    "kind": "skill"
  },
  {
    "slug": "caveman-evidence-review",
    "name": "caveman evidence review",
    "description": ">",
    "kind": "skill"
  },
  {
    "slug": "caveman-explore",
    "name": "caveman explore",
    "description": "Read-only repository explorer. Use PROACTIVELY for cold-start exploration, broad cross-file localization, or when a direct search has failed and you need to find where something li",
    "kind": "skill"
  },
  {
    "slug": "caveman-help",
    "name": "caveman help",
    "description": ">",
    "kind": "skill"
  },
  {
    "slug": "caveman-learn",
    "name": "caveman learn",
    "description": "Close the loop on a Caveman learn report — review the ranked token sinks, apply cost-lowering fixes (trim config, offload recurring context to cavemem) with per-edit consent, and r",
    "kind": "skill"
  },
  {
    "slug": "caveman-manage",
    "name": "caveman manage",
    "description": ">",
    "kind": "skill"
  },
  {
    "slug": "caveman-optimize",
    "name": "caveman optimize",
    "description": ">",
    "kind": "skill"
  },
  {
    "slug": "caveman-review",
    "name": "caveman review",
    "description": ">",
    "kind": "skill"
  },
  {
    "slug": "caveman-setup",
    "name": "caveman setup",
    "description": ">",
    "kind": "skill"
  },
  {
    "slug": "caveman-stats",
    "name": "caveman stats",
    "description": ">",
    "kind": "skill"
  },
  {
    "slug": "channel-portfolio-planner",
    "name": "channel portfolio planner",
    "description": "'Use when the user asks to \"pick which social channels to run\", \"should we be on X platform or 小红书\", or \"plan our organic social channel portfolio\"; produces an audience/objective-",
    "kind": "skill"
  },
  {
    "slug": "channel-registry",
    "name": "channel registry",
    "description": "'Use when the user asks to register/query a social channel, record channel state, cadence, governance, voice adaptation, UGC permission, or advocacy facts; curates them through the",
    "kind": "skill"
  },
  {
    "slug": "churn-prevention",
    "name": "churn prevention",
    "description": "When the user wants to reduce churn, build cancellation flows, set up save offers, recover failed payments, or implement retention strategies. Also use when the user mentions 'chur",
    "kind": "skill"
  },
  {
    "slug": "cinematic-gsap-lenis-motion-system",
    "name": "cinematic gsap lenis motion system",
    "description": "Create premium cinematic web motion systems with GSAP, ScrollTrigger, and Lenis. Use for luxury editorial websites, creative studio portfolios, Awwwards-style interactions, smooth ",
    "kind": "skill"
  },
  {
    "slug": "cinematic-scroll-storytelling",
    "name": "cinematic scroll storytelling",
    "description": "Create cinematic scroll-driven landing pages with Lenis smooth scrolling, GSAP ScrollTrigger, scroll-linked progression, staggered text reveals, sticky card stacks, parallax backgr",
    "kind": "skill"
  },
  {
    "slug": "clean-minimal-beige-light-mode",
    "name": "clean minimal beige light mode",
    "description": "Create a clean minimal beige light-mode design system with warm neutral shells, quiet process grids, restrained accent color, and elegant low-contrast structure.",
    "kind": "skill"
  },
  {
    "slug": "co-marketing",
    "name": "co marketing",
    "description": "When the user wants to find co-marketing partners, plan joint campaigns, or brainstorm partnership opportunities. Use when the user says 'co-marketing,' 'partner marketing,' 'joint",
    "kind": "skill"
  },
  {
    "slug": "cobejs",
    "name": "cobejs",
    "description": "Use when adding a lightweight interactive globe with cobe (canvas setup, markers, interaction, performance, integration with React/Next.js).",
    "kind": "skill"
  },
  {
    "slug": "codebase-memory",
    "name": "codebase memory",
    "description": "Use the codebase knowledge graph for structural code queries. Triggers on: explore the codebase, understand the architecture, what functions exist, show me the structure, who calls",
    "kind": "skill"
  },
  {
    "slug": "cold-email",
    "name": "cold email",
    "description": "Write B2B cold emails and follow-up sequences that get replies. Use when the user wants to write cold outreach emails, prospecting emails, cold email campaigns, sales development e",
    "kind": "skill"
  },
  {
    "slug": "cold-outbound-sequencer",
    "name": "cold outbound sequencer",
    "description": "'Use when the user asks to \"build a B2B cold-outbound sequence\", \"design reply-triage branching\", \"plan a domain warmup / sending throttle\", or \"make my outbound CAN-SPAM / opt-in ",
    "kind": "skill"
  },
  {
    "slug": "community-launch-runner",
    "name": "community launch runner",
    "description": "'Use when the user asks to \"launch on Product Hunt / Hacker News\", \"prepare community or directory launch submissions\", or \"plan the launch submission waves\"; produces per-platform",
    "kind": "skill"
  },
  {
    "slug": "community-marketing",
    "name": "community marketing",
    "description": "Build and leverage online communities to drive product growth and brand loyalty. Use when the user wants to create a community strategy, grow a Discord or Slack community, manage a",
    "kind": "skill"
  },
  {
    "slug": "company-logos",
    "name": "company logos",
    "description": "Use Iconify Simple Icons logos (64x64) instead of text logos.",
    "kind": "skill"
  },
  {
    "slug": "competitor-analysis",
    "name": "competitor analysis",
    "description": "'Use when the user asks to \"analyze competitors\" or \"竞品分析\"; benchmarks competitor keywords, content, backlinks, AI citations, and traffic share into strengths, weaknesses, and an a",
    "kind": "skill"
  },
  {
    "slug": "competitor-profiling",
    "name": "competitor profiling",
    "description": "When the user wants to research, profile, or analyze competitors from their URLs. Also use when the user mentions 'competitor profile,' 'competitor research,' 'competitor analysis,",
    "kind": "skill"
  },
  {
    "slug": "competitor-tracker",
    "name": "competitor tracker",
    "description": "'Use when the user asks to \"track competitor influencer marketing\", \"see who my rivals partner with\", or \"benchmark my influencer program\"; produces a competitor partnership roster",
    "kind": "skill"
  },
  {
    "slug": "competitors",
    "name": "competitors",
    "description": "When the user wants to create competitor comparison or alternative pages for SEO and sales enablement. Also use when the user mentions 'alternative page,' 'vs page,' 'competitor co",
    "kind": "skill"
  },
  {
    "slug": "concepts",
    "name": "concepts",
    "description": "The essential mental models for building onchain — focused on what LLMs get wrong and what humans need explained. \"Nothing is automatic\" and \"incentives are everything\" are the cor",
    "kind": "skill"
  },
  {
    "slug": "consent-registry",
    "name": "consent registry",
    "description": "'Use when the user asks to \"log this subscriber''s opt-in\", record unsubscribes/complaints, or query lawful basis; curates pseudonymous consent facts through the append-only consen",
    "kind": "skill"
  },
  {
    "slug": "container-lines",
    "name": "container lines",
    "description": "Add vertical container-size guide lines with mini corner squares for precise, structured web layouts. Use when asked for container lines, measured layout guides, vertical boundary ",
    "kind": "skill"
  },
  {
    "slug": "container-web-content-editing",
    "name": "container web content editing",
    "description": ">",
    "kind": "skill"
  },
  {
    "slug": "content-amplifier",
    "name": "content amplifier",
    "description": "'Use when the user asks to \"amplify influencer content with paid media\", \"set up whitelisting or Spark Ads\", \"decide which posts to boost\", \"repurpose influencer content\", \"turn on",
    "kind": "skill"
  },
  {
    "slug": "content-gap-analysis",
    "name": "content gap analysis",
    "description": "'Use when the user asks to \"find content gaps\", \"竞品写了什么\", or \"还应该写什么\"; builds a competitor-relative coverage map of missing topics, keyword gaps, and editorial-calendar opportuniti",
    "kind": "skill"
  },
  {
    "slug": "content-quality-auditor",
    "name": "content quality auditor",
    "description": "'Use when auditing content quality, E-E-A-T, or publish readiness; runs a typed 80-item CORE-EEAT profile with evidence coverage, veto checks, and a fix plan. Not for structural ta",
    "kind": "skill"
  },
  {
    "slug": "content-strategy",
    "name": "content strategy",
    "description": "When the user wants to plan a content strategy, decide what content to create, or figure out what topics to cover. Also use when the user mentions \"content strategy,\" \"what should ",
    "kind": "skill"
  },
  {
    "slug": "content-writer",
    "name": "content writer",
    "description": "'Use when the user asks to \"write SEO content\", \"draft a blog post / landing page\", \"update outdated content\", or \"fix traffic/ranking decay\"; two modes — new drafts pages with key",
    "kind": "skill"
  },
  {
    "slug": "contract-helper",
    "name": "contract helper",
    "description": "'Use when the user asks to \"draft an influencer contract\", \"review these agreement terms\", or \"build a partnership template\"; produces a full influencer agreement framework (scope,",
    "kind": "skill"
  },
  {
    "slug": "conversion-signal-qa",
    "name": "conversion signal qa",
    "description": "'Use when the user asks to \"QA my conversion tracking before launch\", \"check my UTMs / pixel / event firing\", \"set up a tracking pre-flight\", or \"set the dedup rule so Meta and Goo",
    "kind": "skill"
  },
  {
    "slug": "conversion-value-mapper",
    "name": "conversion value mapper",
    "description": "'Use when the user asks to \"set up conversion values so tROAS optimizes profit not orders\", \"map margin onto my purchase value\", \"build value rules for lead / phone / signup conver",
    "kind": "skill"
  },
  {
    "slug": "copy-editing",
    "name": "copy editing",
    "description": "When the user wants to edit, review, or improve existing marketing copy, or refresh outdated content. Also use when the user mentions 'edit this copy,' 'review my copy,' 'copy feed",
    "kind": "skill"
  },
  {
    "slug": "copywriting",
    "name": "copywriting",
    "description": "When the user wants to write, rewrite, or improve marketing copy for any page — including homepage, landing pages, pricing pages, feature pages, about pages, or product pages. Also",
    "kind": "skill"
  },
  {
    "slug": "corner-diagonals",
    "name": "corner diagonals",
    "description": "Apply diagonal-cut corners and chamfered edges to buttons, cards, panels, and container shells. Use when a design needs precise geometric framing, sci-fi UI surfaces, clipped-corne",
    "kind": "skill"
  },
  {
    "slug": "corner-lasers",
    "name": "corner lasers",
    "description": "Create a corner-anchored laser composition with thin beams, a bright emitter node, bloom, and atmospheric glow or fog.",
    "kind": "skill"
  },
  {
    "slug": "creator-content-auditor",
    "name": "creator content auditor",
    "description": "'Use when the user asks to \"review this influencer content\" or \"check if this post meets brand guidelines\"; runs the typed STAR pre-publish gate, scores Trust and Appeal on the del",
    "kind": "skill"
  },
  {
    "slug": "creator-registry",
    "name": "creator registry",
    "description": "'Use when the user asks \"what did we pay this creator last time\" or to \"update the creator roster\"; curates creator identity, rate, rights, exclusivity, compliance-event, and perfo",
    "kind": "skill"
  },
  {
    "slug": "crisis-response-planner",
    "name": "crisis response planner",
    "description": "'Use when the user asks to \"build our social crisis protocol\", \"mentions are exploding — what do we do first\", or \"when do we pause the posting queue\"; produces a 1-5 severity ladd",
    "kind": "skill"
  },
  {
    "slug": "cro",
    "name": "cro",
    "description": "When the user wants to optimize, improve, or increase conversions on any marketing page or form — including homepage, landing pages, pricing pages, feature pages, lead capture form",
    "kind": "skill"
  },
  {
    "slug": "crops",
    "name": "crops",
    "description": "Use for every Ethereum dApp architecture plan and for reviews of existing systems, trust assumptions, custody, admin keys, pause or upgrade powers, hosted infra (RPC, indexer, paym",
    "kind": "skill"
  },
  {
    "slug": "css-alpha-masking",
    "name": "css alpha masking",
    "description": "Apply CSS alpha masking with linear-gradient for horizontal or vertical edge fades (mask-image and -webkit-mask-image). Use when asked for alpha masks, fade edges, or CSS mask grad",
    "kind": "skill"
  },
  {
    "slug": "css-border-gradient",
    "name": "css border gradient",
    "description": "Apply subtle gradient-border treatments for premium web surfaces. Use when cards, pricing panels, nav bars, modals, buttons, or hero surfaces need a refined edge highlight without ",
    "kind": "skill"
  },
  {
    "slug": "custom-model-provider-health",
    "name": "custom model provider health",
    "description": "Probe custom provider models, prune dead ones from /model.",
    "kind": "skill"
  },
  {
    "slug": "customer-research",
    "name": "customer research",
    "description": "When the user wants to conduct, analyze, or synthesize customer research. Use when the user mentions \"customer research,\" \"ICP research,\" \"talk to customers,\" \"analyze transcripts,",
    "kind": "skill"
  },
  {
    "slug": "dark-blue-contrasting-clean",
    "name": "dark blue contrasting clean",
    "description": "Create a dark-blue clean design system with strong contrast, cobalt gradient feature blocks, crisp framed structure, and restrained premium glow.",
    "kind": "skill"
  },
  {
    "slug": "dark-glass-clean-layout",
    "name": "dark glass clean layout",
    "description": "Create a dark glass layout system with frosted premium shells, clean multi-column workspace structure, floating data cards, and restrained atmospheric depth.",
    "kind": "skill"
  },
  {
    "slug": "dark-social-attributor",
    "name": "dark social attributor",
    "description": "'Use when the user asks to \"figure out where our direct traffic really comes from\", \"measure dark social\", \"add a how-did-you-hear-about-us field\", or \"show social drives signups w",
    "kind": "skill"
  },
  {
    "slug": "decision-hold-lifecycle",
    "name": "decision hold lifecycle",
    "description": ">-",
    "kind": "skill"
  },
  {
    "slug": "deliverability-qa",
    "name": "deliverability qa",
    "description": "'Use when the user asks to \"run a deliverability pre-flight before I send\", \"check my SPF/DKIM/DMARC/BIMI\", \"why am I landing in spam / promotions\", or \"score my sender reputation ",
    "kind": "skill"
  },
  {
    "slug": "design-first-ui-prompting",
    "name": "design first ui prompting",
    "description": "Use when you need design-first, spec-driven, skimmable prompts for UI generation. Covers prompt structure, constraints, variations, typography/spacing rules, and iteration workflow",
    "kind": "skill"
  },
  {
    "slug": "designer-design-ops-skills-design-critique",
    "name": "designer design ops skills design critique",
    "description": "Facilitate a structured team critique — framing, feedback rules, and actionable outcomes. Use when running a session with people in the room. For a solo expert review, use `heurist",
    "kind": "skill"
  },
  {
    "slug": "designer-design-ops-skills-design-debt-audit",
    "name": "designer design ops skills design debt audit",
    "description": "Inventory and prioritise accumulated design inconsistencies across a product. Use when drift has built up over time. For token coverage specifically use `design-token-audit` (desig",
    "kind": "skill"
  },
  {
    "slug": "designer-design-ops-skills-design-impact-reporting",
    "name": "designer design ops skills design impact reporting",
    "description": "Communicate design's contribution to business and user outcomes in stakeholder language. Use when reporting results upward. For choosing the metrics in the first place, use `metric",
    "kind": "skill"
  },
  {
    "slug": "designer-design-ops-skills-design-qa-checklist",
    "name": "designer design ops skills design qa checklist",
    "description": "Build a QA checklist for verifying that a build matches the design. Use at implementation review. For the spec engineers build from, use `handoff-spec`.",
    "kind": "skill"
  },
  {
    "slug": "designer-design-ops-skills-design-review-process",
    "name": "designer design ops skills design review process",
    "description": "Establish review gates — criteria, checkpoints, and approval flow. Use when work ships without consistent review. For running one individual session, use `design-critique`.",
    "kind": "skill"
  },
  {
    "slug": "designer-design-ops-skills-design-sprint-plan",
    "name": "designer design ops skills design sprint plan",
    "description": "Plan and facilitate a design sprint from challenge framing through prototype testing. Use when compressing discovery into days. For ongoing team cadence, use `team-workflow`.",
    "kind": "skill"
  },
  {
    "slug": "designer-design-ops-skills-handoff-spec",
    "name": "designer design ops skills handoff spec",
    "description": "Write the implementation handoff — measurements, behaviours, assets, states, and edge cases. Use when engineering picks up the work. For verifying the result afterwards use `design",
    "kind": "skill"
  },
  {
    "slug": "designer-design-ops-skills-team-workflow",
    "name": "designer design ops skills team workflow",
    "description": "Design the team's operating rhythm — task management, collaboration rituals, and tooling. Use when the day-to-day cadence needs structure. For a time-boxed sprint, use `design-spri",
    "kind": "skill"
  },
  {
    "slug": "designer-design-ops-skills-version-control-strategy",
    "name": "designer design ops skills version control strategy",
    "description": "Define version control for design files, components, and libraries — branching, naming, and release. Use when file history is chaotic. For design system contribution rules, use `de",
    "kind": "skill"
  },
  {
    "slug": "designer-design-research-skills-affinity-diagram",
    "name": "designer design research skills affinity diagram",
    "description": "Cluster many qualitative data points into themes and insight statements. Use when synthesising across multiple sessions or sources. For a single transcript use `summarize-interview",
    "kind": "skill"
  },
  {
    "slug": "designer-design-research-skills-card-sort-analysis",
    "name": "designer design research skills card sort analysis",
    "description": "Analyse open or closed card sort results into a proposed grouping and label set. Use after running a sort study. For turning that evidence into a full structure, use `information-a",
    "kind": "skill"
  },
  {
    "slug": "designer-design-research-skills-diary-study-plan",
    "name": "designer design research skills diary study plan",
    "description": "Design a diary study — prompts, cadence, duration, participant criteria, and analysis frame. Use when behaviour unfolds over days or weeks. For a single-session study, use `usabili",
    "kind": "skill"
  },
  {
    "slug": "designer-design-research-skills-empathy-map",
    "name": "designer design research skills empathy map",
    "description": "Build a Says, Thinks, Does, Feels map for one user or segment. Use when sharing user understanding quickly. For a composite archetype with goals and behaviours use `user-persona`; ",
    "kind": "skill"
  },
  {
    "slug": "designer-design-research-skills-interview-script",
    "name": "designer design research skills interview script",
    "description": "Write a structured interview guide — warm-up, core exploration, and wrap-up. Use before running interviews. For analysing what comes back, use `summarize-interview`.",
    "kind": "skill"
  },
  {
    "slug": "designer-design-research-skills-jobs-to-be-done",
    "name": "designer design research skills jobs to be done",
    "description": "Map functional, emotional, and social jobs with outcome expectations. Use when reframing decisions around motivation rather than features. For who the user is, use `user-persona`.",
    "kind": "skill"
  },
  {
    "slug": "designer-design-research-skills-journey-map",
    "name": "designer design research skills journey map",
    "description": "Map one persona's end-to-end experience with stages, touchpoints, emotions, and pain points. Use when improving an existing experience. For the multi-channel ecosystem use `experie",
    "kind": "skill"
  },
  {
    "slug": "designer-design-research-skills-research-repository",
    "name": "designer design research skills research repository",
    "description": "Build a repository that makes findings findable, reusable, and cumulative across teams. Use when the same research keeps getting redone. For synthesising one study, use `affinity-d",
    "kind": "skill"
  },
  {
    "slug": "designer-design-research-skills-summarize-interview",
    "name": "designer design research skills summarize interview",
    "description": "Turn one interview transcript into themes, supporting quotes, and action items. Use immediately after a session. For synthesising many sessions at once, use `affinity-diagram`.",
    "kind": "skill"
  },
  {
    "slug": "designer-design-research-skills-survey-design",
    "name": "designer design research skills survey design",
    "description": "Design unbiased survey instruments — question wording, scales, and sampling — to measure attitudes at scale. Use when you need quantitative breadth. For behavioural experiments, us",
    "kind": "skill"
  },
  {
    "slug": "designer-design-research-skills-usability-test-plan",
    "name": "designer design research skills usability test plan",
    "description": "Design a usability study — research questions, methodology, participant criteria, metrics, and facilitation guide. Use when planning the study as a whole. For writing the task scen",
    "kind": "skill"
  },
  {
    "slug": "designer-design-research-skills-user-persona",
    "name": "designer design research skills user persona",
    "description": "Build research-grounded personas with goals, frustrations, and behavioural patterns. Use when decisions need a consistent user reference. For one session's emotional snapshot use `",
    "kind": "skill"
  },
  {
    "slug": "designer-design-systems-skills-accessibility-audit",
    "name": "designer design systems skills accessibility audit",
    "description": "Audit an existing interface against WCAG, producing findings with severity ratings and remediation steps. Use when you have a design or build to assess now. Not for planning future",
    "kind": "skill"
  },
  {
    "slug": "designer-design-systems-skills-component-spec",
    "name": "designer design systems skills component spec",
    "description": "Specify one component — props, states, variants, accessibility, and usage rules. Use when defining a library component. For the reusable doc scaffold use `documentation-template`; ",
    "kind": "skill"
  },
  {
    "slug": "designer-design-systems-skills-design-system-governance",
    "name": "designer design systems skills design system governance",
    "description": "Define how the system evolves — contribution model, versioning, deprecation, and change management. Use when multiple teams contribute. For driving uptake use `design-system-adopti",
    "kind": "skill"
  },
  {
    "slug": "designer-design-systems-skills-design-token",
    "name": "designer design systems skills design token",
    "description": "Define and organise tokens for colour, spacing, type, and elevation with naming and usage rules. Use when establishing the token layer. For auditing existing usage use `design-toke",
    "kind": "skill"
  },
  {
    "slug": "designer-design-systems-skills-documentation-template",
    "name": "designer design systems skills documentation template",
    "description": "Generate a reusable documentation scaffold for components, patterns, or guidelines. Use when standardising how the system is documented. For the content of one component's spec, us",
    "kind": "skill"
  },
  {
    "slug": "designer-design-systems-skills-icon-system",
    "name": "designer design systems skills icon system",
    "description": "Specify an icon system — grid, sizing, stroke weight, naming, categories, and implementation. Use when standardising iconography. For broader illustration, use `illustration-style`",
    "kind": "skill"
  },
  {
    "slug": "designer-design-systems-skills-localization-design",
    "name": "designer design systems skills localization design",
    "description": "Design for multiple languages, writing directions, and cultural contexts — text expansion, RTL mirroring, and locale formats. Use when shipping beyond one locale. For the words the",
    "kind": "skill"
  },
  {
    "slug": "designer-design-systems-skills-motion-system",
    "name": "designer design systems skills motion system",
    "description": "Define motion tokens — durations, easing vocabulary, and reduced-motion handling — for consistency product-wide. Use when standardising motion across a system. For crafting one spe",
    "kind": "skill"
  },
  {
    "slug": "designer-design-systems-skills-naming-convention",
    "name": "designer design systems skills naming convention",
    "description": "Establish naming rules for components, tokens, and layers with patterns and worked examples. Use when names are inconsistent or being set. For what the tokens actually contain, use",
    "kind": "skill"
  },
  {
    "slug": "designer-design-systems-skills-pattern-library",
    "name": "designer design systems skills pattern library",
    "description": "Structure a pattern entry — problem context, solution, usage examples, and related patterns. Use when documenting a recurring solution rather than a component. For a single compone",
    "kind": "skill"
  },
  {
    "slug": "designer-design-systems-skills-theming-system",
    "name": "designer design systems skills theming system",
    "description": "Design theming architecture — brand variants, dark mode, and high-contrast — mapped through token layers. Use when one system must serve multiple themes. For a single palette use `",
    "kind": "skill"
  },
  {
    "slug": "designer-designer-toolkit-skills-case-study",
    "name": "designer designer toolkit skills case study",
    "description": "Craft a portfolio case study with narrative arc, process evidence, and outcomes. Use when telling a project's story to an external audience. For an internal stakeholder deck, use `",
    "kind": "skill"
  },
  {
    "slug": "designer-designer-toolkit-skills-design-negotiation",
    "name": "designer designer toolkit skills design negotiation",
    "description": "Advocate for design quality, scope, and timeline with partners and leadership using evidence and shared goals. Use in the conversation itself. For the commercial vocabulary behind ",
    "kind": "skill"
  },
  {
    "slug": "designer-designer-toolkit-skills-design-rationale",
    "name": "designer designer toolkit skills design rationale",
    "description": "Write rationale connecting decisions to user needs, business goals, and principles. Use when a decision needs defending in writing. For a live conversation, use `design-negotiation",
    "kind": "skill"
  },
  {
    "slug": "designer-designer-toolkit-skills-design-system-adoption",
    "name": "designer designer toolkit skills design system adoption",
    "description": "Create adoption strategy and enablement materials to drive design system usage. Use when the system exists but teams ignore it. For contribution and versioning rules, use `design-s",
    "kind": "skill"
  },
  {
    "slug": "designer-designer-toolkit-skills-design-token-audit",
    "name": "designer designer toolkit skills design token audit",
    "description": "Audit token usage across a product for coverage, drift, and hard-coded values. Use when tokens exist and you suspect they are being bypassed. For defining tokens in the first place",
    "kind": "skill"
  },
  {
    "slug": "designer-designer-toolkit-skills-presentation-deck",
    "name": "designer designer toolkit skills presentation deck",
    "description": "Structure a design presentation for a specific audience and decision. Use when presenting internally. For a portfolio narrative use `case-study`; for the written argument use `desi",
    "kind": "skill"
  },
  {
    "slug": "designer-designer-toolkit-skills-ux-writing",
    "name": "designer designer toolkit skills ux writing",
    "description": "Write interface copy — microcopy, error messages, empty states, and CTAs. Use when the words are the deliverable. For content structure and ownership, use `content-strategy` (ux-st",
    "kind": "skill"
  },
  {
    "slug": "designer-interaction-design-skills-animation-principles",
    "name": "designer interaction design skills animation principles",
    "description": "Apply animation principles — easing, staging, follow-through — to one specific UI motion. Use when tuning how an animation feels. For product-wide duration and easing tokens use `m",
    "kind": "skill"
  },
  {
    "slug": "designer-interaction-design-skills-conversational-ux",
    "name": "designer interaction design skills conversational ux",
    "description": "Design voice and conversational interfaces — dialog flows, error recovery, and persona. Use when the interface speaks and listens rather than being tapped. For graphical input coll",
    "kind": "skill"
  },
  {
    "slug": "designer-interaction-design-skills-doherty-threshold",
    "name": "designer interaction design skills doherty threshold",
    "description": "Apply the Doherty Threshold — keep system response under 400ms to preserve user flow. Use when diagnosing perceived slowness or setting a performance budget. For what to show durin",
    "kind": "skill"
  },
  {
    "slug": "designer-interaction-design-skills-error-handling-ux",
    "name": "designer interaction design skills error handling ux",
    "description": "Design error prevention, detection, and recovery across a product — message content, placement, and escape routes. Use when errors span multiple flows. For validation inside a sing",
    "kind": "skill"
  },
  {
    "slug": "designer-interaction-design-skills-feedback-patterns",
    "name": "designer interaction design skills feedback patterns",
    "description": "Design confirmations, status updates, and notifications that tell users an action registered. Use when the system must acknowledge success or change. For waiting states use `loadin",
    "kind": "skill"
  },
  {
    "slug": "designer-interaction-design-skills-fitts-law",
    "name": "designer interaction design skills fitts law",
    "description": "Apply Fitts's Law — target acquisition time depends on size and distance. Use when sizing and positioning controls, especially for touch. For how many controls to show at once, use",
    "kind": "skill"
  },
  {
    "slug": "designer-interaction-design-skills-form-design",
    "name": "designer interaction design skills form design",
    "description": "Design a form end to end — field order, grouping, validation, and completion. Use when the artifact is a form. For product-wide error strategy use `error-handling-ux`; for first-ru",
    "kind": "skill"
  },
  {
    "slug": "designer-interaction-design-skills-gesture-patterns",
    "name": "designer interaction design skills gesture patterns",
    "description": "Design gesture interactions for touch and pointer — swipe, drag, long-press, and their discoverability. Use when input is gestural. For OS-standard gestures on iOS and Android, use",
    "kind": "skill"
  },
  {
    "slug": "designer-interaction-design-skills-hicks-law",
    "name": "designer interaction design skills hicks law",
    "description": "Apply Hick's Law — decision time grows with the number of simultaneous choices. Use when a screen offers too many options at once. For how many items survive in memory afterwards, ",
    "kind": "skill"
  },
  {
    "slug": "designer-interaction-design-skills-interfaces-that-feel",
    "name": "designer interaction design skills interfaces that feel",
    "description": "Apply an emotional resonance lens to a UI that is technically correct but flat, prescribing changes at the copy, motion, and interaction layer. Use when a design tests fine but lan",
    "kind": "skill"
  },
  {
    "slug": "designer-interaction-design-skills-jakobs-law",
    "name": "designer interaction design skills jakobs law",
    "description": "Apply Jakob's Law — users expect your product to work like the others they already use. Use when deciding whether to innovate on a familiar pattern. For OS-mandated conventions spe",
    "kind": "skill"
  },
  {
    "slug": "designer-interaction-design-skills-loading-states",
    "name": "designer interaction design skills loading states",
    "description": "Design waiting experiences — spinners, skeletons, optimistic updates, and progressive reveal. Use when content takes time to arrive. For the latency budget itself use `doherty-thre",
    "kind": "skill"
  },
  {
    "slug": "designer-interaction-design-skills-micro-interaction-spec",
    "name": "designer interaction design skills micro interaction spec",
    "description": "Specify one micro-interaction completely — trigger, rules, feedback, loops, and modes. Use when handing a single interaction to engineering. For motion craft alone use `animation-p",
    "kind": "skill"
  },
  {
    "slug": "designer-interaction-design-skills-millers-law",
    "name": "designer interaction design skills millers law",
    "description": "Apply Miller's Law — chunk information into groups of about four to fit working memory. Use when grouping fields, menu items, or steps. For reducing the number of choices offered, ",
    "kind": "skill"
  },
  {
    "slug": "designer-interaction-design-skills-navigation-patterns",
    "name": "designer interaction design skills navigation patterns",
    "description": "Select and design a navigation pattern — tabs, drawer, hierarchy, or hub — matched to product structure and user tasks. Use when choosing how users move between sections. For the u",
    "kind": "skill"
  },
  {
    "slug": "designer-interaction-design-skills-onboarding-design",
    "name": "designer interaction design skills onboarding design",
    "description": "Design the first-run experience — activation path, progressive disclosure, and time to first value. Use for a user's very first session. For the mechanics of the signup form itself",
    "kind": "skill"
  },
  {
    "slug": "designer-interaction-design-skills-peak-end-rule",
    "name": "designer interaction design skills peak end rule",
    "description": "Apply the Peak-End Rule — a flow is remembered by its most intense moment and its last. Use when designing completion, celebration, or cancellation moments. For sustaining engageme",
    "kind": "skill"
  },
  {
    "slug": "designer-interaction-design-skills-search-ux",
    "name": "designer interaction design skills search ux",
    "description": "Design search — query input, zero results, refinement, and result presentation. Use when users retrieve rather than browse. For browse structure, use `navigation-patterns`.",
    "kind": "skill"
  },
  {
    "slug": "designer-interaction-design-skills-serial-position-effect",
    "name": "designer interaction design skills serial position effect",
    "description": "Apply the Serial Position Effect — first and last items in a sequence are recalled best. Use when ordering menus, lists, and steps. For emphasising one item regardless of its posit",
    "kind": "skill"
  },
  {
    "slug": "designer-interaction-design-skills-state-machine",
    "name": "designer interaction design skills state machine",
    "description": "Model component behaviour as explicit states, events, and transitions. Use when a component has many interacting states that must be exhaustive. For the feel and feedback of a sing",
    "kind": "skill"
  },
  {
    "slug": "designer-interaction-design-skills-teslers-law",
    "name": "designer interaction design skills teslers law",
    "description": "Apply Tesler's Law — every process has irreducible complexity that someone must absorb. Use when deciding whether the product or the user carries it. For reducing apparent choice, ",
    "kind": "skill"
  },
  {
    "slug": "designer-interaction-design-skills-zeigarnik-effect",
    "name": "designer interaction design skills zeigarnik effect",
    "description": "Apply the Zeigarnik Effect — incomplete tasks stay mentally active. Use when designing progress indicators, saved drafts, and return hooks. For the emotional shape of the ending, u",
    "kind": "skill"
  },
  {
    "slug": "designer-prototyping-testing-skills-a-b-test-design",
    "name": "designer prototyping testing skills a b test design",
    "description": "Design an A/B experiment — hypothesis, variants, primary metric, and sample size. Use when a change can be measured quantitatively at scale. For observing behaviour qualitatively, ",
    "kind": "skill"
  },
  {
    "slug": "designer-prototyping-testing-skills-accessibility-test-plan",
    "name": "designer prototyping testing skills accessibility test plan",
    "description": "Plan accessibility testing — assistive technologies, participant criteria, WCAG coverage, and session protocol. Use when scheduling testing with real AT users. Not for evaluating a",
    "kind": "skill"
  },
  {
    "slug": "designer-prototyping-testing-skills-click-test-plan",
    "name": "designer prototyping testing skills click test plan",
    "description": "Design first-click and click tests for findability and navigation. Use when testing whether people can locate something. For full task-based observation, use `test-scenario`.",
    "kind": "skill"
  },
  {
    "slug": "designer-prototyping-testing-skills-heuristic-evaluation",
    "name": "designer prototyping testing skills heuristic evaluation",
    "description": "Run an expert review against Nielsen's heuristics and domain criteria, with severity ratings. Use when you need findings without recruiting participants. For a facilitated team fee",
    "kind": "skill"
  },
  {
    "slug": "designer-prototyping-testing-skills-prototype-strategy",
    "name": "designer prototyping testing skills prototype strategy",
    "description": "Choose prototype fidelity and method to match the design question and the decision at stake. Use before building a prototype. For what to test once it exists, use `test-scenario`.",
    "kind": "skill"
  },
  {
    "slug": "designer-prototyping-testing-skills-test-scenario",
    "name": "designer prototyping testing skills test scenario",
    "description": "Write realistic usability task scenarios with success criteria and facilitation notes. Use when you have a study and need the tasks. For the surrounding study design, use `usabilit",
    "kind": "skill"
  },
  {
    "slug": "designer-prototyping-testing-skills-user-flow-diagram",
    "name": "designer prototyping testing skills user flow diagram",
    "description": "Diagram screen-level paths, decision points, and branch logic. Use when specifying how a feature is traversed. For the emotional end-to-end arc, use `journey-map` (design-research)",
    "kind": "skill"
  },
  {
    "slug": "designer-prototyping-testing-skills-wireframe-spec",
    "name": "designer prototyping testing skills wireframe spec",
    "description": "Specify wireframe layout — content priority, component placement, and annotation. Use when defining structure before visual design. For grid mechanics, use `layout-grid` (ui-design",
    "kind": "skill"
  },
  {
    "slug": "designer-ui-design-skills-aesthetic-usability",
    "name": "designer ui design skills aesthetic usability",
    "description": "Apply the Aesthetic-Usability Effect — polished, consistent interfaces are perceived as more usable and forgive minor friction. Use when justifying visual polish or diagnosing why ",
    "kind": "skill"
  },
  {
    "slug": "designer-ui-design-skills-color-system",
    "name": "designer ui design skills color system",
    "description": "Build a product colour system — tonal scales, semantic roles, and contrast compliance. Use when defining or rebuilding colour from scratch. For dark-mode adaptation use `dark-mode-",
    "kind": "skill"
  },
  {
    "slug": "designer-ui-design-skills-dark-mode-design",
    "name": "designer ui design skills dark mode design",
    "description": "Adapt an existing palette to dark mode — surface elevation, contrast rebalancing, and desaturation rules. Use when you already have a light palette to translate. For building the b",
    "kind": "skill"
  },
  {
    "slug": "designer-ui-design-skills-data-visualization",
    "name": "designer ui design skills data visualization",
    "description": "Select chart types and design data encodings — marks, axes, labels, and accessible chart styling. Use when presenting data graphically. Owns chart selection and encoding only; the ",
    "kind": "skill"
  },
  {
    "slug": "designer-ui-design-skills-illustration-style",
    "name": "designer ui design skills illustration style",
    "description": "Define an illustration style guide — visual language, colour usage, and application rules. Use when commissioning or standardising illustration. For icons, use `icon-system` (desig",
    "kind": "skill"
  },
  {
    "slug": "designer-ui-design-skills-law-of-closure",
    "name": "designer ui design skills law of closure",
    "description": "Apply the Law of Closure — the eye completes implied shapes from partial forms. Use when reducing visual weight by dropping borders or letting negative space suggest structure. For",
    "kind": "skill"
  },
  {
    "slug": "designer-ui-design-skills-law-of-common-region",
    "name": "designer ui design skills law of common region",
    "description": "Apply the Law of Common Region — a shared container, background, or border groups elements regardless of spacing. Use when grouping must survive a tight layout. For grouping by spa",
    "kind": "skill"
  },
  {
    "slug": "designer-ui-design-skills-law-of-continuity",
    "name": "designer ui design skills law of continuity",
    "description": "Apply the Law of Continuity — the eye follows alignment and unbroken paths. Use when sequencing steps, aligning content, or designing carousels and timelines. For grouping rather t",
    "kind": "skill"
  },
  {
    "slug": "designer-ui-design-skills-law-of-figure-ground",
    "name": "designer ui design skills law of figure ground",
    "description": "Apply the Law of Figure-Ground — establish which layer is foreground and actionable versus background. Use when designing modals, overlays, and depth. For emphasising one element a",
    "kind": "skill"
  },
  {
    "slug": "designer-ui-design-skills-law-of-proximity",
    "name": "designer ui design skills law of proximity",
    "description": "Apply the Law of Proximity — spatial closeness groups elements more strongly than any other cue. Use when spacing alone must carry grouping. For grouping via containers use `law-of",
    "kind": "skill"
  },
  {
    "slug": "designer-ui-design-skills-law-of-similarity",
    "name": "designer ui design skills law of similarity",
    "description": "Apply the Law of Similarity — shared colour, shape, or size signals that elements belong to one category. Use when signalling relationships across distance. For grouping by positio",
    "kind": "skill"
  },
  {
    "slug": "designer-ui-design-skills-layout-grid",
    "name": "designer ui design skills layout grid",
    "description": "Define a responsive grid — columns, gutters, margins, and breakpoint behaviour. Use when establishing page structure. For the spacing scale inside components use `spacing-system`; ",
    "kind": "skill"
  },
  {
    "slug": "designer-ui-design-skills-platform-conventions",
    "name": "designer ui design skills platform conventions",
    "description": "Design to iOS and Android conventions — what each OS mandates, where they diverge, and when to unify. Use when shipping native apps. For breakpoint adaptation use `responsive-desig",
    "kind": "skill"
  },
  {
    "slug": "designer-ui-design-skills-readable-measure",
    "name": "designer ui design skills readable measure",
    "description": "Set line length and measure for comfortable reading across type sizes and breakpoints. Use when tuning body text. Covers measure only — for the full size and weight scale, use `typ",
    "kind": "skill"
  },
  {
    "slug": "designer-ui-design-skills-responsive-design",
    "name": "designer ui design skills responsive design",
    "description": "Design layouts and interactions that adapt across screen sizes and input methods. Use when one design must serve many viewports. For the underlying column grid use `layout-grid`; f",
    "kind": "skill"
  },
  {
    "slug": "designer-ui-design-skills-spacing-system",
    "name": "designer ui design skills spacing system",
    "description": "Create a spacing scale from a base unit with rules for when each step applies. Use when standardising padding and margins. For page-level columns and gutters, use `layout-grid`.",
    "kind": "skill"
  },
  {
    "slug": "designer-ui-design-skills-typography-scale",
    "name": "designer ui design skills typography scale",
    "description": "Create a modular type scale with size, weight, and line-height relationships. Use when establishing typographic structure. For line length only use `readable-measure`; for judging ",
    "kind": "skill"
  },
  {
    "slug": "designer-ui-design-skills-visual-hierarchy",
    "name": "designer ui design skills visual hierarchy",
    "description": "Establish hierarchy through size, weight, colour, spacing, and position so the eye lands in the intended order. Use when composing new work. For judging an existing screen, use `cr",
    "kind": "skill"
  },
  {
    "slug": "designer-ui-design-skills-von-restorff-effect",
    "name": "designer ui design skills von restorff effect",
    "description": "Apply the Von Restorff Effect — the element that differs from its neighbours is the one remembered. Use when a single action must dominate. For overall ordering rather than single-",
    "kind": "skill"
  },
  {
    "slug": "designer-ux-strategy-skills-business-design",
    "name": "designer ux strategy skills business design",
    "description": "Read financials, map competitive landscapes, and argue design decisions in the language of value. Use when defending design to commercial stakeholders. For the live negotiation its",
    "kind": "skill"
  },
  {
    "slug": "designer-ux-strategy-skills-competitive-analysis",
    "name": "designer ux strategy skills competitive analysis",
    "description": "Compare UX patterns, features, strengths, and gaps across rival products. Use when you need to know what others actually do. For deliberately adopting their conventions, use `jakob",
    "kind": "skill"
  },
  {
    "slug": "designer-ux-strategy-skills-content-strategy",
    "name": "designer ux strategy skills content strategy",
    "description": "Define what content a product needs, how it is structured, and who owns it. Use when content itself is the problem. For the words in the interface use `ux-writing` (designer-toolki",
    "kind": "skill"
  },
  {
    "slug": "designer-ux-strategy-skills-design-brief",
    "name": "designer ux strategy skills design brief",
    "description": "Write a project brief — problem space, constraints, audience, and success criteria. Use at kickoff for one specific project. For long-horizon aspiration use `north-star-vision`; fo",
    "kind": "skill"
  },
  {
    "slug": "designer-ux-strategy-skills-design-principles",
    "name": "designer ux strategy skills design principles",
    "description": "Define actionable principles that resolve trade-offs when the team disagrees. Use when the same decisions keep getting relitigated. For a single project's framing, use `design-brie",
    "kind": "skill"
  },
  {
    "slug": "designer-ux-strategy-skills-experience-map",
    "name": "designer ux strategy skills experience map",
    "description": "Map the full ecosystem of touchpoints, channels, and relationships across a service. Use when the experience spans more than one product. For one persona's linear journey use `jour",
    "kind": "skill"
  },
  {
    "slug": "designer-ux-strategy-skills-information-architecture",
    "name": "designer ux strategy skills information architecture",
    "description": "Design content structure, hierarchy, labelling, and the navigation model. Use when organising what exists. For the UI that exposes it use `navigation-patterns` (interaction-design)",
    "kind": "skill"
  },
  {
    "slug": "designer-ux-strategy-skills-metrics-definition",
    "name": "designer ux strategy skills metrics definition",
    "description": "Define UX metrics and KPIs that connect design decisions to measurable outcomes. Use when choosing what to measure. For presenting the results afterwards, use `design-impact-report",
    "kind": "skill"
  },
  {
    "slug": "designer-ux-strategy-skills-north-star-vision",
    "name": "designer ux strategy skills north star vision",
    "description": "Articulate a long-horizon product vision that aligns teams and anchors strategy. Use when direction is contested or absent. For near-term project scope, use `design-brief`.",
    "kind": "skill"
  },
  {
    "slug": "designer-ux-strategy-skills-opportunity-framework",
    "name": "designer ux strategy skills opportunity framework",
    "description": "Identify, score, and prioritise design opportunities against impact and effort. Use when there are more ideas than capacity. For framing the one you choose, use `design-brief`.",
    "kind": "skill"
  },
  {
    "slug": "designer-ux-strategy-skills-service-blueprint",
    "name": "designer ux strategy skills service blueprint",
    "description": "Map service delivery across frontstage actions, backstage processes, and supporting systems. Use when staff and operations are part of the experience. For the customer-visible laye",
    "kind": "skill"
  },
  {
    "slug": "designer-ux-strategy-skills-stakeholder-alignment",
    "name": "designer ux strategy skills stakeholder alignment",
    "description": "Build alignment artifacts — responsibility matrices, decision rights, and communication plans. Use when unclear ownership stalls decisions. For persuading in the moment, use `desig",
    "kind": "skill"
  },
  {
    "slug": "designer-visual-critique-skills-critique-affordance",
    "name": "designer visual critique skills critique affordance",
    "description": "Critique a rendered screen's affordances — what looks clickable, state visibility, CTA clarity, and action discoverability. Use when reviewing an existing screen. For sizing and po",
    "kind": "skill"
  },
  {
    "slug": "designer-visual-critique-skills-critique-brand-consistency",
    "name": "designer visual critique skills critique brand consistency",
    "description": "Critique a rendered screen against mood.md, voice.md, and tokens.md. Use when those brand files exist and you are checking compliance. For defining the visual language itself, use ",
    "kind": "skill"
  },
  {
    "slug": "designer-visual-critique-skills-critique-color",
    "name": "designer visual critique skills critique color",
    "description": "Critique a rendered screen's colour — contrast ratios, palette coherence, and semantic meaning. Use when reviewing one screen. For a product-wide WCAG audit use `accessibility-audi",
    "kind": "skill"
  },
  {
    "slug": "designer-visual-critique-skills-critique-composition",
    "name": "designer visual critique skills critique composition",
    "description": "Critique a rendered screen's composition — balance, whitespace, rhythm, and gestalt grouping. Use when a layout feels off but hierarchy is fine. For emphasis and eye flow specifica",
    "kind": "skill"
  },
  {
    "slug": "designer-visual-critique-skills-critique-information-density",
    "name": "designer visual critique skills critique information density",
    "description": "Critique a rendered screen's density — cognitive load, content prioritisation, scanning patterns, and progressive disclosure. Use when a screen feels overwhelming. For the underlyi",
    "kind": "skill"
  },
  {
    "slug": "designer-visual-critique-skills-critique-typography",
    "name": "designer visual critique skills critique typography",
    "description": "Critique a rendered screen's typography — scale usage, readability, consistency, and token compliance. Use when reviewing type on a screen. For defining the scale itself, use `typo",
    "kind": "skill"
  },
  {
    "slug": "designer-visual-critique-skills-critique-visual-hierarchy",
    "name": "designer visual critique skills critique visual hierarchy",
    "description": "Critique a rendered screen's hierarchy — entry point, eye flow, weight distribution, and emphasis. Use when attention lands in the wrong place. For establishing hierarchy in new wo",
    "kind": "skill"
  },
  {
    "slug": "diagnostic-reasoning",
    "name": "diagnostic reasoning",
    "description": ">-",
    "kind": "skill"
  },
  {
    "slug": "directory-submissions",
    "name": "directory submissions",
    "description": "When the user wants to submit their product to startup, SaaS, AI, agent, MCP, no-code, or review directories for backlinks, domain rating, and discovery. Also use when the user men",
    "kind": "skill"
  },
  {
    "slug": "dither-background",
    "name": "dither background",
    "description": "Create a dark monochrome procedural background with enlarged square pixels and visible Bayer-style ordered dithering. Use when a page needs an atmospheric near-black dither field, ",
    "kind": "skill"
  },
  {
    "slug": "dither-laser-dark-mode",
    "name": "dither laser dark mode",
    "description": "Create a dark premium design system that combines near-black surfaces, subtle ordered-dither texture, and a thin accent-colored laser atmosphere.",
    "kind": "skill"
  },
  {
    "slug": "documentary-brutalist-agency",
    "name": "documentary brutalist agency",
    "description": "Create or redesign creative agency, production studio, architecture, culture, and portfolio websites with billboard typography, hard black-and-white chapters, exposed grids, docume",
    "kind": "skill"
  },
  {
    "slug": "domain-authority-auditor",
    "name": "domain authority auditor",
    "description": "'Use when auditing domain authority, trust, or citation credibility; runs a peer-relative 40-item CITE profile with evidence coverage and verified manipulation/penalty veto checks.",
    "kind": "skill"
  },
  {
    "slug": "dynamic-content-personalizer",
    "name": "dynamic content personalizer",
    "description": "'Use when the user asks to \"personalize the email\", \"add merge tags / dynamic content\", \"set up conditional blocks per segment\", or \"make first-name and product-recommendation fiel",
    "kind": "skill"
  },
  {
    "slug": "early-access-designer",
    "name": "early access designer",
    "description": "'Use when the user asks to \"design an early access program\", \"set up a waitlist and beta stages\", or \"define beta graduation criteria\"; produces a waitlist→concept→alpha→beta→GA st",
    "kind": "skill"
  },
  {
    "slug": "editorial-portfolio-chapters",
    "name": "editorial portfolio chapters",
    "description": "Create or redesign creative-studio, agency, photographer, artist, and portfolio websites where project work leads the story. Use for dark editorial shells, full-bleed campaign medi",
    "kind": "skill"
  },
  {
    "slug": "editorial-service-booking",
    "name": "editorial service booking",
    "description": "Create or redesign appointment-based service websites for salons, barbers, spas, wellness studios, clinics, and hospitality brands. Use for warm editorial layouts, serif-led identi",
    "kind": "skill"
  },
  {
    "slug": "editorial-tech",
    "name": "editorial tech",
    "description": "Blend editorial magazine composition with precision product-tech detailing using asymmetrical grids, cinematic media bands, mono utility labels, and restrained accent color.",
    "kind": "skill"
  },
  {
    "slug": "email-creative-builder",
    "name": "email creative builder",
    "description": "'Use when the user asks to \"write the email\", \"draft subject lines\", or \"build email creative\"; produces the pre-click unit — subject-line variants + preheader, body copy, one clea",
    "kind": "skill"
  },
  {
    "slug": "email-quality-auditor",
    "name": "email quality auditor",
    "description": "'Use when the user asks to \"audit an email program\" or \"is this campaign safe to send\"; runs a typed 20-item SEND profile with authentication, consent, opt-out, and claim veto chec",
    "kind": "skill"
  },
  {
    "slug": "email-render-builder",
    "name": "email render builder",
    "description": "'Use when the user asks to \"build the email HTML\", \"make this email responsive\", \"fix dark-mode rendering\", or \"QA the email across clients\"; produces the coded HTML build — a resp",
    "kind": "skill"
  },
  {
    "slug": "email-sequence-designer",
    "name": "email sequence designer",
    "description": "'Use when the user asks to \"design a welcome flow\", \"set up an abandoned-cart sequence\", \"build a light re-engagement branch inside a lifecycle flow\", or \"plan a cold-outbound sequ",
    "kind": "skill"
  },
  {
    "slug": "emails",
    "name": "emails",
    "description": "When the user wants to create or optimize an email sequence, drip campaign, automated email flow, or lifecycle email program. Also use when the user mentions \"email sequence,\" \"dri",
    "kind": "skill"
  },
  {
    "slug": "emil-design-eng",
    "name": "emil design eng",
    "description": "This skill encodes Emil Kowalski's philosophy on UI polish, component design, animation decisions, and the invisible details that make software feel great.",
    "kind": "skill"
  },
  {
    "slug": "engagement-inbox-manager",
    "name": "engagement inbox manager",
    "description": "'Use when the user asks to \"triage our comments, DMs, and mentions\", \"draft replies to this thread\", \"can we repost this fan post\", or \"set up inbox SLAs and an escalation path\"; p",
    "kind": "skill"
  },
  {
    "slug": "entity-registry",
    "name": "entity registry",
    "description": "'Use when the user asks to \"optimize entity presence\", reconcile an entity identity, or update canonical Knowledge Graph facts; audits and maintains machine-facing identity, sameAs",
    "kind": "skill"
  },
  {
    "slug": "events",
    "name": "events",
    "description": "When the user wants to plan, run, sponsor, speak at, or get pipeline from events — webinars, conferences, trade shows, meetups, dinners, workshops, virtual summits, or user confere",
    "kind": "skill"
  },
  {
    "slug": "explain-interface",
    "name": "explain interface",
    "description": "Answers \"how was this built?\" about an interface. Give it a URL and name the thing you're curious about, and it reads the layers that produce the effect. Reads the whole frontend i",
    "kind": "skill"
  },
  {
    "slug": "falling-leaves",
    "name": "falling leaves",
    "description": "Build falling leaves that read as leaves, with each one tumbling on its own axis so it presents a face, thins to an edge, and opens out again, and with its sideways slip driven by ",
    "kind": "skill"
  },
  {
    "slug": "fatigue-frequency-manager",
    "name": "fatigue frequency manager",
    "description": "'Use when the user asks to \"is my ad fatiguing\", \"why is CTR dropping at scale\", or \"should I rotate creative / widen the audience\"; reads frequency, CTR and CVR decay against an e",
    "kind": "skill"
  },
  {
    "slug": "find-animation-opportunities",
    "name": "find animation opportunities",
    "description": "Search a codebase or UI for places that don't animate but should, and reject everything that shouldn't. Read-only; it proposes motion with exact values, it does not implement it. U",
    "kind": "skill"
  },
  {
    "slug": "firstmate-codexapp",
    "name": "firstmate codexapp",
    "description": ">-",
    "kind": "skill"
  },
  {
    "slug": "firstmate-coding-guidelines",
    "name": "firstmate coding guidelines",
    "description": ">-",
    "kind": "skill"
  },
  {
    "slug": "firstmate-orca",
    "name": "firstmate orca",
    "description": "Agent-only operator checklist for Firstmate's Orca runtime backend. Use when switching to Orca, spawning or supervising Orca-backed work, smoke-testing Orca backend behavior, debug",
    "kind": "skill"
  },
  {
    "slug": "fit-scorer",
    "name": "fit scorer",
    "description": "'Use when the user asks to \"score this influencer\", \"rank these creators for our campaign\", or \"tell me which influencer is the best fit\"; produces the typed STAR Suitability (S) r",
    "kind": "skill"
  },
  {
    "slug": "fmx-respond",
    "name": "fmx respond",
    "description": ">-",
    "kind": "skill"
  },
  {
    "slug": "framed-grid-layout",
    "name": "framed grid layout",
    "description": "Create minimal framed grid layouts with thin visible boundary lines, L-shaped corner brackets, subtle diagonal line texture, and strict section alignment. Use when asked for clean,",
    "kind": "skill"
  },
  {
    "slug": "framed-tech-dark-border-gradient",
    "name": "framed tech dark border gradient",
    "description": "Create a framed dark technical design system with border-gradient shells, asymmetrical grid panels, mono utility labeling, and restrained monochrome atmosphere.",
    "kind": "skill"
  },
  {
    "slug": "free-tools",
    "name": "free tools",
    "description": "When the user wants to plan, evaluate, or build a free tool for marketing purposes — lead generation, SEO value, or brand awareness. Also use when the user mentions \"engineering as",
    "kind": "skill"
  },
  {
    "slug": "funky-purple-container-tech",
    "name": "funky purple container tech",
    "description": "Create a dark container-led technical design system with fuchsia-purple accents, layered rounded shells, crisp frame lines, and playful futuristic focal objects.",
    "kind": "skill"
  },
  {
    "slug": "gauntlet-loop",
    "name": "gauntlet loop",
    "description": "Use when the user says gauntlet loop or make it perfect.",
    "kind": "skill"
  },
  {
    "slug": "geo-content-optimizer",
    "name": "geo content optimizer",
    "description": "'Use when the user asks to \"optimize for AI citations\"; improves citation readiness for ChatGPT, Perplexity, AI Overviews, Gemini, and Claude. Not for structural on-page SEO — use ",
    "kind": "skill"
  },
  {
    "slug": "github-webhook-autodeploy",
    "name": "github webhook autodeploy",
    "description": "Use when wiring GitHub pushes to auto-deploy a server.",
    "kind": "skill"
  },
  {
    "slug": "glass-dark-mode-clock",
    "name": "glass dark mode clock",
    "description": "Create a dark glass design system with frosted shells, soft beam grids, circular clock-like calibration dials, and precise sci-fi instrument framing.",
    "kind": "skill"
  },
  {
    "slug": "glass-dark-ui",
    "name": "glass dark ui",
    "description": "Build dark-mode glassmorphism interfaces with readable contrast, frosted surfaces, and gradient borders using a pseudo-element mask. Use when asked for glass cards, frosted dark he",
    "kind": "skill"
  },
  {
    "slug": "globe-gl",
    "name": "globe gl",
    "description": "Use when implementing globe.gl (Globe.GL) for 3D globe data visualization with WebGL/ThreeJS, including setup, data layers (points, arcs, polygons, labels), and integration pattern",
    "kind": "skill"
  },
  {
    "slug": "globe-particles",
    "name": "globe particles",
    "description": "Create a globe-like 3D particle visualization with a dense luminous spherical core and thinner orbital ring or flattened disc. Use when a design needs a premium planetary, orbital,",
    "kind": "skill"
  },
  {
    "slug": "gooey-blob-system",
    "name": "gooey blob system",
    "description": "Create a gooey blob system using SVG filters where multiple shapes merge into a single fluid form. Use overlapping circles combined with a Gaussian blur and color matrix filter to ",
    "kind": "skill"
  },
  {
    "slug": "gpt-image-2",
    "name": "gpt image 2",
    "description": "面向 GPT Image 2 的图像生成 / 编辑技能。可在 3 种环境下使用：(A) Garden 本地模式，通过 OpenAI 兼容接口直接出图并落盘；(B) Host-Native 模式，把本 Skill 当作提示词工程指引，把渲染好的 prompt 交给宿主 Agent 自带的图像工具出图；(C) Advisor 模式，宿主无任何图像工具时退化为高质",
    "kind": "skill"
  },
  {
    "slug": "gsap",
    "name": "gsap",
    "description": "Use when you need to add or debug professional web animations with GSAP (timelines, ScrollTrigger, stagger, transforms) in HTML/CSS/JS/React. Includes patterns for smooth motion, p",
    "kind": "skill"
  },
  {
    "slug": "gsap-scrolltrigger-storytelling",
    "name": "gsap scrolltrigger storytelling",
    "description": "Build cinematic sticky product storytelling with GSAP ScrollTrigger, progressive UI reveals, scroll-synced animation, smooth interpolation, and immersive section transitions.",
    "kind": "skill"
  },
  {
    "slug": "harness-adapters",
    "name": "harness adapters",
    "description": ">-",
    "kind": "skill"
  },
  {
    "slug": "high-contrast-skeuomorphic-clean",
    "name": "high contrast skeuomorphic clean",
    "description": "Create a high-contrast clean skeuomorphic design system with molded dark surfaces, crisp light separation, tactile inset depth, and restrained signal accents.",
    "kind": "skill"
  },
  {
    "slug": "humanizer",
    "name": "humanizer",
    "description": "|",
    "kind": "skill"
  },
  {
    "slug": "i-have-adhd",
    "name": "i have adhd",
    "description": "'Shape output for a reader with ADHD: lead with the next action, number multi-step work, restate state across turns, suppress tangents, give specific time estimates, make wins visi",
    "kind": "skill"
  },
  {
    "slug": "image",
    "name": "image",
    "description": "When the user wants to create, generate, edit, or optimize images for marketing — blog heroes, social graphics, product mockups, profile banners, listing visuals, or brand assets. ",
    "kind": "skill"
  },
  {
    "slug": "image-first-grid-layout",
    "name": "image first grid layout",
    "description": "Create an image-led grid design system with full-bleed photography, structural guide lines, anchored content blocks, and restrained technical overlays.",
    "kind": "skill"
  },
  {
    "slug": "improve-animations",
    "name": "improve animations",
    "description": "Survey a codebase's animation and motion code as a senior motion advisor, then produce a prioritized audit and self-contained implementation plans for other agents (or cheaper mode",
    "kind": "skill"
  },
  {
    "slug": "inbox-placement-monitor",
    "name": "inbox placement monitor",
    "description": "'Use when the user asks to \"track where my emails are actually landing after I send\", \"read my seed-list inbox vs spam vs promotions results\", \"trend my Gmail Postmaster / Microsof",
    "kind": "skill"
  },
  {
    "slug": "influencer-discovery",
    "name": "influencer discovery",
    "description": "'Use when the user asks to \"find influencers\", \"build an influencer list\", or \"discover creators in [niche]\"; produces a multi-platform candidate pool, per-influencer profiles, aut",
    "kind": "skill"
  },
  {
    "slug": "influencer-marketing",
    "name": "influencer marketing",
    "description": "When the user wants to run influencer, creator, or ambassador partnerships to promote their product — finding and vetting partners, structuring deals, briefing creators, disclosure",
    "kind": "skill"
  },
  {
    "slug": "interface-review",
    "name": "interface review",
    "description": ">-",
    "kind": "skill"
  },
  {
    "slug": "investigate-first",
    "name": "investigate first",
    "description": "Diagnose ambiguous failures before editing. Use for unknown causes, intermittent behavior, performance regressions, or investigations needing evidence-ranked hypotheses.",
    "kind": "skill"
  },
  {
    "slug": "kb-retriever",
    "name": "kb retriever",
    "description": "面向本地知识库目录的检索和问答助手。核心流程：(1)分层索引导航 (2)遇到PDF/Excel时必须先读取references学习处理方法 (3)处理文件后再检索。按文件类型组合使用 grep、Read、pdfplumber、pandas 进行渐进式检索，避免整文件加载。用户问题涉及\"从知识库目录回答问题/检索信息/查资料\"时使用。",
    "kind": "skill"
  },
  {
    "slug": "keyword-research",
    "name": "keyword research",
    "description": "'Use when the user asks to \"find keywords\", \"挖词\", or \"搜什么词\"; prioritizes search volume, keyword difficulty, intent, and topic clusters from provided or connected data. Not for comp",
    "kind": "skill"
  },
  {
    "slug": "landing-experience-checker",
    "name": "landing experience checker",
    "description": "'Use when the user asks to \"pre-launch check the landing page\", \"run a Quality-Score preflight\", or \"verify ad-to-page message match before launch\"; produces an ad↔page continuity ",
    "kind": "skill"
  },
  {
    "slug": "landing-optimizer",
    "name": "landing optimizer",
    "description": "'Use when the user asks to \"optimize our landing page for influencer traffic\", \"fix our promo-code landing page\", or \"improve conversion from a creator campaign\"; produces a messag",
    "kind": "skill"
  },
  {
    "slug": "landing-page",
    "name": "landing page",
    "description": "Use when designing or rewriting a high-converting landing page (single-offer page) for SaaS/apps/services. Covers structure, layout patterns, conversion strategies, copywriting, SE",
    "kind": "skill"
  },
  {
    "slug": "landing-page-design",
    "name": "landing page design",
    "description": "Complete system for building high converting landing pages: intake questions, page structure, layout selection, conversion copywriting, SEO, plus strict visual rules for typography",
    "kind": "skill"
  },
  {
    "slug": "launch",
    "name": "launch",
    "description": "When the user wants to plan a product launch, feature announcement, or release strategy. Also use when the user mentions 'launch,' 'Product Hunt,' 'feature release,' 'announcement,",
    "kind": "skill"
  },
  {
    "slug": "launch-asset-packager",
    "name": "launch asset packager",
    "description": "'Use when the user asks to \"package the launch assets\", \"build a press kit\", or \"prep the store listing and go-live checklist\"; produces a tier-scoped launch asset manifest with pr",
    "kind": "skill"
  },
  {
    "slug": "launch-day-conductor",
    "name": "launch day conductor",
    "description": "'Use when the user asks to \"run my launch day\", \"build a launch day runbook / war room\", or \"decide CONTINUE or ROLLBACK after the push\"; produces a pre-conditions gate check (laun",
    "kind": "skill"
  },
  {
    "slug": "launch-feedback-synthesizer",
    "name": "launch feedback synthesizer",
    "description": "'Use when the user asks to \"triage launch feedback\", \"cluster reviews, comments, and board posts into themes\", or \"set up a you asked, we shipped loop\"; produces a feedback theme d",
    "kind": "skill"
  },
  {
    "slug": "launch-monitor",
    "name": "launch monitor",
    "description": "'Use when the user asks to \"monitor my launch\", \"track our Product Hunt / Hacker News ranking\", or \"watch the launch window\"; runs the T-0 to T+30 window watch — pre-launch instrum",
    "kind": "skill"
  },
  {
    "slug": "launch-readiness-auditor",
    "name": "launch readiness auditor",
    "description": "'Use when the user asks to \"audit our launch plan\", \"are we ready to launch\", or evaluate launch execution/outcomes; runs one typed RAMP preflight, execution, or outcome profile wi",
    "kind": "skill"
  },
  {
    "slug": "launch-registry",
    "name": "launch registry",
    "description": "'Use when the user asks to \"log this launch\", query a launch date/embargo, record a stage transition, or update submissions/outcomes; curates launch facts through the append-only l",
    "kind": "skill"
  },
  {
    "slug": "launch-retro-analyzer",
    "name": "launch retro analyzer",
    "description": "'Use when the user asks to \"run a launch retro / post-mortem\", \"compare launch results vs targets by channel\", or \"decide what to keep or kill for the next launch\"; produces a stru",
    "kind": "skill"
  },
  {
    "slug": "launch-tier-planner",
    "name": "launch tier planner",
    "description": "'Use when the user asks to \"plan my launch tier\", \"how big should this launch be\", or \"build a launch risk register with kill criteria\"; produces a tier decision (Tier 1 flagship a",
    "kind": "skill"
  },
  {
    "slug": "launch-window-planner",
    "name": "launch window planner",
    "description": "'Use when the user asks to \"pick a launch date\", \"plan the launch window\", or \"set the embargo and lift time\"; produces a candidate-window comparison table (conflict / tailwind / r",
    "kind": "skill"
  },
  {
    "slug": "lead-magnets",
    "name": "lead magnets",
    "description": "When the user wants to create, plan, or optimize a lead magnet for email capture or lead generation. Also use when the user mentions \"lead magnet,\" \"gated content,\" \"content upgrad",
    "kind": "skill"
  },
  {
    "slug": "lean-build",
    "name": "lean build",
    "description": "Build feature work with high overbuilding risk. Use for new behavior, product slices, or integrations where repository reuse, strict scope, and an explicit stop condition matter.",
    "kind": "skill"
  },
  {
    "slug": "light-mode-paper-technical",
    "name": "light mode paper technical",
    "description": "Create a light-mode technical design system with warm paper surfaces, dark outer framing, subtle diagonal texture, precise bracketed geometry, and restrained accent signals.",
    "kind": "skill"
  },
  {
    "slug": "liquid-metal-border",
    "name": "liquid metal border",
    "description": "Add and tune animated liquid-metal WebGL borders with the React `metal-fx` package. Use when buttons, icon controls, chips, tabs, cards, or selected surfaces need a metallic active",
    "kind": "skill"
  },
  {
    "slug": "list-growth-designer",
    "name": "list growth designer",
    "description": "'Use when the user asks to \"grow my email list\", \"design a lead magnet / signup incentive\", \"set up double opt-in\", or \"plan a referral / recommendation loop\"; produces a list-grow",
    "kind": "skill"
  },
  {
    "slug": "list-hygiene-monitor",
    "name": "list hygiene monitor",
    "description": "'Use when the user asks to \"watch my list health over time\", \"flag decaying / unengaged subscribers on a schedule\", \"why is my open rate drifting down / bounces creeping up\", or \"b",
    "kind": "skill"
  },
  {
    "slug": "list-segment-builder",
    "name": "list segment builder",
    "description": "'Use when the user asks to \"build email segments from my list\", \"make engaged / lapsed / RFM segments\", \"set up cart-abandoner or lifecycle-stage audiences\", or \"build a suppressio",
    "kind": "skill"
  },
  {
    "slug": "marketing-council",
    "name": "marketing council",
    "description": "When the user wants multiple expert perspectives on a marketing question — a simulated board of advisors staffed by legendary marketers (Seth Godin, David Ogilvy, Eugene Schwartz, ",
    "kind": "skill"
  },
  {
    "slug": "marketing-ideas",
    "name": "marketing ideas",
    "description": "When the user needs marketing ideas, inspiration, or strategies for their SaaS or software product. Also use when the user asks for 'marketing ideas,' 'growth ideas,' 'how to marke",
    "kind": "skill"
  },
  {
    "slug": "marketing-loops",
    "name": "marketing loops",
    "description": "When the user wants to set up a recurring, self-running marketing workflow — a repeatable loop an AI agent runs on a cadence (weekly, daily, on a trigger) rather than a one-off tas",
    "kind": "skill"
  },
  {
    "slug": "marketing-plan",
    "name": "marketing plan",
    "description": "When the user needs a comprehensive marketing plan for a client, a company they advise, or their own product. Also use when the user mentions \"marketing plan,\" \"growth plan,\" \"GTM ",
    "kind": "skill"
  },
  {
    "slug": "marketing-psychology",
    "name": "marketing psychology",
    "description": "When the user wants to apply psychological principles, mental models, or behavioral science to marketing. Also use when the user mentions 'psychology,' 'mental models,' 'cognitive ",
    "kind": "skill"
  },
  {
    "slug": "marquee-loop",
    "name": "marquee loop",
    "description": "Apply seamless infinite marquee loops using duplicated items.",
    "kind": "skill"
  },
  {
    "slug": "masked-reveal",
    "name": "masked reveal",
    "description": "Create masked staggered word reveals on scroll with GSAP ScrollTrigger. Use when headings, hero copy, section titles, or editorial text should reveal word-by-word through an overfl",
    "kind": "skill"
  },
  {
    "slug": "matrix-server-admin",
    "name": "matrix server admin",
    "description": "Administer the Matrix/Synapse homeserver on this server.",
    "kind": "skill"
  },
  {
    "slug": "matterjs",
    "name": "matterjs",
    "description": "Use when implementing 2D physics interactions with Matter.js, including Engine/World setup, Render/Runner configuration, adding bodies and constraints, and scroll/interaction-frien",
    "kind": "skill"
  },
  {
    "slug": "mcp-server-authoring",
    "name": "mcp server authoring",
    "description": "Author MCP servers that bridge external APIs to tools.",
    "kind": "skill"
  },
  {
    "slug": "memory-management",
    "name": "memory management",
    "description": "'Use when the user asks to \"remember project context\", review saved findings, initialize runtime memory, archive stale work, reconcile notes, or erase a subject; manages authorized",
    "kind": "skill"
  },
  {
    "slug": "mesh-gradient-dark-blue-clean",
    "name": "mesh gradient dark blue clean",
    "description": "Create a futuristic, premium, clean dark-blue mesh-gradient design system across background rendering, hero shell, navigation, floating nodes, framed sections, CTAs, and motion. Us",
    "kind": "skill"
  },
  {
    "slug": "message-house-builder",
    "name": "message house builder",
    "description": "'Use when the user asks to \"build a message house\", \"write a PR-FAQ for our launch\", or \"define the launch narrative and value pillars\"; derives from the positioning canvas a messa",
    "kind": "skill"
  },
  {
    "slug": "message-system-architect",
    "name": "message system architect",
    "description": "'Use when the user asks to \"author our durable brand message hierarchy\", \"build the brand message house that seeds the canon\", or \"define the main narrative, three pillars, and tag",
    "kind": "skill"
  },
  {
    "slug": "message-test-designer",
    "name": "message test designer",
    "description": "'Use when the user asks to \"test our messaging before we scale it\", \"design a message-market-fit panel\", or \"run a 5-second comprehension test on our new tagline\"; produces a messa",
    "kind": "skill"
  },
  {
    "slug": "migration",
    "name": "migration",
    "description": "Implement reversible compatibility-safe transitions. Use for schema, data, API, protocol, configuration, or dependency migrations requiring rollback and preservation proof.",
    "kind": "skill"
  },
  {
    "slug": "momentum-planner",
    "name": "momentum planner",
    "description": "'Use when the user asks to \"keep the launch momentum going after launch week\", \"plan a changelog / release-notes cadence as GTM\", or \"is this update worth a relaunch\"; produces a T",
    "kind": "skill"
  },
  {
    "slug": "narrative-baseline-mapper",
    "name": "narrative baseline mapper",
    "description": "'Use when the user asks to \"map what our surfaces say today\", \"inventory our current messaging\", or \"find the gap between what we say and what we mean\"; produces the narrative base",
    "kind": "skill"
  },
  {
    "slug": "narrative-cascade-planner",
    "name": "narrative cascade planner",
    "description": "'Use when the user asks to \"plan how our narrative lands on every surface\", \"write per-surface message-match specs\", or \"brief each creative builder from the canon\"; maps the narra",
    "kind": "skill"
  },
  {
    "slug": "narrative-drift-monitor",
    "name": "narrative drift monitor",
    "description": "'Use when the user asks to \"check if our surfaces have drifted from the canon\", \"watch for competitor repositioning\", or \"define when we should reposition\"; produces a drift report",
    "kind": "skill"
  },
  {
    "slug": "narrative-enablement-kit",
    "name": "narrative enablement kit",
    "description": "'Use when the user asks to \"make everyone tell the same story\", \"write our elevator pitch ladder\", or \"build a spokesperson Q&A and approved boilerplate pack\"; derives from the nar",
    "kind": "skill"
  },
  {
    "slug": "narrative-quality-auditor",
    "name": "narrative quality auditor",
    "description": "'Use when the user asks to \"audit our brand narrative\" or \"is this message on-canon\"; runs separate typed TALE truth, system, or effectiveness profiles and never averages them into",
    "kind": "skill"
  },
  {
    "slug": "narrative-registry",
    "name": "narrative registry",
    "description": "'Use when the user asks to record/query the brand narrative canon, tagline, message hierarchy, voice/naming rules, or a canon re-version; curates complete versioned canon events th",
    "kind": "skill"
  },
  {
    "slug": "narrative-resonance-monitor",
    "name": "narrative resonance monitor",
    "description": "'Use when the user asks to \"measure how our narrative is landing\", \"track echo rate against our canon lexicon\", or \"check how AI answer engines describe our brand\"; produces a reso",
    "kind": "skill"
  },
  {
    "slug": "nested-container-clean-agency",
    "name": "nested container clean agency",
    "description": "Create a clean agency design system built from nested containers, with an outer editorial shell, inset dark feature blocks, rounded premium cards, and restrained accent color.",
    "kind": "skill"
  },
  {
    "slug": "nested-container-frames",
    "name": "nested container frames",
    "description": "Create a container-in-container layout system using nested frames. Use an outer centered container with visible vertical boundary lines and corner markers. Inside, place inner cont",
    "kind": "skill"
  },
  {
    "slug": "newsletter-monetization-planner",
    "name": "newsletter monetization planner",
    "description": "'Use when the user asks to \"monetize my newsletter\", \"build a sponsorship rate card\", or \"model paid-subscription revenue\"; produces a revenue model (paid tiers, ad/sponsorship inv",
    "kind": "skill"
  },
  {
    "slug": "no-ai-design-slop",
    "name": "no ai design slop",
    "description": "Prevent and remove generic AI-generated design defaults, incoherent visual choices, and established UI defects while creating, revising, or reviewing websites, apps, screenshots, m",
    "kind": "skill"
  },
  {
    "slug": "no-ai-slop",
    "name": "no ai slop",
    "description": "Edit drafts into sharper, more human writing while preserving the writer's personal voice, or detect AI-slop patterns without rewriting. Use when the user wants a draft clearer, mo",
    "kind": "skill"
  },
  {
    "slug": "number-details",
    "name": "number details",
    "description": "Add decorative 01, 02, 03 numeric detail markers.",
    "kind": "skill"
  },
  {
    "slug": "offer-claims-registry",
    "name": "offer claims registry",
    "description": "'Use when the user asks to \"register this claim\", \"log our current offers\", or \"where is the proof for this figure\"; curates claim wording, evidence, disclosures, terms, review dat",
    "kind": "skill"
  },
  {
    "slug": "offers",
    "name": "offers",
    "description": "When the user wants to design, construct, or improve an offer — the thing they actually sell — including value framing, bonus stacking, guarantee design, scarcity/urgency, naming, ",
    "kind": "skill"
  },
  {
    "slug": "offsite-signal-analyzer",
    "name": "offsite signal analyzer",
    "description": "'Use when the user asks to \"analyze backlinks\", \"analyze my off-site signals\", or \"track AI traffic / ChatGPT / Perplexity referrals\"; profiles referring domains, anchor-text mix, ",
    "kind": "skill"
  },
  {
    "slug": "omniroute",
    "name": "omniroute",
    "description": "Manage or debug an OmniRoute LLM gateway (v3.8.x).",
    "kind": "skill"
  },
  {
    "slug": "omniroute-expert",
    "name": "omniroute expert",
    "description": "Troubleshoot, configure, and optimize OmniRoute gateway.",
    "kind": "skill"
  },
  {
    "slug": "on-page-seo-checker",
    "name": "on page seo checker",
    "description": "'Use when the user asks to \"audit on-page SEO\" or \"diagnose why a single page dropped\"; scores titles, meta, header structure, keyword placement, links, and images with prioritized",
    "kind": "skill"
  },
  {
    "slug": "onboarding",
    "name": "onboarding",
    "description": "When the user wants to optimize post-signup onboarding, user activation, first-run experience, or time-to-value. Also use when the user mentions \"onboarding flow,\" \"activation rate",
    "kind": "skill"
  },
  {
    "slug": "opencli-adapter-author",
    "name": "opencli adapter author",
    "description": "Use when writing an OpenCLI adapter for a new site or adding a new command to an existing site. Guides end-to-end from first recon through field decoding, adapter coding, and verif",
    "kind": "skill"
  },
  {
    "slug": "opencli-autofix",
    "name": "opencli autofix",
    "description": "Automatically fix broken OpenCLI adapters when commands fail. Load this skill when an opencli command fails — it guides you through collecting a trace artifact, patching the adapte",
    "kind": "skill"
  },
  {
    "slug": "opencli-browser",
    "name": "opencli browser",
    "description": "Use when an agent needs to drive a real Chrome window via opencli — inspect a page, fill forms, click through logged-in flows, or extract data ad-hoc. Covers the selector-first tar",
    "kind": "skill"
  },
  {
    "slug": "opencli-browser-sitemap",
    "name": "opencli browser sitemap",
    "description": "Use when driving a website with opencli browser and sitemap context is available, requested, or needed to avoid blind navigation. Guides agents to consume site sitemap files lazily",
    "kind": "skill"
  },
  {
    "slug": "opencli-sitemap-author",
    "name": "opencli sitemap author",
    "description": "Use when creating or maintaining OpenCLI site sitemaps: agent-facing navigation, page-state, action, workflow, API-reference, pitfall, and fallback knowledge for a website. Use aft",
    "kind": "skill"
  },
  {
    "slug": "opencli-usage",
    "name": "opencli usage",
    "description": "Use at the start of any OpenCLI session — this is the top-level map of what `opencli` can do, how to discover adapters, what flags and output formats are universal, and which speci",
    "kind": "skill"
  },
  {
    "slug": "operational-enterprise-ai",
    "name": "operational enterprise ai",
    "description": "Create or redesign enterprise AI, automation, security, and operations product pages that explain system boundaries, approvals, auditability, exceptions, and rollback. Use for dark",
    "kind": "skill"
  },
  {
    "slug": "orange-clean-paper-saas",
    "name": "orange clean paper saas",
    "description": "Create a clean paper-toned SaaS design system with warm neutrals, orange accent signals, rounded premium forms, and polished product illustration surfaces.",
    "kind": "skill"
  },
  {
    "slug": "outreach-manager",
    "name": "outreach manager",
    "description": "'Use when the user asks to \"write influencer outreach\", \"follow up with a creator\", \"pitch a journalist, hunter, or launch partner\", or \"negotiate partnership terms\"; produces pers",
    "kind": "skill"
  },
  {
    "slug": "page-play-builder",
    "name": "page play builder",
    "description": "'Use when the user asks to \"build programmatic SEO pages\", \"generate pages at scale\", \"rank on a high-authority third-party site\", \"borrow domain authority\", \"build a vs / alternat",
    "kind": "skill"
  },
  {
    "slug": "paid-measurement-loop",
    "name": "paid measurement loop",
    "description": "'Use when the user asks to \"read back\" a paid campaign change, \"did this ad change work\", or \"compare ROAS/CPA before and after\"; reads ROAS/CPA against a control over a fixed read",
    "kind": "skill"
  },
  {
    "slug": "participation-warmup-planner",
    "name": "participation warmup planner",
    "description": "'Use when the user asks to \"plan the participation ramp before we promote\", \"how much account history or karma do we need in this community\", or \"design entry incentives and member",
    "kind": "skill"
  },
  {
    "slug": "paywalls",
    "name": "paywalls",
    "description": "When the user wants to create or optimize in-app paywalls, upgrade screens, upsell modals, or feature gates. Also use when the user mentions \"paywall,\" \"upgrade screen,\" \"upgrade m",
    "kind": "skill"
  },
  {
    "slug": "performance-analyzer",
    "name": "performance analyzer",
    "description": "'Use when the user asks to \"analyze influencer campaign performance\", \"compare influencers\", or \"find what content worked\"; produces metric scorecards vs target and benchmark, plat",
    "kind": "skill"
  },
  {
    "slug": "performance-monitor",
    "name": "performance monitor",
    "description": "'Use when the user asks to \"generate an SEO report\", \"出月报\", \"set SEO alerts\", or \"排名掉了提醒我\"; two modes — report builds multi-metric traffic/ranking/authority/content dashboards, and",
    "kind": "skill"
  },
  {
    "slug": "pick-ui-library",
    "name": "pick ui library",
    "description": "Pick the right library for a given frontend task from a curated, opinionated list — numbers, OTP inputs, charts, command menus, virtualization, drag and drop, toasts, state, stylin",
    "kind": "skill"
  },
  {
    "slug": "pitch-narrative-builder",
    "name": "pitch narrative builder",
    "description": "'Use when the user asks to \"build our pitch deck narrative\", \"write a fundraising story\", or \"structure the sales pitch narrative\"; derives from the narrative canon a company pitch",
    "kind": "skill"
  },
  {
    "slug": "placement-exclusion-manager",
    "name": "placement exclusion manager",
    "description": "'Use when the user asks to \"build my brand-safety exclusion lists\", \"set placement / topic / content exclusions before launch\", \"add network and audience exclusions\", or \"prep the ",
    "kind": "skill"
  },
  {
    "slug": "planning-with-files",
    "name": "planning with files",
    "description": "Persistent file-based planning for multi-step AI-agent work. Keeps task_plan.md, findings.md, and progress.md on disk; lifecycle hooks inject selected project planning context. Aut",
    "kind": "skill"
  },
  {
    "slug": "platform-norm-profiler",
    "name": "platform norm profiler",
    "description": "'Use when the user asks to \"build the norm card for this platform\", \"what are the char limits and visible-fold cutoffs here\", \"is the LinkedIn link-in-first-comment thing documente",
    "kind": "skill"
  },
  {
    "slug": "pointer-trail-emitter",
    "name": "pointer trail emitter",
    "description": "Build a cursor trail whose spacing stays constant at any hand speed, by emitting motes per unit of distance travelled rather than on a timer, so a flick draws the same continuous r",
    "kind": "skill"
  },
  {
    "slug": "popups",
    "name": "popups",
    "description": "When the user wants to create or optimize popups, modals, overlays, slide-ins, or banners for conversion purposes. Also use when the user mentions \"exit intent,\" \"popup conversions",
    "kind": "skill"
  },
  {
    "slug": "positioning-mapper",
    "name": "positioning mapper",
    "description": "'Use when the user asks to \"map our positioning\", \"name our competitive alternatives\", or \"pick a beachhead segment for the launch\"; produces a Dunford-style positioning canvas — n",
    "kind": "skill"
  },
  {
    "slug": "positioning-truth-tracer",
    "name": "positioning truth tracer",
    "description": "'Use when the user asks to \"check our positioning against what we can actually ship\", \"trace which differentiators we can defend\", or \"reconcile the positioning canvas with the cla",
    "kind": "skill"
  },
  {
    "slug": "preference-frequency-manager",
    "name": "preference frequency manager",
    "description": "'Use when the user asks to \"build a preference center\", \"set up a frequency opt-down ladder\", \"give people a step-down instead of unsubscribe\", or \"design a topic/cadence preferenc",
    "kind": "skill"
  },
  {
    "slug": "press-media-relations",
    "name": "press media relations",
    "description": "'Use when the user asks to \"build a media list for my launch\", \"write a launch press release\", or \"pitch press under embargo\"; produces a three-tier media and analyst list (Tier 1 ",
    "kind": "skill"
  },
  {
    "slug": "pricing",
    "name": "pricing",
    "description": "When the user wants help with pricing decisions, packaging, or monetization strategy. Also use when the user mentions 'pricing,' 'pricing tiers,' 'freemium,' 'free trial,' 'packagi",
    "kind": "skill"
  },
  {
    "slug": "pricing-packaging-planner",
    "name": "pricing packaging planner",
    "description": "'Use when the user asks to \"plan launch pricing\", \"design pricing tiers / packaging\", or \"set up a launch discount / early-bird offer\"; produces a launch pricing and packaging plan",
    "kind": "skill"
  },
  {
    "slug": "pricing-page",
    "name": "pricing page",
    "description": "Use when designing or rewriting a high-converting SaaS pricing page (structure, plan design, copywriting, SEO/AEO, FAQs, layout patterns, experiments). Includes checklists, templat",
    "kind": "skill"
  },
  {
    "slug": "privy",
    "name": "privy",
    "description": "Use when adding user login or embedded wallets via Privy.",
    "kind": "skill"
  },
  {
    "slug": "process-event-sources",
    "name": "process event sources",
    "description": ">-",
    "kind": "skill"
  },
  {
    "slug": "product-feed-optimizer",
    "name": "product feed optimizer",
    "description": "'Use when the user asks to \"optimize my Shopping feed\", \"fix product disapprovals\", \"improve product titles/attributes\", or \"build feed-driven PMax asset groups\"; audits and rewrit",
    "kind": "skill"
  },
  {
    "slug": "product-marketing",
    "name": "product marketing",
    "description": "When the user wants to create or update their product marketing context document. Also use when the user mentions 'product context,' 'marketing context,' 'set up context,' 'positio",
    "kind": "skill"
  },
  {
    "slug": "product-proof-saas",
    "name": "product proof saas",
    "description": "Create or redesign SaaS and AI product landing pages where a real workflow, interface, or deterministic demo is the central proof. Use for pale atmospheric shells, product UI in th",
    "kind": "skill"
  },
  {
    "slug": "programmatic-seo",
    "name": "programmatic seo",
    "description": "When the user wants to create SEO-driven pages at scale using templates and data. Also use when the user mentions \"programmatic SEO,\" \"template pages,\" \"pages at scale,\" \"directory",
    "kind": "skill"
  },
  {
    "slug": "progressive-blur",
    "name": "progressive blur",
    "description": "Create a layered CSS progressive blur (top or bottom) using multiple backdrop-filter masks for depth and softness. Use when asked for “progressive blur”, “gradient blur overlay”, o",
    "kind": "skill"
  },
  {
    "slug": "project-management",
    "name": "project management",
    "description": ">-",
    "kind": "skill"
  },
  {
    "slug": "proof-point-packager",
    "name": "proof point packager",
    "description": "'Use when the user asks to \"package our proof points\", \"build reusable stat cards and case snippets\", or \"put proof where each pillar makes its claim\"; turns claims-ledger-approved",
    "kind": "skill"
  },
  {
    "slug": "prospecting",
    "name": "prospecting",
    "description": "When the user wants to find, qualify, and build a list of prospects to reach out to — across B2B SaaS, general B2B, or local small businesses. Also use when the user mentions \"pros",
    "kind": "skill"
  },
  {
    "slug": "prototype",
    "name": "prototype",
    "description": "Build multiple genuinely different versions of a UI piece you describe, rendered behind a visual picker so you can flip through them live and promote the one that feels right. Only",
    "kind": "skill"
  },
  {
    "slug": "public-relations",
    "name": "public relations",
    "description": "When the user wants help with public relations, earned media, press coverage, journalist outreach, or media strategy (not pull requests). Also use when the user mentions 'PR,' 'pub",
    "kind": "skill"
  },
  {
    "slug": "quota-array-dispatch",
    "name": "quota array dispatch",
    "description": ">-",
    "kind": "skill"
  },
  {
    "slug": "rank-tracker",
    "name": "rank tracker",
    "description": "'Use when the user asks to \"track rankings\" or \"查排名\"; measures keyword and SERP-position deltas over time from provided exports or connected tools, including AI-response checks. No",
    "kind": "skill"
  },
  {
    "slug": "react-auth-integration",
    "name": "react auth integration",
    "description": "Use when wiring React auth or debugging 401s on calls.",
    "kind": "skill"
  },
  {
    "slug": "reactivation-specialist",
    "name": "reactivation specialist",
    "description": "'Use when the user asks to \"build a win-back campaign\", \"re-engage lapsed subscribers\", \"run a re-permission / re-consent sweep\", or \"sunset my dead list\"; produces a closed-loop r",
    "kind": "skill"
  },
  {
    "slug": "referrals",
    "name": "referrals",
    "description": "When the user wants to create, optimize, or analyze a referral program, affiliate program, or word-of-mouth strategy. Also use when the user mentions 'referral,' 'affiliate,' 'amba",
    "kind": "skill"
  },
  {
    "slug": "report-generator",
    "name": "report generator",
    "description": "'Use when the user asks to \"create a campaign report\", \"build an executive summary\", or \"deliver client results\"; produces audience-tailored influencer marketing reports (executive",
    "kind": "skill"
  },
  {
    "slug": "responsive-ui-shell",
    "name": "responsive ui shell",
    "description": "Use when building a responsive UI shell or fixing mobile UI.",
    "kind": "skill"
  },
  {
    "slug": "reveal-hover-effect",
    "name": "reveal hover effect",
    "description": "Build cursor-following spotlight reveals that expose a second aligned image through a soft radial mask. Use for hover-to-color, before-and-after, x-ray, material, texture, product-",
    "kind": "skill"
  },
  {
    "slug": "reverse-skill",
    "name": "reverse skill",
    "description": "Routes reverse engineering, exploitation, penetration testing, malware, mobile, firmware, browser automation, documentation, and security tasks to the appropriate specialist skill.",
    "kind": "skill"
  },
  {
    "slug": "review-animations",
    "name": "review animations",
    "description": "Reviews animation and motion code against a high craft bar derived from Emil Kowalski's design engineering philosophy. Default to flagging; approval is earned.",
    "kind": "skill"
  },
  {
    "slug": "revops",
    "name": "revops",
    "description": "When the user wants help with revenue operations, lead lifecycle management, or marketing-to-sales handoff processes. Also use when the user mentions 'RevOps,' 'revenue operations,",
    "kind": "skill"
  },
  {
    "slug": "roi-calculator",
    "name": "roi calculator",
    "description": "'Use when the user asks to \"calculate influencer ROI\", \"prove campaign value\", or \"what was our ROAS\"; produces direct ROI/ROAS, earned media value, attribution-modeled revenue, LT",
    "kind": "skill"
  },
  {
    "slug": "safe-refactor",
    "name": "safe refactor",
    "description": "Restructure code while preserving behavior. Use for extraction, consolidation, ownership moves, or cleanup where verification must bracket structural edits.",
    "kind": "skill"
  },
  {
    "slug": "sales-enablement",
    "name": "sales enablement",
    "description": "When the user wants to create sales collateral, pitch decks, one-pagers, objection handling docs, or demo scripts. Also use when the user mentions 'sales deck,' 'pitch deck,' 'one-",
    "kind": "skill"
  },
  {
    "slug": "sales-enablement-kit",
    "name": "sales enablement kit",
    "description": "'Use when the user asks to \"build battle cards\", \"prep the sales team for launch\", or \"write the internal launch FAQ\"; produces the internal enablement kit for a sales-led launch —",
    "kind": "skill"
  },
  {
    "slug": "schema",
    "name": "schema",
    "description": "When the user wants to add, fix, or optimize schema markup and structured data on their site. Also use when the user mentions \"schema markup,\" \"structured data,\" \"JSON-LD,\" \"rich s",
    "kind": "skill"
  },
  {
    "slug": "scroll-progress-timeline",
    "name": "scroll progress timeline",
    "description": "Turn any ordered process into a data-driven vertical or horizontal scroll story with a base line, progress fill, active step states, responsive collapse, semantic fallback, and red",
    "kind": "skill"
  },
  {
    "slug": "scroll-scrubbed-visual-sequence",
    "name": "scroll scrubbed visual sequence",
    "description": "Build reversible scroll-controlled visual transformations with a pinned or sticky stage, normalized progress, and video, image-sequence, canvas, SVG, or DOM renderers. Use for hero",
    "kind": "skill"
  },
  {
    "slug": "scroll-scrubbed-word-reveal",
    "name": "scroll scrubbed word reveal",
    "description": "Reveal marked-up text word by word as scroll progress advances, while preserving semantic inline links, emphasis, responsive line wrapping, and reduced-motion readability. Use for ",
    "kind": "skill"
  },
  {
    "slug": "scroll-world-storytelling",
    "name": "scroll world storytelling",
    "description": "Turn an article, case study, brand narrative, product journey, or long-form story into a cinematic scroll-driven landing page using one of three renderers: scrubbed video, a real-t",
    "kind": "skill"
  },
  {
    "slug": "search-term-miner",
    "name": "search term miner",
    "description": "'Use when the user asks to \"mine my search terms\", \"find new keywords from converting queries\", \"build a negative-keyword list\", or \"cut wasted paid spend\"; harvests converting que",
    "kind": "skill"
  },
  {
    "slug": "secondmate-provisioning",
    "name": "secondmate provisioning",
    "description": ">-",
    "kind": "skill"
  },
  {
    "slug": "send-experiment-designer",
    "name": "send experiment designer",
    "description": "'Use when the user asks to \"design an email A/B test\", \"set up a multivariate subject/CTA test\", \"run a send-time test\", \"build a hold-out group\", or \"is this email result statisti",
    "kind": "skill"
  },
  {
    "slug": "seo-audit",
    "name": "seo audit",
    "description": "When the user wants to audit, review, or diagnose SEO issues on their site. Also use when the user mentions \"SEO audit,\" \"technical SEO,\" \"why am I not ranking,\" \"SEO issues,\" \"on-",
    "kind": "skill"
  },
  {
    "slug": "serp-analysis",
    "name": "serp analysis",
    "description": "'Use when the user asks to \"analyze the SERP\" or \"SERP分析\"; maps SERP features, layout, ranking factors, search intent, AI Overviews, and snippet opportunities for a query. Not for ",
    "kind": "skill"
  },
  {
    "slug": "serp-markup-builder",
    "name": "serp markup builder",
    "description": "'Use when the user asks to \"optimize meta tags\", \"write title tags / meta descriptions\", \"add Open Graph or Twitter cards\", or \"generate schema / JSON-LD\" for FAQ, HowTo, Article, ",
    "kind": "skill"
  },
  {
    "slug": "shaders-cursor-ripples",
    "name": "shaders cursor ripples",
    "description": "Add cursor-following fluid WebGPU distortion over an existing image with the Shaders library's ImageTexture and CursorRipples components. Use when a hero, gallery, or media panel n",
    "kind": "skill"
  },
  {
    "slug": "share-of-voice-tracker",
    "name": "share of voice tracker",
    "description": "'Use when the user asks to \"track our share of voice\", \"what share of the conversation do we own vs competitors\", or \"trend our SOV this quarter\"; computes SOV% = brand mentions ÷ ",
    "kind": "skill"
  },
  {
    "slug": "short-video-scripter",
    "name": "short video scripter",
    "description": "'Use when the user asks to \"script this short video\", \"write a TikTok / Reels / Shorts script\", \"给这条抖音或视频号视频写脚本\", or \"fix the hook — viewers drop off in the first seconds\"; produce",
    "kind": "skill"
  },
  {
    "slug": "signup",
    "name": "signup",
    "description": "When the user wants to optimize signup, registration, account creation, or trial activation flows. Also use when the user mentions \"signup conversions,\" \"registration friction,\" \"s",
    "kind": "skill"
  },
  {
    "slug": "site-architecture",
    "name": "site architecture",
    "description": "When the user wants to plan, map, or restructure their website's page hierarchy, navigation, URL structure, or internal linking. Also use when the user mentions \"sitemap,\" \"site ma",
    "kind": "skill"
  },
  {
    "slug": "site-structure-optimizer",
    "name": "site structure optimizer",
    "description": "'Use when the user asks to \"plan my site structure\", \"design the page hierarchy / navigation / URL taxonomy\", \"fix internal linking\", or \"find orphan pages\"; runs two modes — archi",
    "kind": "skill"
  },
  {
    "slug": "skeuomorphic-ui",
    "name": "skeuomorphic ui",
    "description": "Create skeuomorphic web UI surfaces with layered gradients, stacked inner and outer shadows, reflective gradient borders, micro texture, and embossed text or icon details. Use when",
    "kind": "skill"
  },
  {
    "slug": "skill-retrieval",
    "name": "skill retrieval",
    "description": ">-",
    "kind": "skill"
  },
  {
    "slug": "smart-search",
    "name": "smart search",
    "description": "基于 opencli 命令的智能搜索路由器。当用户想要使用 OpenCLI、CLI 或 API 搜索、查询、查找或研究信息时，尤其是涉及指定网站、社交媒体、技术资料、新闻、购物、旅游、求职、金融或中文内容时，务必使用此 skill",
    "kind": "skill"
  },
  {
    "slug": "sms",
    "name": "sms",
    "description": "When the user wants to plan, build, or optimize SMS or MMS marketing — including welcome flows, abandoned cart texts, post-purchase, win-back, promotional sends, or transactional/a",
    "kind": "skill"
  },
  {
    "slug": "social",
    "name": "social",
    "description": "When the user wants help creating, scheduling, or optimizing social media content for LinkedIn, Twitter/X, Instagram, TikTok, Facebook, or other platforms, or wants to do social li",
    "kind": "skill"
  },
  {
    "slug": "social-calendar-builder",
    "name": "social calendar builder",
    "description": "'Use when the user asks to \"build our social posting calendar\", \"set weekly slots and queue depth per channel\", or \"plan the evergreen recycle rotation\"; produces the always-on bra",
    "kind": "skill"
  },
  {
    "slug": "social-creative-builder",
    "name": "social creative builder",
    "description": "'Use when the user asks to \"turn this idea into posts for every platform\", \"write the X thread / LinkedIn post / 小红书 note\", or \"spec the carousel slides\"; turns one idea into N pla",
    "kind": "skill"
  },
  {
    "slug": "social-measurement-loop",
    "name": "social measurement loop",
    "description": "'Use when the user asks to \"run the weekly social readout\", \"which denominator does our engagement rate use\", or \"which posts won this week and what changes next cycle\"; produces t",
    "kind": "skill"
  },
  {
    "slug": "social-pulse-monitor",
    "name": "social pulse monitor",
    "description": "'Use when the user asks to \"monitor brand mentions\", \"set up social listening\", \"did anything spike about us this week\", or \"watch these accounts for buying triggers\"; runs always-",
    "kind": "skill"
  },
  {
    "slug": "social-quality-auditor",
    "name": "social quality auditor",
    "description": "'Use when the user asks to \"audit our social presence\" or \"is this batch safe to publish\"; runs either the typed ECHO asset gate or a separate program-maturity profile, with channe",
    "kind": "skill"
  },
  {
    "slug": "social-selling-planner",
    "name": "social selling planner",
    "description": "'Use when the user asks to \"set up my founder social-selling routine\", \"build a daily engagement block for target accounts\", or \"turn funding / hiring signals into selling plays\"; ",
    "kind": "skill"
  },
  {
    "slug": "solar-duotone-bold",
    "name": "solar duotone bold",
    "description": "Use Iconify Solar Duotone Bold icon style.",
    "kind": "skill"
  },
  {
    "slug": "split-layout-technical",
    "name": "split layout technical",
    "description": "Create a technical split-screen design system with dual panels, fine frame lines, mono metadata, quiet editorial typography, and premium inset surfaces.",
    "kind": "skill"
  },
  {
    "slug": "staggered-word-reveal",
    "name": "staggered word reveal",
    "description": "Create subtle editorial word-by-word text reveal animations where each word fades and rises into place once it enters the viewport. Use for premium portfolio headlines, hero copy, ",
    "kind": "skill"
  },
  {
    "slug": "story-bank-builder",
    "name": "story bank builder",
    "description": "'Use when the user asks to \"build a story bank\", \"collect our origin and customer stories\", or \"assemble reusable proof stories for the message\"; assembles reusable narrative units",
    "kind": "skill"
  },
  {
    "slug": "stow",
    "name": "stow",
    "description": "Sweep the current session for uncaptured durable knowledge, file it to disk, persist the open work records this session knows are unfiled or now wrong, and curate the home's tiered",
    "kind": "skill"
  },
  {
    "slug": "strategic-narrative-designer",
    "name": "strategic narrative designer",
    "description": "'Use when the user asks to \"design our change narrative\", \"build the old-world-to-new-game story arc\", or \"frame the shift our category is undergoing\"; produces a Raskin-style stra",
    "kind": "skill"
  },
  {
    "slug": "stuck-crewmate-recovery",
    "name": "stuck crewmate recovery",
    "description": ">-",
    "kind": "skill"
  },
  {
    "slug": "subject-line-lab",
    "name": "subject line lab",
    "description": "'Use when the user asks to \"generate subject line variants\", \"pre-score my subject lines\", or \"will this subject get truncated / trigger spam filters\"; produces a labeled subject +",
    "kind": "skill"
  },
  {
    "slug": "surgical-patch",
    "name": "surgical patch",
    "description": "Fix bugs and small behavior changes at the narrowest responsible layer. Use when regression proof, preserved surrounding behavior, and task-relevant tests matter.",
    "kind": "skill"
  },
  {
    "slug": "tailwindcss",
    "name": "tailwindcss",
    "description": "Use when designing/implementing UI with Tailwind CSS (layout, typography, responsive, theming, component patterns). Includes quick recipes and conventions for clean, consistent web",
    "kind": "skill"
  },
  {
    "slug": "tech-green-dark-mode-modern",
    "name": "tech green dark mode modern",
    "description": "Create a modern dark-mode technical design system with matte-black surfaces, emerald signal accents, mono system labeling, framed dashboard cards, and restrained glow.",
    "kind": "skill"
  },
  {
    "slug": "technical-seo-checker",
    "name": "technical seo checker",
    "description": "'Use when the user asks to \"check technical SEO\"; audits crawlability, indexing, Core Web Vitals, robots.txt, sitemaps, canonicals, redirects, and migrations. Not for on-page tags ",
    "kind": "skill"
  },
  {
    "slug": "technical-wireframe-info-layout",
    "name": "technical wireframe info layout",
    "description": "Create a monochrome technical wireframe design system with exploded 3D structure, connector annotations, sparse information labels, and precise dark diagnostic framing.",
    "kind": "skill"
  },
  {
    "slug": "thinking-orbs",
    "name": "thinking orbs",
    "description": "Add accessible animated AI loading and agent-status indicators with the React thinking-orbs library. Use when a chat, copilot, voice, search, generation, or tool-running interface ",
    "kind": "skill"
  },
  {
    "slug": "threejs",
    "name": "threejs",
    "description": "Use when building or debugging interactive 3D scenes on the web with Three.js (scene/camera/renderer, lights/materials, GLTF loading, controls, performance). Helpful for designers ",
    "kind": "skill"
  },
  {
    "slug": "threejs-landscape",
    "name": "threejs landscape",
    "description": "Build a live Three.js landscape that stays quiet behind a subject — a noise heightfield on a polar grid so resolution follows the lens, ground coloured by slope and moisture rather",
    "kind": "skill"
  },
  {
    "slug": "threejs-towers",
    "name": "threejs towers",
    "description": "Generate architecture procedurally in Three.js and film it assembling — a small geometry vocabulary that builds pagodas, castles, domes and spires from parameters instead of mesh f",
    "kind": "skill"
  },
  {
    "slug": "threejs-weather",
    "name": "threejs weather",
    "description": "Put weather into a Three.js scene that reads as weather — rain anchored inside the frustum, a storm that is the rain leaned on rather than a second system, lightning on its own lig",
    "kind": "skill"
  },
  {
    "slug": "trend-spotter",
    "name": "trend spotter",
    "description": "'Use when the user asks to \"find trending topics\", \"what trends should my brand jump on\", or \"time a campaign around a cultural moment\"; produces a ranked trend report with brand-f",
    "kind": "skill"
  },
  {
    "slug": "unicorn-studio",
    "name": "unicorn studio",
    "description": "Use when embedding and customizing Unicorn Studio interactive animations on the web (embed, responsive sizing, performance, layering with UI, fallbacks).",
    "kind": "skill"
  },
  {
    "slug": "unlazy",
    "name": "unlazy",
    "description": "Enforces completion discipline for substantial autonomous work by writing acceptance gates before execution, decomposing work with the Depth Tree, running approved checks, and re-v",
    "kind": "skill"
  },
  {
    "slug": "updatefirstmate",
    "name": "updatefirstmate",
    "description": ">-",
    "kind": "skill"
  },
  {
    "slug": "vantajs",
    "name": "vantajs",
    "description": "Use when adding animated WebGL background effects with Vanta.js (setup, parameters, resizing, performance, integration in React/Next.js).",
    "kind": "skill"
  },
  {
    "slug": "variant",
    "name": "variant",
    "description": "Answers \"which of these?\" rather than \"is this right?\". Builds several genuinely different versions of one piece of UI behind a picker in the real page, so you can flip between the",
    "kind": "skill"
  },
  {
    "slug": "verify-and-stop",
    "name": "verify and stop",
    "description": "Prove existing work meets acceptance conditions without expanding scope. Use for validation-only tasks, completion checks, focused gate runs, and last-mile proof.",
    "kind": "skill"
  },
  {
    "slug": "video",
    "name": "video",
    "description": "When the user wants to create, generate, or produce video content using AI tools or programmatic frameworks. Also use when the user mentions 'video production,' 'AI video,' 'Remoti",
    "kind": "skill"
  },
  {
    "slug": "voice-dossier-builder",
    "name": "voice dossier builder",
    "description": "'Use when the user asks to \"codify how our founder sounds\", \"build a founder voice dossier\", or \"set our content pillars\"; runs an 80%-extraction interview over the user''s OWN pos",
    "kind": "skill"
  },
  {
    "slug": "web-design-engineer",
    "name": "web design engineer",
    "description": "Build or redesign polished browser-rendered visual artifacts with HTML/CSS/JavaScript/React: pages, dashboards, prototypes, slide decks, animations, UI mockups, and data visualizat",
    "kind": "skill"
  },
  {
    "slug": "web-video-presentation",
    "name": "web video presentation",
    "description": "把一篇文章或口播稿，做成\"看起来像视频\"的点击驱动 16:9 网页演示，可选合成口播音频。流程：原始文章 → **一次产出**口播稿 + outline 开发计划 → 用户**一次对齐** 5 件事（稿子 / outline / 主题 / 素材 / 开发模式）→ 网页开发（逐章 / 顺序 / 并行）→ 可选音频合成（provider-agnostic：内置 ",
    "kind": "skill"
  },
  {
    "slug": "webgl-3d-object",
    "name": "webgl 3d object",
    "description": "Create a real 3D WebGL object with geometric mesh depth, physically based material, directional and ambient lighting, perspective camera, subtle rotation, and floating motion. Use ",
    "kind": "skill"
  },
  {
    "slug": "webgl-landing-steering",
    "name": "webgl landing steering",
    "description": "Use when creating or refining WebGL-heavy landing pages and you need to steer toward a specific visual outcome (premium, technical, playful, cinematic) while balancing conversion c",
    "kind": "skill"
  },
  {
    "slug": "webgl-laser",
    "name": "webgl laser",
    "description": "Create a fixed full-screen WebGL laser background effect with a thin white-hot vertical core, restrained brand-colored halo, and soft smoky fog around the beam. Use only for laser ",
    "kind": "skill"
  },
  {
    "slug": "wordpress-content-deployment",
    "name": "wordpress content deployment",
    "description": "Use when REST API limits block large WP content updates.",
    "kind": "skill"
  },
  {
    "slug": "write-swift",
    "name": "write swift",
    "description": "How to write modern Swift well — modeling with value types, Swift 6 data-race safety and approachable concurrency (@concurrent, main-actor-by-default, actors, task groups), protoco",
    "kind": "skill"
  },
  {
    "slug": "yuanbao",
    "name": "yuanbao",
    "description": "Yuanbao (元宝) groups: @mention users, query info/members.",
    "kind": "skill"
  }
];
export const HERMES_PLUGINS: readonly HermesCapability[] = [
  {
    "slug": "agency-agents-router",
    "name": "agency agents router",
    "description": "Lazy search/load/delegate router for The Agency agent roster.",
    "kind": "plugin"
  },
  {
    "slug": "herdr-agent-state",
    "name": "herdr agent state",
    "description": "Report Hermes Agent lifecycle state to Herdr panes",
    "kind": "plugin"
  },
  {
    "slug": "mnemosyne",
    "name": "mnemosyne",
    "description": "Native local memory for Hermes — SQLite with vector search, FTS5 hybrid ranking, episodic consolidation, temporal triples, and bidirectional sync with optional client-side encrypti",
    "kind": "plugin"
  },
  {
    "slug": "planning-with-files",
    "name": "planning with files",
    "description": "Hermes adapter for persistent project planning and selected context injection. Explicit catchup modes read same-project local session records for aggregate counts or bounded replay",
    "kind": "plugin"
  },
  {
    "slug": "rtk-rewrite",
    "name": "rtk rewrite",
    "description": "Rewrite Hermes terminal commands through RTK before execution.",
    "kind": "plugin"
  }
];
export const HERMES_SKILL_COUNT = 472 as const;
export const HERMES_PLUGIN_COUNT = 5 as const;
