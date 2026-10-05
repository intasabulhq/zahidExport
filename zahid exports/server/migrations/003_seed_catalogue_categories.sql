INSERT INTO categories (name, slug, status)
VALUES
  ('Animal Stands', 'animal-stands', 'published'),
  ('Bowls', 'bowls', 'published'),
  ('Cake Stands', 'cake-stands', 'published'),
  ('Candle Holders', 'candle-holders', 'published'),
  ('Flower Vases', 'flower-vases', 'published'),
  ('Lanterns', 'lanterns', 'published'),
  ('Metal Tables', 'metal-tables', 'published'),
  ('Metal Trays', 'metal-trays', 'published'),
  ('Planters', 'planters', 'published'),
  ('Side Tables', 'side-tables', 'published'),
  ('Wall Art', 'wall-art', 'published'),
  ('Wall Mirrors', 'wall-mirrors', 'published'),
  ('Wooden Bowls', 'wooden-bowls', 'published'),
  ('Wooden Trays', 'wooden-trays', 'published')
ON CONFLICT (slug) DO NOTHING;
