import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: 'https://mate.legitclub.com/', changeFrequency: 'weekly', priority: 1 },
    { url: 'https://mate.legitclub.com/instances', changeFrequency: 'weekly', priority: 0.8 },
    { url: 'https://mate.legitclub.com/docs/api', changeFrequency: 'monthly', priority: 0.7 },
    { url: 'https://mate.legitclub.com/auth.md', changeFrequency: 'monthly', priority: 0.5 },
  ]
}
