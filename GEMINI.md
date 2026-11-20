# OiAI – agent rules

OiAI ("Oops! I Ate It.") is a handmade-chocolate storefront. Next.js 15 App Router, React 19, TypeScript, npm, Supabase, Vercel.
Product truth: `PRODUCT.md`. Structure and symbol map: `docs/ARCHITECTURE.md`. Why things are the way they are: `docs/DECISIONS.md`. Live status: `docs/CURRENT-STATUS.md`.
Read ARCHITECTURE.md before touching `src/lib/oiai-interactions.ts`, `src/app/admin/page.tsx` or `src/app/oiai.css`.

## Preserve
- Do not redesign. Do not change business logic, DB schema or existing integrations unless asked.
- Payments/UPI/cart code is dormant, not deleted. Keep it.
- `initializeOiAI()` looks up DOM ids directly; removing a component that owns an id used there breaks init. Check ARCHITECTURE.md first.

## Ask first (explicit approval)
- npm install / upgrade of any dependency.
- Any Supabase schema or SQL change, or writes to the `products` row `id='site_settings'`.
- Deleting or moving files (including legacy/dormant code).
- Reading or editing `.env*`. Never print secret values.
- `git push` (pushes to `main` auto-deploy to Vercel production). Push only when the user asks.

## Retrieval (cheapest first)
1. Symbol map in `docs/ARCHITECTURE.md` -> 2. grep for the symbol/id/class -> 3. read a bounded line range.
Never read `oiai.css`, `oiai-interactions.ts` or `admin/page.tsx` in full unless the task truly needs it.
Do not read: `node_modules`, `.next`, `tsconfig.tsbuildinfo`, `package-lock.json`, `oiai-product-detail (3).html`, `public/images`, `.env*`.
Use official docs (web search) only when an actual API error appears, not by default.

## Models
Strongest model for architecture, admin/auth, Supabase, multi-file changes. A faster model is fine for copy, CSS tweaks, single-file fixes. Never downgrade mid-task. Quality outranks token savings.

## Verify
- `npx tsc --noEmit` after edits; `npx next build` before any push. PowerShell: chain with `;`, not `&&`.
- UI changes: screenshot at shipped sizes before claiming done. No test suite exists; do not claim tests passed.

## Memory
After a milestone, propose a 2-5 line update to DECISIONS.md / CURRENT-STATUS.md and write it only after the user agrees.
If a doc contradicts the code, trust the code and flag the doc.
Prefer a new conversation per feature once earlier context is irrelevant.

## Skills (load only when relevant)
`.agents/skills/oiai-storefront-runtime` (homepage runtime, feedback modal) · `.agents/skills/oiai-admin-supabase` (admin, API, Supabase). Design/UI work: Impeccable.
