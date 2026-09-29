const image = (filename, version) => `https://zahidexports.com/wp-content/uploads/2024/05/${filename}?v=${version}`

export const products = [
  {
    id: 'ZE-PLANTER-3201X', name: 'Sculpted Metal Planter', slug: 'ze-planter-3201x', category: 'Planters', categorySlug: 'planters',
    material: 'Metal', finish: 'Available on enquiry', description: 'A sculptural metal planter designed to bring greenery into focus. Its considered profile suits residential interiors, boutique retail and hospitality projects. Ask our team about available sizes, finishes and wholesale quantities.',
    images: [image('ZE-3201X.jpg', '1750924214')], applications: ['Home décor', 'Retail', 'Hospitality'], moq: '', featured: true, status: 'published',
    seo: { title: 'ZE-PLANTER-3201X Metal Planter | Zahid Exports', description: 'Explore the ZE-PLANTER-3201X metal planter for wholesale, retail and hospitality projects.' },
  },
  {
    id: 'ZE-PLANTER-3198Y', name: 'Contemporary Metal Planter', slug: 'ze-planter-3198y', category: 'Planters', categorySlug: 'planters',
    material: 'Metal', finish: 'Available on enquiry', description: 'A contemporary planter from Zahid Exports’ metal décor collection. Designed to complement indoor and outdoor greenery, with finish and order details available on request.',
    images: [image('ZE-3198Y-300x300.jpg', '1750924215')], applications: ['Home décor', 'Retail', 'Hospitality'], moq: '', featured: false, status: 'published',
    seo: { title: 'ZE-PLANTER-3198Y Metal Planter | Zahid Exports', description: 'Request wholesale details for the ZE-PLANTER-3198Y metal planter.' },
  },
  {
    id: 'ZE-PLANTER-3198X', name: 'Modern Metal Planter', slug: 'ze-planter-3198x', category: 'Planters', categorySlug: 'planters',
    material: 'Metal', finish: 'Available on enquiry', description: 'A refined metal planter for curated interior and outdoor settings. Contact Zahid Exports for specifications, finish options and bulk-order information.',
    images: [image('ZE-3198X-300x300.jpg', '1750924215')], applications: ['Home décor', 'Retail', 'Hospitality'], moq: '', featured: false, status: 'published',
    seo: { title: 'ZE-PLANTER-3198X Metal Planter | Zahid Exports', description: 'Discover the ZE-PLANTER-3198X planter for B2B and hospitality enquiries.' },
  },
  {
    id: 'ZE-BOWL-3219W', name: 'Artisan Metal Serving Bowl', slug: 'ze-bowl-3219w', category: 'Bowls', categorySlug: 'bowls',
    material: 'Metal', finish: 'Available on enquiry', description: 'A metal serving bowl that pairs practical use with a polished tabletop presence. Suitable for serving, styling and hospitality settings; enquire for finish and wholesale options.',
    images: [image('ZE-3219W.jpg', '1750924538')], applications: ['Dining', 'Hospitality', 'Home décor'], moq: '', featured: true, status: 'published',
    seo: { title: 'ZE-BOWL-3219W Metal Bowl | Zahid Exports', description: 'Explore the ZE-BOWL-3219W metal serving bowl for wholesale and hospitality.' },
  },
  {
    id: 'ZE-BOWL-3219V', name: 'Decorative Metal Bowl', slug: 'ze-bowl-3219v', category: 'Bowls', categorySlug: 'bowls',
    material: 'Metal', finish: 'Available on enquiry', description: 'A versatile metal bowl for serving or decorative display. A considered addition to retail assortments, dining spaces and hospitality collections.',
    images: [image('ZE-3219V-300x300.jpg', '1750924538')], applications: ['Dining', 'Hospitality', 'Retail'], moq: '', featured: false, status: 'published',
    seo: { title: 'ZE-BOWL-3219V Metal Bowl | Zahid Exports', description: 'Request B2B details for the ZE-BOWL-3219V decorative metal bowl.' },
  },
  {
    id: 'ZE-ST-3251O', name: 'Metal Side Table', slug: 'ze-st-3251o', category: 'Side Tables', categorySlug: 'side-tables',
    material: 'Metal', finish: 'Available on enquiry', description: 'A stylish metal side table designed to bring function and a refined accent to living and bedroom spaces. Ask about finish options, specifications and export quantities.',
    images: [image('ZE-3251O.jpg', '1750924200')], applications: ['Living spaces', 'Hospitality', 'Interior projects'], moq: '', featured: true, status: 'published',
    seo: { title: 'ZE-ST-3251O Metal Side Table | Zahid Exports', description: 'Discover the ZE-ST-3251O metal side table for trade and hospitality projects.' },
  },
  {
    id: 'ZE-ST-3251N', name: 'Contemporary Side Table', slug: 'ze-st-3251n', category: 'Side Tables', categorySlug: 'side-tables',
    material: 'Metal', finish: 'Available on enquiry', description: 'A contemporary metal side table suited to coordinated furniture and décor collections. Contact us for product specifications and wholesale details.',
    images: [image('ZE-3251N-300x300.jpg', '1750924200')], applications: ['Living spaces', 'Retail', 'Hospitality'], moq: '', featured: false, status: 'published',
    seo: { title: 'ZE-ST-3251N Side Table | Zahid Exports', description: 'Request wholesale information for the ZE-ST-3251N side table.' },
  },
  {
    id: 'ZE-WT-3224R', name: 'Handcrafted Wooden Tray', slug: 'ze-wt-3224r', category: 'Wooden Trays', categorySlug: 'wooden-trays',
    material: 'Wood', finish: 'Available on enquiry', description: 'A multipurpose wooden tray for serving, organising or displaying décor. Its natural character brings warmth to retail, dining and hospitality collections.',
    images: [image('ZE-3224R.jpg', '1750924159')], applications: ['Dining', 'Hospitality', 'Home décor'], moq: '', featured: true, status: 'published',
    seo: { title: 'ZE-WT-3224R Wooden Tray | Zahid Exports', description: 'Explore the ZE-WT-3224R wooden tray for wholesale and hospitality.' },
  },
  {
    id: 'ZE-WT-3224Z5', name: 'Wooden Serving Tray', slug: 'ze-wt-3224z5', category: 'Wooden Trays', categorySlug: 'wooden-trays',
    material: 'Wood', finish: 'Available on enquiry', description: 'A warm, versatile serving and display piece from the Zahid Exports wooden tray collection. Ask our team about availability and bulk orders.',
    images: [image('ZE-3224Z5-300x300.jpg', '1750924158')], applications: ['Dining', 'Retail', 'Home décor'], moq: '', featured: false, status: 'published',
    seo: { title: 'ZE-WT-3224Z5 Wooden Tray | Zahid Exports', description: 'Request B2B details for the ZE-WT-3224Z5 wooden serving tray.' },
  },
  {
    id: 'ZE-WM-3176Z', name: 'Metal Frame Wall Mirror', slug: 'ze-wm-3176z', category: 'Wall Mirrors', categorySlug: 'wall-mirrors',
    material: 'Metal and mirror', finish: 'Available on enquiry', description: 'A statement wall mirror with a crafted metal frame, designed to add depth and character to interiors. Suitable for retail, hospitality and interior-design projects.',
    images: [image('ZE-3176Z.jpg', '1750924180')], applications: ['Interior projects', 'Retail', 'Hospitality'], moq: '', featured: true, status: 'published',
    seo: { title: 'ZE-WM-3176Z Metal Wall Mirror | Zahid Exports', description: 'Discover the ZE-WM-3176Z wall mirror for wholesale and interior projects.' },
  },
  {
    id: 'ZE-WA-3177M', name: 'Decorative Metal Wall Art', slug: 'ze-wa-3177m', category: 'Wall Art & Clocks', categorySlug: 'wall-art',
    material: 'Metal', finish: 'Available on enquiry', description: 'A decorative metal wall accent from Zahid Exports’ wall-art range. Designed to create a distinctive focal point across residential, retail and hospitality settings.',
    images: [image('ZE-3177M-300x300.jpg', '1750924198')], applications: ['Home décor', 'Retail', 'Hospitality'], moq: '', featured: false, status: 'published',
    seo: { title: 'ZE-WA-3177M Metal Wall Art | Zahid Exports', description: 'Request wholesale details for the ZE-WA-3177M decorative wall-art piece.' },
  },
  {
    id: 'ZE-WAC-3162G', name: 'Decorative Metal Watering Can', slug: 'ze-wac-3162g', category: 'Watering Cans', categorySlug: 'watering-cans',
    material: 'Metal', finish: 'Available on enquiry', description: 'A decorative watering can that brings a crafted touch to gardening and home décor collections. Ask us about product details, finish options and wholesale quantities.',
    images: [image('ZE-3162G-1-300x300.jpg', '1750924174')], applications: ['Garden décor', 'Retail', 'Home décor'], moq: '', featured: true, status: 'published',
    seo: { title: 'ZE-WAC-3162G Watering Can | Zahid Exports', description: 'Explore the ZE-WAC-3162G metal watering can for B2B enquiries.' },
  },
  {
    id: 'ZE-JUG-3208T', name: 'Metal Serving Jug', slug: 'ze-jug-3208t', category: 'Jugs', categorySlug: 'jugs',
    material: 'Metal', finish: 'Available on enquiry', description: 'A metal jug that pairs practical serving with a distinctive tabletop presence. It can also be styled as a decorative centrepiece; enquire about finish and wholesale options.',
    images: [image('ZE-3208T.jpg', '1750924324')], applications: ['Dining', 'Hospitality', 'Home décor'], moq: '', featured: false, status: 'published',
    seo: { title: 'ZE-JUG-3208T Metal Jug | Zahid Exports', description: 'Discover the ZE-JUG-3208T metal serving jug for B2B and hospitality enquiries.' },
  },
]

export function getProductBySlug(slug) {
  return products.find((product) => product.slug === slug)
}

export function getProductsByCategory(categorySlug) {
  return products.filter((product) => product.categorySlug === categorySlug)
}
