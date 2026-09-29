import { lazy, Suspense, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const Hero3DProduct = lazy(() => import('./Hero3DProduct'))

const slides = [
  {
    background: 'https://zahidexports.com/wp-content/uploads/2024/07/slide_1.webp',
    product: 'https://zahidexports.com/wp-content/uploads/2024/04/Wall-Clock.png?v=1750924978',
    productAlt: 'Decorative metal wall clock from Zahid Exports',
    eyebrow: 'Handcrafted home décor · B2B collections',
    title: 'Distinctive pieces.\nDesigned to travel.',
    copy: 'Thoughtful metalwork and home accents, made for retailers, hospitality groups and global buyers.',
    link: '/products/category/wall-art',
    linkLabel: 'Explore the collection',
    productName: 'Wall clock',
    modelType: 'clock',
  },
  {
    background: 'https://zahidexports.com/wp-content/uploads/2024/07/slide_5.webp',
    product: 'https://zahidexports.com/wp-content/uploads/2024/04/Planter-Stand.png?v=1750924979',
    productAlt: 'Metal planter stand from Zahid Exports',
    eyebrow: 'Made for considered spaces',
    title: 'Bring a little\nnature indoors.',
    copy: 'Explore versatile planter designs for home, retail and hospitality interiors.',
    link: '/products/category/planters',
    linkLabel: 'Explore planters',
    productName: 'Planter stand',
    modelType: 'planter',
  },
  {
    background: 'https://zahidexports.com/wp-content/uploads/2024/07/slide_6.webp',
    product: 'https://zahidexports.com/wp-content/uploads/2024/04/Wooden-Tray-2.png?v=1750924975',
    productAlt: 'Handcrafted wooden serving tray from Zahid Exports',
    eyebrow: 'Craftsmanship for everyday rituals',
    title: 'Warm materials.\nLasting character.',
    copy: 'Discover serving and décor pieces crafted to bring natural texture to every setting.',
    link: '/products/category/wooden-trays',
    linkLabel: 'Explore wooden trays',
    productName: 'Wooden tray',
    modelType: 'tray',
  },
]

function HeroSlider() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(() => !window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  const activeSlide = slides[activeIndex]

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!isPlaying || prefersReducedMotion || slides.length < 2) return undefined

    const timer = window.setInterval(() => {
      setActiveIndex((currentIndex) => (currentIndex + 1) % slides.length)
    }, 6500)
    return () => window.clearInterval(timer)
  }, [isPlaying])

  function moveSlide(direction) {
    setActiveIndex((currentIndex) => (currentIndex + direction + slides.length) % slides.length)
  }

  return (
    <section className="hero hero-carousel" aria-label="Featured Zahid Exports collections" aria-roledescription="carousel">
      <div className="hero-slides" aria-hidden="true">
        {slides.map((slide, index) => (
          <div className={`hero-slide${index === activeIndex ? ' hero-slide--active' : ''}`} key={slide.background}>
            <img className="hero-slide-image" src={slide.background} alt="" loading={index === 0 ? 'eager' : 'lazy'} fetchPriority={index === 0 ? 'high' : 'auto'} />
          </div>
        ))}
      </div>
      <div className="hero-overlay" />
      <div className="hero-product-stage" key={activeSlide.product} aria-hidden="true">
        <span className="hero-product-aura" />
        <Suspense fallback={<img className="hero-product-image" src={activeSlide.product} alt="" />}>
          <Hero3DProduct kind={activeSlide.modelType} fallback={activeSlide.product} alt={activeSlide.productAlt} />
        </Suspense>
        <span className="hero-product-caption">{activeSlide.productName}</span>
      </div>
      <div className="container hero-content">
        <div className="hero-copy-block" aria-live="polite" aria-atomic="true">
          <p className="eyebrow">{activeSlide.eyebrow}</p>
          <h1 className="hero-title">{activeSlide.title.split('\n').map((line, index) => <span key={line}>{index > 0 && <br />}{line}</span>)}</h1>
          <p className="hero-copy">{activeSlide.copy}</p>
          <div className="hero-buttons">
            <Link className="btn btn-light" to={activeSlide.link}>{activeSlide.linkLabel} ↗</Link>
            <Link className="btn btn-outline-light" to="/contact">Request a Quote</Link>
          </div>
        </div>
      </div>
      <div className="hero-carousel-controls container">
        <div className="hero-slide-position"><span>{String(activeIndex + 1).padStart(2, '0')}</span><i />{String(slides.length).padStart(2, '0')}</div>
        <div className="hero-slide-dots" aria-label="Choose a featured collection">
          {slides.map((slide, index) => (
            <button
              type="button"
              key={slide.background}
              className={index === activeIndex ? 'active' : ''}
              aria-label={`Show slide ${index + 1}: ${slide.productName}`}
              aria-current={index === activeIndex ? 'true' : undefined}
              onClick={() => setActiveIndex(index)}
            />
          ))}
        </div>
        <div className="hero-slide-actions">
          <button type="button" onClick={() => moveSlide(-1)} aria-label="Previous slide">←</button>
          <button type="button" onClick={() => moveSlide(1)} aria-label="Next slide">→</button>
          <button type="button" className="hero-play-toggle" onClick={() => setIsPlaying((playing) => !playing)} aria-label={isPlaying ? 'Pause slideshow' : 'Play slideshow'}>{isPlaying ? 'Ⅱ' : '▶'}</button>
        </div>
      </div>
    </section>
  )
}

export default HeroSlider
