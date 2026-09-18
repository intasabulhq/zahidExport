export async function apiRequest(path, options = {}) {
  const headers = new Headers(options.headers || {})
  if (options.body && !(options.body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }

  const response = await fetch(path, {
    credentials: 'include',
    ...options,
    headers,
  })

  if (response.status === 204) return null
  const data = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(data.error || 'Request failed')
  return data
}

export function uploadProductImages(files, onProgress) {
  return new Promise((resolve, reject) => {
    const formData = new FormData()
    files.forEach((file) => formData.append('images', file))

    const request = new XMLHttpRequest()
    request.open('POST', '/api/uploads/images')
    request.withCredentials = true

    request.upload.addEventListener('progress', (event) => {
      if (event.lengthComputable) onProgress?.(Math.round((event.loaded / event.total) * 100))
    })

    request.addEventListener('load', () => {
      const data = JSON.parse(request.responseText || '{}')
      if (request.status >= 200 && request.status < 300) resolve(data)
      else reject(new Error(data.error || 'Image upload failed'))
    })
    request.addEventListener('error', () => reject(new Error('Unable to reach the upload server')))
    request.addEventListener('abort', () => reject(new Error('Image upload cancelled')))
    request.send(formData)
  })
}
