# Current status

## Live
Storefront with Supabase-backed products, taste-note and memory feedback (separate thank-you overlay), editable footer contact links and sample options, animated reviews section, newsletter, admin panel (products, orders, feedback, settings & samples).

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
