import { describe, expect, it } from 'vitest'
import { seoServices } from '../lib/seo-services'
import sitemap from '../app/sitemap'

describe('SEO service pages', () => {
  it('uses unique service slugs, primary keywords, and metadata', () => {
    expect(seoServices.length).toBeGreaterThanOrEqual(13)
    expect(new Set(seoServices.map((service) => service.slug)).size).toBe(seoServices.length)
    expect(new Set(seoServices.map((service) => service.primaryKeyword)).size).toBe(seoServices.length)
    for (const service of seoServices) {
      expect(service.name.length).toBeGreaterThan(8)
      expect(service.metaDescription.length).toBeGreaterThan(80)
      expect(service.metaDescription.length).toBeLessThanOrEqual(165)
      expect(service.deliverables.length).toBeGreaterThanOrEqual(5)
      expect(service.measures.length).toBeGreaterThanOrEqual(4)
    }
  })

  it('publishes every service page in the sitemap', () => {
    const urls = new Set(sitemap().map((entry) => entry.url))
    expect(urls.has('https://mate.legitclub.com/seo-services')).toBe(true)
    expect(urls.has('https://mate.legitclub.com/short-form-video')).toBe(true)
    for (const service of seoServices) expect(urls.has(`https://mate.legitclub.com/seo-services/${service.slug}`)).toBe(true)
  })
})
