import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, A11y } from 'swiper/modules'
import { imageUrl } from '../data/productApi'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

function ProductImageSlider({ images = [], name = 'Product' }) {
  if (!images.length) return <div className="product-slider-empty">Product image coming soon</div>

  return (
    <div className="product-slider">
      <Swiper modules={[Navigation, Pagination, A11y]} navigation={images.length > 1} pagination={{ clickable: true }} spaceBetween={0} slidesPerView={1} className="product-swiper">
        {images.map((image, index) => {
          const src = imageUrl(image)
          const alt = typeof image === 'object' && image?.altText ? image.altText : `${name} ${index + 1}`
          return <SwiperSlide key={`${src}-${index}`}><div className="product-slide"><img src={src} alt={alt} /></div></SwiperSlide>
        })}
      </Swiper>
    </div>
  )
}

export default ProductImageSlider
