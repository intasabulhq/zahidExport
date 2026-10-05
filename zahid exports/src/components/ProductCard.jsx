import { Link } from 'react-router-dom'
import { imageUrl } from '../data/productApi'

function ProductCard({ product, index = 0 }) {
  const image = product.images?.[0]
  const src = imageUrl(image)
  const alt = typeof image === 'object' && image?.altText ? image.altText : product.imageAlt || `${product.name} by Zahid Exports`

  return (
    <article className={`product-card product-card-${(index % 3) + 1}`}>
      <Link to={`/products/${product.slug}`} aria-label={`View ${product.name}, SKU ${product.id}`}>
        <div className="product-image">
          {src ? <img src={src} alt={alt} loading="lazy" width="720" height="900" /> : (
            <div className="product-placeholder" aria-label={`${product.name} image coming soon`}>
              <span className="placeholder-shape" aria-hidden="true" />
              <small>Image coming soon</small>
            </div>
          )}
          <span className="product-code">{product.id.split('-').slice(-1)[0]}</span>
        </div>
        <div className="product-meta">
          <div>{product.category ? <p className="eyebrow">{product.category}</p> : null}<h3>{product.name}</h3><small>{product.id}</small></div>
          <span className="product-arrow" aria-hidden="true">↗</span>
        </div>
      </Link>
    </article>
  )
}
export default ProductCard
