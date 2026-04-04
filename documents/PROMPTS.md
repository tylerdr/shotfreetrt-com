# Prompts Log

*Verbatim record of Tyler's instructions. Append-only, newest first. Do not edit or paraphrase existing entries.*


---

## 2026-03-31 20:40 UTC

**Tyler's exact words:**
> ## Task: Fix Blog Rendering

The blog at shotfreetrt.com has several rendering issues. Fix all of them, build, and deploy.

## Problems to Fix

### 1. Missing CSS for <p> tags (CRITICAL — all articles affected)
In `src/app/globals.css`, the `.article-content` block has NO `p` tag styling.
Paragraphs render with zero margin so every paragraph smashes into the next.
Add proper paragraph spacing inside `.article-content`:
```css
.article-content p {
  margin-bottom: 1.25rem;
  line-height: 1.8;
}
```
Also add missing h2 font-size and h4 support:
```css
.article-content h2 {
  font-size: 1.45rem;
  font-weight: 700;
  margin-top: 2.5rem;
  margin-bottom: 0.75rem;
  color: #F9FAFB;
  border-bottom: 1px solid #1E2A4A;
  padding-bottom: 0.4rem;
}
.article-content h3 {
  font-size: 1.15rem;
  font-weight: 600;
  margin-top: 1.8rem;
  margin-bottom: 0.5rem;
  color: #93C5FD;
}
.article-content h4 {
  font-size: 1rem;
  font-weight: 600;
  margin-top: 1.4rem;
  margin-bottom: 0.4rem;
  color: #BAC8FF;
}
```

### 2. Light-colored inline callout boxes look broken on dark theme
Several data files use inline styles with light backgrounds:
`style="background:#f0f4ff;border-left:4px solid #4f46e5;padding:16px;margin:24px 0;border-radius:4px"`

These files need the inline style replaced. Search ALL files in `src/data/` for `background:#f0f4ff` and replace those callout div inline styles with the dark-theme equivalent:
`style="background:#0F1530;border-left:4px solid #3B82F6;padding:16px;margin:24px 0;border-radius:8px;color:#C7D2FE;"`

Do a global find+replace across all .ts files in src/data/ for:
- `background:#f0f4ff` → `background:#0F1530`
- `border-left:4px solid #4f46e5` → `border-left:4px solid #3B82F6`
- Where these appear together, also update the text color to be light: add `color:#C7D2FE;` if not present

### 3. Schema mismatch in trtAndFinasteride.ts
`trtAndFinasteride.ts` uses `readingTime` but the BlogArticle type and page template use `readTime`.
Fix: rename `readingTime` → `readTime` in `src/data/trtAndFinasteride.ts`.

### 4. Missing type file — trtBloodTestCost.ts imports from `../types/blog` which does not exist
`src/data/trtBloodTestCost.ts` has: `import { BlogArticle } from "../types/blog";`
But there is no `src/types/blog.ts` file.
Fix: change the import to `import { BlogArticle } from "./articles";` in `src/data/trtBloodTestCost.ts`.

### 5. Sections-based articles that contain HTML strings show raw tags
In `src/app/blog/[slug]/page.tsx`, the sections renderer calls `renderParagraphWithLinks(paragraph, ...)` which uses React spans — this escapes HTML like `<strong>`, `<table>`, `<em>` etc.

The `testosteroneAndDopamine.ts` article uses `sections[]` with paragraphs that contain raw HTML (tables, strong tags, etc.).

Fix the sections renderer in `page.tsx` to handle HTML paragraphs. Change the sections rendering block so that if a paragraph contains HTML tags, it renders via `dangerouslySetInnerHTML` instead of the link-splitter:

Replace the current `renderParagraphWithLinks` call in the sections map with this logic:
```tsx
{section.paragraphs.map((paragraph, index) => {
  const hasHtml = /<[a-z][\s\S]*>/i.test(paragraph);
  if (hasHtml) {
    return (
      <div key={`${section.heading}-${index}`}
        dangerouslySetInnerHTML={{ __html: paragraph }} />
    );
  }
  return renderParagraphWithLinks(paragraph, `${section.heading}-${index}`);
})}
```

