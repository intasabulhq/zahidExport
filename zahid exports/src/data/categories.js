export const categories = [
  { id: 'planters', name: 'Planters', slug: 'planters' },
  { id: 'bowls', name: 'Bowls', slug: 'bowls' },
  { id: 'side-tables', name: 'Side Tables', slug: 'side-tables' },
  { id: 'wooden-trays', name: 'Wooden Trays', slug: 'wooden-trays' },
  { id: 'wall-art', name: 'Wall Art & Clocks', slug: 'wall-art' },
  { id: 'wall-mirrors', name: 'Wall Mirrors', slug: 'wall-mirrors' },
  { id: 'watering-cans', name: 'Watering Cans', slug: 'watering-cans' },
  { id: 'jugs', name: 'Jugs', slug: 'jugs' },
  { id: 'animal-stands', name: 'Animal Stands', slug: 'animal-stands' },
  { id: 'cake-stands', name: 'Cake Stands', slug: 'cake-stands' },
  { id: 'candle-holders', name: 'Candle Holders', slug: 'candle-holders' },
  { id: 'flower-vases', name: 'Flower Vases', slug: 'flower-vases' },
  { id: 'lanterns', name: 'Lanterns', slug: 'lanterns' },
  { id: 'metal-tables', name: 'Metal Tables', slug: 'metal-tables' },
  { id: 'metal-trays', name: 'Metal Trays', slug: 'metal-trays' },
  { id: 'wooden-bowls', name: 'Wooden Bowls', slug: 'wooden-bowls' },
]

export function getCategoryBySlug(slug) {
  return categories.find((category) => category.slug === slug)
}
