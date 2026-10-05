import { z } from 'zod'

export const productStatusValues = ['draft', 'published', 'archived']
const productFolderPrefix = 'zahid-exports/products/'

const productImageSchema = z.object({
  url: z.string().url().max(2000),
  publicId: z.string().trim().startsWith(productFolderPrefix).max(500).nullable().optional().default(null),
  altText: z.string().trim().max(240).default(''),
  position: z.number().int().min(0).max(11).optional(),
})

// Keep top-level field validators free of defaults. PATCH must never create
// values for omitted fields, including images or publication status.
const productFields = {
  name: z.string().trim().min(2).max(180),
  sku: z.string().trim().min(2).max(100),
  slug: z.string().trim().max(200).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  categoryId: z.string().uuid('Select a valid category for this product'),
  description: z.string().trim().min(20),
  material: z.string().trim().max(200),
  finish: z.string().trim().max(200),
  dimensions: z.string().trim().max(200),
  moq: z.string().trim().max(100),
  applications: z.array(z.string().trim().min(1).max(100)),
  images: z.array(z.union([z.string().url().max(2000), productImageSchema])).max(12),
  imageAlt: z.string().trim().max(240),
  seoTitle: z.string().trim().max(70),
  seoDescription: z.string().trim().max(170),
  seoKeywords: z.array(z.string().trim().min(1).max(100)),
  featured: z.boolean(),
  status: z.enum(productStatusValues),
}

export const productCreateSchema = z.object({
  ...productFields,
  material: productFields.material.default(''),
  finish: productFields.finish.default(''),
  dimensions: productFields.dimensions.default(''),
  moq: productFields.moq.default(''),
  applications: productFields.applications.default([]),
  images: productFields.images.default([]),
  imageAlt: productFields.imageAlt.default(''),
  seoKeywords: productFields.seoKeywords.default([]),
  featured: productFields.featured.default(false),
  status: productFields.status.default('draft'),
})

export const productPatchSchema = z.object(productFields).partial().strict()

export const productIdSchema = z.string().uuid('Invalid product ID')
