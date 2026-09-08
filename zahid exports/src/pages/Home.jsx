import { Link } from "react-router-dom"
import Header from "../components/Header"
import Footer from "../components/Footer"
import ProductGrid from "../components/ProductGrid"
import { products } from "../data/products"
import { categories } from "../data/categories"

function Home() {
  const featured = products.filter((product) => product.featured)

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900">
      <Header />

      <section className="relative flex min-h-screen items-center overflow-hidden">
        <img src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=2200&q=90" alt="Luxury interior" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-black/45" />
        <div className="relative z-10 mx-auto w-full max-w-7xl px-6 lg:px-10">
          <div className="max-w-4xl text-white">
            <p className="mb-6 text-xs uppercase tracking-[0.35em] text-stone-200 md:text-sm">Furniture • Home Decor • Handicrafts</p>
            <h1 className="text-5xl font-light leading-[1.05] md:text-7xl lg:text-8xl">Crafted for<br />Beautiful Spaces</h1>
            <p className="mt-7 max-w-xl text-base leading-7 text-stone-200 md:text-lg">A premium B2B collection of furniture, home décor and handcrafted pieces for buyers, retailers and hospitality spaces.</p>
            <Link to="/products" className="mt-9 inline-block border border-white px-8 py-4 text-sm uppercase tracking-widest transition hover:bg-white hover:text-stone-900">Explore Collection</Link>
          </div>
        </div>
      </section>

      <section className="px-6 py-24 lg:px-10 lg:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 max-w-3xl">
            <p className="mb-4 text-xs uppercase tracking-[0.3em] text-stone-500">Our Collection</p>
            <h2 className="text-4xl font-light leading-tight md:text-6xl">Products made to<br />make an impression.</h2>
          </div>
          <ProductGrid products={featured.length ? featured : products.slice(0, 4)} />
          <div className="mt-16 text-center"><Link to="/products" className="inline-block border border-stone-900 px-8 py-4 text-sm uppercase tracking-widest transition hover:bg-stone-900 hover:text-white">View All Products</Link></div>
        </div>
      </section>

      <section className="bg-stone-900 px-6 py-24 text-white lg:px-10 lg:py-32">
        <div className="mx-auto max-w-7xl">
          <p className="mb-5 text-xs uppercase tracking-[0.3em] text-stone-400">Browse by category</p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {categories.slice(0, 8).map((category) => (
              <Link key={category.id} to={`/products/category/${category.slug}`} className="border border-stone-700 p-6 transition hover:border-white">
                <p className="text-lg">{category.name}</p>
                <p className="mt-3 text-xs uppercase tracking-widest text-stone-500">{category.productCount} products →</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-24 lg:px-10 lg:py-36">
        <div className="mx-auto max-w-5xl text-center">
          <p className="mb-5 text-xs uppercase tracking-[0.3em] text-stone-500">B2B Enquiries</p>
          <h2 className="text-4xl font-light leading-tight md:text-6xl">Building a collection for<br />your next project?</h2>
          <Link to="/contact" className="mt-10 inline-block border border-stone-900 px-9 py-4 text-sm uppercase tracking-widest transition hover:bg-stone-900 hover:text-white">Request an Enquiry</Link>
        </div>
      </section>
      <Footer />
    </div>
  )
}

export default Home
