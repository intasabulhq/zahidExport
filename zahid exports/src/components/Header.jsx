import { useState } from 'react'
import { Link } from 'react-router-dom'

const links = [['Collections', '/products'], ['About', '/about'], ['Contact', '/contact']]

function Header() {
  const [open, setOpen] = useState(false)
  return (
    <header className="site-header">
      <nav className="container header-inner">
        <Link to="/" className="brand" onClick={() => setOpen(false)}>
          <span>ZAHID</span><small>EXPORTS</small>
        </Link>
        <div className="desktop-nav">
          {links.map(([label, href]) => <Link key={href} to={href}>{label}</Link>)}
        </div>
        <div className="header-actions">
          <Link className="quote-link" to="/contact">Request a Quote <span>↗</span></Link>
          <button className="menu-button" onClick={() => setOpen(!open)} aria-expanded={open} aria-label="Toggle menu">{open ? 'Close' : 'Menu'}</button>
        </div>
      </nav>
      {open && <div className="mobile-nav"><div className="container">{links.map(([label, href]) => <Link key={href} to={href} onClick={() => setOpen(false)}>{label}</Link>)}<Link to="/contact" onClick={() => setOpen(false)}>Request a Quote ↗</Link></div></div>}
    </header>
  )
}
export default Header
