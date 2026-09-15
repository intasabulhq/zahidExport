import { useEffect, useState } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import ProductGrid from '../components/ProductGrid'
import Seo from '../components/Seo'
import { fetchProducts } from '../data/productApi'

function Products() {
  const [query, setQuery] = useState('')
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const controller = new AbortController()
    const timer = window.setTimeout(async () => {
      setLoading(true)
      setError('')
      try {
        setProducts(await fetchProducts({ search: query, signal: controller.signal }))
      } catch (requestError) {
        if (requestError.name !== 'AbortError') setError(requestError.message)
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    }, 250)
    return () => { window.clearTimeout(timer); controller.abort() }
  }, [query])

  return <div className="min-h-screen bg-stone-50 text-stone-900">
    <Seo title="Home Decor Products Manufacturer & Exporter | Zahid Exports" description="Explore handcrafted metal furniture, cake stands, animal stands, trays and decorative home accessories manufactured in Moradabad, India." keywords={['home decor manufacturer India', 'Moradabad handicraft exporter', 'wholesale metal decor', 'hospitality decor supplier']} canonicalPath="/products" />
    <Header />
    <main className="mx-auto max-w-7xl px-6 pb-24 pt-36 lg:px-10">
      <p className="mb-4 text-xs uppercase tracking-[0.3em] text-stone-500">Product Catalogue</p>
      <div className="flex flex-col justify-between gap-8 border-b border-stone-300 pb-12 md:flex-row md:items-end">
        <div><h1 className="text-5xl font-light md:text-7xl">Home Decor Products</h1><p className="mt-5 max-w-2xl leading-7 text-stone-600">Browse export-ready furniture and decorative accessories manufactured in Moradabad for wholesale, hospitality and interior projects.</p></div>
        <div className="w-full md:max-w-sm"><label htmlFor="product-search" className="sr-only">Search products</label><input id="product-search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by name, SKU or category" className="w-full border-b border-stone-400 bg-transparent px-0 py-3 text-sm outline-none placeholder:text-stone-400" /></div>
      </div>
      {error && <p className="admin-module-error" role="alert">{error}</p>}
      <p className="py-8 text-sm text-stone-500">{loading ? 'Loading catalogue…' : `Showing ${products.length} published products.`}</p>
      {!loading && <ProductGrid products={products} />}
    </main>
    <Footer />
  </div>
}

export default Products