### 6. Also add dark-theme table styles to sections articles
The `testosteroneAndDopamine.ts` article has a table inside a paragraph. Make sure the `.article-content table` CSS already in globals.css applies (it should once fix #5 above is in). No additional work needed here if the table HTML has no conflicting inline styles.

### 7. Add top-of-article spacing 
Add `margin-bottom: 1.5rem` to the first child of `.article-content` to give breathing room after the article header:
```css
.article-content > *:first-child {
  margin-top: 0;
}
```

## After Making All Fixes

1. Run `npm run build` — fix any TypeScript errors
2. Run `vercel --prod --token $VERCEL_TOKEN` or `npx vercel --prod` to deploy
3. Confirm HTTP 200 on at least 3 of these:
   - `curl -s -o /dev/null -w "%{http_code}" https://shotfreetrt.com/blog/trt-and-finasteride`
   - `curl -s -o /dev/null -w "%{http_code}" https://shotfreetrt.com/blog/testosterone-and-dopamine`
   - `curl -s -o /dev/null -w "%{http_code}" https://shotfreetrt.com/blog/trt-blood-test-cost`

When completely finished, run:
openclaw system event --text "Done: Blog rendering fixed — p margins, dark callouts, section HTML, schema fixes — deployed to prod" --mode now

**Classified as:** `pending-review`
**Spec impact:** pending


---

## 2026-03-31 03:20 UTC

**Tyler's exact words:**
> Polish pass on ShotFreeTRT.com. The site is at /home/sprinter/Projects/shotfreetrt.com. The dark premium blue/gold theme is in place. Now fix the specific remaining issues from design QA:

## ISSUE 1: Blog listing page (src/app/blog/page.tsx) — Score was 4/10, the biggest gap

The current page is a wall of identical dark cards with no structure. Fix it:

1. Add category filter tabs at the top — extract unique categories from articles, show them as horizontally scrollable pill tabs (with an 'All' default). On click, filter the visible articles. Use 'use client' and useState for this.

2. Add a 'Start Here' featured row — pull the 3 most important articles (enclomiphene-vs-trt, low-testosterone-symptoms, testosterone-replacement-therapy-guide) as larger featured cards with a slight blue accent border on the left side and more prominent typography.

3. Add category section grouping — after the featured row, group remaining articles by category with a section header (e.g. 'Protocol & Management (12)', 'Lifestyle & Safety (8)'). This breaks the monotony massively.

4. Article cards need better visual weight:
   - Title: text-white font-bold text-base (not semibold text-lg — too big for the grid)
   - Add a subtle left border on the card: border-l-2 border-l-[color based on category]
   - Read time: calculate from article content length if available, else show category as meta
   - Card hover: scale-[1.01] transition plus blue glow

## ISSUE 2: Article page (src/app/blog/[slug]/page.tsx)

1. Constrain reading width: the article content area should be max-w-3xl (or ~700px) for the main text, centered within the page. This is the single biggest readability fix.

2. Inline quiz CTA boxes — replace the flat blue banner style with a dark card approach:
   In globals.css, update .article-content .quiz-cta-inline:
   

3. Article body text size: in globals.css, update .article-content:
   

4. Table improvements in globals.css:
   

## ISSUE 3: Pricing page (src/app/pricing/page.tsx)

1. Remove the teal/green price badge pill styling — show prices as large display text inside the card instead. Find the price display and change it to:
   className='text-2xl font-bold text-blue-400 mt-2'
   No colored pill/badge.

2. Comparison table — increase contrast: make the header row bg-[#0F1530] and header text text-blue-300 font-semibold. Replace any red/green check marks with text: '✓' in blue-400 and '—' in zinc-600 for negatives.

3. Bottom CTA gradient section — make it a clean solid dark card:
   bg-[#12121A] border border-[#222230] rounded-2xl p-10
   (remove any gradient that causes banding)

## ISSUE 4: Homepage (src/app/page.tsx)

1. The 4 feature cards (Sleep+Recovery, Lift+Body Comp, Labs+Root Causes, AI Personalization) — upgrade from small icon circles to larger styled icon areas:
   - Card: bg-[#12121A] border border-[#222230] rounded-xl p-6 hover:border-blue-500/30 transition-all group
   - Icon wrapper: w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center mb-4
   - Icon: size-5 text-blue-400
   - Title: text-base font-semibold text-white mb-2

2. Trust stat bar — make it more visible:
   

After all changes:
1. npm run build
2. If passes: vercel --prod
3. curl -s -o /dev/null -w '%{http_code}' https://shotfreetrt.com
4. openclaw system event --text 'ShotFreeTRT polish pass complete — blog listing, article, pricing, homepage all upgraded' --mode now

**Classified as:** `pending-review`
**Spec impact:** pending


---

## 2026-03-31 01:45 UTC

**Tyler's exact words:**
> [Tue 2026-03-31 01:45 UTC] Wire a new article into the shotfreetrt.com production site and deploy it.
>
> **Repo:** `/home/sprinter/Projects/shotfreetrt.com`
>
> **Article details:**
> - Slug: `testosterone-and-anemia`
> - Title: "Testosterone and Anemia: How Low T Causes Anemia (and How TRT Can Fix It)"
> - Description: "Low testosterone causes anemia in 5–13× more men than normal T. But iron deficiency anemia also mimics low T symptoms exactly. Here's how to tell which problem you actually have."
> - Primary keyword: testosterone and anemia
> - Category: MOFU diagnostic
> - Reading time: ~9 min
>
> **Steps:**
> 1. Look at how existing article data files are structured in `src/data/` — e.g., `trtAndFinasteride.ts` or `trtAndBloodDonation.ts` as reference
> 2. Create `src/data/testosteroneAndAnemia.ts` with the article data (title, description, slug, content). The content should be a comprehensive article covering:
>    - How testosterone drives red blood cell production (EPO stimulation, hepcidin suppression, bone marrow effects)
>    - Anemia prevalence in hypogonadal men (5–13× higher than eugonadal men, Ferrucci 2006)
>    - Symptom overlap table: iron deficiency anemia vs low testosterone (fatigue/brain fog overlap; libido/morning erections distinguish low T; pale skin/cold extremities/restless legs distinguish iron deficiency)
>    - TRT raises hematocrit — delivery method risk table (daily SubQ lowest → weekly IM → pellets highest)
>    - Diagnostic lab panel table (hemoglobin, hematocrit, MCV, ferritin, TIBC, transferrin saturation, plus hormone labs)
>    - Key lab patterns: iron deficiency pattern vs anemia of hypogonadism pattern vs TRT erythrocytosis pattern
>    - Ferritin section: most overlooked lab; optimal 50-150 ng/mL; treat iron first if ferritin < 30
>    - When TRT treats anemia (confirmed hypogonadism + normocytic anemia)
>    - What TRT does NOT fix (iron deficiency, B12/folate, CKD, hemolytic)
>    - Hematocrit safety window table (< 40% → may indicate anemia; 40-52% target; 52-54% yellow; > 54% red; > 56% high risk)
>    - Sleep apnea compounding effect (apnea EPO + TRT EPO = compounded risk)
>    - 5-step action protocol
>    - 8-question FAQ
>    - Internal links to: /blog/trt-bloodwork-panel, /blog/trt-and-blood-donation, /blog/trt-and-sleep-apnea, /blog/testosterone-and-energy, /blog/low-testosterone-symptoms, /blog/trt-side-effects
>
> 3. Register the article in `src/data/articles.ts` — add the new article to the articles array following the existing pattern
>
> 4. Run `npm run build` — fix any TypeScript/build errors
>
> 5. Deploy with `vercel --prod --token $VERCEL_TOKEN` (or use the existing deploy pattern in the repo)
>
> 6. Verify: `curl -s -o /dev/null -w "%{http_code}" https://shotfreetrt.com/blog/testosterone-and-anemia`
>
> 7. Report back: HTTP status, any build errors, and confirmation of live URL
>
> **Note:** The full article content is in `/home/sprinter/.openclaw/workspace-ventures/ai-ventures/ventures/shotfreetrt.com/content/article-testosterone-and-anemia-2026-03-31.md` — use it as the source for article body content.

**Classified as:** `in-progress`
**Spec impact:** pending


---

## 2026-03-31 00:54 UTC

**Tyler's exact words:**
> <task-notification>
<task-id>ada309cc2d4231538</task-id>
<tool-use-id>toolu_01CHP6xtezXZmjPGkgN7oCWe</tool-use-id>
<output-file>/tmp/claude-1000/-home-sprinter-Projects-shotfreetrt-com/c0ae9550-50fb-4105-8d9c-2d84fa3f0169/tasks/ada309cc2d4231538.output</output-file>
<status>completed</status>
<summary>Agent "Find light-mode classes in components" completed</summary>
<result>Perfect! I found the matches. Let me compile this into the concise format you requested, focusing on components outside of the page files:

## Light-Mode Color Classes Found

**Components:**

/home/sprinter/Projects/shotfreetrt.com/src/components/ui/slider.tsx:56 - `bg-white`

/home/sprinter/Projects/shotfreetrt.com/src/components/quiz/QuizResult.tsx:147 - `border-emerald-700 bg-white text-emerald-950`

/home/sprinter/Projects/shotfreetrt.com/src/components/quiz/QuizResult.tsx:165 - `border-emerald-200 bg-white/80`

/home/sprinter/Projects/shotfreetrt.com/src/components/quiz/QuizResult.tsx:233 - `bg-white`

/home/sprinter/Projects/shotfreetrt.com/src/components/quiz/QuizEngine.tsx:577 - `border-emerald-200 bg-emerald-50/70 text-emerald-900`

/home/sprinter/Projects/shotfreetrt.com/src/components/quiz/QuizResult.tsx:140 - `border-emerald-200 bg-gradient-to-br from-emerald-50 to-white`

/home/sprinter/Projects/shotfreetrt.com/src/components/quiz/QuizResult.tsx:265 - `border-emerald-200 bg-emerald-50/60`

/home/sprinter/Projects/shotfreetrt.com/src/components/quiz/QuizResult.tsx:302 - `text-emerald-700`

/home/sprinter/Projects/shotfreetrt.com/src/components/quiz/QuizResult.tsx:351 - `text-emerald-700`

**Page Files (you mentioned knowing about these, but included for completeness):**

/home/sprinter/Projects/shotfreetrt.com/src/app/pricing/page.tsx:131 - `bg-teal-700 hover:bg-teal-800`

/home/sprinter/Projects/shotfreetrt.com/src/app/pricing/page.tsx:152 - `border-teal-200 bg-teal-50/50`

/home/sprinter/Projects/shotfreetrt.com/src/app/pricing/page.tsx:153 - `border-gray-200 bg-white`

/home/sprinter/Projects/shotfreetrt.com/src/app/pricing/page.tsx:188 - `border-gray-200 bg-white`

/home/sprinter/Projects/shotfreetrt.com/src/app/pricing/page.tsx:194 - `bg-teal-50`

/home/sprinter/Projects/shotfreetrt.com/src/app/pricing/page.tsx:232 - `border-gray-100 bg-gray-50`

/home/sprinter/Projects/shotfreetrt.com/src/app/pricing/page.tsx:254 - `border-gray-200 bg-gray-50`

/home/sprinter/Projects/shotfreetrt.com/src/app/pricing/page.tsx:265 - `bg-teal-700 hover:bg-teal-800`

/home/sprinter/Projects/shotfreetrt.com/src/app/pricing/page.tsx:271 - `border-gray-300 text-gray-700 hover:bg-gray-100`

/home/sprinter/Projects/shotfreetrt.com/src/app/pricing/page.tsx:279 - `border-teal-200 bg-teal-50/50`

/home/sprinter/Projects/shotfreetrt.com/src/app/pricing/page.tsx:289 - `bg-teal-700 hover:bg-teal-800`

All remaining gray classes and other text colors are dispersed across both files with multiple matches on individual lines.

The component files with the most remaining light-mode classes are:
- `/home/sprinter/Projects/shotfreetrt.com/src/components/quiz/QuizResult.tsx` (emerald palette)
- `/home/sprinter/Projects/shotfreetrt.com/src/components/quiz/QuizEngine.tsx` (emerald palette)
- `/home/sprinter/Projects/shotfreetrt.com/src/components/ui/slider.tsx` (single bg-white)</result>
<usage><total_tokens>21803</total_tokens><tool_uses>14</tool_uses><duration_ms>21072</duration_ms></usage>
</task-notification>

**Classified as:** `pending-review`
**Spec impact:** pending


---

## 2026-03-31 00:54 UTC

**Tyler's exact words:**
> <task-notification>
<task-id>ae3ce48bd1ab5626c</task-id>
<tool-use-id>toolu_014yRdUDXsUDcVPJigKV91Ji</tool-use-id>
<output-file>/tmp/claude-1000/-home-sprinter-Projects-shotfreetrt-com/c0ae9550-50fb-4105-8d9c-2d84fa3f0169/tasks/ae3ce48bd1ab5626c.output</output-file>
<status>completed</status>
<summary>Agent "Read handoff and current state" completed</summary>
<result>Here are the full contents of the three documents:

## 1. HANDOFF.md

```
# Session Handoff

*Overwritten at the end of each coding session. If this file is current, start here.*

**Session date:** YYYY-MM-DD
**Agent:** Claude Code / Codex
**Branch:** feature/name
**Status:** `complete` | `in-progress` | `blocked`

---

## What was completed this session
- [x] [Task or item completed]
- [x] [ADR written or updated]

## Pick up here (priority order)
- [ ] [Next task] — start in `path/to/file.ts`
- [ ] [Blocking question] — must answer before [task] can proceed

## Important context for next session
- [Architecture fact that's non-obvious from reading the code]
- [Gotcha or constraint to be aware of]
- [Key file or pattern to know]

## Decisions made this session
- ADR-XXX: [Decision name] — see DECISIONS.md for full record

## Tech debt created this session
- TD-XXX: [Debt item] — added to BACKLOG.md

## Files changed this session
- `path/to/file.ts` (new / modified)
- `documents/SPEC.md` (updated: [which section])
- `documents/DECISIONS.md` (ADR-XXX added)
- `documents/BACKLOG.md` (updated)
```

## 2. BACKLOG.md

```
# Backlog

*Single source of truth for what's next. Coding agents update at session end. Tyler can add at any time.*

---

## Active Sprint
- [ ] T001: [Task name] — [brief description] `HIGH`
- [ ] T002: [Task name] `HIGH`

## Next Up
- [ ] T003: [Task name]
- [ ] T004: [Task name]

## Tech Debt
- [ ] TD001: [Debt item] — [why it matters, what it unblocks]

## Open Questions (blocking work)
- [ ] OQ001: [Question] — blocks [T001]

## Open Questions (non-blocking)
- [ ] OQ002: [Question] — answer when convenient

## Completed
- [x] T000: [Task] — done YYYY-MM-DD
```

## 3. DECISIONS.md

```
# Architecture Decisions

*Append-only. Never delete entries. To reverse a decision, add a new ADR that supersedes the old one.*

---

## ADR-001: [Decision Name]

**Date:** YYYY-MM-DD
**Status:** Accepted
**Context:** Why this decision was needed — what problem or tradeoff we were facing.
**Decision:** What we decided to do.
**Consequences:** Tradeoffs accepted. What becomes harder or easier.
**Alternatives considered:** What we explicitly rejected and why.

---
```

All three files are currently template/placeholder files with no actual content filled in. They follow a structured format designed for project management and decision tracking.</result>
<usage><total_tokens>14461</total_tokens><tool_uses>3</tool_uses><duration_ms>10928</duration_ms></usage>
</task-notification>

**Classified as:** `pending-review`
**Spec impact:** pending


---

## 2026-03-31 00:45 UTC

**Tyler's exact words:**
> You are implementing a full design overhaul for ShotFreeTRT.com — a testosterone optimization site for men 35-55 who are competitive, disciplined, and want to dominate physically without injections.

## DESIGN DIRECTION: Premium Dark Performance
Reference aesthetic: Whoop.com, Eight Sleep, Levels Health, Andrew Huberman's brand. NOT ProtocolRank (too clinical/sterile). NOT a supplement blog (too cheap). Premium masculine dark with electric blue + gold accents.

The existing partial changes went in the WRONG direction (light teal classes) — fix everything to match the dark premium direction below.

---

## TASK 1: src/app/globals.css — COMPLETE REWRITE of CSS variables + component styles

Replace the :root block with this exact palette:


Update body styles:
- background: #0A0A0F (solid, no gradient — or subtle radial: )
- font-family: 'Barlow Condensed', 'Inter', system-ui, sans-serif (Barlow for headings, Inter for body)
- color: var(--text)

Update ALL component styles to match the dark blue-black palette:
- .hero: background: linear-gradient(135deg, #0F0F1F 0%, #0A0A0F 100%), border: 1px solid #222230
- .card: background: #12121A, border: 1px solid #222230
- .article-content table th: background: #0F1530, color: #93C5FD (blue-300), border: 1px solid #1E2A4A
- .article-content table td: color: #D1D5DB, border: 1px solid #1E2A4A
- .article-content tr:nth-child(even) td: background: #0F0F1A
- .article-content blockquote: border-left: 4px solid #3B82F6, background: #0F1530
- .article-content h3: color: #93C5FD (blue-300)
- .article-content a: color: #60A5FA
- .article-content strong: color: #F9FAFB
- .article-content .quiz-cta-inline: background: linear-gradient(130deg, #0F1530, #1a1f3a), border: 1px solid #1E3A5F
- .article-content .faq-item: border: 1px solid #222230, background: #12121A
- .article-content .faq-item h3: color: #93C5FD
- .article-content .faq-item p: color: #9CA3AF
- .badge: border: 1px solid #1E2A4A, background: #0F1530, color: #60A5FA
- .cta: background: linear-gradient(130deg, #0F1530, #1a1f3a), border: 1px solid #1E3A5F, color: #E0E7FF
- .cta-form input: border: 1px solid #1E2A4A, background: #0A0F1E, color: #E0E7FF
- .cta-form button: background: #3B82F6, color: #FFFFFF
- .guide-promo-banner: border: 1px solid #1E2A4A, background: linear-gradient(135deg, #0F1530 0%, #1a1f3a 56%, #0F1530 100%)
- .guide-promo-primary: background: #3B82F6, color: #FFFFFF
- .guide-promo-secondary: border: 1px solid rgba(59,130,246,0.4), color: #93C5FD, background: rgba(59,130,246,0.08)
- .guide-promo-banner::after: radial-gradient using blue rgba(59,130,246,0.12)
- .guide-promo-links a: color: #60A5FA
- .disclosure: border: 1px solid #1E2A4A, background: #0B0F1F, color: #93C5FD
- All quiz styles: keep dark, replace emerald green with blue (#3B82F6)
  - .quiz-progress-fill: background: linear-gradient(90deg, #1D4ED8 0%, #3B82F6 100%)
  - .quiz-option-button: border: 1px solid #1E2A4A, background: #0F1530, color: #C7D2FE
  - .quiz-option-button:hover: border-color: #3B82F6, background: #1a1f3a
  - .quiz-option-button.is-selected: background: #1E2A4A, border-color: #3B82F6, color: #BFDBFE
  - .quiz-button-primary: background: #3B82F6, color: #FFFFFF
  - .quiz-result-hero: background: linear-gradient(140deg, #0F1530 0%, #0F1F45 100%), border: 1px solid #1E3A5F
  - .quiz-result-kicker: color: #60A5FA
  - .quiz-score-ring: border: 6px solid #3B82F6, background: #0A0F1E, color: #93C5FD
  - .quiz-progress-track: background: #1A1A26
  - .quiz-factor-helping: border-color: #1E2A4A, background: #0F1530, color: #93C5FD
- .site-header: background: rgba(10,10,15,0.9), border-bottom: 1px solid #222230
- a: color: #60A5FA
- a:hover: color: #93C5FD
- footer: border-top: 1px solid #222230, background-color: rgba(10,10,15,0.6)

---

## TASK 2: src/app/layout.tsx — Font import + Nav redesign

Add Google Fonts import for Barlow Condensed:


Apply both font variables to the html/body element. Also add to globals.css @theme inline:


Update the header to use Barlow Condensed for the logo:
- Logo: className should include font-[family-name:var(--font-display)] text-xl font-extrabold tracking-tight text-white
- Remove the all-caps small-letter-spacing style
- Nav links: text-zinc-400 hover:text-blue-400 transition-colors
- Header bg: bg-black/80 backdrop-blur-xl border-b border-[#222230]

Add a credibility strip BELOW the header nav as a separate div:


---

## TASK 3: src/app/page.tsx — Homepage overhaul

The existing partial changes used light classes (teal-50, gray-900) — fix them all back to dark premium:

Hero section:
- Remove any white/light backgrounds
- Hero: full-width section, NO border box — just dark bg with subtle geometric grid using CSS
- H1: className="font-[family-name:var(--font-display)] text-5xl font-extrabold tracking-tight text-white sm:text-6xl md:text-7xl leading-none"
- Subtext: text-zinc-400
- Primary CTA button: bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_20px_rgba(59,130,246,0.3)]
- Secondary CTA: border border-zinc-700 text-zinc-300 hover:border-zinc-500

Trust/stats bar below hero:


Pathway comparison table: dark with blue header row. Fix the table row cue classes to dark variants:
- lifestyle: 'bg-blue-500/10 text-blue-300 border-blue-500/30'
- SERM: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30'
- oral/topical: 'bg-amber-500/10 text-amber-300 border-amber-500/30'
- injectable: 'bg-rose-500/10 text-rose-300 border-rose-500/30'

Feature/capability cards (Sleep+Recovery, Lift+Body Comp, etc.):
- Dark surface bg: bg-[#12121A] border border-[#222230]
- Icon color: text-blue-400
- Title: text-white font-semibold
- Body: text-zinc-400

Blueprint/guide section:
- Dark gradient card: bg-gradient-to-br from-[#0F1530] to-[#12121A] border border-[#1E2A4A]
- CTA button: bg-blue-600 text-white hover:bg-blue-500
- Secondary: border border-blue-500/40 text-blue-300

Newsletter section: dark form, blue submit button

Latest articles section: dark cards with blue left-border accent on hover

---

## TASK 4: src/app/blog/page.tsx — Keep the new grid structure but fix colors

The 2-column grid structure that was added is GOOD — keep it. Fix the category colors to dark variants:


Article cards:
- bg-[#12121A] border border-[#222230] rounded-xl p-6 hover:border-blue-500/40 hover:shadow-[0_0_20px_rgba(59,130,246,0.08)] transition-all
- Title: text-white font-semibold text-lg group-hover:text-blue-200
- Description: text-zinc-400 text-sm
- Meta: text-zinc-500 text-xs
- Page heading: font-[family-name:var(--font-display)] text-3xl font-bold text-white

---

## TASK 5: src/app/blog/[slug]/page.tsx — Article reading experience

Keep the existing structure but:
- Reading content: dark background (body bg), text-zinc-200 for article body
- H1: font-[family-name:var(--font-display)] text-4xl font-bold text-white
- Category badge: dark pill with blue colors
- Meta: text-zinc-500
- Any inline content backgrounds: dark (not white/light)
- Make sure quiz CTA boxes use the blue dark style, not green

---

## TASK 6: src/app/pricing/page.tsx — Fix to dark premium

The partial changes made this lighter — fix back:
- All card backgrounds: bg-[#12121A] border border-[#222230]
- Page heading: font-[family-name:var(--font-display)] text-3xl font-bold text-white
- Text: text-zinc-400 for body text
- Prices: text-blue-400 font-bold or text-amber-400
- CTA buttons: bg-blue-600 text-white hover:bg-blue-500
- Comparison table: dark bg, blue header row
- Remove any light (teal-700, gray-900, gray-500) class patterns

---

## AFTER ALL CHANGES:

1. Run: npm run build
2. If it passes, run: vercel --prod  
3. Report the final HTTP status: curl -s -o /dev/null -w '%{http_code}' https://shotfreetrt.com
4. Run: openclaw system event --text 'ShotFreeTRT design overhaul DONE — premium dark blue/gold deployed, ready for screenshot review' --mode now

Be thorough — go through every file and make sure there are no light-mode color classes (no bg-white, bg-gray-50, text-gray-900, text-teal-700 etc.) left over from the previous partial attempt.

**Classified as:** `pending-review`
**Spec impact:** pending


---

## 2026-03-31 00:43 UTC

**Tyler's exact words:**
> Say OK

**Classified as:** `pending-review`
**Spec impact:** pending


---

## 2026-03-31 00:14 UTC

**Tyler's exact words:**
> <task-notification>
<task-id>a2a611aaadf49466b</task-id>
<tool-use-id>toolu_01TCYqWNBdYh7JQWMJLjgaca</tool-use-id>
<output-file>/tmp/claude-1000/-home-sprinter-Projects-shotfreetrt-com/633c0507-0315-40b7-a1f6-1cd0819acaa0/tasks/a2a611aaadf49466b.output</output-file>
<status>completed</status>
<summary>Agent "Read project handoff docs" completed</summary>
<result>Here are the full contents of the three files:

## 1. /home/sprinter/Projects/shotfreetrt.com/documents/HANDOFF.md

```markdown
# Session Handoff

*Overwritten at the end of each coding session. If this file is current, start here.*

**Session date:** YYYY-MM-DD
**Agent:** Claude Code / Codex
**Branch:** feature/name
**Status:** `complete` | `in-progress` | `blocked`

---

## What was completed this session
- [x] [Task or item completed]
- [x] [ADR written or updated]

## Pick up here (priority order)
- [ ] [Next task] — start in `path/to/file.ts`
- [ ] [Blocking question] — must answer before [task] can proceed

## Important context for next session
- [Architecture fact that's non-obvious from reading the code]
- [Gotcha or constraint to be aware of]
- [Key file or pattern to know]

## Decisions made this session
- ADR-XXX: [Decision name] — see DECISIONS.md for full record

## Tech debt created this session
- TD-XXX: [Debt item] — added to BACKLOG.md

## Files changed this session
- `path/to/file.ts` (new / modified)
- `documents/SPEC.md` (updated: [which section])
- `documents/DECISIONS.md` (ADR-XXX added)
- `documents/BACKLOG.md` (updated)
```

## 2. /home/sprinter/Projects/shotfreetrt.com/documents/DECISIONS.md

```markdown
# Architecture Decisions

*Append-only. Never delete entries. To reverse a decision, add a new ADR that supersedes the old one.*

---

## ADR-001: [Decision Name]

**Date:** YYYY-MM-DD
**Status:** Accepted
**Context:** Why this decision was needed — what problem or tradeoff we were facing.
**Decision:** What we decided to do.
**Consequences:** Tradeoffs accepted. What becomes harder or easier.
**Alternatives considered:** What we explicitly rejected and why.

---
```

## 3. /home/sprinter/Projects/shotfreetrt.com/documents/BACKLOG.md

```markdown
# Backlog

*Single source of truth for what's next. Coding agents update at session end. Tyler can add at any time.*

---

## Active Sprint
- [ ] T001: [Task name] — [brief description] `HIGH`
- [ ] T002: [Task name] `HIGH`

## Next Up
- [ ] T003: [Task name]
- [ ] T004: [Task name]

## Tech Debt
- [ ] TD001: [Debt item] — [why it matters, what it unblocks]

## Open Questions (blocking work)
- [ ] OQ001: [Question] — blocks [T001]

## Open Questions (non-blocking)
- [ ] OQ002: [Question] — answer when convenient

## Completed
- [x] T000: [Task] — done YYYY-MM-DD
```

All three files appear to be templates with placeholder content and haven't been filled in yet with actual project information.</result>
<usage><total_tokens>30756</total_tokens><tool_uses>3</tool_uses><duration_ms>11546</duration_ms></usage>
</task-notification>

**Classified as:** `pending-review`
**Spec impact:** pending


---

## 2026-03-31 00:13 UTC

**Tyler's exact words:**
> # ShotFreeTRT Design Overhaul Brief — v2
Generated: 2026-03-31
Direction: PREMIUM MASCULINE DARK — NOT a ProtocolRank clone

## THE BRAND IDENTITY
ShotFreeTRT is for men who want to optimize testosterone WITHOUT injections — the guy who's disciplined, competitive, wants to dominate physically and mentally, and wants real data not supplement hype. Think:
- Tim Ferriss's 4-Hour Body crossed with a premium fitness brand
- The guy who reads Andrew Huberman AND lifts heavy
- Masculine, serious, premium — not soft clinical, not bro supplement site
- "Alpha male performance optimization" but with actual science behind it

This is NOT ProtocolRank (which is for a researcher demographic). This is for men who want to WIN.

## DESIGN DIRECTION: "Premium Dark Performance"
The dark theme STAYS but gets a complete quality upgrade. Reference points:
- **Whoop.com** — premium dark, bold typography, performance-focused
- **Eight Sleep** — dark, scientific credibility, masculine aesthetic
- **Levels Health** — data-forward dark, clean, premium
- **Andrew Huberman's site** — serious, credentialed, no-nonsense

NOT: cheap supplement blogs, biohacker forums, crypto sites, gaming sites.

---

## COLOR PALETTE (dark premium, stay dark)

```css
:root {
  /* Core backgrounds — DARKER, richer, not cheap zinc */
  --background: #0A0A0F;          /* Near-black with slight blue-black tint */
  --surface: #12121A;             /* Card/elevated surface */
  --surface-2: #1A1A26;          /* Nested surface, table rows */
  --surface-hover: #1E1E2E;      /* Hover state */
  
  /* Text */
  --foreground: #F0F0F5;          /* Warm white, not pure #fff */
  --muted-foreground: #8A8A9A;   /* Secondary text — more blue-grey than zinc */
  --subtle-foreground: #5A5A6A;  /* Captions, meta */
  
  /* PRIMARY accent — remove emerald green, use ELECTRIC BLUE (performance/science) */
  --primary: #3B82F6;             /* Blue-500 — scientific, performance, premium */
  --primary-foreground: #FFFFFF;
  --primary-hover: #2563EB;       /* Blue-600 */
  --primary-glow: rgba(59, 130, 246, 0.15);
  
  /* SECONDARY accent — gold/amber (dominance, achievement, premium) */
  --accent: #F59E0B;              /* Amber-500 — achievement, testosterone energy */
  --accent-foreground: #0A0A0F;
  --accent-glow: rgba(245, 158, 11, 0.12);
  
  /* Warning / side effects */
  --warning: #EF4444;             /* Red-500 */
  --warning-bg: rgba(239, 68, 68, 0.08);
  
  /* Cards & borders */
  --card: #12121A;
  --card-foreground: #F0F0F5;
  --border: #222230;              /* Subtle blue-grey border */
  --border-strong: #2E2E42;
  
  /* Data / clinical areas — keep dark but more readable */
  --data-bg: #0F0F1A;
  --data-accent: #3B82F6;         /* Blue for data labels */
}
```

**Why blue not green:**
- Blue = science, performance labs, data, precision (Huberman, Levels, Eight Sleep)
- Green = supplements, "natural", health blogs — exactly what we want to escape
- Gold/amber accent = achievement, dominance, testosterone energy — masculine without being cheesy

---

## TYPOGRAPHY

**Headline font:** `Barlow Condensed` (Bold/ExtraBold) OR `Oswald` — masculine, condensed, powerful. Feels like a performance brand, not a medical journal.
**Body font:** `Inter` — keep (already loaded, highly legible)
**Data/monospace:** `JetBrains Mono` — for lab values, dosages, numbers

**Scale:**
- Hero h1: 56-72px, Barlow Condensed ExtraBold 800, tight letter-spacing, possibly partial accent color
- Section h2: 32-40px, Barlow Condensed Bold 700
- Card title: 18-20px, Inter SemiBold 600
- Body: 16-17px, Inter 400, line-height 1.7
- Data values: JetBrains Mono, blue accent color
- Labels/badges: Inter 600 uppercase tracked

---

## PAGE-BY-PAGE REQUIREMENTS

### 1. globals.css — Full palette upgrade
- Replace zinc/emerald with the new blue-gold dark palette above
- Update ALL component styles: tables, blockquotes, FAQs, quiz
- Article table headers: blue tint bg (#0F1530) with blue text
- Key finding boxes: gold/amber left border + amber-tinted dark bg
- Blockquotes: blue left border, dark blue-tinted bg
- Progress bars: blue gradient
- Buttons: blue primary, gold/amber secondary

### 2. layout.tsx — Nav + Header overhaul
- Import `Barlow Condensed` from Google Fonts (weights 600, 700, 800)
- Logo: "ShotFreeTRT" in Barlow Condensed ExtraBold — bold, masculine, NOT all-caps small-tracked
- Nav: clean dark header, blue on hover
- Add BELOW HEADER: a thin credibility strip — "67 evidence-based articles · No clinic bias · Lab-context included"
- Footer: darker, minimal

### 3. /blog/page.tsx — Blog listing redesign
Current state: near-unreadable dark rows. New direction:
- Header: "Performance Intelligence" or "TRT Research" with article count in blue badge
- 2-column article card grid (desktop), 1-col mobile
- Cards: dark surface (#12121A), blue-tinted top border on hover, 4px left border accent on category
- Category badges: color-coded (Protocol=blue, Safety=red/warning, Clinical=amber, Lifestyle=grey)
- Title: Inter SemiBold, large, white
- Description: muted grey, 2 lines max
- Read time + category tag in meta
- Clean scan pattern — this is the biggest UX win

### 4. page.tsx — Homepage redesign
- Remove the bordered hero card box — hero should be FULL-BLEED section, dark background with subtle grid/mesh pattern or geometric lines (NOT a purple-blue gradient)
- H1: Barlow Condensed ExtraBold, 64-72px, white — powerful, direct
- Tagline style: something like "SHOTFREETRT" wordmark in hero then "Optimize Testosterone Without Injections" — bold, declarative
- Trust/stats row: "67 ARTICLES · EVIDENCE-BASED · NO CLINIC BIAS" — minimal, data-first
- Hero CTAs: ONE primary blue button ("Take the Assessment"), ONE ghost/outline secondary
- Pathway comparison table: clean dark table, blue headers, much better contrast
- Feature cards: slightly elevated surface, blue left-border accent, clean
- Replace "FREE GUIDE" badge style → clean call-to-action section
- Newsletter: streamlined dark form, blue button

### 5. /blog/[slug]/page.tsx — Article reading experience
- Reading column: max-w-2xl to max-w-3xl, centered, proper left/right margins
- Article header: category badge (colored) + h1 in Barlow Condensed + meta (read time, date)
- KEY FINDING boxes: amber/gold left border (4px), dark amber-tinted bg, "KEY FINDING" label in amber uppercase
- Tables: dark with blue-tinted header row (#0F1530), cleaner cell borders
- Blockquotes: left border in blue, slightly elevated surface bg
- FAQ: clean dark cards, accordion if possible
- Quiz CTAs: blue card with blue button (replace dark green)
- Related articles: horizontal scroll or 3-col grid at bottom

### 6. /pricing/page.tsx
- Clinic cards: clean dark surface cards, blue accent on recommended/featured
- Price: large, blue or amber color
- Comparison table: clean dark theme with better contrast
- Remove any cheap-looking styling

### 7. Quiz pages
- Question cards: dark surface, blue option buttons on hover/selected
- Progress bar: blue gradient fill
- Result cards: blue-tinted hero result, amber for achievement indicators

---

## VISUAL SIGNATURE (one memorable element per section)
- Hero: subtle geometric grid lines (CSS-only, no images) in background
- Article key findings: amber left-border callout boxes — instantly recognizable
- Data tables: blue monospace headers — signals precision
- CTAs: blue with subtle glow shadow `box-shadow: 0 0 20px rgba(59,130,246,0.25)`

---

## WHAT MAKES THIS DISTINCT FROM PROTOCOLRANK
- Bold condensed headlines vs. soft serif — this is for doers not readers
- Electric blue + gold vs. minimal black/grey — more energy, still premium
- Performance brand feel vs. academic publication feel
- "You can dominate this without injections" vs. "here is a clinical ranking"
- More visual hierarchy and punch vs. ProtocolRank's deliberate restraint

---

## WHAT TO KEEP
- Dark theme overall — just PREMIUM dark, not cheap dark
- The quiz flow (just restyle)
- All article content
- Site structure

## WHAT TO KILL
- Emerald/mint green (#10b981) — gone everywhere
- Zinc-900 backgrounds → replace with richer blue-black
- All-caps small-tracked wordmark → condensed bold wordmark
- Dark green card boxes → blue-tinted surfaces
- Generic bordered hero card → full-bleed hero section

---

## IMPLEMENTATION ORDER
1. globals.css — color palette + typography variables + all component styles
2. layout.tsx — fonts + header + footer
3. /blog/page.tsx — grid card listing
4. page.tsx — homepage hero + sections  
5. /blog/[slug]/page.tsx — article reading experience
6. /pricing/page.tsx
7. Quiz pages (light touch, keep logic)

## BUILD + DEPLOY
After all changes:
```bash
npm run build
vercel --prod
curl -s -o /dev/null -w "%{http_code}" https://shotfreetrt.com
```

## YOUR IMPLEMENTATION TASK

Implement the full design overhaul described in this brief. The project is at /home/sprinter/Projects/shotfreetrt.com.

Work through each task in order. Be thorough — this is a FULL visual overhaul, not a quick tweak.

Key files to modify:
- src/app/globals.css (complete CSS variable + component style overhaul)
- src/app/layout.tsx (Google Fonts import: Barlow Condensed + JetBrains Mono, header/footer redesign)
- src/app/blog/page.tsx (2-column card grid with category badges)
- src/app/page.tsx (homepage hero, trust bar, feature sections)
- src/app/blog/[slug]/page.tsx (article reading experience)
- src/app/pricing/page.tsx (light-themed clinic cards)
- src/app/quiz/page.tsx and healthspan quiz pages (light touch restyle)

IMPORTANT CONSTRAINTS:
- Keep all content, quiz logic, article data exactly as-is — VISUAL CHANGES ONLY
- Use next/font/google for Barlow Condensed (weights: 600, 700, 800) and JetBrains Mono
- Keep shadcn/ui components
- Build must pass: npm run build

After completing all changes:
1. Run: npm run build
2. If build passes, run: vercel --prod
3. Report: curl -s -o /dev/null -w '%{http_code}' https://shotfreetrt.com

When completely finished, run this command to notify: openclaw system event --text 'ShotFreeTRT design overhaul complete — premium dark blue/gold theme deployed' --mode now

**Classified as:** `pending-review`
**Spec impact:** pending


---

## 2026-03-31 00:07 UTC

**Tyler's exact words:**
> # ShotFreeTRT Design Overhaul Brief
Generated: 2026-03-31
Sources: Opus critique (4.5/10 current score), ProtocolRank reference analysis, codebase review

## THE VERDICT
The current dark biohacker theme (zinc-900 bg + emerald green) is actively undermining trust with the target demographic — educated men 35-55 making serious health decisions. Every credible health reference (Examine.com, ProtocolRank, Mayo, UpToDate) uses light themes. The green accent codes as supplement marketing. The blog listing is nearly unreadable.

**Goal:** Transform from "biohacker supplement blog" to "clinical publication" — think ProtocolRank meets Examine.com.

---

## COLOR PALETTE (light theme)

```css
:root {
  /* Backgrounds */
  --background: #FFFFFF;
  --surface: #F8F9FB;
  --surface-2: #EEF1F6;
  
  /* Text */
  --foreground: #111827;       /* near-black */
  --muted-foreground: #6B7280; /* medium grey for secondary text */
  --subtle-foreground: #9CA3AF; /* captions, meta */
  
  /* Primary accent — deep clinical teal (NOT emerald green) */
  --primary: #0F766E;          /* teal-700 — trustworthy, medical */
  --primary-foreground: #FFFFFF;
  --primary-hover: #0D6B64;
  
  /* Secondary accent — warm amber for highlights/callouts */
  --accent: #D97706;           /* amber-600 — warm, distinctive */
  --accent-foreground: #FFFFFF;
  
  /* Warning / side effects callouts */
  --warning: #DC2626;          /* red-600 */
  --warning-bg: #FEF2F2;
  
  /* Success / positive indicators */
  --success: #059669;          /* emerald-600 — used SPARINGLY */
  --success-bg: #F0FDF4;
  
  /* Cards & borders */
  --card: #FFFFFF;
  --card-foreground: #111827;
  --border: #E5E7EB;           /* grey-200 */
  --border-strong: #D1D5DB;    /* grey-300 */
  
  /* Callout highlight (key findings, pull quotes) */
  --highlight-bg: #FFFBEB;     /* amber-50 */
  --highlight-border: #FCD34D; /* amber-300 */
  
  /* Clinical data / monospace areas */
  --data-bg: #F1F5F9;          /* slate-100 */
  --data-text: #0F172A;        /* slate-900 */
}
```

## TYPOGRAPHY

### Google Fonts to add in layout.tsx:
```
Source Serif 4 — for all h1, h2 headlines (editorial authority)
Inter — keep for body text (already loaded, highly readable)
JetBrains Mono — for data labels, dosage numbers, lab values (precision signal)
```

### Font scale:
- Hero h1: `text-4xl md:text-5xl font-bold` (Source Serif 4, weight 700)
- Section h2: `text-2xl md:text-3xl font-semibold` (Source Serif 4)
- Card title: `text-lg font-semibold` (Inter)
- Body: `text-base leading-7` (Inter, line-height ~1.75 for long-form)
- Meta/labels: `text-sm font-medium uppercase tracking-wide` (Inter)
- Data values: `font-mono text-sm` (JetBrains Mono)

---

## PAGE-BY-PAGE REQUIREMENTS

### 1. globals.css
- Full light theme variable overhaul (see color palette above)
- body background: white, text: --foreground
- Remove radial gradient on body
- Remove dark article-content styles → use light equivalents
- Update table, blockquote, FAQ styles for light theme
- Update quiz styles for light theme

### 2. layout.tsx (Header + Footer)
- Header: white background, bottom border, no backdrop blur needed
- Nav: text-foreground links, primary color on hover
- Logo: serif font "ShotFreeTRT" — remove all-caps tracking, make it warmer
- Footer: light grey background, proper link styling

### 3. Homepage (page.tsx)
- Hero: white/light-grey bg, large serif h1, remove hero gradient card box
- Trust bar (ADD): "67 articles · Evidence-based · No clinic bias · Every claim sourced" — like ProtocolRank's stat bar
- Comparison table: clean white table with proper borders, colored badge for each row
- Feature cards: white cards with subtle shadow, NOT dark
- Blueprint section: light callout box, muted teal background, no "FREE GUIDE" badge styling
- Newsletter: clean white form, not dark green box
- Remove/consolidate competing CTAs — ONE primary CTA in hero

### 4. Blog listing (/blog/page.tsx)
- Complete redesign: article cards with title, description, category badge, read time
- Add category filter/tabs at top
- Clean white cards with subtle hover shadow
- Category color badges (teal=protocol, amber=clinical, red=safety, etc.)
- Visible article count: "67 articles covering TRT, protocols, and hormone optimization"

### 5. Article pages (/blog/[slug]/page.tsx)
- Max reading width: 700-720px content column
- Optional: right sidebar for TOC on desktop
- Article header: category badge + h1 in serif + meta (read time, date, topic)
- Key finding highlight boxes (amber background, left border)
- Tables: clean light theme, teal header row
- Blockquotes: left teal border, light teal background
- FAQ: collapsible or clean bordered sections
- Quiz CTAs: teal card, not dark green

### 6. Pricing page (/pricing/page.tsx)
- Light theme clinic cards with clear pricing
- Comparison table: clean, readable
- Remove dark backgrounds

---

## TRUST SIGNALS TO ADD (steal from ProtocolRank)
1. **Credential bar** (below hero or in header): "67 articles · No affiliate rank manipulation · Evidence citations included"
2. **Editorial methodology section**: "How we evaluate and present TRT options" with 3-4 numbered steps
3. **Disclosure**: Clean, non-defensive single line ("Educational content. Some links may generate affiliate commissions.") — NOT a defensive 3-column transparency section

---

## COMPONENT SPECIFICS

### Nav
```tsx
<header className="sticky top-0 z-20 bg-white border-b border-gray-200">
  // Logo: "ShotFreeTRT" in Source Serif 4, not all-caps
  // Links: text-gray-600 hover:text-teal-700
</header>
```

### Primary Button
```
bg-teal-700 text-white hover:bg-teal-800
// NOT: emerald green #10b981
```

### Article Card (blog listing)
```
white bg, border border-gray-200, rounded-xl, p-6, hover:shadow-md
Category badge: teal/amber/red pill
Title: font-semibold text-gray-900 (NOT serif for list items)
Description: text-gray-600 text-sm
Meta: text-gray-400 text-xs
```

### Key Finding Box (article pages)
```
bg-amber-50 border-l-4 border-amber-400 px-4 py-3 my-6
Heading: text-amber-800 font-semibold text-sm uppercase
Content: text-amber-900
```

---

## IMPLEMENTATION ORDER
1. globals.css — full light theme rewrite (highest impact, cascades everywhere)
2. layout.tsx — header/footer/nav
3. blog/page.tsx — listing redesign
4. page.tsx — homepage
5. blog/[slug]/page.tsx — article reading experience
6. pricing/page.tsx — clinic cards
7. quiz pages — light theme adaptation

---

## WHAT NOT TO DO
- Do NOT keep any dark backgrounds on content areas
- Do NOT use emerald green (#10b981) as primary — use teal-700 (#0F766E)
- Do NOT add more gradients
- Do NOT use all-caps for logo/brand
- Do NOT leave blog listing as a wall of identical dark rows
- Keep the quiz functional — just restyle, don't rebuild logic

## YOUR TASK

Implement the full design overhaul described above. Work through these 7 tasks in order:

1. **globals.css** - Full light theme rewrite (white bg, teal-700 primary, proper typography variables)
2. **layout.tsx** - Import Source Serif 4 from Google Fonts, update header/footer/nav to light theme
3. **/blog/page.tsx** - Redesign blog listing (grid cards, category badges, readable)
4. **page.tsx (homepage)** - Light theme hero, trust bar, clean cards, consolidated CTAs
5. **/blog/[slug]/page.tsx** - Article reading experience overhaul
6. **/pricing/page.tsx** - Light theme clinic cards
7. **Quiz pages** - Light theme adaptation

After all changes run: npm run build
If build passes, run: vercel --prod

Report a summary of all changes made and the final HTTP response code from: curl -s -o /dev/null -w '%{http_code}' https://shotfreetrt.com

**Classified as:** `pending-review`
**Spec impact:** pending


---

## 2026-03-30 13:50 UTC

**Tyler's exact words:**
> Create a new data file `src/data/trtAndFinasteride.ts` for shotfreetrt.com. This file should export a `trtAndFinasterideArticle` const of type `BlogArticle` (imported from "./articles").

The article data:
- slug: "trt-and-finasteride"
- title: "TRT and Finasteride: The Interaction Most Clinics Get Wrong (2026)"
- description: "Combining TRT and finasteride suppresses DHT by 65–70% — which can cause reduced libido, erectile changes, and mood blunting even when testosterone looks normal on labs. Here is what the research shows and how to monitor the combination correctly."
- publishedAt: "2026-03-30"
- readingTime: "14 min read"
- category: "protocol"
- keywords array: ["TRT and finasteride", "finasteride on testosterone therapy", "finasteride hair loss TRT", "does finasteride lower testosterone", "testosterone and finasteride interaction", "post-finasteride syndrome TRT", "DHT on TRT", "finasteride DHT suppression", "finasteride testosterone levels", "TRT hair loss prevention"]

For the HTML content, write a comprehensive, medically-accurate article covering:

1. Intro: Why the combination is more complicated than most prescribers explain — finasteride suppresses DHT by 65-70% even when T is normal

2. H2: How Finasteride Works — 5-alpha-reductase inhibition, DHT reduction by 65-70% at 1mg/day

3. H2: What Happens to Testosterone When You Add Finasteride — table: testosterone levels rise slightly (T accumulates +10-15%), estradiol may rise modestly, DHT falls sharply

4. H2: The Core Problem — DHT-Driven Symptoms — DHT is not just a hair loss hormone; it drives libido, erectile sensitivity, motivation, mood in DHT-sensitive men. Symptom table: Low DHT on TRT vs Low Testosterone distinguishing clinical picture

5. H2: What Labs to Check — table with: total T, free T (equilibrium dialysis), DHT (critical — often omitted), E2, SHBG, LH/FSH (for reference), prolactin, PSA (note: finasteride suppresses PSA 50% — adjust threshold)

6. H2: Post-Finasteride Syndrome — what the evidence shows: sexual SEs in ~2-5% during use, most resolve on stopping, persistent PFS in ~1-2% subset (contested but documented), neurosteroid disruption mechanism proposed but not established, TRT in PFS: anecdotal mixed results, no RCTs

7. H2: Practical Framework — baseline before combining (DHT, E2, PSA, symptom diary), dose options table (0.2mg/0.5mg/1mg/5mg with DHT suppression %), topical finasteride alternative (reduces serum DHT ~30-40% vs 65-70% oral), minoxidil as DHT-free alternative

8. H2: Monitoring Schedule — table: baseline, 6-8 weeks, 3 months, ongoing (every 6-12 months with adjusted PSA note)

9. H2: FAQ (8 questions in accordion format):
- Does finasteride lower testosterone? (No — T accumulates slightly; DHT falls)
- Can you take TRT and finasteride together? (Yes, no pharmacokinetic interaction; monitor DHT)
- Why feel worse on TRT after starting finasteride? (DHT suppression, not T)
- Will finasteride make TRT less effective? (Muscle/energy largely unaffected; sexual function may be reduced)
- What is post-finasteride syndrome and can TRT help? (Documented but contested; TRT anecdotally mixed)
- Safer option for hair preservation on TRT? (Topical minoxidil, topical finasteride, low-dose oral)
- Does finasteride affect PSA accuracy? (Yes — halves PSA; double the value for comparison)
- Should I check DHT on finasteride? (Yes — often not included by default; critical for symptom context)

Include quiz CTAs at logical positions (after the DHT symptoms section, after the lab table, and at the end).

Internal links to include (use relative hrefs in anchor tags):
- /blog/trt-and-hair-loss
- /blog/trt-side-effects
- /blog/testosterone-and-erectile-dysfunction
- /blog/testosterone-and-libido
- /blog/anastrozole-on-trt
- /blog/trt-bloodwork-panel
- /blog/testosterone-and-prostate-health

Use the same HTML content structure and style as the existing trtAndStatins.ts or testosteroneAndMetformin.ts files for consistency (look at those files first to match the pattern).

After creating the file, update `src/data/articles.ts`:
1. Add import: `import { trtAndFinasterideArticle } from "./trtAndFinasteride";`
2. Add `trtAndFinasterideArticle` to BOTH the getAllArticles() return array AND the getArticleBySlug() array

Then run `npm run build` to verify compilation.

When completely done, run: openclaw system event --text "Done: TRT + Finasteride article wired into articles.ts, builds clean" --mode now

**Classified as:** `pending-review`
**Spec impact:** pending


---

## 2026-03-20 01:58 UTC

**Tyler's exact words:**
> 
Read the current articles.ts to understand the existing format for the first 6 TRT-specific article entries (low-testosterone-symptoms, best-online-trt-clinic, trt-alternatives, trt-cost-2026, trt-bloodwork-panel, enclomiphene-vs-trt).

Then read each of these 24 markdown article files from /home/sprinter/.openclaw/workspace-ventures/ai-ventures/ventures/shotfreetrt.com/content/ and add them as new entries to src/data/articles.ts BEFORE the longevity articles (i.e., right after the trt-bloodwork-panel entry and before the enclomiphene-vs-trt entry):

1. article-trt-side-effects-2026-03-13.md → slug: trt-side-effects
2. article-how-long-does-trt-take-to-work-2026-03-14.md → slug: how-long-does-trt-take-to-work
3. article-testosterone-levels-by-age-2026-03-14.md → slug: testosterone-levels-by-age
4. article-testosterone-cypionate-vs-enanthate-2026-03-14.md → slug: testosterone-cypionate-vs-enanthate
5. article-natural-testosterone-boosters-2026-03-14.md → slug: natural-testosterone-boosters
6. article-trt-and-fertility-2026-03-15.md → slug: trt-and-fertility
7. article-stopping-trt-coming-off-2026-03-15.md → slug: stopping-trt
8. article-hcg-on-trt-2026-03-15.md → slug: hcg-on-trt
9. article-testosterone-injection-sites-2026-03-15.md → slug: testosterone-injection-sites
10. article-anastrozole-on-trt-2026-03-16.md → slug: anastrozole-on-trt
11. article-testosterone-gel-vs-injections-2026-03-16.md → slug: testosterone-gel-vs-injections
12. article-trt-insurance-coverage-2026-03-16.md → slug: trt-insurance-coverage
13. article-testosterone-and-weight-loss-2026-03-16.md → slug: testosterone-and-weight-loss
14. article-trt-and-sleep-apnea-2026-03-17.md → slug: trt-and-sleep-apnea
15. article-testosterone-and-mood-depression-2026-03-17.md → slug: testosterone-and-mood-depression
16. article-trt-and-cardiovascular-health-2026-03-17.md → slug: trt-and-cardiovascular-health
17. article-testosterone-and-libido-2026-03-18.md → slug: testosterone-and-libido
18. article-testosterone-and-erectile-dysfunction-2026-03-18.md → slug: testosterone-and-erectile-dysfunction
19. article-testosterone-and-prostate-health-2026-03-18.md → slug: testosterone-and-prostate-health
20. article-trt-and-hair-loss-2026-03-18.md → slug: trt-and-hair-loss
21. article-low-testosterone-causes-2026-03-19.md → slug: low-testosterone-causes
22. article-trt-pellets-vs-injections-2026-03-19.md → slug: trt-pellets-vs-injections
23. article-clomid-vs-trt-2026-03-19.md → slug: clomid-vs-trt
24. article-trt-dosage-starting-dose-2026-03-19.md → slug: trt-dosage

For each article:
- Extract the title from the H1 or **Title tag**
- Extract the description from **Meta description**
- Set publishedAt from the filename date (e.g. 2026-03-13)
- Set author to 'ShotFreeTRT Editorial Team'
- Set category to 'TRT'
- Estimate readTime from **Word count** (words/200 = minutes, round to nearest whole number, format as 'X min read')
- Extract keywords from **Secondary keywords** plus the **Primary keyword** as a TypeScript string array
- Set sections to []
- For content: extract ALL the markdown content BELOW the horizontal rule (---) that follows the medical disclaimer, convert the entire article body to a single HTML string. This is critical — include ALL sections, tables, lists, and the full FAQ section at the bottom. The content field must contain the complete article HTML.
- For faqItems: extract from the FAQ section — each Q and A pair. Set to [] if no FAQ found.

After ALL 24 articles are added, run: npm run build

If the build passes, run:
git add -A
git commit -m 'feat: wire 24 TRT authority articles into blog (trt-side-effects through trt-dosage)'
git push origin main

Then deploy: vercel --prod --yes

When completely finished, run this command to notify:
openclaw system event --text 'Done: wired 24 TRT articles into articles.ts, built, committed, and deployed to production' --mode now

**Classified as:** `pending-review`
**Spec impact:** pending

*Tyler's input is scarce and valuable. Exact words are preserved so scope never gets lost or misremembered.*

---

## YYYY-MM-DD HH:MM UTC — [brief topic]

**Tyler's exact words:**
> [paste verbatim]

**Context:** [Session branch / what was happening when this came in]
**Action taken:** [How the agent responded / what it built]
**Spec impact:** [Did this update SPEC.md? Which section?]

---
