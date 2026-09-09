import { Link } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import Reveal from '../components/Reveal'
import Seo from '../components/Seo'
import { products } from '../data/products'
import { categories } from '../data/categories'
import './home-motion.css'
import './home-theme.css'
import './home-v2.css'

const stages = [
  { number: '01', title: 'Discover', label: 'Direction & sourcing', copy: 'We align product references, quantities, target prices, compliance needs and market direction before development begins.', points: ['Requirement review', 'Category mapping', 'Commercial direction'] },
  { number: '02', title: 'Develop', label: 'Sampling & refinement', copy: 'Materials, dimensions and finishes are developed around the approved direction, with a clear route from sample to production.', points: ['Custom development', 'Sample approval', 'Finish coordination'] },
  { number: '03', title: 'Deliver', label: 'Production & export', copy: 'Production follow-up, quality focus, packaging requirements and documentation support dependable order fulfilment.', points: ['Production oversight', 'Quality focus', 'Export support'] },
]

const services = [
  { index: '01', title: 'Custom product development', copy: 'Buyer-led concepts translated into commercially considered furniture and decorative collections.' },
  { index: '02', title: 'Wholesale production', copy: 'Structured support for retailers, importers, hospitality groups and project-based requirements.' },
  { index: '03', title: 'Quality & finishing', copy: 'Close attention to material character, dimensions, surface treatment and approved product direction.' },
  { index: '04', title: 'Export coordination', copy: 'Clear communication for production updates, packaging requirements and global supply.' },
]

