export const categories = [
  { id: "animal-stand", name: "Animal Stands", slug: "animal-stands", productCount: 540 },
  { id: "bowls", name: "Bowls", slug: "bowls", productCount: 96 },
  { id: "cake-stand", name: "Cake Stands", slug: "cake-stands", productCount: 220 },
  { id: "candle-holder", name: "Candle Holders", slug: "candle-holders", productCount: 340 },
  { id: "flower-vase", name: "Flower Vases", slug: "flower-vases", productCount: 257 },
  { id: "lantern", name: "Lanterns", slug: "lanterns", productCount: 131 },
  { id: "metal-table", name: "Metal Tables", slug: "metal-tables", productCount: 279 },
  { id: "metal-tray", name: "Metal Trays", slug: "metal-trays", productCount: 179 },
  { id: "planter", name: "Planters", slug: "planters", productCount: 74 },
  { id: "side-table", name: "Side Tables", slug: "side-tables", productCount: 49 },
  { id: "wall-art", name: "Wall Art", slug: "wall-art", productCount: 38 },
  { id: "wall-mirror", name: "Wall Mirrors", slug: "wall-mirrors", productCount: 23 },
  { id: "wooden-bowl", name: "Wooden Bowls", slug: "wooden-bowls", productCount: 36 },
  { id: "wooden-tray", name: "Wooden Trays", slug: "wooden-trays", productCount: 20 },
]

export function getCategoryBySlug(slug) {
  return categories.find((category) => category.slug === slug)
}
