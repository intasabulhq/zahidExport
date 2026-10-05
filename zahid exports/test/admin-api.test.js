import test from 'node:test'
import assert from 'node:assert/strict'
import { apiRequest, uploadProductImages } from '../src/admin/api.js'

function installXHR(t, { event = 'load', status = 200, text = '{"images":[{"url":"https://example.com/tray.jpg"}]}' } = {}) {
  const previous = globalThis.XMLHttpRequest
  let request
  globalThis.XMLHttpRequest = class {
    constructor() { request = this; this.listeners = {}; this.responseText = text; this.status = status; this.upload = { addEventListener: (name, fn) => { this.progress = fn } } }
    open(method, path) { this.method = method; this.path = path }
    addEventListener(name, callback) { this.listeners[name] = callback }
    send(body) {
      this.body = body
      // Model browser delivery: callback exceptions do not reject the Promise.
      queueMicrotask(() => {
        try { this.listeners[event]() } catch (error) { this.callbackError = error }
      })
    }
  }
  t.after(() => { globalThis.XMLHttpRequest = previous })
  return () => request
}

async function bounded(promise) {
  let timer
  try {
    return await Promise.race([promise, new Promise((_, reject) => { timer = setTimeout(() => reject(new Error('Promise remained unsettled')), 250) })])
  } finally { clearTimeout(timer) }
}

test('valid upload returns images, enables credentials and has a timeout', async (t) => {
  const request = installXHR(t)
  const result = await bounded(uploadProductImages([]))
  assert.equal(result.images.length, 1)
  assert.equal(request().withCredentials, true)
  assert.equal(request().timeout, 120000)
  assert.equal(request().path, '/api/uploads/images')
})

for (const [status, text] of [[502, '<html>Bad gateway</html>'], [200, '<html>SPA index</html>'], [200, ''], [200, '{invalid']]) {
  test(`malformed HTTP ${status} upload rejects instead of hanging: ${text}`, async (t) => {
    const request = installXHR(t, { status, text })
    await assert.rejects(bounded(uploadProductImages([])), /invalid response/)
    assert.equal(request().callbackError, undefined)
  })
}

for (const text of ['null', '{}', '{"images":[]}', '{"images":[{}]}', '{"images":[null]}']) {
  test(`invalid successful upload payload rejects: ${text}`, async (t) => {
    installXHR(t, { text })
    await assert.rejects(bounded(uploadProductImages([])), /valid images/)
  })
}

test('server validation error is visible', async (t) => {
  installXHR(t, { status: 400, text: '{"error":"Image is too large"}' })
  await assert.rejects(bounded(uploadProductImages([])), /Image is too large/)
})

for (const [event, message] of [['timeout', /timed out/], ['error', /Unable to reach/], ['abort', /cancelled/]]) {
  test(`${event} rejects the upload`, async (t) => {
    installXHR(t, { event })
    await assert.rejects(bounded(uploadProductImages([])), message)
  })
}

test('upload reports numeric progress', async (t) => {
  const request = installXHR(t)
  const progress = []
  const promise = uploadProductImages([], (value) => progress.push(value))
  request().progress({ lengthComputable: true, loaded: 25, total: 100 })
  await bounded(promise)
  assert.deepEqual(progress, [25])
})

function installFetch(t, response) {
  const original = globalThis.fetch
  globalThis.fetch = async () => response
  t.after(() => { globalThis.fetch = original })
}

test('apiRequest rejects successful HTML response instead of treating it as saved', async (t) => {
  installFetch(t, { status: 200, ok: true, json: async () => { throw new SyntaxError('HTML') } })
  await assert.rejects(apiRequest('/api/products'), /invalid response/)
})

test('apiRequest preserves status and validation fields', async (t) => {
  installFetch(t, { status: 400, ok: false, json: async () => ({ error: 'Invalid product data', fields: { categoryId: ['Required'] } }) })
  await assert.rejects(apiRequest('/api/products'), (error) => {
    assert.equal(error.status, 400)
    assert.deepEqual(error.fields, { categoryId: ['Required'] })
    return true
  })
})

test('apiRequest handles 204 with no JSON body', async (t) => {
  installFetch(t, { status: 204 })
  assert.equal(await apiRequest('/api/auth/logout'), null)
})
