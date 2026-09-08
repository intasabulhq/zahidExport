import { useEffect } from 'react'

function upsertMeta(name, content) {
  let element = document.head.querySelector(`meta[name="${name}"]`)
  if (!element) {
    element = document.createElement('meta')
    element.setAttribute('name', name)
    document.head.appendChild(element)
  }
  element.setAttribute('content', content)
}

function Seo({ title, description, canonicalPath, robots = 'index, follow', structuredData }) {
  const structuredDataJson = structuredData ? JSON.stringify(structuredData) : ''

  useEffect(() => {
    document.title = title
    upsertMeta('description', description)
    upsertMeta('robots', robots)

    const canonicalUrl = new URL(canonicalPath || window.location.pathname, window.location.origin).href
    let canonical = document.head.querySelector('link[rel="canonical"]')
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.setAttribute('rel', 'canonical')
      document.head.appendChild(canonical)
    }
    canonical.setAttribute('href', canonicalUrl)

    const scriptId = 'zahid-exports-structured-data'
    document.getElementById(scriptId)?.remove()
    if (structuredDataJson) {
      const script = document.createElement('script')
      script.id = scriptId
      script.type = 'application/ld+json'
      script.text = structuredDataJson
      document.head.appendChild(script)
    }

    return () => document.getElementById(scriptId)?.remove()
  }, [title, description, canonicalPath, robots, structuredDataJson])

  return null
}

export default Seo
