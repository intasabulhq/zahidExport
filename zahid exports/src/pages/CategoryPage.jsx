import { Link, useParams, useSearchParams } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import ProductGrid from '../components/ProductGrid'
import CataloguePagination from '../components/CataloguePagination'
import Seo from '../components/Seo'
import useAsyncResource from '../hooks/useAsyncResource'
import { fetchCategory, fetchProductsPage, imageUrl } from '../data/productApi'
import './catalogue.css'

async function loadCategoryPage(key, signal) {
  const { slug, page } = JSON.parse(key)
  const category = await fetchCategory(slug, signal)
  const productsPage = await fetchProductsPage({ category: slug, offset: (page - 1) * 24, signal })
  return { category, ...productsPage }
}

function CategoryPage() {
  const { categorySlug } = useParams()
  const [searchParams, setSearchParams] = useSearchParams()
  const candidate = Number(searchParams.get('page') || 1)
  const page = Number.isSafeInteger(candidate) && candidate > 0 && candidate <= 1000000 ? candidate : 1
  const { data, loading, error, retry } = useAsyncResource(JSON.stringify({ slug: categorySlug, page }), loadCategoryPage)
  const changePage = (value) => {
    const params = new URLSearchParams(searchParams)
    if (value === 1) params.delete('page')
    else params.set('page', String(value))
    setSearchParams(params)
    window.scrollTo({ top: 0, behavior: 'instant' })
  }

  if (loading || error) {
    const missing = error?.status === 404
    const title = loading ? 'Loading category…' : missing ? 'Category not found' : 'Unable to load category'
    return <div className="catalogue-page min-h-screen bg-stone-50 text-stone-900">
      <Seo title={`${title} | Zahid Exports`} description="Browse the Zahid Exports product catalogue." robots="noindex, follow" />
      <Header /><main className="catalogue-status"><h1 role="status">{title}</h1>{error && <p role="alert">{error.message}</p>}{error && !missing && <button type="button" className="btn catalogue-retry" onClick={retry}>Try again</button>}<Link className="mt-6 inline-block underline" to="/products">Back to products</Link></main><Footer />
    </div>
  }

  const { category, products, hasMore } = data
  const schema = { '@context': 'https://schema.org', '@type': 'CollectionPage', name: `${category.name} by Zahid Exports`, description: category.description, url: `${window.location.origin}/products/category/${category.slug}` }

  return <div className="catalogue-page min-h-screen bg-stone-50 text-stone-900">
    <Seo title={category.seoTitle} description={category.seoDescription} keywords={category.keywords} canonicalPath={`/products/category/${category.slug}`} image={category.image || imageUrl(products[0]?.images?.[0])} structuredData={schema} robots={page > 1 ? 'noindex, follow' : 'index, follow'} />
    <Header />
    <main className="mx-auto max-w-7xl px-6 pb-24 pt-36 lg:px-10">
      <p className="mb-4 text-xs uppercase tracking-[0.3em] text-stone-500">Wholesale Collection</p>
      <h1 className="text-5xl font-light md:text-7xl">{category.name}</h1>
      <p className="mt-6 max-w-3xl text-lg leading-8 text-stone-600">{category.description}</p>
      <div className="my-12 border-y border-stone-300 py-5 text-sm text-stone-500">{category.productCount} published products · Page {page}</div>
      <ProductGrid products={products} />
      <CataloguePagination page={page} hasMore={hasMore} onPageChange={changePage} />
    </main>
    <Footer />
  </div>
}

export default CategoryPage
