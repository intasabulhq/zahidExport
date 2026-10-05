import test from 'node:test'
import assert from 'node:assert/strict'
import { mapApiProduct, mapApiCategory, fetchProductsPage, fetchProduct, fetchCategory, fetchHome } from '../src/data/productApi.js'
import { resourceView, resolveResource, waitForResource } from '../src/data/asyncResource.js'

const product = { id: 'db-tray', sku: 'ZE-100', slug: 'tray', name: 'Tray', status: 'published', featured: true, images: [{ url: 'https://example.com/tray.jpg', altText: 'Tray photo' }] }
const category = { id: 'db-category', name: 'New Category', slug: 'new-category', product_count: 501, image_url: 'https://example.com/tray.jpg' }

function mockFetch(t, body, status = 200) {
  const original = globalThis.fetch
  const calls = []
  globalThis.fetch = async (path, options) => { calls.push({ path, options }); return { ok: status >= 200 && status < 300, status, json: async () => body } }
  t.after(() => { globalThis.fetch = original })
  return calls
}

test('homepage maps database products and category totals rather than legacy counts', async (t) => {
  const calls = mockFetch(t, { products: [product], categories: [category] })
  const controller = new AbortController()
  const result = await fetchHome(controller.signal)
  assert.equal(calls[0].path, '/api/catalogue/home')
  assert.equal(calls[0].options.signal, controller.signal)
  assert.equal(result.products[0].dbId, 'db-tray')
  assert.equal(result.products[0].images[0].url, 'https://example.com/tray.jpg')
  assert.equal(result.categories[0].productCount, 501)
})

test('new database category is supported without a hardcoded slug', async (t) => {
  const calls = mockFetch(t, { category })
  assert.equal((await fetchCategory('new-category')).slug, 'new-category')
  assert.equal(calls[0].path, '/api/catalogue/categories/new-category')
})

test('category slug is encoded and server metadata is preserved', async (t) => {
  const calls = mockFetch(t, { category: { ...category, seo_title: 'Custom title', seo_description: 'Custom description', seo_keywords: ['custom'] } })
  const result = await fetchCategory('a/b')
  assert.equal(calls[0].path, '/api/catalogue/categories/a%2Fb')
  assert.equal(result.seoTitle, 'Custom title')
  assert.deepEqual(result.keywords, ['custom'])
})

test('pagination reads one extra row and preserves search/category/offset', async (t) => {
  const calls = mockFetch(t, { products: Array.from({ length: 25 }, (_, i) => ({ ...product, id: String(i) })) })
  const page = await fetchProductsPage({ search: ' bowls ', category: 'bowls', offset: 120 })
  const url = new URL(calls[0].path, 'https://example.com')
  assert.equal(url.searchParams.get('limit'), '25')
  assert.equal(url.searchParams.get('offset'), '120')
  assert.equal(url.searchParams.get('search'), 'bowls')
  assert.equal(url.searchParams.get('category'), 'bowls')
  assert.equal(page.products.length, 24)
  assert.equal(page.hasMore, true)
})

test('a full final page does not advertise an empty next page', async (t) => {
  mockFetch(t, { products: Array(24).fill(product) })
  assert.equal((await fetchProductsPage()).hasMore, false)
})

test('invalid pagination is rejected before fetch', async (t) => {
  const calls = mockFetch(t, { products: [] })
  for (const input of [{ limit: 100 }, { limit: 1.5 }, { offset: -1 }, { offset: Infinity }]) await assert.rejects(fetchProductsPage(input), /Invalid catalogue page/)
  assert.equal(calls.length, 0)
})

test('missing product remains distinguishable from a server outage', async (t) => {
  mockFetch(t, { error: 'Product not found' }, 404)
  await assert.rejects(fetchProduct('missing'), (error) => error.status === 404)
})

test('empty/incomplete successful API responses are errors, not empty catalogues', async (t) => {
  mockFetch(t, {})
  await assert.rejects(fetchHome(), /incomplete/)
  await assert.rejects(fetchProduct('tray'), /did not contain a product/)
  await assert.rejects(fetchCategory('bowls'), /did not contain a category/)
  await assert.rejects(fetchProductsPage(), /did not contain products/)
})

test('malformed HTML response rejects with useful feedback', async (t) => {
  const original = globalThis.fetch
  globalThis.fetch = async () => ({ status: 502, ok: false, json: async () => { throw new SyntaxError('HTML') } })
  t.after(() => { globalThis.fetch = original })
  await assert.rejects(fetchHome(), /invalid response/)
})

test('mapping filters missing image URLs and handles image strings', () => {
  const mapped = mapApiProduct({ ...product, images: [null, {}, '', 'https://example.com/tray.jpg'] })
  assert.equal(mapped.images.length, 1)
  assert.equal(mapped.images[0].url, 'https://example.com/tray.jpg')
  assert.equal(mapApiCategory(category).productCount, 501)
})

test('route A response cannot be rendered for route B', () => {
  const snapshot = { key: 'A', loading: false, data: product, error: null }
  assert.deepEqual(resourceView(snapshot, 'B'), { key: 'B', loading: true, data: null, error: null })
  assert.equal(resourceView(snapshot, 'A'), snapshot)
})

test('old route errors are hidden for a new route', () => {
  const snapshot = { key: 'A', loading: false, data: null, error: new Error('old failure') }
  assert.equal(resourceView(snapshot, 'B').error, null)
})

test('cancelled late success cannot publish stale state', async () => {
  const controller = new AbortController()
  const snapshots = []
  let finish
  const promise = resolveResource('A', () => new Promise((resolve) => { finish = resolve }), controller.signal, (state) => snapshots.push(state))
  controller.abort()
  finish(product)
  await promise
  assert.deepEqual(snapshots, [])
})

test('cancelled late failure cannot publish stale errors', async () => {
  const controller = new AbortController()
  const snapshots = []
  let fail
  const promise = resolveResource('A', () => new Promise((resolve, reject) => { fail = reject }), controller.signal, (state) => snapshots.push(state))
  controller.abort()
  fail(new Error('old error'))
  await promise
  assert.deepEqual(snapshots, [])
})

test('current failure clears data and current success clears error', async () => {
  const signal = new AbortController().signal
  const snapshots = []
  await resolveResource('A', async () => { throw new Error('outage') }, signal, (state) => snapshots.push(state))
  await resolveResource('A', async () => product, signal, (state) => snapshots.push(state))
  assert.equal(snapshots[0].data, null)
  assert.equal(snapshots[1].error, null)
  assert.equal(snapshots[1].data, product)
})

test('debounce can be aborted without waiting or sending a request', async () => {
  const controller = new AbortController()
  const promise = waitForResource(10000, controller.signal)
  controller.abort()
  await assert.rejects(promise, (error) => error.name === 'AbortError')
  await assert.rejects(waitForResource(10000, controller.signal), (error) => error.name === 'AbortError')
})
