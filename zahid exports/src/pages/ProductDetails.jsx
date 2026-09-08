import { Link, useParams } from "react-router-dom"
import Header from "../components/Header"
import Footer from "../components/Footer"
import ProductImageSlider from "../components/ProductImageSlider"
import Seo from "../components/Seo"
import { getProductBySlug } from "../data/products"

function ProductDetails() {
  const { productSlug } = useParams()
  const product = getProductBySlug(productSlug)

  if (!product) return <div className="min-h-screen bg-stone-50 px-6 py-40 text-center"><Seo title="Product Not Found | Zahid Exports" description="The requested product could not be found." robots="noindex, follow" /><h1 className="text-4xl font-light">Product not found</h1><Link className="mt-6 inline-block underline" to="/products">Back to products</Link></div>

  const canonicalPath = `/products/${product.slug}`
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    sku: product.id,
    category: product.category,
    description: product.description,
    url: `${window.location.origin}${canonicalPath}`,
    brand: { "@type": "Brand", name: "Zahid Exports" },
    manufacturer: { "@type": "Organization", name: "Zahid Exports", address: { "@type": "PostalAddress", addressLocality: "Moradabad", addressRegion: "Uttar Pradesh", postalCode: "244001", addressCountry: "IN" } },
    ...(product.images.length ? { image: product.images } : {}),
    additionalProperty: [
      product.material && { "@type": "PropertyValue", name: "Material", value: product.material },
      product.finish && { "@type": "PropertyValue", name: "Finish", value: product.finish },
      product.dimensions && { "@type": "PropertyValue", name: "Dimensions", value: product.dimensions },
    ].filter(Boolean),
  }

  const whatsappText = encodeURIComponent(`Hello Zahid Exports, I would like a quote for ${product.name} (${product.id}).`)

  return <div className="min-h-screen bg-stone-50 text-stone-900">
    <Seo title={product.seo.title} description={product.seo.description} canonicalPath={canonicalPath} structuredData={productSchema} />
    <Header />
    <main className="mx-auto max-w-7xl px-6 pb-24 pt-36 lg:px-10">
      <nav aria-label="Breadcrumb" className="mb-8 text-sm text-stone-500"><Link to="/products">Products</Link> <span aria-hidden="true">/</span> <Link to={`/products/category/${product.categorySlug}`}>{product.category}</Link> <span aria-hidden="true">/</span> <span>{product.id}</span></nav>
      <div className="grid gap-12 lg:grid-cols-2">
        <ProductImageSlider images={product.images} name={product.imageAlt || product.name} />
        <div className="lg:py-8">
          <p className="text-xs uppercase tracking-[0.25em] text-stone-500">{product.category}</p>
          <h1 className="mt-4 text-5xl font-light md:text-6xl">{product.name}</h1>
          <p className="mt-4 text-xs uppercase tracking-widest text-stone-400">SKU: {product.id}</p>
          <p className="mt-8 text-lg leading-8 text-stone-600">{product.description}</p>
          <dl className="mt-10 grid grid-cols-2 gap-6 border-y border-stone-300 py-7 text-sm">
            <div><dt className="text-stone-400">Material</dt><dd className="mt-1">{product.material || "On enquiry"}</dd></div>
            <div><dt className="text-stone-400">Finish</dt><dd className="mt-1">{product.finish || "Custom options available"}</dd></div>
            <div><dt className="text-stone-400">Dimensions</dt><dd className="mt-1">{product.dimensions || "On enquiry"}</dd></div>
            <div><dt className="text-stone-400">MOQ</dt><dd className="mt-1">{product.moq || "On enquiry"}</dd></div>
          </dl>
          <div className="mt-8"><h2 className="text-sm uppercase tracking-widest text-stone-500">Applications</h2><p className="mt-3 leading-7 text-stone-600">{product.applications.join(" · ")}</p></div>
          <div className="mt-10 flex flex-wrap gap-4"><Link to="/contact" className="inline-block border border-stone-900 px-9 py-4 text-sm uppercase tracking-widest transition hover:bg-stone-900 hover:text-white">Request a Quote</Link><a href={`https://wa.me/918433085717?text=${whatsappText}`} target="_blank" rel="noreferrer" className="inline-block bg-stone-900 px-9 py-4 text-sm uppercase tracking-widest text-white transition hover:bg-stone-700">WhatsApp Enquiry</a></div>
        </div>
      </div>
    </main>
    <Footer />
  </div>
}

export default ProductDetails
