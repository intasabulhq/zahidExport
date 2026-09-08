import { useState } from "react"
import { useSearchParams } from "react-router-dom"
import Header from "../components/Header"
import Footer from "../components/Footer"
import Seo from "../components/Seo"
import { categories } from "../data/categories"
import "./info-pages.css"

function Contact() {
  const [searchParams] = useSearchParams()
  const [status, setStatus] = useState("")
  const [form, setForm] = useState({
    name: "",
    company: "",
    email: "",
    country: "",
    category: "",
    quantity: "",
    sku: searchParams.get("sku") || "",
    product: searchParams.get("product") || "",
    message: "",
  })

  const schema = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "Contact Zahid Exports",
    description: "Send a wholesale, custom product or export enquiry to Zahid Exports in Moradabad, India.",
    mainEntity: {
      "@type": "Organization",
      name: "Zahid Exports",
      email: "info@zahidexports.com",
      telephone: "+91 84330 85717",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Jayantipur Peer Ka Bazaar, Mansoori Colony, White Building, Delhi Road",
        addressLocality: "Moradabad",
        addressRegion: "Uttar Pradesh",
        postalCode: "244001",
        addressCountry: "IN",
      },
    },
  }

  const updateField = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }))

  const enquiryText = () => [
    `Name: ${form.name}`,
    `Company: ${form.company || "Not provided"}`,
    `Business email: ${form.email}`,
    `Country: ${form.country}`,
    `Category: ${form.category || "General enquiry"}`,
    `Product: ${form.product || "Not specified"}`,
    `SKU: ${form.sku || "Not specified"}`,
    `Required quantity: ${form.quantity || "To be discussed"}`,
    "",
    form.message,
  ].join("\n")

  const handleEmail = (event) => {
    event.preventDefault()
    const subject = encodeURIComponent(`B2B enquiry${form.sku ? ` — ${form.sku}` : ""} from ${form.company || form.name}`)
    window.location.href = `mailto:info@zahidexports.com?subject=${subject}&body=${encodeURIComponent(enquiryText())}`
    setStatus("Your email application has been opened with the enquiry details.")
  }

  const handleWhatsapp = (event) => {
    if (!event.currentTarget.form.reportValidity()) return
    const url = `https://wa.me/918433085717?text=${encodeURIComponent(enquiryText())}`
    const whatsappWindow = window.open(url, "_blank", "noopener,noreferrer")
    if (whatsappWindow) whatsappWindow.opener = null
    setStatus("WhatsApp has been opened with the enquiry details.")
  }

  return <div className="info-page contact-page">
    <Seo
      title="Contact Zahid Exports | Wholesale & Export Enquiries"
      description="Contact Zahid Exports in Moradabad for wholesale home decor, custom product development, bulk orders, hospitality sourcing and export enquiries."
      keywords={["contact Zahid Exports", "home decor wholesale enquiry", "Moradabad exporter contact", "custom metal decor supplier"]}
      canonicalPath="/contact"
      structuredData={schema}
    />
    <Header />
    <main>
      <section className="info-hero contact-hero">
        <div className="container info-hero-grid">
          <div><p className="eyebrow">B2B Enquiry</p><h1>Let’s build your<br />next collection.</h1></div>
          <div className="info-hero-copy"><p>Share your product, quantity and destination requirements. We welcome enquiries from importers, wholesalers, retailers, hospitality groups and interior professionals.</p><div className="contact-quick"><a href="mailto:info@zahidexports.com">info@zahidexports.com</a><a href="tel:+918433085717">+91 84330 85717</a></div></div>
        </div>
      </section>

      <section className="info-section enquiry-section">
        <div className="container enquiry-layout">
          <aside className="contact-details">
            <p className="eyebrow">Contact details</p>
            <div><span>Email</span><a href="mailto:info@zahidexports.com">info@zahidexports.com</a></div>
            <div><span>Phone & WhatsApp</span><a href="tel:+918433085717">+91 84330 85717</a></div>
            <div><span>Address</span><p>Jayantipur Peer Ka Bazaar<br />Mansoori Colony, White Building<br />Delhi Road, Moradabad<br />Uttar Pradesh 244001, India</p></div>
            <p className="contact-note">For a faster response, include the SKU, expected quantity, delivery country and required timeline.</p>
          </aside>

          <form className="enquiry-form" onSubmit={handleEmail}>
            <div className="field-grid">
              <label><span>Your name *</span><input required name="name" autoComplete="name" value={form.name} onChange={updateField} /></label>
              <label><span>Company</span><input name="company" autoComplete="organization" value={form.company} onChange={updateField} /></label>
              <label><span>Business email *</span><input required type="email" name="email" autoComplete="email" value={form.email} onChange={updateField} /></label>
              <label><span>Country *</span><input required name="country" autoComplete="country-name" value={form.country} onChange={updateField} /></label>
              <label><span>Product category</span><select name="category" value={form.category} onChange={updateField}><option value="">Select a category</option>{categories.map((category) => <option key={category.id} value={category.name}>{category.name}</option>)}</select></label>
              <label><span>Required quantity</span><input name="quantity" inputMode="numeric" value={form.quantity} onChange={updateField} placeholder="e.g. 100 pieces" /></label>
              <label><span>Product name</span><input name="product" value={form.product} onChange={updateField} /></label>
              <label><span>SKU</span><input name="sku" value={form.sku} onChange={updateField} /></label>
            </div>
            <label className="message-field"><span>Tell us about your requirements *</span><textarea required name="message" rows="6" value={form.message} onChange={updateField} placeholder="Product specifications, finish, dimensions, quantity, destination and timeline" /></label>
            <p className="form-help">Submitting by email opens your email application. No information is stored on this website yet.</p>
            <div className="form-actions"><button type="submit" className="btn btn-dark">Continue by email <span aria-hidden="true">↗</span></button><button type="button" className="btn btn-outline-dark" onClick={handleWhatsapp}>Continue on WhatsApp</button></div>
            {status && <p className="form-status" role="status">{status}</p>}
          </form>
        </div>
      </section>
    </main>
    <Footer />
  </div>
}

export default Contact
