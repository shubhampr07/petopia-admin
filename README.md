# Petopia Admin

A standalone **Next.js 16 + shadcn/ui** admin panel for the Petopia store. It is a
separate app/repo from `petopia-ui` (the storefront) and `petopia-server` (the API).

The admin panel is a **pure frontend** — it talks only to the admin API exposed by
`petopia-server` under `/api/admin/*`. It never connects to the database directly.

## What you can manage

- **Dashboard** — counts, total revenue, recent orders & bookings
- **Products** — full CRUD (price, brand, category, pet, badges, bestseller / new-arrival flags, description, highlights)
- **Brands** — full CRUD + "sync from existing products"
- **Adopt Pets** — full CRUD
- **Orders** — list, filter by status, view detail, update status, delete
- **Service Bookings** — list, filter by service, view submitted details, delete
- **Users** — list/search, view profile with orders/wishlist/bookings, delete

## Architecture

```
petopia-admin (this app, Next.js + shadcn/ui, port 3001)
        │  fetch + Bearer admin JWT
        ▼
petopia-server  /api/admin/*   (Express, port 4000)
        │
        ▼
   PostgreSQL (shared with the storefront)
```

- UI built with **shadcn/ui** (new-york style) on Tailwind v4.
- Data is fetched in Server Components; mutations run through Server Actions that
  call the admin API with the admin's Bearer token.
- **Auth**: the login form posts to the server's `POST /api/admin/login`. The
  returned admin JWT is stored in an httpOnly cookie and attached as a Bearer token
  on every subsequent admin request. The `(admin)` layout validates the token on
  each navigation via `GET /api/admin/me`.

## Setup

1. **Server side** — in `petopia-server/.env`, set admin credentials and run the DB
   push (a new additive `Brand` table was added — it does not affect existing data):

   ```
   ADMIN_EMAIL="admin@petopia.com"
   ADMIN_PASSWORD="your-strong-password"
   JWT_ADMIN_SECRET="a-long-random-string"
   ```

   ```bash
   cd ../petopia-server
   npm run db:push      # creates the Brand table (additive, safe)
   npm run dev          # API on http://localhost:4000
   ```

2. **Admin panel**

   ```bash
## Deployment env vars

| Platform | Variable | Value |
|----------|----------|-------|
| **Vercel / Render (this app)** | `ADMIN_API_URL` | `https://petopia-server-d7og.onrender.com` (your API URL, no trailing slash) |

## Test credentials (stored in database — run `npm run seed` on petopia-server)

| Portal | Email | Password |
|--------|-------|----------|
| **Admin** | `admin@petopia.com` | `Petopia@Admin1` |
| **Grooming manager** | `grooming@petopia.ae` | `Petopia@Manager1` |
| **Grooming groomer** | `g01@petopia.ae` | `Petopia@G01` |

Admin credentials live in the **`AdminStaff`** table on petopia-server (not env vars).
   npm install
   npm run dev                # admin on http://localhost:3001
   ```

3. Open http://localhost:3001 and sign in with the `ADMIN_EMAIL` / `ADMIN_PASSWORD`
   you configured on the server.

## Notes

- `Product` and `AdoptPet` IDs mirror the storefront seed (no DB auto-increment), so
  the server assigns the next free id on create (products ≥ 1000, adopt pets ≥ 301)
  to avoid colliding with seeded ids.
- Deleting a product or user referenced by existing orders is blocked with a clear
  message — handle the orders first.
