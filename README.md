# OiAI — Oops! I Ate It.

Next.js 15 App Router implementation of the supplied OiAI catalogue design. The original page is split into reusable React section components, its original CSS is kept in `src/app/oiai.css`, its interactive behaviour is isolated in `src/lib/oiai-interactions.ts`, and its embedded photography is stored as local files under `public/images/oiai/`.

## Design fidelity ..

The source CSS and original image bytes are preserved. The implementation does not intentionally change font sizes, image dimensions, spacing, proportions, breakpoints, or animation styling. The page markup is converted into React components while retaining the original class names and IDs used by the styles and interactions.

## Structure

- `src/components/oiai/`: page shell and reusable sections (sidebar, hero, categories, product shelf, story, process, moments, gifting, newsletter, footer, drawers and modals).
- `src/app/oiai.css`: original design stylesheet.
- `src/lib/oiai-interactions.ts`: original client-side catalogue, cart, quick-view, feedback, animation, and interaction logic.
- `src/data/oiai-images.json`: local image path registry used by the interaction layer.
- `public/images/oiai/`: original embedded image assets extracted without resizing or recompression.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Docker

The Dockerfile installs from `package.json` with `npm install`. For repeatable production builds, switch that step to `npm ci` (a `package-lock.json` is now committed).

```bash
docker build -t oiai-catalogue .
docker run -d --name oiai-catalogue -p 3000:3000 --restart unless-stopped oiai-catalogue
```

The app listens on port 3000. Put Nginx or another reverse proxy in front for public hosting and HTTPS.

## Existing product-detail route

The starter project’s `/products/[slug]` route remains available with its original sample catalogue data. The homepage product shelf is not wired to that separate legacy route.

## Important functional note

Products are stored in Supabase (`products` table, served by `/api/products`) with a local fallback in `src/data/fallback-products.ts`. Feedback, orders, newsletter sign-ups and site settings are also stored in Supabase. Homepage product cards open the taste-note feedback form; the cart and UPI checkout code is retained but disconnected. See `docs/ARCHITECTURE.md`.


## Supabase configuration

Copy `.env.example` to `.env.local` and set `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` and `ADMIN_PASSWORD`, then run `npm install` and `npm run dev`. The schema is in `supabase/schema.sql`; the admin panel is at `/admin`.
