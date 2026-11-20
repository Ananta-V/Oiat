# Current status

## Live
Storefront with Supabase-backed products, taste-note and memory feedback (separate thank-you overlay), editable footer contact links and sample options, animated reviews section, newsletter, admin panel (products, orders, feedback, settings & samples).
- 7 custom chocolate photos ingested with OCR mapping to catalog products and fallback data (catalog finalized to 7 products).
- Removed "Chocolate is a love language / For the people who feel like home" section.
- Replaced top announcement bar with direct "ORDER NOW" WhatsApp CTA (+91 63036 48554).
- Contact & WhatsApp ordering phone number standardized to +91 63036 48554 across all routes.
- Hero "Order Now" CTA and slide-down sticky topbar with WhatsApp ordering CTA on scroll.
- Responsive Quick View modal: desktop 2-column split (details + embedded taste note form), mobile stacked layout with WhatsApp order and feedback trigger buttons.

## Business state
Showcase + price + feedback. Online payment is intentionally off (code retained).

## In flight
None recorded.

## Known issues / watch items
- Admin password falls back to a hard-coded default in `src/lib/admin-auth.ts` if `ADMIN_PASSWORD` is unset; ensure it is set in Vercel. (Needs owner approval before changing auth.)
- `/api/orders`, `/api/feedback`, `/api/newsletter` accept unauthenticated POSTs with no rate limiting.
- No automated tests; verification is `tsc` + `next build` + visual check.
- Docs history: README previously described MongoDB; corrected to Supabase.
- Untracked duplicate Impeccable copy at `.gemini/skills/` (also installed globally); left as is by decision.
