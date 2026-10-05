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
  let data
  try {
    data = await response.json()
  } catch {
    throw new Error(`The server returned an invalid response (HTTP ${response.status}). Please try again.`)
  }
  if (!response.ok) {
    const error = new Error(data?.error || `Request failed (HTTP ${response.status})`)
    error.status = response.status
    error.fields = data?.fields || {}
    throw error
  }
  return data
}

export function uploadProductImages(files, onProgress) {
  return new Promise((resolve, reject) => {
    const formData = new FormData()
    files.forEach((file) => formData.append('images', file))

    const request = new XMLHttpRequest()
    request.open('POST', '/api/uploads/images')
    request.withCredentials = true
    request.timeout = 120000

    request.upload.addEventListener('progress', (event) => {
      if (event.lengthComputable) onProgress?.(Math.round((event.loaded / event.total) * 100))
    })

    request.addEventListener('load', () => {
      let data
      try {
        data = JSON.parse(request.responseText)
      } catch {
        reject(new Error(`The upload server returned an invalid response (HTTP ${request.status}). Please try again.`))
        return
      }
      if (request.status < 200 || request.status >= 300) {
        reject(new Error(data?.error || `Image upload failed (HTTP ${request.status})`))
        return
      }
      if (!data || !Array.isArray(data.images) || !data.images.length || data.images.some((image) => !image || typeof image.url !== 'string' || !image.url)) {
        reject(new Error('The upload server did not return valid images. Please try again.'))
        return
      }
      resolve(data)
    })
    request.addEventListener('timeout', () => reject(new Error('Image upload timed out. Check your connection and try again.')))
    request.addEventListener('error', () => reject(new Error('Unable to reach the upload server')))
    request.addEventListener('abort', () => reject(new Error('Image upload cancelled')))
    request.send(formData)
  })
}
