-- Zahid Exports B2B catalogue and quote-request schema.
-- Buyers browse and submit enquiries without creating accounts. Only staff accounts
-- explicitly added to public.admin_users can use the admin dashboard.

create extension if not exists pgcrypto;

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  created_at timestamptz not null default now()
);

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  sku text not null unique,
  name text not null,
  slug text not null unique,
  category_id uuid references public.categories(id) on delete set null,
  material text not null default '',
  finish text not null default '',
  dimensions text not null default '',
  lead_time text not null default '',
  description text not null default '',
  image_urls text[] not null default '{}',
  applications text[] not null default '{}',
  moq text not null default '',
  featured boolean not null default false,
  status text not null default 'draft' check (status in ('draft', 'published')),
  seo_title text not null default '',
  seo_description text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.enquiries (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  company text not null,
  email text not null,
  country text not null default '',
  message text not null default '',
  items jsonb not null default '[]'::jsonb check (jsonb_typeof(items) = 'array'),
  status text not null default 'new' check (status in ('new', 'contacted', 'quoted', 'closed')),
  internal_notes text not null default ''
);

create index if not exists products_category_status_idx on public.products(category_id, status);
create index if not exists products_featured_status_idx on public.products(featured, status);
create index if not exists enquiries_created_at_idx on public.enquiries(created_at desc);
create index if not exists enquiries_status_idx on public.enquiries(status);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists categories_set_updated_at on public.categories;
create trigger categories_set_updated_at
before update on public.categories
for each row execute function public.set_updated_at();

drop trigger if exists products_set_updated_at on public.products;
create trigger products_set_updated_at
before update on public.products
for each row execute function public.set_updated_at();

-- Safe for use in row-level security policies; callers cannot modify admin membership.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.admin_users as admins
    where admins.user_id = auth.uid()
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

alter table public.admin_users enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.enquiries enable row level security;

create policy "Staff can read their own admin membership"
on public.admin_users for select to authenticated
using (user_id = auth.uid());

create policy "Public can read active categories"
on public.categories for select to anon, authenticated
using (is_active or public.is_admin());

create policy "Staff can manage categories"
on public.categories for all to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "Public can read published products"
on public.products for select to anon, authenticated
using (status = 'published' or public.is_admin());

create policy "Staff can manage products"
on public.products for all to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "Visitors can submit quote enquiries"
on public.enquiries for insert to anon, authenticated
with check (
  status = 'new'
  and internal_notes = ''
  and jsonb_typeof(items) = 'array'
  and char_length(trim(name)) between 1 and 120
  and char_length(trim(company)) between 1 and 160
  and char_length(trim(email)) between 3 and 254
  and char_length(message) <= 5000
);

create policy "Staff can read and manage enquiries"
on public.enquiries for all to authenticated
using (public.is_admin())
with check (public.is_admin());

grant select on public.categories, public.products to anon, authenticated;
grant insert, update, delete on public.categories, public.products to authenticated;
grant insert on public.enquiries to anon, authenticated;
grant select, update on public.enquiries to authenticated;
grant select on public.admin_users to authenticated;

-- Public images are readable by buyers; uploads and changes are restricted to staff.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'product-images',
  'product-images',
  true,
  10485760,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

create policy "Anyone can view catalogue images"
on storage.objects for select to anon, authenticated
using (bucket_id = 'product-images');

create policy "Staff can upload catalogue images"
on storage.objects for insert to authenticated
with check (bucket_id = 'product-images' and public.is_admin());

create policy "Staff can update catalogue images"
on storage.objects for update to authenticated
using (bucket_id = 'product-images' and public.is_admin())
with check (bucket_id = 'product-images' and public.is_admin());

create policy "Staff can delete catalogue images"
on storage.objects for delete to authenticated
using (bucket_id = 'product-images' and public.is_admin());

-- Seed a representative selection from the existing Zahid Exports catalogue.
-- Product photos initially reference the public legacy WordPress image URLs; staff can
-- upload them into Supabase Storage later from the product editor.
insert into public.categories (name, slug, sort_order) values
  ('Planters', 'planters', 1),
  ('Bowls', 'bowls', 2),
  ('Side Tables', 'side-tables', 3),
  ('Wooden Trays', 'wooden-trays', 4),
  ('Wall Art & Clocks', 'wall-art', 5),
  ('Wall Mirrors', 'wall-mirrors', 6),
  ('Watering Cans', 'watering-cans', 7),
  ('Jugs', 'jugs', 8),
  ('Animal Stands', 'animal-stands', 9),
  ('Cake Stands', 'cake-stands', 10),
  ('Candle Holders', 'candle-holders', 11),
  ('Flower Vases', 'flower-vases', 12),
  ('Lanterns', 'lanterns', 13),
  ('Metal Tables', 'metal-tables', 14),
  ('Metal Trays', 'metal-trays', 15),
  ('Wooden Bowls', 'wooden-bowls', 16)
on conflict (slug) do update set
  name = excluded.name,
  sort_order = excluded.sort_order,
  is_active = true;

