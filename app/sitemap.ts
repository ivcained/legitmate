import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: 'https://mate.legitclub.com/', changeFrequency: 'weekly', priority: 1 },
    { url: 'https://mate.legitclub.com/docs/api', changeFrequency: 'monthly', priority: 0.7 },
    { url: 'https://mate.legitclub.com/auth.md', changeFrequency: 'monthly', priority: 0.5 },
    { url: 'https://mate.legitclub.com/seo-services', changeFrequency: 'weekly', priority: 0.9 },
    { url: 'https://mate.legitclub.com/short-form-video', changeFrequency: 'weekly', priority: 0.9 },
    { url: 'https://mate.legitclub.com/products', changeFrequency: 'weekly', priority: 0.9 },
    { url: 'https://mate.legitclub.com/presentation-design', changeFrequency: 'weekly', priority: 0.9 },
    { url: 'https://mate.legitclub.com/web-scraping-services', changeFrequency: 'weekly', priority: 0.9 },
    ...['technical-seo', 'keyword-research', 'rank-tracking', 'competitor-analysis', 'backlink-analysis', 'seo-audits', 'ai-seo', 'local-seo', 'international-seo', 'content-seo', 'ecommerce-seo', 'saas-seo'].map((slug) => ({ url: `https://mate.legitclub.com/seo-services/${slug}`, changeFrequency: 'monthly' as const, priority: 0.8 })),
  ]
}
