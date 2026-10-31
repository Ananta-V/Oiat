# OiAI — Oops! I Ate It.

Next.js 15 App Router implementation of the supplied OiAI catalogue design. The original page is split into reusable React section components, its original CSS is kept in `src/app/oiai.css`, its interactive behaviour is isolated in `src/lib/oiai-interactions.ts`, and its embedded photography is stored as local files under `public/images/oiai/`.

## Design fidelity

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

This starter archive did not include `package-lock.json`, so the Docker dependency stage uses `npm install`. For repeatable production builds, run `npm install` locally once, commit the generated `package-lock.json`, and change the Docker dependency step to `npm ci`.

```bash
docker build -t oiai-catalogue .
docker run -d --name oiai-catalogue -p 3000:3000 --restart unless-stopped oiai-catalogue
```

The app listens on port 3000. Put Nginx or another reverse proxy in front for public hosting and HTTPS.

## Existing product-detail route

The starter project’s `/products/[slug]` route remains available with its original sample catalogue data. The OiAI homepage keeps its supplied quick-view experience; its product shelf is not currently wired to that separate legacy route.

## Important functional note

The product catalogue and its product details remain in the local project data and local image assets; MongoDB is not used for products. Only feedback form submissions are written to the MongoDB `feedback` collection through `/api/feedback`. The feedback thank-you state is shown only after MongoDB confirms the insert. The cart and checkout remain demo-only; this project does not add payment processing, order storage, or email delivery.


## MongoDB for feedback only

Copy `.env.example` to `.env.local`, set `MONGODB_URI` and `MONGODB_DB=oiai`, then run `npm install` and `npm run dev`. Feedback submissions store the customer name, email, selected sample/category, rating, feelings, written note, associated local product ID/name when available, page path and server timestamp in the `feedback` collection. The app does not read or write the `products` collection.
