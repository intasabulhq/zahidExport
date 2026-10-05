import { useSearchParams } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import ProductGrid from '../components/ProductGrid'
import CataloguePagination from '../components/CataloguePagination'
import Seo from '../components/Seo'
import useAsyncResource from '../hooks/useAsyncResource'
import { fetchProductsPage } from '../data/productApi'
import { waitForResource } from '../data/asyncResource'
import './catalogue.css'

async function loadProducts(key, signal) {
  const { search, page } = JSON.parse(key)
  await waitForResource(250, signal)
  return fetchProductsPage({ search, offset: (page - 1) * 24, signal })
}

function Products() {
  const [searchParams, setSearchParams] = useSearchParams()
  const query = searchParams.get('q') || ''
  const candidate = Number(searchParams.get('page') || 1)
  const page = Number.isSafeInteger(candidate) && candidate > 0 && candidate <= 1000000 ? candidate : 1
  const { data, loading, error, retry } = useAsyncResource(JSON.stringify({ search: query, page }), loadProducts)

  const changeSearch = (value) => {
    const params = new URLSearchParams(searchParams)
    if (value) params.set('q', value)
    else params.delete('q')
    params.delete('page')
    setSearchParams(params, { replace: true })
  }
  const changePage = (value) => {
    const params = new URLSearchParams(searchParams)
    if (value === 1) params.delete('page')
    else params.set('page', String(value))
    setSearchParams(params)
    window.scrollTo({ top: 0, behavior: 'instant' })
  }

  return <div className="catalogue-page min-h-screen bg-stone-50 text-stone-900">
    <Seo title="Home Decor Products Manufacturer & Exporter | Zahid Exports" description="Explore handcrafted metal furniture, cake stands, animal stands, trays and decorative home accessories manufactured in Moradabad, India." keywords={['home decor manufacturer India', 'Moradabad handicraft exporter', 'wholesale metal decor', 'hospitality decor supplier']} canonicalPath="/products" robots={page > 1 || query ? 'noindex, follow' : 'index, follow'} />
    <Header />
    <main className="mx-auto max-w-7xl px-6 pb-24 pt-36 lg:px-10">
      <p className="mb-4 text-xs uppercase tracking-[0.3em] text-stone-500">Product Catalogue</p>
      <div className="flex flex-col justify-between gap-8 border-b border-stone-300 pb-12 md:flex-row md:items-end">
        <div><h1 className="text-5xl font-light md:text-7xl">Home Decor Products</h1><p className="mt-5 max-w-2xl leading-7 text-stone-600">Browse export-ready furniture and decorative accessories manufactured in Moradabad for wholesale, hospitality and interior projects.</p></div>
        <div className="w-full md:max-w-sm"><label htmlFor="product-search" className="sr-only">Search products</label><input id="product-search" value={query} onChange={(event) => changeSearch(event.target.value)} placeholder="Search by name, SKU or category" className="w-full border-b border-stone-400 bg-transparent px-0 py-3 text-sm outline-none placeholder:text-stone-400" /></div>
      </div>
      <p className="py-8 text-sm text-stone-500" role="status">{loading ? 'Loading catalogue…' : error ? 'Catalogue unavailable.' : `Showing ${data.products.length} products on page ${page}.`}</p>
      {error && <div className="catalogue-error" role="alert"><p>{error.message}</p><button type="button" className="btn catalogue-retry" onClick={retry}>Try again</button></div>}
      {!loading && !error && <><ProductGrid products={data.products} /><CataloguePagination page={page} hasMore={data.hasMore} onPageChange={changePage} /></>}
    </main>
    <Footer />
  </div>
}

export default Products
