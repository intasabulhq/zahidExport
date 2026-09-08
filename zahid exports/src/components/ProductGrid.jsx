import ProductCard from './ProductCard'

function ProductGrid({ products }) {
  if (!products.length) return <div className="empty-state">No products found.</div>
  return <div className="product-grid">{products.map((product, index) => <ProductCard key={product.id} product={product} index={index} />)}</div>
}
export default ProductGrid
