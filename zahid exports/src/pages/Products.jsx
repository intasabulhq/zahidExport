import { useMemo, useState } from "react"
import Header from "../components/Header"
import Footer from "../components/Footer"
import ProductGrid from "../components/ProductGrid"
import { products } from "../data/products"

function Products() {
  const [query, setQuery] = useState("")
  const filteredProducts = useMemo(() => {
    const term = query.trim().toLowerCase()
    if (!term) return products
    return products.filter((product) => [product.name, product.id, product.category, product.material].some((value) => value?.toLowerCase().includes(term)))
  }, [query])

  return <div className="min-h-screen bg-stone-50 text-stone-900"><Header /><main className="mx-auto max-w-7xl px-6 pb-24 pt-36 lg:px-10"><p className="mb-4 text-xs uppercase tracking-[0.3em] text-stone-500">Product Catalogue</p><div className="flex flex-col justify-between gap-8 border-b border-stone-300 pb-12 md:flex-row md:items-end"><h1 className="text-5xl font-light md:text-7xl">Our Products</h1><div className="w-full md:max-w-sm"><label htmlFor="product-search" className="sr-only">Search products</label><input id="product-search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by name, SKU or category" className="w-full border-b border-stone-400 bg-transparent px-0 py-3 text-sm outline-none placeholder:text-stone-400" /></div></div><p className="py-8 text-sm text-stone-500">Showing {filteredProducts.length} catalogue items in the current data set.</p><ProductGrid products={filteredProducts} /></main><Footer /></div>
}

export default Products
