# Prompts Log

*Verbatim record of Tyler's instructions. Append-only, newest first. Do not edit or paraphrase existing entries.*


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
