# Zahid Exports API

Secure Node.js/Express foundation for products, admin authentication and B2B enquiries.

## Local setup

1. Install PostgreSQL and create a database named `zahid_exports`.
2. Copy `.env.example` to `.env` and replace every placeholder.
3. Run `npm install` inside `server`.
4. Run `npm run db:migrate`.
5. Run `npm run admin:create` once to create the first admin.
6. Run `npm run dev`.

The API starts on `http://localhost:4000`. The Vite frontend proxies `/api` to this server.

## Initial endpoints

- `GET /api/health`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `POST /api/auth/logout`
- `GET /api/products`
- `GET /api/products/:slug`
- `POST /api/products` — admin only
- `PATCH /api/products/:id` — admin only
- `DELETE /api/products/:id` — admin only; archives the product
- `POST /api/enquiries`
- `GET /api/enquiries` — admin only
- `PATCH /api/enquiries/:id/status` — admin only

Never commit `.env` or real admin credentials.
