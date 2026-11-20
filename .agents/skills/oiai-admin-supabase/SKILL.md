---
name: oiai-admin-supabase
description: Use when editing the /admin panel, any app/api route, Supabase access, admin auth, site settings, categories, orders or feedback data.
---

# OiAI admin + Supabase

Routes, tables and admin symbol map: `docs/ARCHITECTURE.md`.

## Rules
- Server code uses `getSupabaseAdmin()` (service role if set) from `src/lib/supabase.ts`. Never expose the service key client-side; never print env values; never open `.env*` without approval.
- Admin routes must call `checkAdminAuth()` first. Public POST routes have no auth/rate limit (known issue); do not widen what they expose.
- Settings (`whatsapp`, `instagram`, `email`, `sampleOptions`) are JSON in `products` row `id='site_settings'` (D3). `/api/products` excludes it via `is_active=false`; `/api/admin/products` filters `__settings__`. Keep both filters when changing product queries, and do not render that row as a product.
- Category rename must stay a single server call (D7). Admin price field stays text/numeric (D6).
- No schema/SQL changes or settings-row writes without explicit approval. Existing schema: `supabase/schema.sql`, `SUPABASE_SCHEMA.md`.
- Admin page is one ~1650-line client component; read the needed handler/tab by line range from the symbol map, not the whole file.

## Verify
`npx tsc --noEmit`, `npx next build`. For API behaviour use a small node script like `scratch_check_supa.js` (reads `.env.local` itself; do not echo values).
