import { Link } from 'react-router-dom'

function Footer() {
  return (
    <footer style={{ background: '#24211e', color: 'white', padding: '34px 0' }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', gap: 24, alignItems: 'center', flexWrap: 'wrap' }}>
        <p style={{ fontSize: 11, letterSpacing: '.2em' }}>ZAHID EXPORTS</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 22 }}>
          <Link to="/admin" style={{ color: 'white', opacity: .62, fontSize: 10, textDecoration: 'none' }}>Staff Login ↗</Link>
          <p style={{ fontSize: 10, opacity: .45 }}>© {new Date().getFullYear()} Zahid Exports. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
