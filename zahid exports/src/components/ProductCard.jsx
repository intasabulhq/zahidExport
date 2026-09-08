import { Link } from 'react-router-dom'

function ProductCard({ product, index = 0 }) {
  const image = product.images?.[0]
  return (
    <article className={`product-card product-card-${(index % 3) + 1}`}>
      <Link to={`/products/${product.slug}`}>
        <div className="product-image">
          {image ? <img src={image} alt={product.name} loading="lazy" /> : (
            <div className="product-placeholder" aria-label={`${product.name} image coming soon`}>
              <span className="placeholder-shape" aria-hidden="true" />
              <small>Image coming soon</small>
            </div>
          )}
          <span className="product-code">{product.id.split('-').slice(-1)[0]}</span>
        </div>
        <div className="product-meta">
          <div><p className="eyebrow">{product.category}</p><h3>{product.name}</h3></div>
          <span className="product-arrow" aria-hidden="true">↗</span>
        </div>
      </Link>
    </article>
  )
}
export default ProductCard
