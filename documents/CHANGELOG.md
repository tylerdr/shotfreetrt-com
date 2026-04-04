# Changelog

*Append-only, newest first. Never edit old entries.*

---

## 2026-03-31 — testosterone-and-anemia article shipped (Codex session)

**Branch:** feature/design-overhaul-light-theme -> deployed locally to production alias
**Tyler's prompt:** "Wire a new article into the shotfreetrt.com production site and deploy it."

**Shipped:**
- `src/data/testosteroneAndAnemia.ts` — new testosterone/anemia diagnostic article with required tables, FAQ, and internal links
- `src/data/articles.ts` — registered the new article in route generation and lookup helpers
- `documents/PLAN-testosterone-and-anemia-2026-03-31.md` — saved execution plan for this ship

**Verification:**
- `npm run build` passed locally
- Vercel deployment ready: `https://shotfreetrt-dinlkwvqb-tai-durden-ai.vercel.app`
- Production alias confirmed: `https://shotfreetrt.com`
- Live route check: `https://shotfreetrt.com/blog/testosterone-and-anemia` -> HTTP 200

**Decisions:** none
**Follow-up / tech debt created:** none

---

## YYYY-MM-DD — [Brief description] (Claude Code / Codex session)

**Branch:** feature/name → merged to main (PR #N)
**Tyler's prompt:** "[verbatim or close paraphrase of the instruction that kicked this off]"

**Shipped:**
- `path/to/file.ts` — [what it does]
- `path/to/other.ts` — [what it does]

**Decisions:** ADR-001
**Follow-up / tech debt created:** [Any items added to BACKLOG.md]

---
