export const products = [
  {
    id: "ZE-CAKESTAND-ZE-3446Y",
    name: "Cake Stand",
    slug: "ze-cakestand-ze-3446y",
    category: "Cake Stands",
    categorySlug: "cake-stands",
    material: "Metal",
    finish: "Premium Finish",
    description: "A decorative cake stand designed for elegant product presentation, dining spaces and hospitality environments.",
    images: [],
    applications: ["Dining", "Hospitality", "Retail", "Home Decor"],
    moq: "",
    featured: true,
    status: "published",
    seo: {
      title: "Cake Stand | Zahid Exports",
      description: "Explore cake stands from Zahid Exports for wholesale, hospitality and interior applications.",
    },
  },
  {
    id: "ZE-CAKESTAND-ZE-3446X",
    name: "Cake Stand",
    slug: "ze-cakestand-ze-3446x",
    category: "Cake Stands",
    categorySlug: "cake-stands",
    material: "Metal",
    finish: "Premium Finish",
    description: "A versatile cake stand created for presentation, hospitality and retail environments.",
    images: [],
    applications: ["Dining", "Hospitality", "Retail"],
    moq: "",
    featured: true,
    status: "published",
    seo: {
      title: "Cake Stand ZE-3446X | Zahid Exports",
      description: "Explore ZE-3446X cake stand from Zahid Exports.",
    },
  },
  {
    id: "ZE-CAKESTAND-ZE-3446W",
    name: "Cake Stand",
    slug: "ze-cakestand-ze-3446w",
    category: "Cake Stands",
    categorySlug: "cake-stands",
    material: "Metal",
    finish: "Premium Finish",
    description: "A refined cake stand for dining, hospitality and decorative presentation.",
    images: [],
    applications: ["Dining", "Hospitality", "Home Decor"],
    moq: "",
    featured: false,
    status: "published",
    seo: {
      title: "Cake Stand ZE-3446W | Zahid Exports",
      description: "Explore ZE-3446W cake stand from Zahid Exports.",
    },
  },
]

export function getProductBySlug(slug) {
  return products.find((product) => product.slug === slug)
}

export function getProductsByCategory(categorySlug) {
  return products.filter((product) => product.categorySlug === categorySlug)
}
