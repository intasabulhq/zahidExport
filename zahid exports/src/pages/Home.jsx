import { Link } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import Reveal from '../components/Reveal'
import Seo from '../components/Seo'
import { products } from '../data/products'
import { categories } from '../data/categories'
import './home-motion.css'

const stages = [
  { number: '01', title: 'Discover', copy: 'Share references, quantities, target prices and market requirements. We align the brief before development begins.', points: ['Requirement review', 'Category selection', 'Commercial direction'] },
  { number: '02', title: 'Develop', copy: 'Materials, finishes and samples are refined around the approved direction for a clear route to production.', points: ['Custom development', 'Sample approval', 'Finish coordination'] },
  { number: '03', title: 'Deliver', copy: 'Production follow-up, quality checks and export-ready coordination support dependable order fulfilment.', points: ['Production oversight', 'Quality focus', 'Export support'] },
]

const services = [
  { index: '01', title: 'Custom product development', copy: 'Buyer-led concepts translated into commercially considered decorative collections.' },
  { index: '02', title: 'Wholesale production', copy: 'Structured support for retailers, importers, hospitality groups and project requirements.' },
  { index: '03', title: 'Quality & finishing', copy: 'Close attention to material character, surface finish and approved product direction.' },
  { index: '04', title: 'Export coordination', copy: 'Clear communication for documentation, packaging requirements and global supply.' },
]

