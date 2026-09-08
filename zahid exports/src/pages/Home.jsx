import { Link } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import ProductGrid from '../components/ProductGrid'
import heroImage from '../assets/hero.png'
import { products } from '../data/products'
import { categories } from '../data/categories'

const strengths = [
  ['01', 'Craft-led production', 'Skilled making, precise finishing and close attention to every detail.'],
  ['02', 'Built for business', 'Collections developed for wholesale, hospitality and interior projects.'],
  ['03', 'Export ready', 'Reliable documentation, packaging and support for global buyers.'],
]

function Home() {
  const featured = products.filter((product) => product.featured)

  return (
    <div className="page-shell home-page">
      <Header />
      <main>
        <section className="hero" aria-labelledby="hero-title">
          <img className="hero-image" src={heroImage} alt="A refined Zahid Exports interior collection" />
          <div className="hero-overlay" />
          <div className="container hero-content">
            <p className="eyebrow hero-eyebrow">Moradabad · India · Since 1998</p>
            <h1 id="hero-title" className="hero-title">Objects made<br />to be remembered.</h1>
            <div className="hero-lower">
              <p className="hero-copy">Premium furniture and décor shaped by skilled hands for retailers, hospitality groups and considered interiors worldwide.</p>
              <div className="hero-buttons">
                <Link className="btn btn-light" to="/products">Explore collection <span aria-hidden="true">↗</span></Link>
                <Link className="btn btn-ghost" to="/contact">Discuss a project</Link>
              </div>
            </div>
          </div>
          <a className="scroll-cue" href="#introduction">Scroll to discover <span aria-hidden="true">↓</span></a>
        </section>

        <section id="introduction" className="section intro-section">
          <div className="container intro-grid">
            <div>
              <p className="eyebrow">Designed with purpose</p>
              <h2 className="section-title">Distinctive forms.<br />Enduring craft.</h2>
            </div>
            <div className="intro-copy-wrap">
              <p className="section-copy section-copy-large">We combine timeless proportions, thoughtful materials and generations of metalworking expertise to create pieces with a quiet, unmistakable presence.</p>
              <Link className="text-link" to="/about">Our story <span aria-hidden="true">↗</span></Link>
            </div>
          </div>
          <div className="container strengths-grid">
            {strengths.map(([number, title, copy]) => (
              <article className="strength-card" key={number}>
                <span className="strength-number">{number}</span>
                <h3>{title}</h3>
                <p>{copy}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section collection-section">
          <div className="container">
            <div className="collection-head">
              <div>
                <p className="eyebrow">Curated selection</p>
                <h2 className="section-title">Featured pieces.</h2>
              </div>
              <Link className="text-link" to="/products">View all products <span aria-hidden="true">↗</span></Link>
            </div>
            <ProductGrid products={featured.length ? featured : products.slice(0, 4)} />
          </div>
        </section>

        <section className="section category-section">
          <div className="container category-layout">
            <div className="category-intro">
              <p className="eyebrow category-eyebrow">The collection</p>
              <h2 className="section-title">Explore by<br />category.</h2>
              <p>From sculptural accents to functional furniture, discover a broad collection built for commercial sourcing.</p>
              <Link className="btn btn-outline-light" to="/products">Browse everything <span aria-hidden="true">↗</span></Link>
            </div>
            <div className="category-list">
              {categories.slice(0, 8).map((category, index) => (
                <Link className="category-row" key={category.id} to={`/products/category/${category.slug}`}>
                  <span className="category-index">{String(index + 1).padStart(2, '0')}</span>
                  <span className="category-name">{category.name}</span>
                  <span className="category-count">{category.productCount} pieces</span>
                  <span className="category-arrow" aria-hidden="true">↗</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="section trade-section">
          <div className="container trade-grid">
            <div className="trade-label">
              <p className="eyebrow">For the trade</p>
              <span className="trade-mark" aria-hidden="true">ZE</span>
            </div>
            <div className="trade-copy">
              <h2 className="section-title">A dependable partner for ambitious spaces.</h2>
              <p className="section-copy">Tell us your brief, quantity and delivery market. We will help shape a considered collection around your project.</p>
              <div className="trade-actions">
                <Link className="btn btn-dark" to="/contact">Request a quote <span aria-hidden="true">↗</span></Link>
                <a className="text-link" href="mailto:info@zahidexports.com">info@zahidexports.com</a>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

export default Home
