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
  const whatsappUrl = "https://wa.me/918433085717?text=" + whatsappText
  const contactUrl = `/contact?sku=${encodeURIComponent(product.id)}&product=${encodeURIComponent(product.name)}`

  return <div className="product-details-page min-h-screen bg-stone-50 text-stone-900">
    <Seo title={product.seo.title} description={product.seo.description} keywords={product.seo.keywords} canonicalPath={canonicalPath} image={product.images[0]} type="product" structuredData={productSchema} />
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
          <div className="mt-10 flex flex-wrap gap-4"><Link to={contactUrl} className="inline-block border border-stone-900 px-9 py-4 text-sm uppercase tracking-widest transition hover:bg-stone-900 hover:text-white">Request a Quote</Link><a href={whatsappUrl} target="_blank" rel="noreferrer" className="inline-block bg-stone-900 px-9 py-4 text-sm uppercase tracking-widest text-white transition hover:bg-stone-700"><svg
  viewBox="0 0 24 24"
  width="24"
  height="24"
  aria-hidden="true"
  style={{ flexShrink: 0, marginRight: "12px" }}
>
  <path
    fill="currentColor"
    d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.262.489 1.693.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.29.173-1.414-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.981.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884a9.82 9.82 0 017.021 2.91 9.825 9.825 0 012.9 7.025c-.003 5.45-4.445 9.882-9.885 9.882m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.304-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"
  />
</svg>

<span
  style={{
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    gap: "3px",
  }}
>
  <strong style={{ fontSize: "11px", fontWeight: 500 }}>
    WhatsApp Enquiry
  </strong>

  <small
    style={{
      fontSize: "10px",
      letterSpacing: "0.08em",
      opacity: 0.85,
    }}
  >
    +91 84330 85717
  </small>
</span></a></div>
        </div>
      </div>
    </main>
    <Footer />
  </div>
}

export default ProductDetails
