import { Router } from 'express'
import { query } from '../config/db.js'

const router = Router()

// Counts and previews come from all published database rows, not a limited
// frontend page or the legacy catalogue export.
const categorySelect = `
  SELECT c.id, c.name, c.slug, c.description, c.seo_title,
    c.seo_description, c.seo_keywords, COUNT(p.id)::integer AS product_count,
    (SELECT pi.url FROM products preview
      JOIN product_images pi ON pi.product_id = preview.id
      WHERE preview.category_id = c.id AND preview.status = 'published'
      ORDER BY preview.featured DESC, preview.created_at DESC,
        preview.id DESC, pi.position ASC, pi.id ASC LIMIT 1) AS image_url
  FROM categories c
  LEFT JOIN products p ON p.category_id = c.id AND p.status = 'published'
`

router.get('/home', async (req, res) => {
  const [products, categories] = await Promise.all([
    query(`SELECT p.*, c.name AS category, c.slug AS category_slug,
      COALESCE((SELECT json_agg(json_build_object(
        'url', pi.url, 'publicId', pi.public_id,
        'altText', pi.alt_text, 'position', pi.position
      ) ORDER BY pi.position, pi.id) FROM product_images pi
        WHERE pi.product_id = p.id), '[]'::json) AS images
      FROM products p JOIN categories c ON c.id = p.category_id
      WHERE p.status = 'published' AND p.featured = true AND c.status = 'published'
      ORDER BY p.updated_at DESC, p.id DESC LIMIT 4`),
    query(`${categorySelect} WHERE c.status = 'published' GROUP BY c.id ORDER BY c.name, c.id`),
  ])
  res.json({ products: products.rows, categories: categories.rows })
})

router.get('/categories/:slug', async (req, res) => {
  const result = await query(`${categorySelect} WHERE c.status = 'published' AND c.slug = $1 GROUP BY c.id`, [req.params.slug])
  if (!result.rows[0]) return res.status(404).json({ error: 'Category not found' })
  res.json({ category: result.rows[0] })
})

export default router
