import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { seoServices } from '../../../lib/seo-services'

type Props = { params: Promise<{ slug: string }> }

export function generateStaticParams() { return seoServices.map((service) => ({ slug: service.slug })) }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const service = seoServices.find((item) => item.slug === slug)
  if (!service) return {}
  return { title: `${service.name} | LegitClub`, description: service.metaDescription, alternates: { canonical: `https://mate.legitclub.com/seo-services/${service.slug}` }, openGraph: { title: `${service.name} | LegitClub`, description: service.metaDescription, url: `https://mate.legitclub.com/seo-services/${service.slug}`, type: 'article' } }
}

export default async function SeoServiceDetail({ params }: Props) {
  const { slug } = await params
  const service = seoServices.find((item) => item.slug === slug)
  if (!service) notFound()
  const jsonLd = { '@context': 'https://schema.org', '@type': 'Service', name: service.name, description: service.metaDescription, provider: { '@type': 'Organization', name: 'LegitClub', url: 'https://mate.legitclub.com' }, areaServed: 'Worldwide', serviceType: service.name }
  return <main className="seo-page seo-detail"><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} /><nav className="seo-nav"><Link href="/seo-services" className="seo-brand"><span>LM</span> LegitClub</Link><div><Link href="/seo-services">All services</Link><Link href="/#main-content">Deploy an agent</Link></div></nav><header className="seo-detail-hero"><p className="seo-kicker">LEGITCLUB / {service.shortName.toUpperCase()}</p><h1>{service.name}<br /><em>built around your evidence.</em></h1><p className="seo-lede">{service.summary}</p><div className="seo-hero-actions"><a className="seo-button seo-button-primary" href={`mailto:hello@legitclub.com?subject=${encodeURIComponent(`${service.name} brief`)}&body=${encodeURIComponent(`Site or product:\nMarkets:\nWhat should improve:\n`)}`}>Discuss this service →</a><Link className="seo-button seo-button-secondary" href="/seo-services">Back to services</Link></div></header><section className="seo-detail-body"><div className="seo-detail-main"><p className="seo-kicker">THE OUTCOME</p><h2>{service.outcome}</h2><p>We start with your business context and the search results that matter. Recommendations are tied to an observable signal, an owner, and a validation step. We do not promise rankings, links, traffic, or AI citations before the work is done.</p><h2 className="seo-subhead">What you receive</h2><div className="seo-deliverables">{service.deliverables.map((item, index) => <div key={item}><span>0{index + 1}</span><strong>{item}</strong></div>)}</div><h2 className="seo-subhead">How we measure it</h2><div className="seo-measures">{service.measures.map((item) => <span key={item}>{item}</span>)}</div></div><aside className="seo-detail-aside"><p className="seo-kicker">BRIEF CHECKLIST</p><p>Send the URL, target markets, language, business goal, and anything already connected: Search Console, Analytics, CRM, or rank data.</p><a className="seo-inline-link" href="mailto:hello@legitclub.com?subject=SEO%20brief">Start a conversation →</a></aside></section><section className="seo-faq"><p className="seo-kicker">COMMON QUESTIONS</p>{service.questions.map((question) => <details key={question}><summary>{question}</summary><p>We answer this during the brief after reviewing your site, market, and current data. The scope should fit the evidence — not a fixed template.</p></details>)}</section><footer className="seo-footer"><span>© LegitClub</span><Link href="/seo-services">SEO services index →</Link></footer></main>
}
