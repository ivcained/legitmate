import { describe, expect, it } from 'vitest'
import sitemap from '../app/sitemap'
import { productOffers } from '../lib/product-offers'

describe('LegitClub product family', () => {
  it('publishes distinct branded offers with working internal targets', () => {
    expect(productOffers.map((product) => product.name)).toEqual(['Agent Workspaces', 'Search Systems', 'Short-Form Studio', 'Deck Studio'])
    expect(new Set(productOffers.map((product) => product.slug)).size).toBe(productOffers.length)
    expect(new Set(productOffers.map((product) => product.href)).size).toBe(productOffers.length)
    for (const product of productOffers) {
      expect(product.description.length).toBeGreaterThan(70)
      expect(product.audience.length).toBeGreaterThan(25)
    }
  })

  it('includes the products hub and Deck Studio in the sitemap', () => {
    const urls = new Set(sitemap().map((entry) => entry.url))
    expect(urls.has('https://mate.legitclub.com/products')).toBe(true)
    expect(urls.has('https://mate.legitclub.com/presentation-design')).toBe(true)
  })
})
