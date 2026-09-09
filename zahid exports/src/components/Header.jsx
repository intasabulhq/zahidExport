import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const links = [['Collection', '/products'], ['About', '/about'], ['Contact', '/contact']]

function Header() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const closeMenu = () => setOpen(false)

  return (
    <header className={`site-header ${scrolled ? 'is-scrolled' : ''} ${open ? 'menu-open' : ''}`}>
      <nav className="container header-inner" aria-label="Primary navigation">
        <Link to="/" className="brand" aria-label="Zahid Exports home" onClick={closeMenu}>
          <span>ZAHID</span><small>EXPORTS</small>
        </Link>
        <div className="desktop-nav">
          {links.map(([label, href]) => <Link key={href} to={href} onClick={closeMenu}>{label}</Link>)}
        </div>
        <div className="header-actions">
          <Link className="quote-link" to="/contact" onClick={closeMenu}>Request a quote <span aria-hidden="true">↗</span></Link>
          <button className="menu-button" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="mobile-menu">
            <span>{open ? 'Close' : 'Menu'}</span><i aria-hidden="true" />
          </button>
        </div>
      </nav>
      <div id="mobile-menu" className="mobile-nav" aria-hidden={!open}>
        <div className="container mobile-nav-inner">
          <p className="eyebrow">Navigate</p>
          {links.map(([label, href], index) => (
            <Link key={href} to={href} onClick={closeMenu}><span>0{index + 1}</span>{label}<b aria-hidden="true">↗</b></Link>
          ))}
          <Link className="mobile-quote" to="/contact" onClick={closeMenu}>Start an enquiry</Link>
        </div>
      </div>
    </header>
  )
}
export default Header
