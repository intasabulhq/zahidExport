import { useEffect } from 'react'

function upsertMeta(attribute, key, content) {
  let element = document.head.querySelector(`meta[${attribute}="${key}"]`)
  if (!element) {
    element = document.createElement('meta')
    element.setAttribute(attribute, key)
    document.head.appendChild(element)
  }
  element.setAttribute('content', content)
}

function removeMeta(attribute, key) {
  document.head.querySelector(`meta[${attribute}="${key}"]`)?.remove()
}

function Seo({ title, description, keywords = [], canonicalPath, robots = 'index, follow', image = '', type = 'website', structuredData }) {
  const structuredDataJson = structuredData ? JSON.stringify(structuredData) : ''
  const keywordContent = Array.isArray(keywords) ? keywords.join(', ') : keywords

  useEffect(() => {
    document.title = title
    upsertMeta('name', 'description', description)
    upsertMeta('name', 'robots', robots)
    if (keywordContent) upsertMeta('name', 'keywords', keywordContent)

    const canonicalUrl = new URL(canonicalPath || window.location.pathname, window.location.origin).href
    let canonical = document.head.querySelector('link[rel="canonical"]')
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.setAttribute('rel', 'canonical')
      document.head.appendChild(canonical)
    }
    canonical.setAttribute('href', canonicalUrl)

    upsertMeta('property', 'og:title', title)
    upsertMeta('property', 'og:description', description)
    upsertMeta('property', 'og:type', type)
    upsertMeta('property', 'og:url', canonicalUrl)
    upsertMeta('property', 'og:site_name', 'Zahid Exports')
    upsertMeta('name', 'twitter:card', image ? 'summary_large_image' : 'summary')
    upsertMeta('name', 'twitter:title', title)
    upsertMeta('name', 'twitter:description', description)

    if (image) {
      upsertMeta('property', 'og:image', image)
      upsertMeta('name', 'twitter:image', image)
    } else {
      removeMeta('property', 'og:image')
      removeMeta('name', 'twitter:image')
    }

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
  }, [title, description, keywordContent, canonicalPath, robots, image, type, structuredDataJson])

  return null
}

export default Seo
