ALTER TABLE product_images
ADD COLUMN IF NOT EXISTS public_id text;

CREATE UNIQUE INDEX IF NOT EXISTS product_images_public_id_unique_idx
ON product_images(public_id)
WHERE public_id IS NOT NULL;