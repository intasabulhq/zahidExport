import ProductCard from "./ProductCard"

function ProductGrid({ products }) {
  if (!products.length) {
    return <div className="py-20 text-center text-stone-500">No products found.</div>
  }

  return (
    <div className="grid grid-cols-2 gap-x-5 gap-y-12 md:grid-cols-3 lg:grid-cols-4">
      {products.map((product) => <ProductCard key={product.id} product={product} />)}
    </div>
  )
}

export default ProductGrid
