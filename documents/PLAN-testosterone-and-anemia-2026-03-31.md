# Plan — testosterone-and-anemia

Date: 2026-03-31
Agent: Codex

## Goal
Wire the new `testosterone-and-anemia` article into the production site, build cleanly, deploy to Vercel production, and verify the live URL.

## Steps
1. Add Tyler's prompt to `documents/PROMPTS.md`.
2. Create `src/data/testosteroneAndAnemia.ts` following the current imported-article pattern.
3. Register the article import and include it in the article registry helpers in `src/data/articles.ts`.
4. Run `npm run build` and resolve any TypeScript/build errors needed to ship.
5. Deploy with the repo's linked Vercel project.
6. Verify `https://shotfreetrt.com/blog/testosterone-and-anemia` returns HTTP 200.

## Constraints
- Do not disturb unrelated local changes in the dirty worktree.
- Keep article links pointed at existing internal URLs already present in the site.
