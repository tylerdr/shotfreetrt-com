# Task: Build AliveLongevity Healthspan Quiz

## Overview
Build an interactive, AI-powered "What's Your Healthspan Score?" quiz at `/quiz/healthspan`.
Typeform-style, one-question-at-a-time, mobile-first UI.

## Tech Stack
- Next.js (existing site framework)
- Vercel AI SDK (`ai` package) for AI calls
- Claude Sonnet for serious mode, Grok for roast mode
- Existing site styling (green/teal CSS theme)

## Files to Create

### 1. `/src/app/quiz/healthspan/page.tsx` — Quiz page (main entry)
- Server component wrapper with metadata
- Title: "What's Your Healthspan Score?"
- Meta description for SEO

### 2. `/src/components/quiz/QuizEngine.tsx` — Client component
- "use client"
- Multi-step form, one question at a time
- Progress bar at top
- Smooth transitions between questions
- Question types: single-select, multi-select, slider, number-input
- Mobile-first responsive design
- State management with useState

### 3. `/src/lib/quiz/healthspan-config.ts` — Question configuration
Questions (15-20 total, research-backed longevity factors):
1. Age (number input)
2. Sex (single-select: Male/Female)
3. Height & Weight (number inputs → BMI calc)
4. Sleep hours per night (slider: 3-12)
5. Sleep quality (single-select: Poor/Fair/Good/Excellent)
6. Exercise frequency (single-select: None/1-2x/3-4x/5+x per week)
7. Exercise type (multi-select: Walking/Cardio/Strength/HIIT/Yoga/Zone 2)
8. Diet pattern (single-select: Standard American/Mediterranean/Keto/Plant-based/Whole food/Other)
9. Processed food intake (slider: 0-100% of diet)
10. Alcohol consumption (single-select: None/Occasional/Moderate/Heavy)
11. Smoking status (single-select: Never/Former/Current)
12. Stress level (slider: 1-10)
13. Social connections (single-select: Isolated/Few close/Strong network/Very connected)
14. Sense of purpose (single-select: None/Searching/Moderate/Strong)
15. Family longevity (single-select: <70/70-80/80-90/90+)
16. Chronic conditions (multi-select: None/Diabetes/Heart disease/Cancer history/Autoimmune/Other)
17. Supplements (multi-select: None/Vitamin D/Omega-3/Magnesium/NMN/Other)
18. Sun exposure (single-select: Minimal/Moderate/Regular)
19. Preventive care (single-select: Never/Occasionally/Regular checkups/Proactive)

### 4. `/src/app/api/quiz/healthspan/route.ts` — AI result generation
- POST endpoint
- Receives quiz answers as JSON
- Uses Vercel AI SDK `generateText` with structured output
- System prompt instructs AI to analyze answers against longevity research
- Returns: projected healthspan, lifespan, grade (A+ to F), top 3 helping factors, top 3 hurting factors, 5 personalized recommendations with estimated years gained
- Support `mode` param: "serious" (Claude) or "roast" (Grok)

### 5. `/src/components/quiz/QuizResult.tsx` — Result display
- Animated score reveal
- Projected healthspan age (big number)
- Grade badge (A+ through F)
- Helping factors (green cards)
- Hurting factors (red cards)
- Recommendations with years-gained estimates
- "Roast Me" toggle button to switch modes
- Social share button (copy link)
- Email capture: "Get your full personalized report" → email gate
- CTA: "Get the Longevity Blueprint" → Stripe checkout ($19)

### 6. `/src/app/quiz/healthspan/result/[shareId]/page.tsx` — Shareable result page
- Dynamic route for shared results
- OG meta tags for social preview (title: "My Healthspan Score: XX years")
- Shows result + CTA to take the quiz yourself

## Styling
- Match existing AliveLongevity green/teal theme
- Use existing CSS classes where possible
- Mobile-first, max-width container
- Smooth animations (CSS transitions or framer-motion if already installed)

## Dependencies to Install FIRST (before Codex runs)
```bash
npm install ai @ai-sdk/anthropic @ai-sdk/xai
```

## Environment Variables Needed
- ANTHROPIC_API_KEY (for Claude — serious mode)
- XAI_API_KEY (for Grok — roast mode)
- These should be in Vercel env vars

## Success Criteria
- Quiz loads at /quiz/healthspan
- All 19 questions render with proper input types
- AI generates personalized results in <5 seconds
- Roast mode toggle works
- Share link generates unique URL
- Email capture form appears
- BuyButton links to existing Stripe checkout
- Mobile responsive
- Build passes clean (`npx next build`)

## Notes
- Do NOT use Supabase yet — store nothing server-side for MVP. Just in-memory + URL share via query params.
- Keep it simple. Ship fast. We can add persistence later.
- Reuse existing BuyButton component for upsell
- Link from homepage and article pages to /quiz/healthspan
