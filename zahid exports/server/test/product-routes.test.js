import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { SourceTextModule, SyntheticModule } from 'node:vm'
import * as validation from '../src/validation/products.js'

// Execute the real route handlers with in-memory database/Cloudinary doubles.
// No .env, live database, remote upload, or actual asset deletion is used.
const routeSource = await readFile(new URL('../src/routes/products.js', import.meta.url), 'utf8')
const id = '22222222-2222-4222-8222-222222222222'
const categoryId = '11111111-1111-4111-8111-111111111111'

async function harness(overrides = {}) {
  const routes = new Map()
  const router = {}
  for (const method of ['get', 'post', 'patch', 'delete']) {
    router[method] = (path, ...handlers) => routes.set(`${method} ${path}`, handlers.at(-1))
  }
  const state = {
    product: { id, category_id: categoryId, name: 'Tray', sku: 'ZE-100', slug: 'tray', status: 'draft', material: 'Brass', finish: 'Polished', dimensions: '30 cm', moq: '100', applications: ['Retail'], image_alt: 'Brass tray', seo_keywords: ['tray'], featured: true, updated_at: 'before', ...overrides },
    images: [{ public_id: 'zahid-exports/products/tray', url: 'https://example.com/tray.jpg', position: 0 }],
    calls: [], destroyed: [], connected: 0, released: 0,
    categoryStatus: 'published',
  }
  async function query(sql, params = []) {
    state.calls.push({ sql, params })
    if (sql.startsWith('SELECT * FROM products')) return { rows: state.product ? [{ ...state.product }] : [] }
    if (sql.startsWith('SELECT id, status FROM categories')) return { rows: state.categoryStatus ? [{ id: categoryId, status: state.categoryStatus }] : [] }
    if (sql.startsWith('UPDATE products SET')) {
      for (const match of sql.matchAll(/(\w+) = \$(\d+)/g)) {
        if (match[1] !== 'id') state.product[match[1]] = match[1] === 'applications' ? JSON.parse(params[Number(match[2]) - 1]) : params[Number(match[2]) - 1]
      }
      state.product.updated_at = 'after'
      return { rows: [{ ...state.product }] }
    }
    if (sql.startsWith('SELECT public_id FROM product_images')) return { rows: state.images.filter((image) => image.public_id).map(({ public_id }) => ({ public_id })) }
    if (sql.startsWith('DELETE FROM product_images')) { state.images = []; return { rows: [] } }
    if (sql.startsWith('INSERT INTO product_images')) {
      state.images.push({ url: params[1], public_id: params[2], alt_text: params[3], position: params[4] })
      return { rows: [] }
    }
    return { rows: [] }
  }
  const client = { query, release: () => { state.released += 1 } }
  const dependencies = {
    express: { Router: () => router },
    '../config/cloudinary.js': { cloudinary: { uploader: { destroy: async (publicId) => { state.destroyed.push(publicId); return { result: 'ok' } } } } },
    '../config/db.js': { pool: { connect: async () => { state.connected += 1; return client } }, query },
    '../middleware/auth.js': { requireAuth: () => {} },
    '../validation/products.js': validation,
  }
  const module = new SourceTextModule(routeSource)
  await module.link((specifier) => {
    const exports = dependencies[specifier]
    assert.ok(exports, `Unexpected route dependency: ${specifier}`)
    return new SyntheticModule(Object.keys(exports), function () {
      for (const [name, value] of Object.entries(exports)) this.setExport(name, value)
    })
  })
  await module.evaluate()
  async function invoke(method, path, body = {}, params = { id }, queryParams = {}) {
    const res = { statusCode: 200, body: null, status(code) { this.statusCode = code; return this }, json(data) { this.body = data; return this }, end() { return this } }
    await routes.get(`${method} ${path}`)({ body, params, query: queryParams }, res)
    return res
  }
  return { state, invoke }
}

for (const status of ['published', 'archived', 'draft']) {
  test(`status-only PATCH to ${status} preserves product data and images`, async () => {
    const { state, invoke } = await harness()
    const before = structuredClone(state.product)
    const images = structuredClone(state.images)
    const res = await invoke('patch', '/:id', { status })
    assert.equal(res.statusCode, 200)
    for (const [key, value] of Object.entries(before)) {
      if (!['status', 'updated_at'].includes(key)) assert.deepEqual(state.product[key], value, key)
    }
    assert.deepEqual(state.images, images)
    assert.deepEqual(state.destroyed, [])
    assert.equal(state.calls.some(({ sql }) => /DELETE FROM product_images/.test(sql)), false)
    assert.equal(state.product.status, status)
    assert.equal(state.released, 1)
  })
}

