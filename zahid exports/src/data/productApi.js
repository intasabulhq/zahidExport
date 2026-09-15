const imageUrl = (image) => typeof image === 'string' ? image : image?.url

export function mapApiProduct(product) {
  const images = (product.images || []).map((image, position) => typeof image === 'string'
    ? { url: image, publicId: null, altText: product.image_alt || '', position }
    : { ...image, position })

  return {
    dbId: product.id,
    id: product.sku,
    sku: product.sku,
    slug: product.slug,
    name: product.name,
    category: product.category || 'Uncategorized',
    categorySlug: product.category_slug || '',
    description: product.description,
    material: product.material,
    finish: product.finish,
    dimensions: product.dimensions,
    moq: product.moq,
    applications: product.applications || [],
    images,
    imageAlt: product.image_alt || images[0]?.altText || product.name,
    featured: Boolean(product.featured),
    status: product.status,
    seo: {
      title: product.seo_title || `${product.name} | Zahid Exports`,
      description: product.seo_description || product.description,
      keywords: product.seo_keywords || [],
    },
  }
}

async function request(path, signal) {
  const response = await fetch(path, { signal })
  const data = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(data.error || 'Unable to load products')
  return data
}

export async function fetchProducts({ search = '', category = '', signal } = {}) {
  const params = new URLSearchParams()
  if (search.trim()) params.set('search', search.trim())
  if (category) params.set('category', category)
  params.set('limit', '100')
  const data = await request(`/api/products?${params}`, signal)
  return (data.products || []).map(mapApiProduct)
}

export async function fetchProduct(slug, signal) {
  const data = await request(`/api/products/${encodeURIComponent(slug)}`, signal)
  return mapApiProduct(data.product)
}

export { imageUrl }
