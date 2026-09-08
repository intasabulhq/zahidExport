export const categories = [
  {
    id: "animal-stand",
    name: "Animal Stands",
    slug: "animal-stands",
    productCount: 540,
    description: "Explore handcrafted metal animal stands from Zahid Exports, a Moradabad manufacturer and exporter supplying decorative collections for retailers, hospitality buyers and interior projects.",
    keywords: ["metal animal stand manufacturer", "animal decor exporter India", "wholesale animal sculpture stand"],
  },
  {
    id: "bowls",
    name: "Bowls",
    slug: "bowls",
    productCount: 96,
    description: "Source decorative metal bowls from Moradabad for wholesale home decor, hospitality presentation, gifting and international retail collections.",
    keywords: ["decorative metal bowl manufacturer", "wholesale bowls India", "Moradabad handicraft exporter"],
  },
  {
    id: "cake-stand",
    name: "Cake Stands",
    slug: "cake-stands",
    productCount: 220,
    description: "Discover handcrafted metal cake stands for dessert presentation, weddings, hospitality, retailers and private-label wholesale sourcing.",
    keywords: ["metal cake stand manufacturer India", "wholesale cake stands", "dessert stand exporter"],
  },
  {
    id: "candle-holder",
    name: "Candle Holders",
    slug: "candle-holders",
    productCount: 340,
    description: "Browse decorative candle holders manufactured in Moradabad for home decor retailers, hotels, events and international wholesale buyers.",
    keywords: ["metal candle holder manufacturer", "candle stand exporter India", "wholesale candle holders"],
  },
  {
    id: "flower-vase",
    name: "Flower Vases",
    slug: "flower-vases",
    productCount: 257,
    description: "Explore decorative metal flower vases for wholesale interiors, hospitality styling, gifting and global home decor collections.",
    keywords: ["metal flower vase manufacturer", "flower vase exporter India", "wholesale decorative vases"],
  },
  { id: "lantern", name: "Lanterns", slug: "lanterns", productCount: 131, description: "Source handcrafted decorative lanterns for wholesale home decor, hospitality, festive collections and global retail programmes.", keywords: ["decorative lantern manufacturer India", "metal lantern exporter", "wholesale lantern supplier"] },
  { id: "metal-table", name: "Metal Tables", slug: "metal-tables", productCount: 279, description: "Explore handcrafted metal tables made in Moradabad for homes, offices, cafés, hotels, retail collections and international interior projects.", keywords: ["metal table manufacturer India", "wholesale side table exporter", "hospitality furniture supplier"] },
  { id: "metal-tray", name: "Metal Trays", slug: "metal-trays", productCount: 179, description: "Discover decorative and serving metal trays for hospitality, gifting, retail displays and wholesale home accessory collections.", keywords: ["metal tray manufacturer Moradabad", "decorative tray exporter", "wholesale serving trays"] },
  { id: "planter", name: "Planters", slug: "planters", productCount: 74, description: "Browse metal planters and planter stands for indoor styling, gardens, hotels, retailers and international wholesale sourcing.", keywords: ["metal planter manufacturer India", "planter stand exporter", "wholesale garden decor"] },
  { id: "side-table", name: "Side Tables", slug: "side-tables", productCount: 49, description: "Source handcrafted side tables for residential interiors, hospitality projects and curated furniture retail collections.", keywords: ["side table manufacturer India", "wholesale accent tables", "Moradabad furniture exporter"] },
  { id: "wall-art", name: "Wall Art", slug: "wall-art", productCount: 38, description: "Explore decorative wall art manufactured for homes, hotels, offices, retail collections and international interior buyers.", keywords: ["metal wall art manufacturer India", "wall decor exporter", "wholesale wall art"] },
  { id: "wall-mirror", name: "Wall Mirrors", slug: "wall-mirrors", productCount: 23, description: "Discover decorative wall mirrors for hospitality, residential projects and global home furnishing retailers.", keywords: ["decorative wall mirror manufacturer", "wall mirror exporter India", "wholesale mirrors"] },
  { id: "wooden-bowl", name: "Wooden Bowls", slug: "wooden-bowls", productCount: 36, description: "Browse handcrafted wooden bowls for serving, display, gifting and international wholesale homeware collections.", keywords: ["wooden bowl manufacturer India", "wholesale wooden bowls", "handcrafted homeware exporter"] },
  { id: "wooden-tray", name: "Wooden Trays", slug: "wooden-trays", productCount: 20, description: "Explore handcrafted wooden trays for serving, tabletop styling, hospitality and wholesale homeware sourcing.", keywords: ["wooden tray manufacturer India", "wholesale serving trays", "wooden homeware exporter"] },
]

export function getCategoryBySlug(slug) {
  return categories.find((category) => category.slug === slug)
}