test('name-only PATCH does not unpublish or clear images/featured', async () => {
  const { state, invoke } = await harness({ status: 'published' })
  const res = await invoke('patch', '/:id', { name: 'Updated tray' })
  assert.equal(res.statusCode, 200)
  assert.equal(state.product.name, 'Updated tray')
  assert.equal(state.product.status, 'published')
  assert.equal(state.product.featured, true)
  assert.equal(state.images.length, 1)
  assert.deepEqual(state.destroyed, [])
})

test('empty, unknown-only, and invalid PATCH cause no database connection', async () => {
  for (const body of [{}, { unexpected: true }, { images: null }, { status: 'invalid' }]) {
    const { state, invoke } = await harness()
    assert.equal((await invoke('patch', '/:id', body)).statusCode, 400)
    assert.equal(state.connected, 0)
    assert.deepEqual(state.destroyed, [])
  }
})

test('explicit empty images removes images only after commit', async () => {
  const { state, invoke } = await harness()
  const res = await invoke('patch', '/:id', { images: [] })
  assert.equal(res.statusCode, 200)
  assert.deepEqual(state.images, [])
  assert.deepEqual(state.destroyed, ['zahid-exports/products/tray'])
  assert.ok(state.calls.some(({ sql }) => sql === 'COMMIT'))
  assert.equal(state.product.material, 'Brass')
  assert.equal(state.product.status, 'draft')
  assert.equal(state.product.updated_at, 'after')
})

test('retaining a public ID during image reorder does not destroy its asset', async () => {
  const { state, invoke } = await harness()
  const res = await invoke('patch', '/:id', { images: [{ url: 'https://example.com/tray.jpg', publicId: 'zahid-exports/products/tray', altText: 'Reordered tray' }] })
  assert.equal(res.statusCode, 200)
  assert.deepEqual(state.destroyed, [])
  assert.equal(state.images[0].alt_text, 'Reordered tray')
})

test('uncategorized legacy product cannot be published', async () => {
  const { state, invoke } = await harness({ category_id: null })
  const res = await invoke('patch', '/:id', { status: 'published' })
  assert.equal(res.statusCode, 400)
  assert.equal(state.product.status, 'draft')
  assert.equal(state.calls.some(({ sql }) => sql.startsWith('UPDATE')), false)
  assert.deepEqual(state.destroyed, [])
  assert.equal(state.released, 1)
})

test('draft/archived/missing categories cannot be used to publish', async () => {
  for (const status of ['draft', 'archived', null]) {
    const { state, invoke } = await harness()
    state.categoryStatus = status
    assert.equal((await invoke('patch', '/:id', { status: 'published' })).statusCode, 400)
    assert.equal(state.product.status, 'draft')
  }
})

test('missing product returns 404 and rolls back', async () => {
  const { state, invoke } = await harness()
  state.product = null
  assert.equal((await invoke('patch', '/:id', { status: 'draft' })).statusCode, 404)
  assert.ok(state.calls.some(({ sql }) => sql === 'ROLLBACK'))
  assert.equal(state.released, 1)
})

test('invalid product ID is rejected before reading database', async () => {
  const { state, invoke } = await harness()
  assert.equal((await invoke('patch', '/:id', { status: 'draft' }, { id: 'bad-id' })).statusCode, 400)
  assert.equal(state.connected, 0)
})

test('invalid pagination never reaches database', async () => {
  for (const queryParams of [{ limit: '1.5' }, { limit: 'Infinity' }, { limit: '101' }, { limit: '0' }, { offset: '-1' }, { offset: 'Infinity' }, { offset: '0.5' }]) {
    const { state, invoke } = await harness()
    assert.equal((await invoke('get', '/', {}, {}, queryParams)).statusCode, 400)
    assert.deepEqual(state.calls, [])
  }
})

test('category search is included and pagination order is stable', async () => {
  const { state, invoke } = await harness()
  assert.equal((await invoke('get', '/', {}, {}, { search: 'Bowls', limit: '10', offset: '20' })).statusCode, 200)
  assert.match(state.calls[0].sql, /c\.name ILIKE/)
  assert.match(state.calls[0].sql, /p\.id DESC/)
  assert.deepEqual(state.calls[0].params, ['%Bowls%', 10, 20])
})
