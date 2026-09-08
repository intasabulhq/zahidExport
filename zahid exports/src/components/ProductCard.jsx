import { Link } from 'react-router-dom'

function ProductCard({ product }) {
  const image = product.images?.[0]
  return (
    <article className="group">
      <Link to={`/products/${product.slug}`} style={{ textDecoration: 'none' }}>
        <div className="product-image" style={{ aspectRatio: '4 / 5', overflow: 'hidden', background: '#e8e3db' }}>
          {image ? <img src={image} alt={product.name} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform .7s' }} /> : <div style={{ height: '100%', display: 'grid', placeItems: 'center', padding: 24, color: '#8b847b', fontSize: 10, letterSpacing: '.18em', textTransform: 'uppercase', textAlign: 'center' }}>Product image coming soon</div>}
        </div>
        <div style={{ padding: '18px 0', borderBottom: '1px solid var(--line)' }}>
          <p className="eyebrow">{product.category}</p>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'center', marginTop: 8 }}>
            <h3 style={{ margin: 0, fontSize: 19 }}>{product.name}</h3><span style={{ fontSize: 18 }}>↗</span>
          </div>
        </div>
      </Link>
    </article>
  )
}
export default ProductCard
