import { Link, useParams } from "react-router-dom"
import Header from "../components/Header"
import Footer from "../components/Footer"
import ProductImageSlider from "../components/ProductImageSlider"
import { getProductBySlug } from "../data/products"

function ProductDetails() {
  const { productSlug } = useParams()
  const product = getProductBySlug(productSlug)

  if (!product) return <div className="min-h-screen bg-stone-50 px-6 py-40 text-center"><h1 className="text-4xl font-light">Product not found</h1><Link className="mt-6 inline-block underline" to="/products">Back to products</Link></div>

  return <div className="min-h-screen bg-stone-50 text-stone-900"><Header /><main className="mx-auto max-w-7xl px-6 pb-24 pt-36 lg:px-10"><div className="grid gap-12 lg:grid-cols-2"><ProductImageSlider images={product.images} name={product.name} /><div className="lg:py-8"><p className="text-xs uppercase tracking-[0.25em] text-stone-500">{product.category}</p><h1 className="mt-4 text-5xl font-light md:text-6xl">{product.name}</h1><p className="mt-4 text-xs uppercase tracking-widest text-stone-400">SKU: {product.id}</p><p className="mt-8 text-lg leading-8 text-stone-600">{product.description}</p><dl className="mt-10 grid grid-cols-2 gap-6 border-y border-stone-300 py-7 text-sm"><div><dt className="text-stone-400">Material</dt><dd className="mt-1">{product.material || "—"}</dd></div><div><dt className="text-stone-400">Finish</dt><dd className="mt-1">{product.finish || "—"}</dd></div><div><dt className="text-stone-400">MOQ</dt><dd className="mt-1">{product.moq || "On enquiry"}</dd></div><div><dt className="text-stone-400">Status</dt><dd className="mt-1 capitalize">{product.status}</dd></div></dl><Link to="/contact" className="mt-10 inline-block border border-stone-900 px-9 py-4 text-sm uppercase tracking-widest transition hover:bg-stone-900 hover:text-white">Request a Quote</Link></div></div></main><Footer /></div>
}

export default ProductDetails
