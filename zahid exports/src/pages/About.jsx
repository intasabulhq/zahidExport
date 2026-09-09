import { Link } from "react-router-dom"
import Header from "../components/Header"
import Footer from "../components/Footer"
import Seo from "../components/Seo"
import "./info-pages.css"

const capabilities = [
  { number: "01", title: "Design development", copy: "Collections developed around buyer references, approved samples and commercial requirements." },
  { number: "02", title: "Material craft", copy: "Home and lifestyle products across metal, wood and mixed-material decorative categories." },
  { number: "03", title: "B2B production", copy: "Support for custom designs, wholesale collections, hospitality sourcing and bulk requirements." },
  { number: "04", title: "Global supply", copy: "Export-focused communication and collection development for buyers in international markets." },
]

function About() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: "About Zahid Exports",
    description: "Learn about Zahid Exports, a Moradabad manufacturer and exporter of handcrafted home decor, furniture, gardenware and lifestyle products established in 2016.",
    mainEntity: {
      "@type": "Organization",
      name: "Zahid Exports",
      foundingDate: "2016",
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

  return <div className="info-page about-page">
    <Seo
      title="About Zahid Exports | Home Decor Manufacturer Moradabad"
      description="Zahid Exports is a Moradabad manufacturer and exporter of handcrafted home decor, furniture, gardenware and lifestyle products, established in 2016."
      keywords={["Zahid Exports Moradabad", "home decor manufacturer Moradabad", "Indian handicraft exporter", "metal decor manufacturer India"]}
      canonicalPath="/about"
      structuredData={schema}
    />
    <Header />
    <main>
      <section className="info-hero about-hero">
        <div className="container info-hero-grid">
          <div>
            <p className="eyebrow">About Zahid Exports</p>
            <h1>Indian craft,<br />shaped for the world.</h1>
          </div>
          <div className="info-hero-copy">
            <p>Established in Moradabad in 2016, Zahid Exports manufactures and exports home décor and lifestyle products for wholesale buyers, retailers, hospitality groups and interior projects.</p>
            <div className="about-founded"><strong>2016</strong><span>Established in<br />Moradabad, India</span></div>
          </div>
        </div>
      </section>

      <section className="info-section story-section">
        <div className="container story-grid">
          <p className="eyebrow">Our foundation</p>
          <div>
            <h2>Quality handicrafts guided by approved samples and considered production.</h2>
            <div className="story-columns">
              <p>Our catalogue spans furniture, gardenware, kitchenware, lighting products, candle stands, flower vases, planters and decorative accessories. Each collection is approached with close attention to design, finish and its intended commercial use.</p>
              <p>We work to combine Indian craftsmanship with buyer-focused development—supporting custom concepts, bulk sourcing and global distribution while maintaining clear communication throughout the process.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="info-section capabilities-section">
        <div className="container">
          <div className="info-section-head"><p className="eyebrow">What we bring</p><h2>Built for lasting business relationships.</h2></div>
          <div className="capability-grid">
            {capabilities.map((item) => <article key={item.number} className="capability-card"><span>{item.number}</span><h3>{item.title}</h3><p>{item.copy}</p></article>)}
          </div>
        </div>
      </section>

      <section className="info-section mission-section">
        <div className="container mission-grid">
          <div><p className="eyebrow">Our direction</p><h2>Make in India.<br />Made to travel.</h2></div>
          <div><p>Our aim is to create useful, distinctive décor through innovation, quality standards, responsible working practices and a strong customer focus.</p><p>We believe long-term partnerships are built through consistency, integrity and continuous improvement in design and manufacturing.</p><Link className="btn btn-light" to="/contact">Discuss your requirements <span aria-hidden="true">↗</span></Link></div>
        </div>
      </section>
    </main>
    <Footer />
  </div>
}

export default About
