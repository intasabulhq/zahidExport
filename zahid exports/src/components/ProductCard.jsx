import { Link } from "react-router-dom"

function ProductCard({ product }) {
  const image = product.images?.[0]

  return (
    <article className="group">
      <Link to={`/products/${product.slug}`}>
        <div className="aspect-[4/5] overflow-hidden bg-stone-200">
          {image ? (
            <img src={image} alt={product.name} loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
          ) : (
            <div className="flex h-full items-center justify-center bg-stone-100 p-8 text-center text-xs uppercase tracking-[0.2em] text-stone-400">
              Product image coming soon
            </div>
          )}
        </div>
        <div className="border-b border-stone-300 py-5">
          <p className="text-xs uppercase tracking-[0.2em] text-stone-500">{product.category}</p>
          <div className="mt-2 flex items-center justify-between gap-4">
            <h2 className="text-lg">{product.name}</h2>
            <span className="text-xl transition-transform duration-300 group-hover:translate-x-2">→</span>
          </div>
          <p className="mt-2 text-xs text-stone-400">{product.id}</p>
        </div>
      </Link>
    </article>
  )
}

export default ProductCard