function Home() {
  const visualProducts = products.filter((product) => product.images?.length)
  const featured = visualProducts.filter((product) => product.featured).slice(0, 4)
  const heroProducts = visualProducts.slice(0, 3)
  const categoryCards = categories.slice(0, 8).map((category) => ({
    ...category,
    image: visualProducts.find((product) => product.categorySlug === category.slug)?.images?.[0],
  }))

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Zahid Exports',
    foundingDate: '2016',
    description: 'Manufacturer and exporter of handcrafted furniture, home decor and lifestyle products from Moradabad, India.',
    email: 'info@zahidexports.com',
    telephone: '+91 84330 85717',
    address: { '@type': 'PostalAddress', addressLocality: 'Moradabad', addressRegion: 'Uttar Pradesh', postalCode: '244001', addressCountry: 'IN' },
  }

  return <div className="motion-home home-v2">
    <Seo
      title="Home Decor Manufacturer & Exporter India | Zahid Exports"
      description="Zahid Exports manufactures handcrafted metal furniture, home decor and lifestyle products in Moradabad for wholesale, hospitality and global buyers."
      keywords={['home decor manufacturer India', 'Moradabad handicraft exporter', 'metal furniture manufacturer', 'wholesale decor supplier India']}
      canonicalPath="/"
      image={heroProducts[0]?.images?.[0]}
      structuredData={organizationSchema}
    />
    <Header />
    <main>
      <section className="ze2-hero">
        <div className="ze2-hero-glow" aria-hidden="true" />
        <div className="container ze2-hero-grid">
          <div className="ze2-hero-copy">
            <p className="ze2-kicker ze2-hero-enter">Moradabad · India · Established 2016</p>
            <h1 aria-label="Crafted in India. Made for global spaces.">
              <span className="ze2-line"><i>Crafted in India.</i></span>
              <span className="ze2-line"><i>Made for global</i></span>
              <span className="ze2-line ze2-line-accent"><i>spaces.</i></span>
            </h1>
            <div className="ze2-hero-detail ze2-hero-enter">
              <p>Handcrafted furniture and décor developed for retailers, hospitality groups and international sourcing programmes.</p>
              <div className="ze2-actions">
                <Link className="ze2-btn ze2-btn-primary" to="/products">Explore collection <span>↗</span></Link>
                <Link className="ze2-btn ze2-btn-ghost" to="/contact">Discuss a project <span>↗</span></Link>
              </div>
            </div>
          </div>

          <div className="ze2-hero-gallery" aria-label="Selected Zahid Exports products">
            {heroProducts[0] && <Link to={`/products/${heroProducts[0].slug}`} className="ze2-main-product">
              <img src={heroProducts[0].images[0]} alt={heroProducts[0].imageAlt} />
              <span><small>Selected object · {heroProducts[0].id}</small>{heroProducts[0].name}</span>
            </Link>}
            <div className="ze2-side-products">
              {heroProducts.slice(1).map((product, index) => <Link key={product.id} to={`/products/${product.slug}`} className={`ze2-side-product ze2-side-product-${index + 1}`}>
                <img src={product.images[0]} alt={product.imageAlt} />
                <span>{product.id}</span>
              </Link>)}
            </div>
            <div className="ze2-sourcing-card"><small>For global buyers</small><strong>Furniture.<br />Décor.<br />Objects.</strong><span>Direct B2B enquiry ↗</span></div>
          </div>
        </div>
        <a className="ze2-scroll" href="#partner">Scroll to explore <span>↓</span></a>
      </section>

      <div className="az-marquee ze2-marquee" aria-label="Zahid Exports capabilities"><div><span>Furniture</span><b>✦</b><span>Home décor</span><b>✦</b><span>Metal craft</span><b>✦</b><span>Custom development</span><b>✦</b><span>Global B2B</span><b>✦</b><span>Furniture</span><b>✦</b><span>Home décor</span><b>✦</b><span>Metal craft</span><b>✦</b></div></div>

      <section id="partner" className="ze2-partner ze2-section">
        <div className="container ze2-partner-grid">
          <Reveal className="ze2-partner-mark"><p className="ze2-kicker">A manufacturing partner</p><span>ZE</span></Reveal>
          <Reveal className="ze2-partner-copy" delay={120}>
            <h2>Objects with presence.<br />Partnerships with purpose.</h2>
            <div><p>Zahid Exports brings together Moradabad’s making heritage and a commercial understanding of international home and lifestyle markets.</p><p>From initial direction to bulk requirements, we focus on considered design, dependable communication and products made to earn their place.</p></div>
            <Link className="ze2-text-link" to="/about">Discover our story <span>↗</span></Link>
          </Reveal>
        </div>
      </section>

      <section className="ze2-process ze2-section">
        <div className="container ze2-process-intro">
          <Reveal><p className="ze2-kicker">How sourcing works</p><h2>One clear journey.<br />Three focused stages.</h2></Reveal>
          <Reveal delay={120}><p>A coordinated route from initial brief to production support—structured around the buyer’s commercial requirements.</p></Reveal>
        </div>
        <div className="container ze2-process-track">
          {stages.map((stage, index) => <Reveal as="article" key={stage.number} className="ze2-stage" delay={index * 120}>
            <div className="ze2-stage-top"><span>{stage.number}</span><small>{stage.label}</small><i aria-hidden="true">↗</i></div>
            <h3>{stage.title}</h3>
            <p>{stage.copy}</p>
            <ul>{stage.points.map((point) => <li key={point}>{point}</li>)}</ul>
          </Reveal>)}
        </div>
      </section>

      <section className="ze2-services ze2-section">
        <div className="container">
          <Reveal className="ze2-heading-row"><p className="ze2-kicker">What we support</p><h2>Made to move<br />business forward.</h2></Reveal>
          <div className="ze2-service-grid">{services.map((service, index) => <Reveal as="article" key={service.index} className="ze2-service" delay={index * 85}><div><span>{service.index}</span><i>↗</i></div><h3>{service.title}</h3><p>{service.copy}</p></Reveal>)}</div>
        </div>
      </section>

      <section className="ze2-categories ze2-section">
        <div className="container ze2-category-head"><Reveal><p className="ze2-kicker">Product universe</p><h2>Explore the collection.</h2></Reveal><Reveal delay={100}><p>Furniture, tabletop and decorative objects developed across a growing multi-category catalogue.</p><Link className="ze2-text-link" to="/products">View all products <span>↗</span></Link></Reveal></div>
        <div className="ze2-category-rail">{categoryCards.map((category, index) => <Reveal as="article" key={category.id} className="ze2-category" delay={(index % 4) * 70}><Link to={`/products/category/${category.slug}`}><div>{category.image ? <img src={category.image} alt={`${category.name} manufactured by Zahid Exports`} loading="lazy" /> : <span>ZE</span>}<b>{String(index + 1).padStart(2, '0')}</b></div><h3>{category.name}</h3><small>{category.productCount} legacy pieces</small><i>↗</i></Link></Reveal>)}</div>
      </section>

      <section className="ze2-featured ze2-section">
        <div className="container"><Reveal><p className="ze2-kicker">Selected pieces</p><h2>Designed to be noticed.</h2></Reveal>
          <div className="ze2-featured-grid">{featured.map((product, index) => <Reveal as="article" key={product.id} className={`ze2-featured-card ze2-featured-${index + 1}`} delay={index * 90}><Link to={`/products/${product.slug}`}><div><img src={product.images[0]} alt={product.imageAlt} loading="lazy" /></div><p>{product.category}</p><h3>{product.name}</h3><span>{product.id}</span></Link></Reveal>)}</div>
        </div>
      </section>

      <section className="ze2-proof ze2-section">
        <div className="container ze2-proof-grid">
          <Reveal><p className="ze2-kicker">Why Zahid Exports</p><h2>Your eyes on detail.<br />Your partner in India.</h2></Reveal>
          <div className="ze2-proof-list">{[['01','Buyer-led development'],['02','Custom and bulk capability'],['03','Quality-focused production'],['04','Direct B2B communication'],['05','Export-oriented support']].map(([number, label], index) => <Reveal key={number} delay={index * 65}><span>{number}</span><h3>{label}</h3><i>↗</i></Reveal>)}</div>
        </div>
      </section>

      <section className="ze2-cta ze2-section"><div className="container"><Reveal><p className="ze2-kicker">Start a conversation</p><h2>Let’s make something<br /><span>remarkable.</span></h2><div><Link className="ze2-btn ze2-btn-dark" to="/contact">Discuss your project <span>↗</span></Link><a href="mailto:info@zahidexports.com">info@zahidexports.com</a></div></Reveal></div></section>
    </main>
    <Footer />
  </div>
}

export default Home