-- Remove placeholder product rows used by the first catalogue prototype, if present.
delete from public.products
where sku in ('ZE-CAKESTAND-ZE-3446Y', 'ZE-CAKESTAND-ZE-3446X', 'ZE-CAKESTAND-ZE-3446W');

insert into public.products (
  sku, name, slug, category_id, material, finish, description, image_urls, applications,
  featured, status, seo_title, seo_description
)
select
  seed.sku,
  seed.name,
  seed.slug,
  categories.id,
  seed.material,
  seed.finish,
  seed.description,
  seed.image_urls,
  seed.applications,
  seed.featured,
  'published',
  seed.seo_title,
  seed.seo_description
from (values
  ('ZE-PLANTER-3201X', 'Sculpted Metal Planter', 'ze-planter-3201x', 'planters', 'Metal', 'Available on enquiry', 'A sculptural metal planter designed to bring greenery into focus. Its considered profile suits residential interiors, boutique retail and hospitality projects. Ask our team about available sizes, finishes and wholesale quantities.', array['https://zahidexports.com/wp-content/uploads/2024/05/ZE-3201X.jpg?v=1750924214']::text[], array['Home décor', 'Retail', 'Hospitality']::text[], true, 'ZE-PLANTER-3201X Metal Planter | Zahid Exports', 'Explore the ZE-PLANTER-3201X metal planter for wholesale, retail and hospitality projects.'),
  ('ZE-PLANTER-3198Y', 'Contemporary Metal Planter', 'ze-planter-3198y', 'planters', 'Metal', 'Available on enquiry', 'A contemporary planter from Zahid Exports metal décor collection. Designed to complement indoor and outdoor greenery, with finish and order details available on request.', array['https://zahidexports.com/wp-content/uploads/2024/05/ZE-3198Y-300x300.jpg?v=1750924215']::text[], array['Home décor', 'Retail', 'Hospitality']::text[], false, 'ZE-PLANTER-3198Y Metal Planter | Zahid Exports', 'Request wholesale details for the ZE-PLANTER-3198Y metal planter.'),
  ('ZE-PLANTER-3198X', 'Modern Metal Planter', 'ze-planter-3198x', 'planters', 'Metal', 'Available on enquiry', 'A refined metal planter for curated interior and outdoor settings. Contact Zahid Exports for specifications, finish options and bulk-order information.', array['https://zahidexports.com/wp-content/uploads/2024/05/ZE-3198X-300x300.jpg?v=1750924215']::text[], array['Home décor', 'Retail', 'Hospitality']::text[], false, 'ZE-PLANTER-3198X Metal Planter | Zahid Exports', 'Discover the ZE-PLANTER-3198X planter for B2B and hospitality enquiries.'),
  ('ZE-BOWL-3219W', 'Artisan Metal Serving Bowl', 'ze-bowl-3219w', 'bowls', 'Metal', 'Available on enquiry', 'A metal serving bowl that pairs practical use with a polished tabletop presence. Suitable for serving, styling and hospitality settings; enquire for finish and wholesale options.', array['https://zahidexports.com/wp-content/uploads/2024/05/ZE-3219W.jpg?v=1750924538']::text[], array['Dining', 'Hospitality', 'Home décor']::text[], true, 'ZE-BOWL-3219W Metal Bowl | Zahid Exports', 'Explore the ZE-BOWL-3219W metal serving bowl for wholesale and hospitality.'),
  ('ZE-BOWL-3219V', 'Decorative Metal Bowl', 'ze-bowl-3219v', 'bowls', 'Metal', 'Available on enquiry', 'A versatile metal bowl for serving or decorative display. A considered addition to retail assortments, dining spaces and hospitality collections.', array['https://zahidexports.com/wp-content/uploads/2024/05/ZE-3219V-300x300.jpg?v=1750924538']::text[], array['Dining', 'Hospitality', 'Retail']::text[], false, 'ZE-BOWL-3219V Metal Bowl | Zahid Exports', 'Request B2B details for the ZE-BOWL-3219V decorative metal bowl.'),
  ('ZE-ST-3251O', 'Metal Side Table', 'ze-st-3251o', 'side-tables', 'Metal', 'Available on enquiry', 'A stylish metal side table designed to bring function and a refined accent to living and bedroom spaces. Ask about finish options, specifications and export quantities.', array['https://zahidexports.com/wp-content/uploads/2024/05/ZE-3251O.jpg?v=1750924200']::text[], array['Living spaces', 'Hospitality', 'Interior projects']::text[], true, 'ZE-ST-3251O Metal Side Table | Zahid Exports', 'Discover the ZE-ST-3251O metal side table for trade and hospitality projects.'),
  ('ZE-ST-3251N', 'Contemporary Side Table', 'ze-st-3251n', 'side-tables', 'Metal', 'Available on enquiry', 'A contemporary metal side table suited to coordinated furniture and décor collections. Contact us for product specifications and wholesale details.', array['https://zahidexports.com/wp-content/uploads/2024/05/ZE-3251N-300x300.jpg?v=1750924200']::text[], array['Living spaces', 'Retail', 'Hospitality']::text[], false, 'ZE-ST-3251N Side Table | Zahid Exports', 'Request wholesale information for the ZE-ST-3251N side table.'),
  ('ZE-WT-3224R', 'Handcrafted Wooden Tray', 'ze-wt-3224r', 'wooden-trays', 'Wood', 'Available on enquiry', 'A multipurpose wooden tray for serving, organising or displaying décor. Its natural character brings warmth to retail, dining and hospitality collections.', array['https://zahidexports.com/wp-content/uploads/2024/05/ZE-3224R.jpg?v=1750924159']::text[], array['Dining', 'Hospitality', 'Home décor']::text[], true, 'ZE-WT-3224R Wooden Tray | Zahid Exports', 'Explore the ZE-WT-3224R wooden tray for wholesale and hospitality.'),
  ('ZE-WT-3224Z5', 'Wooden Serving Tray', 'ze-wt-3224z5', 'wooden-trays', 'Wood', 'Available on enquiry', 'A warm, versatile serving and display piece from the Zahid Exports wooden tray collection. Ask our team about availability and bulk orders.', array['https://zahidexports.com/wp-content/uploads/2024/05/ZE-3224Z5-300x300.jpg?v=1750924158']::text[], array['Dining', 'Retail', 'Home décor']::text[], false, 'ZE-WT-3224Z5 Wooden Tray | Zahid Exports', 'Request B2B details for the ZE-WT-3224Z5 wooden serving tray.'),
  ('ZE-WM-3176Z', 'Metal Frame Wall Mirror', 'ze-wm-3176z', 'wall-mirrors', 'Metal and mirror', 'Available on enquiry', 'A statement wall mirror with a crafted metal frame, designed to add depth and character to interiors. Suitable for retail, hospitality and interior-design projects.', array['https://zahidexports.com/wp-content/uploads/2024/05/ZE-3176Z.jpg?v=1750924180']::text[], array['Interior projects', 'Retail', 'Hospitality']::text[], true, 'ZE-WM-3176Z Metal Wall Mirror | Zahid Exports', 'Discover the ZE-WM-3176Z wall mirror for wholesale and interior projects.'),
  ('ZE-WA-3177M', 'Decorative Metal Wall Art', 'ze-wa-3177m', 'wall-art', 'Metal', 'Available on enquiry', 'A decorative metal wall accent from Zahid Exports wall-art range. Designed to create a distinctive focal point across residential, retail and hospitality settings.', array['https://zahidexports.com/wp-content/uploads/2024/05/ZE-3177M-300x300.jpg?v=1750924198']::text[], array['Home décor', 'Retail', 'Hospitality']::text[], false, 'ZE-WA-3177M Metal Wall Art | Zahid Exports', 'Request wholesale details for the ZE-WA-3177M decorative wall-art piece.'),
  ('ZE-WAC-3162G', 'Decorative Metal Watering Can', 'ze-wac-3162g', 'watering-cans', 'Metal', 'Available on enquiry', 'A decorative watering can that brings a crafted touch to gardening and home décor collections. Ask us about product details, finish options and wholesale quantities.', array['https://zahidexports.com/wp-content/uploads/2024/05/ZE-3162G-1-300x300.jpg?v=1750924174']::text[], array['Garden décor', 'Retail', 'Home décor']::text[], true, 'ZE-WAC-3162G Watering Can | Zahid Exports', 'Explore the ZE-WAC-3162G metal watering can for B2B enquiries.'),
  ('ZE-JUG-3208T', 'Metal Serving Jug', 'ze-jug-3208t', 'jugs', 'Metal', 'Available on enquiry', 'A metal jug that pairs practical serving with a distinctive tabletop presence. It can also be styled as a decorative centrepiece; enquire about finish and wholesale options.', array['https://zahidexports.com/wp-content/uploads/2024/05/ZE-3208T.jpg?v=1750924324']::text[], array['Dining', 'Hospitality', 'Home décor']::text[], false, 'ZE-JUG-3208T Metal Jug | Zahid Exports', 'Discover the ZE-JUG-3208T metal serving jug for B2B and hospitality enquiries.')
) as seed(sku, name, slug, category_slug, material, finish, description, image_urls, applications, featured, seo_title, seo_description)
join public.categories on categories.slug = seed.category_slug
on conflict (sku) do update set
  name = excluded.name,
  slug = excluded.slug,
  category_id = excluded.category_id,
  material = excluded.material,
  finish = excluded.finish,
  description = excluded.description,
  image_urls = excluded.image_urls,
  applications = excluded.applications,
  featured = excluded.featured,
  status = excluded.status,
  seo_title = excluded.seo_title,
  seo_description = excluded.seo_description;

-- MANUAL STAFF SETUP (run after creating the staff user in Supabase Authentication):
-- insert into public.admin_users (user_id, email)
-- select id, email from auth.users where email = 'staff@example.com';
-- Do not add buyer/customer accounts to admin_users.
