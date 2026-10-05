import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { SourceTextModule, SyntheticModule } from 'node:vm'

const source = await readFile(new URL('../src/routes/catalogue.js', import.meta.url), 'utf8')
async function harness({ missing = false, fail = false } = {}) {
  const routes = new Map()
  const calls = []
  const category = { id: 'category-db', slug: 'new-category', name: 'New Category', product_count: 501 }
  const product = { id: 'product-db', sku: 'ZE-100', slug: 'tray', featured: true, status: 'published', images: [] }
  const dependencies = {
    express: { Router: () => ({ get: (path, handler) => routes.set(path, handler) }) },
    '../config/db.js': { query: async (sql, params = []) => {
      calls.push({ sql, params })
      if (fail) throw new Error('database unavailable')
      if (sql.includes('SELECT p.*')) return { rows: [product] }
      return { rows: missing ? [] : [category] }
    } },
  }
  const module = new SourceTextModule(source)
  await module.link((specifier) => {
    const values = dependencies[specifier]
    assert.ok(values)
    return new SyntheticModule(Object.keys(values), function () {
      for (const [key, value] of Object.entries(values)) this.setExport(key, value)
    })
  })
  await module.evaluate()
  async function invoke(path, slug) {
    const res = { statusCode: 200, body: null, status(code) { this.statusCode = code; return this }, json(body) { this.body = body; return this } }
    await routes.get(path)({ params: { slug } }, res)
    return res
  }
  return { calls, invoke }
}

test('home exposes featured rows and authoritative counts from database', async () => {
  const { calls, invoke } = await harness()
  const res = await invoke('/home')
  assert.equal(res.body.products[0].id, 'product-db')
  assert.equal(res.body.categories[0].product_count, 501)
  assert.equal(calls.length, 2)
  assert.match(calls[0].sql, /p\.status = 'published'/)
  assert.match(calls[0].sql, /p\.featured = true/)
  assert.match(calls[0].sql, /c\.status = 'published'/)
  assert.match(calls[0].sql, /LIMIT 4/)
})

test('category counts are not limited to the first 100 products', async () => {
  const { calls, invoke } = await harness()
  await invoke('/home')
  assert.match(calls[1].sql, /COUNT\(p\.id\)/)
  assert.match(calls[1].sql, /LEFT JOIN products p ON p\.category_id = c\.id AND p\.status = 'published'/)
  assert.match(calls[1].sql, /preview\.status = 'published'/)
  assert.doesNotMatch(calls[1].sql, /LIMIT 100/)
})

test('database category slug is parameterized, not matched to a static list', async () => {
  const { calls, invoke } = await harness()
  const slug = "new-category' OR true--"
  const res = await invoke('/categories/:slug', slug)
  assert.equal(res.statusCode, 200)
  assert.deepEqual(calls[0].params, [slug])
  assert.match(calls[0].sql, /c\.slug = \$1/)
  assert.equal(calls[0].sql.includes(slug), false)
})

test('missing/archived category returns 404', async () => {
  const { invoke } = await harness({ missing: true })
  const res = await invoke('/categories/:slug', 'missing')
  assert.equal(res.statusCode, 404)
  assert.equal(res.body.error, 'Category not found')
})

test('database failures propagate rather than returning fabricated empty data', async () => {
  const { invoke } = await harness({ fail: true })
  await assert.rejects(invoke('/home'), /database unavailable/)
})
