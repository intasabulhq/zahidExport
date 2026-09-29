# Zahid Exports

A B2B product catalogue and quote-request website built with React, Vite, React Router and Tailwind CSS. Buyers can browse the public catalogue and submit quote requests without creating an account. Staff use the separate `/admin` area to manage products, categories and enquiries.

## Run locally

```bash
cd "zahid exports"
npm ci
npm run dev
```

The public website runs using sample data until Supabase is configured. The staff dashboard and quote submission require Supabase.

## Supabase setup

1. Create a Supabase project.
2. Copy `.env.example` to `.env.local` and set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` from the project API settings. The browser must only receive the public anon/publishable key—never a service-role key.
3. Run [`supabase/migrations/202609290001_b2b_catalog_and_enquiries.sql`](supabase/migrations/202609290001_b2b_catalog_and_enquiries.sql) in the Supabase SQL Editor. It creates the catalogue, enquiries, product-image bucket and row-level security policies, and seeds the current sample categories/products.
4. In Supabase Auth settings, disable public sign-ups. Create staff users from the Supabase dashboard, then grant dashboard access only to approved staff by running the commented `admin_users` insert at the end of the migration with that staff user's email.
5. Start or restart Vite after updating `.env.local`. Staff sign in at `/admin`; buyers do not sign in and can send quote requests from `/contact` or a product detail page.

The admin dashboard verifies staff membership in the database. Product, category, image and enquiry access is also guarded by Supabase row-level security. The public key is safe to use in the browser only with these policies enabled.

## Available scripts

- `npm run dev` — start the local Vite server
- `npm run build` — build the production site
- `npm run preview` — preview the production build
- `npm run lint` — run ESLint
