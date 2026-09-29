import { Link } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import HeroSlider from '../components/HeroSlider'
import ProductGrid from '../components/ProductGrid'
import { useCatalog } from '../data/useCatalog'

function Home() {
  const { products, categories } = useCatalog()
  const featured = products.filter((product) => product.featured)

  return (
    <div className="page-shell">
      <Header />
      <main>
        <HeroSlider />

        <section className="section intro-section">
          <div className="container intro">
            <div>
              <p className="eyebrow">Zahid Exports</p>
              <h2 className="section-title">Objects with character.<br />Made for spaces.</h2>
            </div>
            <p className="section-copy">We bring together timeless forms, thoughtful materials and skilled craftsmanship to create collections that feel distinctive in every setting — from boutique retail to hospitality and interior projects.</p>
          </div>
        </section>

        <section className="section collection-section">
          <div className="container">
            <div className="collection-head">
              <div>
                <p className="eyebrow">Featured Collection</p>
                <h2 className="section-title">Selected pieces<br />for considered spaces.</h2>
              </div>
              <Link className="text-link" to="/products">View all products ↗</Link>
            </div>
            <ProductGrid products={featured.length ? featured : products.slice(0, 4)} />
          </div>
        </section>

        <section className="section category-section">
          <div className="container">
            <p className="eyebrow category-eyebrow">Explore the range</p>
            <h2 className="section-title">Shop by category.</h2>
            <div className="category-grid">
              {categories.slice(0, 8).map((category) => (
                <Link className="category-card" key={category.id} to={`/products/category/${category.slug}`}>
                  <div className="category-name">{category.name}</div>
                  <div className="category-count">{category.productCount} products&nbsp;&nbsp;→</div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="section enquiry">
          <div className="container">
            <p className="eyebrow">B2B Enquiries</p>
            <h2 className="section-title">Building a collection for<br />your next project?</h2>
            <p className="section-copy">Tell us what you are sourcing. Our team can help with collections, quantities and project requirements.</p>
            <Link className="btn" to="/contact">Start an Enquiry ↗</Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

export default Home