function Home() {
  const visualProducts = products.filter((product) => product.images?.length)
  const featured = visualProducts.filter((product) => product.featured).slice(0, 4)
  const categoryCards = categories.slice(0, 8).map((category) => ({ ...category, image: visualProducts.find((product) => product.categorySlug === category.slug)?.images?.[0] }))

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

  return <div className="motion-home">
    <Seo
      title="Home Decor Manufacturer & Exporter India | Zahid Exports"
      description="Zahid Exports manufactures handcrafted metal furniture, home decor and lifestyle products in Moradabad for wholesale, hospitality and global buyers."
      keywords={['home decor manufacturer India', 'Moradabad handicraft exporter', 'metal furniture manufacturer', 'wholesale decor supplier India']}
      canonicalPath="/"
      image={visualProducts[0]?.images?.[0]}
      structuredData={organizationSchema}
    />
    <Header />
    <main>
      <section className="az-hero">
        <div className="az-hero-noise" aria-hidden="true" />
        <div className="container az-hero-layout">
          <div className="az-hero-copy">
            <p className="az-kicker az-fade-in">Moradabad · India · Since 2016</p>
            <h1 aria-label="From Moradabad to remarkable spaces">
              <span className="az-word"><i>From Moradabad</i></span>
              <span className="az-word"><i>to remarkable</i></span>
              <span className="az-word az-word-accent"><i>spaces.</i></span>
            </h1>
            <div className="az-hero-bottom az-fade-in">
              <p>Handcrafted furniture and décor developed for retailers, hospitality groups and global sourcing programmes.</p>
              <div><Link className="az-button az-button-light" to="/products">Explore collection <span>↗</span></Link><Link className="az-text-link" to="/contact">Start an enquiry</Link></div>
            </div>
          </div>
          <div className="az-hero-visual" aria-label="Selected Zahid Exports products">
            {visualProducts.slice(0, 3).map((product, index) => <Link key={product.id} to={`/products/${product.slug}`} className={`az-floating-card az-floating-card-${index + 1}`}><img src={product.images[0]} alt={product.imageAlt} /><span>{product.name}<small>{product.id}</small></span></Link>)}
            <div className="az-orbit" aria-hidden="true"><span>CRAFTED · EXPORTED · CONSIDERED · </span></div>
          </div>
        </div>
        <a href="#story" className="az-scroll">Scroll to explore <span>↓</span></a>
      </section>

      <div className="az-marquee" aria-label="Zahid Exports capabilities"><div><span>Furniture</span><b>✦</b><span>Home décor</span><b>✦</b><span>Metal craft</span><b>✦</b><span>Custom development</span><b>✦</b><span>Global B2B</span><b>✦</b><span>Furniture</span><b>✦</b><span>Home décor</span><b>✦</b><span>Metal craft</span><b>✦</b></div></div>

      <section id="story" className="az-story az-section">
        <div className="container az-story-grid">
          <Reveal><p className="az-kicker">A manufacturing partner</p><div className="az-roundel" aria-hidden="true"><span>ZE</span></div></Reveal>
          <Reveal delay={120}><h2>Objects with presence.<br />Partnerships with purpose.</h2><div className="az-story-copy"><p>Zahid Exports brings together Moradabad’s making heritage and a commercial understanding of international home and lifestyle markets.</p><p>From initial direction to bulk requirements, we focus on considered design, dependable communication and products made to earn their place.</p></div><Link className="az-arrow-link" to="/about">Discover our story <span>↗</span></Link></Reveal>
        </div>
      </section>

      <section className="az-process az-section">
        <div className="container az-process-head"><Reveal><p className="az-kicker">How we work</p><h2>One clear journey.<br />Three focused stages.</h2></Reveal><Reveal delay={120}><p>A straightforward path from product direction to production support—built around the buyer’s commercial brief.</p></Reveal></div>
        <div className="container az-stage-stack">
          {stages.map((stage, index) => <Reveal key={stage.number} className="az-stage" delay={index * 90}><div className="az-stage-number">{stage.number}</div><h3>{stage.title}</h3><p>{stage.copy}</p><ul>{stage.points.map((point) => <li key={point}>{point}</li>)}</ul></Reveal>)}
        </div>
      </section>

      <section className="az-services az-section">
        <div className="container">
          <Reveal className="az-services-title"><p className="az-kicker">What we support</p><h2>Made to move business forward.</h2></Reveal>
          <div className="az-service-grid">{services.map((service, index) => <Reveal as="article" key={service.index} className="az-service-card" delay={index * 80}><span>{service.index}</span><div className="az-service-icon" aria-hidden="true">↗</div><h3>{service.title}</h3><p>{service.copy}</p></Reveal>)}</div>
        </div>
      </section>

      <section className="az-categories az-section">
        <div className="container az-category-head"><Reveal><p className="az-kicker">Product universe</p><h2>Explore the collection.</h2></Reveal><Reveal delay={100}><p>Furniture, tabletop and decorative objects developed across a growing multi-category catalogue.</p><Link className="az-arrow-link" to="/products">View all products <span>↗</span></Link></Reveal></div>
        <div className="az-category-rail">{categoryCards.map((category, index) => <Reveal as="article" key={category.id} className="az-category-card" delay={(index % 4) * 70}><Link to={`/products/category/${category.slug}`}><div className="az-category-image">{category.image ? <img src={category.image} alt={`${category.name} manufactured by Zahid Exports`} loading="lazy" /> : <span aria-hidden="true">ZE</span>}<b>{String(index + 1).padStart(2, '0')}</b></div><div><h3>{category.name}</h3><span>{category.productCount} legacy pieces</span><i aria-hidden="true">↗</i></div></Link></Reveal>)}</div>
      </section>

      <section className="az-featured az-section">
        <div className="container az-featured-head"><Reveal><p className="az-kicker">Selected pieces</p><h2>Designed to be noticed.</h2></Reveal></div>
        <div className="container az-featured-grid">{featured.map((product, index) => <Reveal as="article" key={product.id} className={`az-featured-card az-featured-${index + 1}`} delay={index * 90}><Link to={`/products/${product.slug}`}><div><img src={product.images[0]} alt={product.imageAlt} loading="lazy" /></div><p>{product.category}</p><h3>{product.name}</h3><span>{product.id}</span></Link></Reveal>)}</div>
      </section>

      <section className="az-proof az-section">
        <div className="container az-proof-grid">
          <Reveal><p className="az-kicker">Why Zahid Exports</p><h2>Your eyes on detail.<br />Your partner in India.</h2></Reveal>
          <div className="az-proof-list">{[['01','Buyer-led development'],['02','Custom and bulk capability'],['03','Quality-focused production'],['04','Direct B2B communication'],['05','Export-oriented support']].map(([number, label], index) => <Reveal key={number} delay={index * 60}><span>{number}</span><h3>{label}</h3><i>↗</i></Reveal>)}</div>
        </div>
      </section>

      <section className="az-final-cta">
        <div className="container"><Reveal><p className="az-kicker">Ready for the next collection?</p><h2>Let’s make something<br /><i>remarkable.</i></h2><div><Link className="az-button az-button-dark" to="/contact">Discuss your project <span>↗</span></Link><a href="mailto:info@zahidexports.com">info@zahidexports.com</a></div></Reveal></div>
      </section>
    </main>
    <Footer />
  </div>
}

export default Home
