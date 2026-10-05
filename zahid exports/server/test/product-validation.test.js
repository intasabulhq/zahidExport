import test from 'node:test'
import assert from 'node:assert/strict'
import { productCreateSchema, productPatchSchema, productIdSchema } from '../src/validation/products.js'

const createInput = {
  name: 'Metal tray', sku: 'ZE-100', slug: 'metal-tray',
  categoryId: '11111111-1111-4111-8111-111111111111',
  description: 'Handcrafted metal tray for wholesale buyers.',
  seoTitle: 'Metal tray', seoDescription: 'Wholesale handcrafted metal tray.',
}

for (const input of [
  { status: 'published' }, { status: 'archived' }, { name: 'Updated tray' },
  { featured: false }, { material: '' }, { seoKeywords: [] },
  { images: [] }, { applications: ['Retail'] }, { imageAlt: 'New alternative text' },
]) {
  test(`PATCH preserves exactly the supplied fields: ${JSON.stringify(input)}`, () => {
    assert.deepEqual(productPatchSchema.parse(input), input)
  })
}

test('empty PATCH receives no defaults and can be rejected by the route', () => {
  assert.deepEqual(productPatchSchema.parse({}), {})
})

test('unknown-only and typo PATCH payloads fail validation', () => {
  assert.equal(productPatchSchema.safeParse({ image: [] }).success, false)
  assert.equal(productPatchSchema.safeParse({ status: 'published', unexpected: 1 }).success, false)
})

test('invalid PATCH payloads fail', () => {
  for (const input of [null, [], 'hello', { status: 'public' }, { featured: 'false' }, { images: null }, { categoryId: null }]) {
    assert.equal(productPatchSchema.safeParse(input).success, false)
  }
})

test('create still supplies the original optional defaults', () => {
  const p = productCreateSchema.parse(createInput)
  assert.equal(p.status, 'draft')
  assert.equal(p.featured, false)
  assert.deepEqual(p.images, [])
  assert.deepEqual(p.applications, [])
  assert.deepEqual(p.seoKeywords, [])
  assert.equal(p.material, '')
})

test('create still requires a valid category', () => {
  const { categoryId, ...withoutCategory } = createInput
  assert.ok(categoryId)
  assert.equal(productCreateSchema.safeParse(withoutCategory).success, false)
})

test('full admin form PATCH remains compatible', () => {
  const form = productCreateSchema.parse(createInput)
  assert.deepEqual(productPatchSchema.parse(form), form)
})

test('explicit images normalize only nested supplied image metadata', () => {
  const url = 'https://res.cloudinary.com/example/image/upload/tray.jpg'
  assert.deepEqual(productPatchSchema.parse({ images: [{ url }] }), {
    images: [{ url, publicId: null, altText: '' }],
  })
})

test('slug storage limit is enforced on both create and update', () => {
  assert.equal(productCreateSchema.safeParse({ ...createInput, slug: 'a'.repeat(201) }).success, false)
  assert.equal(productPatchSchema.safeParse({ slug: 'a'.repeat(201) }).success, false)
  assert.equal(productPatchSchema.safeParse({ slug: 'a'.repeat(200) }).success, true)
})

test('invalid product IDs and oversized image lists fail', () => {
  assert.equal(productIdSchema.safeParse('bad-id').success, false)
  assert.equal(productIdSchema.safeParse(createInput.categoryId).success, true)
  assert.equal(productPatchSchema.safeParse({ images: Array(13).fill('https://example.com/image.jpg') }).success, false)
})
