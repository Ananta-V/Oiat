---
name: oiai-storefront-runtime
description: Use when editing the homepage runtime in src/lib/oiai-interactions.ts, the feedback/thank-you modals, product cards, Moments cards, filters, cart/quick-view remnants, or any DOM id the runtime binds.
---

# OiAI storefront runtime

Map and line anchors: `docs/ARCHITECTURE.md` (do not duplicate here).

## Rules
- Most markup is server components in `src/components/oiai/*`; behaviour is bound by id/class in `initializeOiAI()`. Before changing or removing markup, grep the id in `oiai-interactions.ts`. Many binds are direct (`$('#x').addEventListener`) and throw on null.
- Product cards come from `productCard()`/`renderProducts()` (+ `/api/products`, fallback data) and open `openFeedback`. Do not reconnect `openQuickView`/payment unless the user asks (D1).
- Feedback modal has two modes (`taste_note`, `memory`). Any new label that differs by mode needs an id in `OiAIFeedbackModal.tsx` and a branch in `openFeedback`. Submit handler reads `currentFeedbackMode` for the thank-you copy.
- Moments cards use `data-memory-open="<moment>"`; chocolate cards/links use `data-feedback-open`.
- Thank-you is `#feedback-success-overlay`, shown via `style.display='flex'`.
- CSS: `src/app/oiai.css` is huge; grep the selector, append overrides at the END of the file, keep the existing look.

## Verify
`npx tsc --noEmit`, then `npx next build`; click-test the card and modal flows visually.
