import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { useCatalog } from '../data/useCatalog'
import { isSupabaseConfigured, supabase } from '../lib/supabase'

function EnquiryForm({ products, initialProduct }) {
  const [lineItems, setLineItems] = useState([{ productSlug: initialProduct, quantity: '1' }])
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [reference, setReference] = useState('')

  function updateLine(index, key, value) {
    setLineItems((items) => items.map((item, itemIndex) => (
      itemIndex === index ? { ...item, [key]: value } : item
    )))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setReference('')

    if (!supabase) {
      setError('The enquiry service is not connected yet. Please contact the site administrator.')
      return
    }

    const form = event.currentTarget
    const formData = new FormData(form)
    const items = lineItems
      .filter((item) => item.productSlug)
      .map((item) => {
        const product = products.find((entry) => entry.slug === item.productSlug)
        return product ? {
          sku: product.id,
          slug: product.slug,
          name: product.name,
          quantity: Math.max(1, Number.parseInt(item.quantity, 10) || 1),
        } : null
      })
      .filter(Boolean)

    setSubmitting(true)
    const { data, error: submitError } = await supabase
      .from('enquiries')
      .insert({
        name: String(formData.get('name') ?? '').trim(),
        company: String(formData.get('company') ?? '').trim(),
        email: String(formData.get('email') ?? '').trim(),
        country: String(formData.get('country') ?? '').trim(),
        message: String(formData.get('message') ?? '').trim(),
        items,
      })
      .select('id')
      .single()
    setSubmitting(false)

    if (submitError) {
      setError('Your enquiry could not be sent. Please try again in a moment.')
      console.error('Enquiry submission failed:', submitError)
      return
    }

    setReference(data.id.slice(0, 8).toUpperCase())
    form.reset()
    setLineItems([{ productSlug: '', quantity: '1' }])
  }

  return (
    <>
      {!isSupabaseConfigured && (
        <div className="mb-8 border border-amber-300 bg-amber-50 px-5 py-4 text-sm text-amber-900">
          Enquiry submission is not connected yet. Configure the Supabase settings to receive buyer requests.
        </div>
      )}
      {reference && (
        <div className="mb-8 border border-emerald-300 bg-emerald-50 px-5 py-4 text-sm text-emerald-900" role="status">
          Thank you. Your enquiry has been received. Reference: {reference}
        </div>
      )}
      {error && <div className="mb-8 border border-red-300 bg-red-50 px-5 py-4 text-sm text-red-800" role="alert">{error}</div>}

      <form className="grid gap-8" onSubmit={handleSubmit}>
        <div className="grid gap-7 md:grid-cols-2">
          <label className="grid gap-2 text-sm text-stone-600">
            Your name <span className="sr-only">(required)</span>
            <input name="name" required maxLength={120} autoComplete="name" placeholder="Full name" className="border-b border-stone-300 bg-transparent py-3 text-stone-900 outline-none focus:border-stone-900" />
          </label>
          <label className="grid gap-2 text-sm text-stone-600">
            Business email <span className="sr-only">(required)</span>
            <input name="email" required type="email" maxLength={254} autoComplete="email" placeholder="you@company.com" className="border-b border-stone-300 bg-transparent py-3 text-stone-900 outline-none focus:border-stone-900" />
          </label>
          <label className="grid gap-2 text-sm text-stone-600">
            Company <span className="sr-only">(required)</span>
            <input name="company" required maxLength={160} autoComplete="organization" placeholder="Company name" className="border-b border-stone-300 bg-transparent py-3 text-stone-900 outline-none focus:border-stone-900" />
          </label>
          <label className="grid gap-2 text-sm text-stone-600">
            Country <span className="sr-only">(required)</span>
            <input name="country" required maxLength={100} autoComplete="country-name" placeholder="Your country" className="border-b border-stone-300 bg-transparent py-3 text-stone-900 outline-none focus:border-stone-900" />
          </label>
        </div>

        <fieldset className="grid gap-4 border-y border-stone-300 py-7">
          <legend className="px-2 text-xs uppercase tracking-[0.2em] text-stone-500">Products for quotation</legend>
          {lineItems.map((item, index) => (
            <div className="grid items-end gap-4 sm:grid-cols-[1fr_150px_auto]" key={index}>
              <label className="grid gap-2 text-sm text-stone-600">
                Product
                <select
                  value={item.productSlug}
                  onChange={(event) => updateLine(index, 'productSlug', event.target.value)}
                  className="border-b border-stone-300 bg-transparent py-3 text-stone-900 outline-none focus:border-stone-900"
                >
                  <option value="">General enquiry / choose a product</option>
                  {item.productSlug && !products.some((product) => product.slug === item.productSlug) && (
                    <option value={item.productSlug}>Selected product</option>
                  )}
                  {products.map((product) => (
                    <option key={product.slug} value={product.slug}>{product.name} — {product.id}</option>
                  ))}
                </select>
              </label>
              <label className="grid gap-2 text-sm text-stone-600">
                Quantity
                <input type="number" min="1" step="1" value={item.quantity} onChange={(event) => updateLine(index, 'quantity', event.target.value)} className="border-b border-stone-300 bg-transparent py-3 text-stone-900 outline-none focus:border-stone-900" />
              </label>
              <button type="button" disabled={lineItems.length === 1} onClick={() => setLineItems((items) => items.filter((_, itemIndex) => itemIndex !== index))} className="h-11 px-3 text-xs uppercase tracking-wider text-stone-500 underline underline-offset-4 disabled:opacity-30">
                Remove
              </button>
            </div>
          ))}
          <button type="button" onClick={() => setLineItems((items) => [...items, { productSlug: '', quantity: '1' }])} className="w-fit text-xs uppercase tracking-[0.16em] text-stone-700 underline underline-offset-4">
            + Add another product
          </button>
        </fieldset>

        <label className="grid gap-2 text-sm text-stone-600">
          Project or sourcing requirements <span className="sr-only">(required)</span>
          <textarea name="message" required maxLength={5000} rows="5" placeholder="Tell us about specifications, destination, target timeline, or other requirements." className="resize-y border-b border-stone-300 bg-transparent py-3 text-stone-900 outline-none focus:border-stone-900" />
        </label>
        <button disabled={submitting || !isSupabaseConfigured} type="submit" className="w-fit border border-stone-900 px-9 py-4 text-sm uppercase tracking-widest transition hover:bg-stone-900 hover:text-white disabled:cursor-not-allowed disabled:opacity-50">
          {submitting ? 'Sending…' : 'Send Quote Request'}
        </button>
        <p className="text-xs leading-6 text-stone-500">No buyer account is needed. We’ll use these details only to respond to your enquiry.</p>
      </form>
    </>
  )
}

function Contact() {
  const { products } = useCatalog()
  const [searchParams] = useSearchParams()
  const initialProduct = searchParams.get('product') ?? ''

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900">
      <Header />
      <main className="mx-auto max-w-4xl px-6 pb-24 pt-36 lg:px-10">
        <p className="mb-5 text-xs uppercase tracking-[0.3em] text-stone-500">B2B Enquiry</p>
        <h1 className="text-5xl font-light md:text-7xl">Let’s talk about your next collection.</h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-stone-600">Share the products and quantities you’re sourcing. Our team will follow up with availability and a tailored quotation.</p>
        <div className="mt-12">
          <EnquiryForm key={initialProduct || 'general-enquiry'} products={products} initialProduct={initialProduct} />
        </div>
        <Link to="/products" className="mt-12 inline-block text-xs uppercase tracking-[0.18em] underline underline-offset-4">Browse the catalogue</Link>
      </main>
      <Footer />
    </div>
  )
}

export default Contact
