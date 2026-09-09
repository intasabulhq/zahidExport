import { useEffect, useRef, useState } from 'react'

const supportsIntersectionObserver = typeof window !== 'undefined' && 'IntersectionObserver' in window

function Reveal({ children, className = '', delay = 0, as: Tag = 'div' }) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(!supportsIntersectionObserver)

  useEffect(() => {
    const element = ref.current
    if (!element || !supportsIntersectionObserver) return

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setVisible(true)
        observer.unobserve(element)
      }
    }, { threshold: 0.08, rootMargin: '0px 0px -3% 0px' })

    observer.observe(element)
    const fallback = window.setTimeout(() => setVisible(true), 1800)

    return () => {
      window.clearTimeout(fallback)
      observer.disconnect()
    }
  }, [])

  return <Tag ref={ref} className={`motion-reveal ${visible ? 'is-visible' : ''} ${className}`} style={{ '--reveal-delay': `${delay}ms` }}>{children}</Tag>
}

export default Reveal
