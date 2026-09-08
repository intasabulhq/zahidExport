function Footer() {
  return (
    <footer style={{ background: '#24211e', color: 'white', padding: '34px 0' }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', gap: 24, alignItems: 'center' }}>
        <p style={{ fontSize: 11, letterSpacing: '.2em' }}>ZAHID EXPORTS</p>
        <p style={{ fontSize: 10, opacity: .45 }}>© {new Date().getFullYear()} Zahid Exports. All rights reserved.</p>
      </div>
    </footer>
  )
}
export default Footer
