const categorySeo = {
  "cake-stands": ["metal cake stand manufacturer India", "wholesale cake stands", "dessert stand exporter"],
  "metal-tables": ["metal table manufacturer India", "wholesale metal tables", "hospitality furniture exporter"],
  "animal-stands": ["metal animal stand manufacturer", "animal decor exporter India", "wholesale decorative stands"],
  "wooden-trays": ["wooden tray manufacturer India", "wholesale wooden trays", "Moradabad handicraft exporter"],
}

function catalogueProduct({ id, name, slug, category, categorySlug, material, description, sourceUrl = "", featured = false }) {
  const sku = id.replace(/^ZE-/, "")
  return {
    id,
    name,
    slug,
    category,
    categorySlug,
    material,
    finish: "",
    dimensions: "",
    description,
    images: [],
    imageAlt: `${name} ${sku} manufactured by Zahid Exports in Moradabad, India`,
    applications: ["Home Decor", "Hospitality", "Retail", "Interior Projects"],
    moq: "",
    featured,
    status: "published",
    sourceUrl,
    seo: {
      title: `${name} ${sku} | Zahid Exports India`,
      description,
      keywords: categorySeo[categorySlug] || ["home decor manufacturer India", "Moradabad handicraft exporter"],
    },
  }
}

export const products = [
  catalogueProduct({ id: "ZE-CAKESTAND-ZE-3446Y", name: "Cake Stand", slug: "ze-cakestand-ze-3446y", category: "Cake Stands", categorySlug: "cake-stands", material: "Metal", featured: true, description: "Decorative metal cake stand for elegant dessert presentation, hospitality, weddings and wholesale homeware collections from India." }),
  catalogueProduct({ id: "ZE-CAKESTAND-ZE-3446X", name: "Cake Stand", slug: "ze-cakestand-ze-3446x", category: "Cake Stands", categorySlug: "cake-stands", material: "Metal", featured: true, description: "Handcrafted metal cake stand designed for refined dining, event styling, retail displays and international wholesale sourcing." }),
  catalogueProduct({ id: "ZE-CAKESTAND-ZE-3446W", name: "Cake Stand", slug: "ze-cakestand-ze-3446w", category: "Cake Stands", categorySlug: "cake-stands", material: "Metal", description: "Versatile metal cake stand for serving desserts across homes, hotels, cafés, events and curated retail collections." }),
  catalogueProduct({ id: "ZE-CAKESTAND-3246U", name: "Metal Cake Stand", slug: "ze-cakestand-3246u", category: "Cake Stands", categorySlug: "cake-stands", material: "Metal", sourceUrl: "https://zahidexports.com/product/ze-cakestand-3246u/", description: "High-quality metal cake stand created to showcase desserts with an elegant presentation for weddings, hotels, cafés and retailers." }),

  catalogueProduct({ id: "ZE-MT-3238X", name: "Metal Table", slug: "ze-mt-3238x", category: "Metal Tables", categorySlug: "metal-tables", material: "Metal", featured: true, sourceUrl: "https://zahidexports.com/product/ze-mt-3238x/", description: "Decorative metal table for residential interiors, hospitality spaces, retail collections and international project sourcing." }),
  catalogueProduct({ id: "ZE-METALTABLE-ZE-3201L", name: "Handcrafted Metal Table", slug: "ze-metaltable-ze-3201l", category: "Metal Tables", categorySlug: "metal-tables", material: "Metal", sourceUrl: "https://zahidexports.com/product/ze-metaltable-ze-3201l/", description: "Handcrafted metal table made for homes, offices, cafés and hospitality interiors, available for wholesale and export enquiries." }),
  catalogueProduct({ id: "ZE-METALTABLE-ZE-3435I", name: "Decorative Metal Table", slug: "ze-metaltable-ze-3435i", category: "Metal Tables", categorySlug: "metal-tables", material: "Metal", sourceUrl: "https://zahidexports.com/product/ze-metaltable-ze-3435i/", description: "Decorative metal table developed for contemporary living spaces, hotels, cafés and design-led retail furniture collections." }),
  catalogueProduct({ id: "ZE-METALTABLE-ZE-3379M", name: "Metal Accent Table", slug: "ze-metaltable-ze-3379m", category: "Metal Tables", categorySlug: "metal-tables", material: "Metal", sourceUrl: "https://zahidexports.com/product/ze-metaltable-ze-3379m/", description: "Handcrafted metal accent table for residential, office and hospitality projects, supplied for custom and bulk requirements." }),
  catalogueProduct({ id: "ZE-METALTABLE-ZE-3379J", name: "Metal Side Table", slug: "ze-metaltable-ze-3379j", category: "Metal Tables", categorySlug: "metal-tables", material: "Metal", sourceUrl: "https://zahidexports.com/product/ze-metaltable-ze-3379j/", description: "Versatile metal side table designed for modern homes, cafés, hotels and wholesale furniture programmes worldwide." }),
  catalogueProduct({ id: "ZE-METALTABLE-ZE-3251U", name: "Handmade Metal Table", slug: "ze-metaltable-ze-3251u", category: "Metal Tables", categorySlug: "metal-tables", material: "Metal", sourceUrl: "https://zahidexports.com/product/ze-metaltable-ze-3251u/", description: "Handmade metal table combining functional form with decorative appeal for homes, offices, hospitality and retail sourcing." }),

  catalogueProduct({ id: "ZE-ANIMALSTAND-ZE-3412Q", name: "Metal Animal Stand", slug: "ze-animalstand-ze-3412q", category: "Animal Stands", categorySlug: "animal-stands", material: "Metal", featured: true, sourceUrl: "https://zahidexports.com/product/ze-animalstand-ze-3412q/", description: "Sculptural metal animal stand for decorative displays, gifting, hospitality styling and international wholesale collections." }),
  catalogueProduct({ id: "ZE-ANIMALSTAND-ZE-3383P", name: "Decorative Animal Stand", slug: "ze-animalstand-ze-3383p", category: "Animal Stands", categorySlug: "animal-stands", material: "Metal", sourceUrl: "https://zahidexports.com/product/ze-animalstand-ze-3383p/", description: "Handcrafted decorative animal stand suited to curated home collections, retail displays, gifting and hospitality projects." }),
  catalogueProduct({ id: "ZE-ANIMALSTAND-ZE-3423I", name: "Handcrafted Animal Stand", slug: "ze-animalstand-ze-3423i", category: "Animal Stands", categorySlug: "animal-stands", material: "Metal", sourceUrl: "https://zahidexports.com/product/ze-animalstand-ze-3423i/", description: "Characterful handcrafted animal stand made for residential styling, commercial interiors and global decor retailers." }),
  catalogueProduct({ id: "ZE-ANIMALSTAND-ZE-3385M", name: "Sculptural Animal Stand", slug: "ze-animalstand-ze-3385m", category: "Animal Stands", categorySlug: "animal-stands", material: "Metal", sourceUrl: "https://zahidexports.com/product/ze-animalstand-ze-3385m/", description: "Sculptural metal animal-shaped stand for home decor, themed interiors, gifting and wholesale decorative collections." }),
  catalogueProduct({ id: "ZE-ANIMALSTAND-ZE-3405Y", name: "Animal Decor Stand", slug: "ze-animalstand-ze-3405y", category: "Animal Stands", categorySlug: "animal-stands", material: "Metal", sourceUrl: "https://zahidexports.com/product/ze-animalstand-ze-3405y/", description: "Metal animal decor stand handcrafted for shelves, consoles, hospitality styling and international retail programmes." }),
  catalogueProduct({ id: "ZE-ANIMALSTAND-ZE-3384P", name: "Metal Animal Sculpture Stand", slug: "ze-animalstand-ze-3384p", category: "Animal Stands", categorySlug: "animal-stands", material: "Metal", sourceUrl: "https://zahidexports.com/product/ze-animalstand-ze-3384p/", description: "Decorative metal animal sculpture stand for design-led homes, gifting collections, hotels and wholesale importers." }),
  catalogueProduct({ id: "ZE-ANIMALSTAND-ZE-3401V", name: "Handmade Animal Stand", slug: "ze-animalstand-ze-3401v", category: "Animal Stands", categorySlug: "animal-stands", material: "Metal", sourceUrl: "https://zahidexports.com/product/ze-animalstand-ze-3401v/", description: "Handmade metal animal stand offering a distinctive accent for interiors, retail displays and custom decor projects." }),
  catalogueProduct({ id: "ZE-ANIMALSTAND-ZE-3425D", name: "Decorative Metal Animal Stand", slug: "ze-animalstand-ze-3425d", category: "Animal Stands", categorySlug: "animal-stands", material: "Metal", sourceUrl: "https://zahidexports.com/product/ze-animalstand-ze-3425d/", description: "Decorative metal animal stand manufactured for home accessories, hospitality concepts, gifting and bulk export orders." }),
  catalogueProduct({ id: "ZE-ANIMALSTAND-ZE-3384H", name: "Artisan Animal Stand", slug: "ze-animalstand-ze-3384h", category: "Animal Stands", categorySlug: "animal-stands", material: "Metal", sourceUrl: "https://zahidexports.com/product/ze-animalstand-ze-3384h/", description: "Artisan-made animal stand for expressive home decor, themed spaces, retail assortments and international sourcing." }),
  catalogueProduct({ id: "ZE-ANIMALSTAND-ZE-3323Q", name: "Functional Animal Stand", slug: "ze-animalstand-ze-3323q", category: "Animal Stands", categorySlug: "animal-stands", material: "Iron, brass or aluminium", sourceUrl: "https://zahidexports.com/product/ze-animalstand-ze-3323q/", description: "Decorative and functional animal stand for holding planters, bowls or showpieces in homes, hotels and retail displays." }),

  catalogueProduct({ id: "ZE-WT-3223X", name: "Handcrafted Wooden Tray", slug: "ze-wt-3223x", category: "Wooden Trays", categorySlug: "wooden-trays", material: "Wood", sourceUrl: "https://zahidexports.com/product/ze-wt-3223x/", description: "High-quality wooden tray combining rustic character with practical use for serving drinks, snacks or decorative displays." }),
]

export function getProductBySlug(slug) {
  return products.find((product) => product.slug === slug)
}

export function getProductsByCategory(categorySlug) {
  return products.filter((product) => product.categorySlug === categorySlug)
}
