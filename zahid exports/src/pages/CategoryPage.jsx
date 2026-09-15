import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import ProductGrid from '../components/ProductGrid'
import Seo from '../components/Seo'
import { getCategoryBySlug } from '../data/categories'
import { fetchProducts, imageUrl } from '../data/productApi'

function CategoryPage() {
  const { categorySlug } = useParams()
  const category = getCategoryBySlug(categorySlug)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(Boolean(category))
  const [error, setError] = useState('')

  useEffect(() => {
    if (!category) return
    const controller = new AbortController()
    fetchProducts({ category: categorySlug, signal: controller.signal })
      .then(setProducts)
      .catch((requestError) => requestError.name !== 'AbortError' && setError(requestError.message))
      .finally(() => !controller.signal.aborted && setLoading(false))
    return () => controller.abort()
  }, [category, categorySlug])

  if (!category) return <div className="min-h-screen bg-stone-50 px-6 py-40 text-center"><Seo title="Category Not Found | Zahid Exports" description="The requested product category could not be found." robots="noindex, follow" /><h1 className="text-4xl font-light">Category not found</h1><Link className="mt-6 inline-block underline" to="/products">Back to products</Link></div>

  const schema = { '@context': 'https://schema.org', '@type': 'CollectionPage', name: `${category.name} by Zahid Exports`, description: category.description, url: `${window.location.origin}/products/category/${category.slug}` }

  return <div className="min-h-screen bg-stone-50 text-stone-900">
    <Seo title={`${category.name} Manufacturer & Exporter India | Zahid Exports`} description={category.description} keywords={category.keywords} canonicalPath={`/products/category/${category.slug}`} image={imageUrl(products[0]?.images?.[0])} structuredData={schema} />
    <Header />
    <main className="mx-auto max-w-7xl px-6 pb-24 pt-36 lg:px-10">
      <p className="mb-4 text-xs uppercase tracking-[0.3em] text-stone-500">Wholesale Collection</p>
      <h1 className="text-5xl font-light md:text-7xl">{category.name}</h1>
      <p className="mt-6 max-w-3xl text-lg leading-8 text-stone-600">{category.description}</p>
      <div className="my-12 border-y border-stone-300 py-5 text-sm text-stone-500">{loading ? 'Loading products…' : `${products.length} published products`}</div>
      {error && <p className="admin-module-error" role="alert">{error}</p>}
      {!loading && <ProductGrid products={products} />}
    </main>
    <Footer />
  </div>
}

export default CategoryPage
