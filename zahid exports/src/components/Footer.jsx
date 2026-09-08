import { Link } from 'react-router-dom'

function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-main">
        <div className="footer-brand">
          <p className="brand"><span>ZAHID</span><small>EXPORTS</small></p>
          <p>Crafted objects for considered spaces, made in Moradabad and supplied worldwide.</p>
        </div>
        <div className="footer-column">
          <p className="eyebrow">Navigate</p>
          <Link to="/products">Collection</Link><Link to="/about">About</Link><Link to="/contact">Contact</Link>
        </div>
        <div className="footer-column">
          <p className="eyebrow">Contact</p>
          <a href="mailto:info@zahidexports.com">info@zahidexports.com</a>
          <p>Moradabad, Uttar Pradesh<br />India 244001</p>
        </div>
      </div>
      <div className="container footer-bottom">
        <p>© {new Date().getFullYear()} Zahid Exports</p>
        <p>Furniture · Décor · Handcraft</p>
      </div>
    </footer>
  )
}
export default Footer
