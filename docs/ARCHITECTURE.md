# Architecture (verified against code; line numbers drift, re-grep if off)

## Shape
- Single public page `src/app/page.tsx` -> `OiAIExperience` (server components in `src/components/oiai/*`, mostly static markup using original class names/ids) + `OiAIRuntime` (client) which calls `initializeOiAI()` in `src/lib/oiai-interactions.ts`.
- `/admin` = one client component (`src/app/admin/page.tsx`), cookie session (`oiai_admin_session`, 7 days, HMAC) via `src/lib/admin-auth.ts`.
- Styling: `src/app/oiai.css` (storefront, ~228 KB, later override blocks appended at the END win via `!important`; grep the selector before editing), `src/app/admin/admin.css`, `src/app/globals.css`.
- Deploy: Vercel (auto on push to `main`). `next.config.ts` uses `output: standalone` (Docker). Local `next build` on Windows may print a standalone-copy ENOENT after compiling; the compile and page generation are the real signal.

## Live page tree (`OiAISiteLayout`)
Sidebar, Scrim, Announcement, Topbar, Hero, Promises, Categories, ProductShelf, Story, Process, Moments, Reviews, Gifting, Newsletter, Footer. Overlays in `OiAIExperience`: Intro, CartDrawer, ModalBackdrop, QuickViewModal, FeedbackBackdrop, FeedbackModal (+ `#feedback-success-overlay`), Toasts.
Client-fetching components: `OiAIFooter` and `OiAIFeedbackModal` -> `/api/site-settings`; `OiAIReviews` -> `/api/feedback`.

## Data / API (Supabase tables: products, orders, feedback, subscribers)
| Route | Methods | Admin auth | Notes |
|---|---|---|---|
| `/api/products` | GET | no | `is_active=true` only; falls back to `src/data/fallback-products.ts` |
| `/api/feedback` | POST | no | writes `feedback` |
| `/api/orders` | POST | no | dormant flow (payment/quick-view) |
| `/api/newsletter` | POST | no | `subscribers` |
| `/api/site-settings` | GET public, POST admin | POST only | JSON in `products` row `id='site_settings'` (`notes`): whatsapp, instagram, email, sampleOptions |
| `/api/admin/products` | GET, POST, DELETE | yes | filters out `__settings__` row; POST `{renameCategory:{from,to}}` renames atomically |
| `/api/admin/orders` `/feedback` `/subscribers` `/stats` | various | yes | |
| `/api/admin/login` `/logout` | POST | no | |
Admin UI polls products/orders/feedback every 5 s.

## `oiai-interactions.ts` symbol map (1300 lines)
`initializeOiAI` 6 · cart load/save 44/52 · `productCard` 58 · `renderProducts` 84 · `escapeHTML` 104 · `renderCart` 113 · toasts 134/141 · `addToCart` 147 · `openCart/closeCart` 163/171 · **dormant payment/quick-view region 177-660** (`openQuickView` 181 short-circuits to `openFeedback`; `renderProductDetail` 207; UPI id const 208; `/api/orders` fetch 444; `closeQuickView` 519; `generateReceiptImage` 543) · `setFilter` 664 · `openFeedback` 684 (modes below) · `closeFeedback` 889 · `closeSuccessOverlay` 912 · feedback submit handler ~920-960 · product shelf listeners 984 · scroll/sidebar sync 1082 · cocoa dust canvas 1099 · intro animation 1122-1260 · live products fetch 1257.
`window` globals: `openQuickView`, `closeQuickView`, `openFeedback` (537-540).
Card routing: `#product-grid` cards and `[data-feedback-open]` -> `openFeedback`; `[data-memory-open]` (Moments cards) -> `openFeedback(context)` in memory mode.
Feedback modes (`currentFeedbackMode`): `taste_note` (product/chocolate; dropdown from `sampleOptions`) vs `memory` (story; fixed moment options). `openFeedback` rewrites titles, legends, rating labels (`#rating-label-1..5`), chip 6, art copy, placeholder, submit text.

## `admin/page.tsx` symbol map (1650 lines)
Types 30-81 · `AdminPage` 88 · `checkAuthAndLoad` 186 · `loadSettings` 211 · sample options add/remove 230/245 · `handleSaveSettings` 253 · loaders 277-301 · `handleLogin` 313 · `handleSaveProduct` 347 · `handleUpdateOrderStatus` 375 · `handleDeleteFeedback` 395 · category create/rename 423/442 · CSV export 487 · JSX tabs: Products 758, Orders 955, Feedback 1052, Settings & Samples 1159; modals follow.

## Legacy / dormant (KEEP; not wired to homepage; do not delete without approval)
`components/product-card.tsx`, `product-catalogue.tsx`, `contact-form.tsx`, `rating-preview.tsx`, `data/products.ts`, route `/products/[slug]` (own sample data); payment/receipt/quick-view code above; `OiAIQuickViewModal`, `OiAICartDrawer`, `OiAIHiddenCartControls` (kept because init binds their ids); root file `oiai-product-detail (3).html` (1.4 MB reference, ignore).
