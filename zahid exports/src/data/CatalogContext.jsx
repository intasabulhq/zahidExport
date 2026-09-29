import { useCallback, useEffect, useState } from 'react'
import { CatalogContext } from './catalogContext'
import { categories as localCategories } from './categories'
import { products as localProducts } from './products'
import { supabase } from '../lib/supabase'

const localCategoryList = localCategories.map((category) => ({
  ...category,
  productCount: localProducts.filter((product) => product.categorySlug === category.slug).length,
}))

function mapProduct(row) {
  const category = Array.isArray(row.category) ? row.category[0] : row.category

  return {
    id: row.sku,
    recordId: row.id,
    name: row.name,
    slug: row.slug,
    category: category?.name ?? 'Uncategorized',
    categorySlug: category?.slug ?? '',
    material: row.material ?? '',
    finish: row.finish ?? '',
    dimensions: row.dimensions ?? '',
    leadTime: row.lead_time ?? '',
    description: row.description ?? '',
    images: row.image_urls ?? [],
    applications: row.applications ?? [],
    moq: row.moq ?? '',
    featured: Boolean(row.featured),
    status: row.status,
    seo: {
      title: row.seo_title || `${row.name} | Zahid Exports`,
      description: row.seo_description || row.description || '',
    },
  }
}

export function CatalogProvider({ children }) {
  const [catalog, setCatalog] = useState({ categories: localCategoryList, products: localProducts })
  const [loading, setLoading] = useState(Boolean(supabase))

  const refreshCatalog = useCallback(async () => {
    if (!supabase) return

    try {
      const [categoryResult, productResult] = await Promise.all([
        supabase
          .from('categories')
          .select('id, name, slug, sort_order')
          .eq('is_active', true)
          .order('sort_order'),
        supabase
          .from('products')
          .select('id, sku, name, slug, material, finish, dimensions, lead_time, description, image_urls, applications, moq, featured, status, seo_title, seo_description, category:categories(name, slug)')
          .eq('status', 'published')
          .order('featured', { ascending: false })
          .order('name'),
      ])

      if (categoryResult.error) throw categoryResult.error
      if (productResult.error) throw productResult.error

      const products = (productResult.data ?? []).map(mapProduct)
      const categories = (categoryResult.data ?? []).map((category) => ({
        id: category.id,
        name: category.name,
        slug: category.slug,
        productCount: products.filter((product) => product.categorySlug === category.slug).length,
      }))

      setCatalog({ categories, products })
    } catch (error) {
      console.error('Unable to load the remote catalogue; using the local catalogue instead.', error)
      setCatalog({ categories: localCategoryList, products: localProducts })
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const timer = window.setTimeout(() => { void refreshCatalog() }, 0)
    return () => window.clearTimeout(timer)
  }, [refreshCatalog])

  return (
    <CatalogContext.Provider value={{ ...catalog, loading, refreshCatalog }}>
      {children}
    </CatalogContext.Provider>
  )
}
