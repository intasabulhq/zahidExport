import { Link } from 'react-router-dom'

function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-main">
        <div className="footer-brand">
          <p className="brand"><span>ZAHID</span><small>EXPORTS</small></p>
          <p>Handcrafted furniture and décor made in Moradabad for wholesale, hospitality and considered spaces worldwide.</p>
        </div>
        <div className="footer-column">
          <p className="eyebrow">Navigate</p>
          <Link to="/products">Collection</Link><Link to="/about">About</Link><Link to="/contact">Contact</Link>
        </div>
        <div className="footer-column">
          <p className="eyebrow">Contact</p>
          <a href="mailto:info@zahidexports.com">info@zahidexports.com</a>
          <a href="tel:+918433085717">+91 84330 85717</a>
          <p>Jayantipur Peer Ka Bazaar, Mansoori Colony, White Building, Delhi Road<br />Moradabad, Uttar Pradesh 244001, India</p>
        </div>
      </div>
      <div className="container footer-bottom">
        <p>© {new Date().getFullYear()} Zahid Exports</p>
        <p>Established 2016 · Made in Moradabad</p>
      </div>
    </footer>
  )
}
export default Footer
