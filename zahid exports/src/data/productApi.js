const imageUrl = (image) => typeof image === 'string' ? image : image?.url

export function mapApiProduct(product) {
  const images = (Array.isArray(product.images) ? product.images : [])
    .filter((image) => typeof imageUrl(image) === 'string' && imageUrl(image).length > 0)
    .map((image, position) => typeof image === 'string'
      ? { url: image, publicId: null, altText: product.image_alt || '', position }
      : { ...image, position })

  return {
    dbId: product.id,
    id: product.sku,
    sku: product.sku,
    slug: product.slug,
    name: product.name,
    category: product.category || '',
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

export function mapApiCategory(category) {
  return {
    id: category.id,
    slug: category.slug,
    name: category.name,
    description: category.description || `Explore ${category.name.toLowerCase()} manufactured by Zahid Exports for wholesale, hospitality and international buyers.`,
    productCount: Number(category.product_count) || 0,
    image: category.image_url || '',
    seoTitle: category.seo_title || `${category.name} Manufacturer & Exporter India | Zahid Exports`,
    seoDescription: category.seo_description || category.description || `Source ${category.name.toLowerCase()} from Zahid Exports, Moradabad, India.`,
    keywords: category.seo_keywords || [],
  }
}

async function request(path, signal) {
  const response = await fetch(path, { signal })
  let data
  try {
    data = await response.json()
  } catch {
    const error = new Error('The catalogue server returned an invalid response. Please try again.')
    error.status = response.status
    throw error
  }
  if (!response.ok) {
    const error = new Error(data?.error || 'Unable to load products')
    error.status = response.status
    throw error
  }
  if (!data || typeof data !== 'object' || Array.isArray(data)) throw new Error('The catalogue server returned an invalid response. Please try again.')
  return data
}

function productParams({ search = '', category = '', limit = 100, offset = 0 } = {}) {
  const params = new URLSearchParams({ limit: String(limit), offset: String(offset) })
  if (search.trim()) params.set('search', search.trim())
  if (category) params.set('category', category)
  return params
}

export async function fetchProducts({ search = '', category = '', signal, limit = 100, offset = 0 } = {}) {
  const data = await request(`/api/products?${productParams({ search, category, limit, offset })}`, signal)
  if (!Array.isArray(data.products)) throw new Error('The catalogue response did not contain products. Please try again.')
  return data.products.map(mapApiProduct)
}

export async function fetchProductsPage({ search = '', category = '', signal, limit = 24, offset = 0 } = {}) {
  if (!Number.isSafeInteger(limit) || limit < 1 || limit > 99 || !Number.isSafeInteger(offset) || offset < 0) throw new Error('Invalid catalogue page')
  // Fetch one extra row so a full final page does not create an empty Next page.
  const rows = await fetchProducts({ search, category, signal, limit: limit + 1, offset })
  return { products: rows.slice(0, limit), hasMore: rows.length > limit, limit, offset }
}

export async function fetchProduct(slug, signal) {
  const data = await request(`/api/products/${encodeURIComponent(slug)}`, signal)
  if (!data.product || !data.product.slug) throw new Error('The catalogue response did not contain a product. Please try again.')
  return mapApiProduct(data.product)
}

export async function fetchCategory(slug, signal) {
  const data = await request(`/api/catalogue/categories/${encodeURIComponent(slug)}`, signal)
  if (!data.category || !data.category.slug) throw new Error('The catalogue response did not contain a category. Please try again.')
  return mapApiCategory(data.category)
}

export async function fetchHome(signal) {
  const data = await request('/api/catalogue/home', signal)
  if (!Array.isArray(data.products) || !Array.isArray(data.categories)) throw new Error('The homepage catalogue response was incomplete. Please try again.')
  return { products: data.products.map(mapApiProduct), categories: data.categories.map(mapApiCategory) }
}

export { imageUrl }
