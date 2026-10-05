export function resourceView(snapshot, key) {
  // A response for A must never render while the URL/search points at B.
  return snapshot?.key === key
    ? snapshot
    : { key, loading: true, data: null, error: null }
}

export async function resolveResource(key, load, signal, publish) {
  try {
    const data = await load(key, signal)
    if (!signal.aborted) publish({ key, loading: false, data, error: null })
  } catch (error) {
    if (!signal.aborted) publish({ key, loading: false, data: null, error })
  }
}

export function waitForResource(milliseconds, signal) {
  return new Promise((resolve, reject) => {
    if (signal.aborted) return reject(new DOMException('Request aborted', 'AbortError'))
    const timer = setTimeout(() => {
      signal.removeEventListener('abort', onAbort)
      resolve()
    }, milliseconds)
    function onAbort() {
      clearTimeout(timer)
      signal.removeEventListener('abort', onAbort)
      reject(new DOMException('Request aborted', 'AbortError'))
    }
    signal.addEventListener('abort', onAbort, { once: true })
  })
}
