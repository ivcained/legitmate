import type { Metadata } from 'next'
import Link from 'next/link'
import { seoServices } from '../../lib/seo-services'

export const metadata: Metadata = {
  title: 'Global SEO Services | LegitClub',
  description: 'Technical SEO, keyword research, content, international SEO, link building, local SEO, ecommerce SEO, SaaS SEO, and AI search optimization.',
  alternates: { canonical: 'https://mate.legitclub.com/seo-services' },
  openGraph: { title: 'Global SEO Services | LegitClub', description: 'Search strategy built from evidence, delivered by specialists.', url: 'https://mate.legitclub.com/seo-services', type: 'website' },
}

export default function SeoServicesPage() {
  return <main className="seo-page">
    <nav className="seo-nav"><Link href="/" className="seo-brand"><span>LM</span> LegitClub</Link><div><Link href="/seo-services">SEO services</Link><Link href="/#main-content">Deploy an agent</Link><Link href="/instances">My instances</Link></div></nav>
    <header className="seo-hero">
      <p className="seo-kicker">LEGITCLUB / GLOBAL SEARCH</p>
      <h1>Search visibility<br /><em>with evidence.</em></h1>
      <p className="seo-lede">Technical SEO, content strategy, international growth, and AI search optimization for teams that need a clear path from discovery to demand.</p>
      <div className="seo-hero-actions"><a className="seo-button seo-button-primary" href="mailto:hello@legitclub.com?subject=SEO%20growth%20brief">Start a growth brief →</a><a className="seo-button seo-button-secondary" href="#services">Explore services ↓</a></div>
      <div className="seo-signal"><span>SEARCH DATA</span><i /><span>MARKET CONTEXT</span><i /><span>HUMAN JUDGMENT</span></div>
    </header>
    <section className="seo-intro"><p className="seo-kicker">01 / HOW WE WORK</p><div><h2>Not a list of keywords.<br /><em>A search system.</em></h2><p>We combine crawl evidence, keyword and SERP research, competitor patterns, authority signals, and content judgment. The result is a prioritized plan your team can implement and measure.</p></div></section>
    <section id="services" className="seo-services-grid"><div className="seo-section-head"><p className="seo-kicker">02 / SERVICE MAP</p><h2>What we can do<br /><em>for your market.</em></h2><p>Choose one workstream or combine them into an organic growth program. Scope follows your market, site, team, and evidence.</p></div><div className="seo-cards">{seoServices.map((service, index) => <article className="seo-card" key={service.slug}><div className="seo-card-top"><span>0{index + 1}</span><span>{service.primaryKeyword}</span></div><h3>{service.name}</h3><p>{service.summary}</p><ul>{service.deliverables.slice(0, 3).map((item) => <li key={item}>{item}</li>)}</ul><Link href={`/seo-services/${service.slug}`}>View scope <span>↗</span></Link></article>)}</div></section>
    <section className="seo-ai"><div><p className="seo-kicker">03 / AI SEARCH</p><h2>Be useful to<br /><em>the answer engine.</em></h2></div><div><p>AI visibility is not a shortcut around SEO. We audit how systems describe and cite your brand, identify the source gaps behind competitor mentions, and improve the pages and evidence that make an answer trustworthy.</p><Link className="seo-inline-link" href="/seo-services/ai-seo">Explore AI SEO / GEO →</Link></div></section>
    <section className="seo-process"><p className="seo-kicker">04 / ENGAGEMENT</p><div className="seo-process-grid"><div><span>01</span><h3>Diagnose</h3><p>We establish the business goal, markets, search landscape, baseline, and constraints.</p></div><div><span>02</span><h3>Prioritize</h3><p>We rank opportunities by fit, intent, evidence, effort, and expected value — not volume alone.</p></div><div><span>03</span><h3>Improve</h3><p>Your team gets briefs, fixes, assets, and validation checks that move the roadmap forward.</p></div></div></section>
    <section className="seo-cta"><p className="seo-kicker">05 / NEXT MOVE</p><h2>Bring the hard<br /><em>search question.</em></h2><p>Tell us the site, market, and outcome. We will come back with the first useful question, not a generic audit PDF.</p><a className="seo-button seo-button-primary" href="mailto:hello@legitclub.com?subject=SEO%20growth%20brief">Send the brief →</a></section>
    <footer className="seo-footer"><span>© LegitClub</span><span>Global SEO / AI search / organic growth</span><Link href="/">LegitMate workspace →</Link></footer>
  </main>
}
