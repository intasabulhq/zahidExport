import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

const links = [['Collections', '/products'], ['About', '/about'], ['Contact', '/contact']]

function Header() {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()
  const isHome = pathname === '/'

  return (
    <header className={`site-header ${isHome ? 'site-header--home' : 'site-header--interior'}`}>
      <nav className="container header-inner" aria-label="Main navigation">
        <Link to="/" className="brand" onClick={() => setOpen(false)}>
          <span>ZAHID</span><small>EXPORTS</small>
        </Link>
        <div className="desktop-nav">
          {links.map(([label, href]) => <Link key={href} to={href}>{label}</Link>)}
        </div>
        <div className="header-actions">
          <Link className="quote-link" to="/contact">Request a Quote <span>↗</span></Link>
          <button
            className="menu-button"
            type="button"
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            aria-controls="mobile-navigation"
            aria-label="Toggle menu"
          >
            {open ? 'Close' : 'Menu'}
          </button>
        </div>
      </nav>
      {open && (
        <div className="mobile-nav" id="mobile-navigation">
          <div className="container">
            {links.map(([label, href]) => <Link key={href} to={href} onClick={() => setOpen(false)}>{label}</Link>)}
            <Link to="/contact" onClick={() => setOpen(false)}>Request a Quote ↗</Link>
          </div>
        </div>
      )}
    </header>
  )
}

export default Header
