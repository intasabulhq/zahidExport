CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS admins (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name varchar(120) NOT NULL,
  email varchar(255) NOT NULL UNIQUE,
  password_hash text NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name varchar(160) NOT NULL,
  slug varchar(180) NOT NULL UNIQUE,
  description text NOT NULL DEFAULT '',
  seo_title varchar(70) NOT NULL DEFAULT '',
  seo_description varchar(170) NOT NULL DEFAULT '',
  seo_keywords text[] NOT NULL DEFAULT '{}',
  status varchar(20) NOT NULL DEFAULT 'published' CHECK (status IN ('draft','published','archived')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  name varchar(180) NOT NULL,
  sku varchar(100) NOT NULL UNIQUE,
  slug varchar(200) NOT NULL UNIQUE,
  description text NOT NULL,
  material varchar(200) NOT NULL DEFAULT '',
  finish varchar(200) NOT NULL DEFAULT '',
  dimensions varchar(200) NOT NULL DEFAULT '',
  moq varchar(100) NOT NULL DEFAULT '',
  applications jsonb NOT NULL DEFAULT '[]',
  image_alt varchar(240) NOT NULL DEFAULT '',
  seo_title varchar(70) NOT NULL,
  seo_description varchar(170) NOT NULL,
  seo_keywords text[] NOT NULL DEFAULT '{}',
  featured boolean NOT NULL DEFAULT false,
  status varchar(20) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','published','archived')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS product_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  url text NOT NULL,
  alt_text varchar(240) NOT NULL DEFAULT '',
  position integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS enquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name varchar(120) NOT NULL,
  company varchar(180) NOT NULL DEFAULT '',
  email varchar(255) NOT NULL,
  country varchar(100) NOT NULL,
  category varchar(120) NOT NULL DEFAULT '',
  product_name varchar(180) NOT NULL DEFAULT '',
  sku varchar(100) NOT NULL DEFAULT '',
  quantity varchar(100) NOT NULL DEFAULT '',
  message text NOT NULL,
  source varchar(40) NOT NULL DEFAULT 'website',
  status varchar(20) NOT NULL DEFAULT 'new' CHECK (status IN ('new','contacted','qualified','closed')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS products_status_category_idx ON products(status, category_id);
CREATE INDEX IF NOT EXISTS products_search_idx ON products USING gin(to_tsvector('english', name || ' ' || sku || ' ' || description));
CREATE INDEX IF NOT EXISTS product_images_product_position_idx ON product_images(product_id, position);
CREATE INDEX IF NOT EXISTS enquiries_status_created_idx ON enquiries(status, created_at DESC);
