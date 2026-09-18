export type SeoService = {
  slug: string
  name: string
  shortName: string
  primaryKeyword: string
  metaDescription: string
  summary: string
  outcome: string
  deliverables: string[]
  measures: string[]
  questions: string[]
}

export const seoServices: SeoService[] = [
  {
    slug: 'technical-seo', name: 'Technical SEO Services', shortName: 'Technical SEO', primaryKeyword: 'technical SEO services',
    metaDescription: 'Technical SEO audits and implementation plans for crawlability, indexing, performance, structured data, and international websites.',
    summary: 'Find the technical conditions that keep useful pages out of search, then turn the findings into a sequenced implementation plan.',
    outcome: 'A site search engines can crawl, understand, render, and index without wasting attention on preventable defects.',
    deliverables: ['Full-site crawl and indexability audit', 'Robots, sitemap, canonical, redirect, and status-code review', 'Core Web Vitals and rendering diagnosis', 'Structured data and internal-link architecture review', 'Prioritized engineering backlog with validation checks'],
    measures: ['Valid indexed pages', 'Crawl waste and errors', 'Core Web Vitals', 'Rich-result eligibility'],
    questions: ['Can you work with our developers?', 'Will you implement the fixes?', 'How often should a technical audit run?'],
  },
  {
    slug: 'seo-strategy', name: 'SEO Strategy & Project Setup', shortName: 'SEO strategy', primaryKeyword: 'SEO strategy services',
    metaDescription: 'SEO strategy and project setup covering business context, markets, competitors, priority pages, measurement readiness, and an evidence-led roadmap.',
    summary: 'Establish the commercial goal, markets, competitors, important pages, measurement access, and research sequence before spending effort on isolated tactics.',
    outcome: 'A shared search brief and prioritized operating plan that connects technical, content, authority, measurement, and AI-visibility work.',
    deliverables: ['Business, audience, offer, and market search brief', 'Baseline domain and measurement-readiness review', 'Competitor and key-page context map', 'Prioritized research and implementation sequence', 'Decision log and recommended next service'],
    measures: ['Brief completeness', 'Measurement readiness', 'Roadmap ownership', 'Priority work completed'],
    questions: ['What do you need before strategy starts?', 'Can you work from public data?', 'Does the strategy include implementation?'],
  },
  {
    slug: 'keyword-research', name: 'Keyword Research Services', shortName: 'Keyword research', primaryKeyword: 'keyword research services',
    metaDescription: 'Global keyword research grounded in search intent, SERP competition, difficulty, demand, CPC, and the pages your business can credibly rank.',
    summary: 'Map real search demand to offers, audience problems, markets, and pages instead of handing over a spreadsheet of disconnected phrases.',
    outcome: 'A prioritized keyword and page plan built around commercial fit, intent, competition, and realistic ranking paths.',
    deliverables: ['Seed expansion and related-query research', 'Volume, difficulty, intent, CPC, and trend analysis where data is available', 'SERP and competitor validation', 'Keyword clustering and topic-map design', 'Page mapping and content briefs'],
    measures: ['Qualified organic demand', 'Ranking coverage by topic', 'Share of relevant SERPs', 'Organic conversion contribution'],
    questions: ['Do you provide search volumes?', 'Can you research several countries?', 'How do you choose priority keywords?'],
  },
  {
    slug: 'rank-tracking', name: 'SEO Rank Tracking Services', shortName: 'Rank tracking', primaryKeyword: 'SEO rank tracking services',
    metaDescription: 'Track organic rankings by keyword, page, market, language, and device with scheduled reports and opportunity alerts.',
    summary: 'Monitor the terms that matter, separate durable movement from noise, and use ranking changes to decide what to fix next.',
    outcome: 'A reliable view of organic performance across the markets and pages that drive the business.',
    deliverables: ['Keyword, page, and competitor tracking set-up', 'Location, language, and device segmentation', 'Scheduled movement and visibility reports', 'Striking-distance opportunity detection', 'Change annotations and recommended actions'],
    measures: ['Ranking distribution', 'Visibility trend', 'Top 3 and top 10 coverage', 'Page-level gains and losses'],
    questions: ['Can you track international rankings?', 'Do reports include competitors?', 'How frequently are rankings checked?'],
  },
  {
    slug: 'competitor-analysis', name: 'SEO Competitor Analysis Services', shortName: 'Competitor analysis', primaryKeyword: 'SEO competitor analysis services',
    metaDescription: 'Compare organic competitors, keyword gaps, content coverage, authority, backlinks, traffic estimates, and SERP ownership.',
    summary: 'Identify who actually competes with you in search, where they win, and which gaps are worth closing.',
    outcome: 'A defensible organic strategy based on competitor evidence rather than copied tactics.',
    deliverables: ['Organic competitor discovery', 'Keyword and content-gap analysis', 'Top pages and traffic-pattern review', 'Domain authority and backlink comparison', 'Opportunity matrix by effort, intent, and expected value'],
    measures: ['Keyword overlap and gaps', 'Share of search visibility', 'Top-page coverage', 'Authority gap'],
    questions: ['Can you find competitors we do not know?', 'Will you analyze individual pages?', 'Do you include paid search competitors?'],
  },
  {
    slug: 'backlink-analysis', name: 'Backlink Analysis & Link Building', shortName: 'Backlinks & links', primaryKeyword: 'link building services',
    metaDescription: 'Backlink audits, competitor link-gap research, prospect qualification, digital PR angles, and measurable link acquisition strategy.',
    summary: 'Separate useful authority signals from noise, find realistic prospects, and build outreach around assets people have a reason to cite.',
    outcome: 'A safer, evidence-led path to earning relevant links and strengthening the pages that need authority.',
    deliverables: ['Backlink profile and risk review', 'Competitor link-intersection analysis', 'Lost-link and unlinked-mention opportunities', 'Prospect discovery, relevance scoring, and qualification', 'Linkable asset, outreach, and digital PR plan'],
    measures: ['Relevant referring domains', 'Earned links to priority pages', 'Link quality and topical fit', 'Lost-link recovery'],
    questions: ['Do you guarantee links?', 'Do you buy links?', 'How do you qualify prospects?'],
  },
  {
    slug: 'seo-audits', name: 'SEO Audit Services', shortName: 'SEO audits', primaryKeyword: 'SEO audit services',
    metaDescription: 'Evidence-based SEO audits covering technical health, indexation, content, internal links, competitors, backlinks, and search opportunities.',
    summary: 'Combine crawl data, search performance, competitor evidence, and page-level inspection into decisions your team can act on.',
    outcome: 'A prioritized roadmap that explains the problem, the evidence, the fix, the owner, and how to verify it.',
    deliverables: ['Technical and on-page audit', 'Indexation and Search Console review', 'Content quality and cannibalization analysis', 'Internal-link and information-architecture review', 'Executive report and implementation backlog'],
    measures: ['Critical issues resolved', 'Index coverage quality', 'Organic landing-page performance', 'Backlog completion'],
    questions: ['Is this a tool-generated report?', 'How deep is the crawl?', 'Can you audit migrations?'],
  },
  {
    slug: 'ai-seo', name: 'AI SEO & Generative Engine Optimization', shortName: 'AI SEO / GEO', primaryKeyword: 'AI SEO services',
    metaDescription: 'AI SEO, GEO, AEO, and LLM visibility audits for ChatGPT, Google AI Overviews, Gemini, Claude, and Perplexity.',
    summary: 'Measure how AI systems describe and cite your brand, then improve the source pages, entity signals, evidence, and answer structure they rely on.',
    outcome: 'Clearer visibility across AI answers without abandoning the search fundamentals that make a brand discoverable and credible.',
    deliverables: ['AI visibility and citation baseline', 'Prompt-set and competitor mention analysis', 'Entity, source, and answer-gap audit', 'GEO/AEO content briefs and citation-ready page improvements', 'Ongoing model-by-model monitoring and change log'],
    measures: ['Mention and citation rate', 'Share of AI answers', 'Source-page coverage', 'Answer accuracy and sentiment'],
    questions: ['Is GEO different from SEO?', 'Can you guarantee AI citations?', 'Which AI platforms do you monitor?'],
  },
  {
    slug: 'local-seo', name: 'Local SEO Services', shortName: 'Local SEO', primaryKeyword: 'local SEO services',
    metaDescription: 'Local SEO for service areas and physical locations: local SERPs, Google Business Profile, reviews, citations, and location content.',
    summary: 'Improve visibility where customers search locally while keeping listings, service areas, locations, and on-site evidence consistent.',
    outcome: 'More qualified discovery across local organic results and map experiences in the markets you actually serve.',
    deliverables: ['Local keyword and map-pack research', 'Google Business Profile audit', 'Listing, category, review, and Q&A analysis', 'Citation and NAP consistency plan', 'Location and service-area page strategy'],
    measures: ['Local pack visibility', 'Profile actions', 'Review velocity and quality', 'Location-page conversions'],
    questions: ['Can you support multiple locations?', 'Do you manage reviews?', 'Will you create city pages?'],
  },
  {
    slug: 'international-seo', name: 'International SEO Services', shortName: 'International SEO', primaryKeyword: 'international SEO services',
    metaDescription: 'International SEO strategy for multi-country and multilingual sites, including hreflang, market research, localization, and regional SERPs.',
    summary: 'Build market-specific organic growth around language, local intent, domain structure, search engines, and technical internationalization.',
    outcome: 'A global search architecture that sends each market to the right experience and gives local teams a usable growth plan.',
    deliverables: ['Country and language opportunity research', 'International domain and URL architecture', 'Hreflang, canonical, and localization audit', 'Market-specific keyword and competitor research', 'Google and Baidu market planning where relevant'],
    measures: ['Non-brand visibility by market', 'Correct regional indexation', 'International organic conversions', 'Hreflang validity'],
    questions: ['Do you work outside Google?', 'Do you translate content?', 'Can you support China SEO?'],
  },
  {
    slug: 'content-seo', name: 'SEO Content Strategy & Optimization', shortName: 'Content SEO', primaryKeyword: 'SEO content strategy services',
    metaDescription: 'Content strategy, topic clusters, on-page optimization, refresh programs, internal links, and briefs built from search evidence.',
    summary: 'Turn keyword and competitor evidence into useful pages, clear topical coverage, and a repeatable publishing and refresh system.',
    outcome: 'Content that answers real demand, supports the sales journey, and compounds instead of competing with itself.',
    deliverables: ['Content inventory and decay analysis', 'Topic clusters and editorial roadmap', 'Search-led content briefs', 'On-page and internal-link optimization', 'Content refresh and pruning plan'],
    measures: ['Qualified traffic by topic', 'Organic conversions', 'Content coverage', 'Refresh uplift'],
    questions: ['Do you write the content?', 'Can you update existing pages?', 'How do you avoid keyword cannibalization?'],
  },
  {
    slug: 'ecommerce-seo', name: 'Ecommerce SEO Services', shortName: 'Ecommerce SEO', primaryKeyword: 'ecommerce SEO services',
    metaDescription: 'Ecommerce SEO for category, product, faceted navigation, structured data, internal links, content, and international product discovery.',
    summary: 'Improve product and category discovery while controlling duplicate URLs, filters, stock changes, and large-site crawl demands.',
    outcome: 'A store architecture that earns qualified product discovery and turns organic visits into measurable revenue.',
    deliverables: ['Category and product keyword map', 'Faceted navigation and crawl-control review', 'Product and merchant structured data audit', 'Category content and internal-link plan', 'Competitor, pricing-SERP, and feed opportunity analysis'],
    measures: ['Organic revenue', 'Category visibility', 'Indexed product quality', 'Non-brand product discovery'],
    questions: ['Which platforms do you support?', 'Can you handle large catalogs?', 'Do you optimize product feeds?'],
  },
  {
    slug: 'saas-seo', name: 'SaaS SEO Services', shortName: 'SaaS SEO', primaryKeyword: 'SaaS SEO services',
    metaDescription: 'SaaS SEO for category demand, product-led pages, competitor comparisons, integrations, use cases, content, and pipeline attribution.',
    summary: 'Connect search demand to product use cases, comparison journeys, integration pages, and the questions buyers ask before a sales conversation.',
    outcome: 'An organic acquisition system tied to product adoption and qualified pipeline rather than traffic alone.',
    deliverables: ['Category and use-case demand map', 'Competitor and alternative page strategy', 'Integration and solution-page architecture', 'Product-led content briefs', 'Search-to-signup and pipeline measurement plan'],
    measures: ['Qualified signups', 'Organic pipeline', 'Category visibility', 'High-intent page conversion'],
    questions: ['Do you work with early-stage SaaS?', 'Can you connect SEO to pipeline?', 'Do you create comparison pages?'],
  },
]

export const primarySeoServices = seoServices.slice(0, 7)
