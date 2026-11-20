# Decisions (append-only; add via the milestone rule in GEMINI.md)

| ID | Decision | Why | Ref |
|---|---|---|---|
| D1 | Product cards open the taste-note feedback form, not a buying modal. Quick-view/payment code is kept but disconnected (modal hidden by CSS, `openQuickView` redirects). | Current business state: show products and price, collect feedback, no online payment. | 58afc3c, cc5e22c |
| D2 | Feedback thank-you is a separate overlay `#feedback-success-overlay`, not inline. | Inline message appeared below the fold. | cc5e22c |
| D3 | Site settings live in the `products` table as row `id='site_settings'`, `category='__settings__'`, `is_active=false`, JSON in `notes`. | No `site_settings` table exists and schema changes need approval. Row is excluded by `is_active` on the public API and filtered in the admin API. | 4adab90 |
| D4 | Feedback "sample" dropdown options are editable in admin and stored in the same settings JSON (`sampleOptions`). | Owner wants to edit options without code changes. | 2c7f647 |
| D5 | Feedback modal has two modes: taste note (chocolates) and memory (Moments cards via `data-memory-open`). | "Which sample did you try?" made no sense for memory/story cards. | f0bdc3f, 27cf3e1 |
| D6 | Admin price input is text + numeric, not `type=number`. | Leading-zero typing bug. | cc5e22c |
| D7 | Category rename is one atomic server call (`POST /api/admin/products {renameCategory}`). | Client-side loop was unreliable. | ff6a991 |
| D8 | `PRODUCT.md` stays at repo root; Impeccable build path is code-first. | Impeccable resolves context from the root. | 27cf3e1 |
| D9 | AI workflow: native-first, free/local tools only, no new MCP servers now. Serena only if, after the symbol map, tasks still need several large-region reads of the hotspot files. Context7 rejected (cloud). Approval required for installs, SQL/schema, deletions, `.env*`, pushes. Memory updated at milestones after user approval. | User's answers during the AI-environment review. | this change |
