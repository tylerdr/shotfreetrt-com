# Healthspan Quiz V2 — Upgrade Task

## IMPORTANT RULES
- Use **shadcn/ui** components for ALL interactive elements (Button, Input, Slider, Select, RadioGroup, Checkbox, ToggleGroup, Card, Label, etc.)
- Initialize shadcn with `npx shadcn@latest init` if not already set up, then add components as needed
- Use Tailwind CSS with CSS variables for theming (shadcn default approach)
- ALL components must be keyboard navigatable and accessible
- Do NOT use raw HTML `<button>`, `<input>`, `<select>` — use shadcn equivalents
- Create a feature branch `feature/quiz-v2` — do NOT push to main

## Bug Fixes (Priority 1)

### Number inputs jump to max value
The `clampValue` function in `QuizEngine.tsx` clamps on every keystroke. When user types "3" for age, it clamps to 18 (min). When they type "30", intermediate "3" gets clamped.

**Fix:** Only clamp on blur, not on change. Allow free typing, validate/clamp when the user leaves the field. Show validation error if out of range.

## UX Improvements (Priority 2)

### Imperial/Metric toggle for body metrics
- Add a toggle (default: imperial — ft/in + lbs) at the top of the bodyMetrics question
- Imperial inputs: feet (dropdown 4-7), inches (dropdown 0-11), weight in lbs
- Metric inputs: cm, kg (current behavior)
- Convert to metric internally before scoring (the API expects cm/kg)
- Use shadcn ToggleGroup for the unit toggle
- Use shadcn Select for feet/inches dropdowns
- Make height picker intuitive — NOT raw number input for imperial

### Better number inputs across the board
- Age: use a shadcn Input with proper debounced validation (no clamping on type)
- All number fields: validate on blur, show inline error if out of range
- Consider a stepper (+/- buttons) for age using shadcn Button

## New Question Types (Priority 3)

### Image/Icon Select
Add a new question type `icon-select` that renders options with emoji or icons above the label text. Use this for:
- **Exercise types** — show relevant emoji/icons (🚶 Walking, 🏃 Cardio, 💪 Strength, ⚡ HIIT, 🧘 Yoga, 🫀 Zone 2)
- **Diet pattern** — show food icons (🍔 Standard American, 🫒 Mediterranean, 🥑 Keto, 🥗 Plant-based, 🥩 Whole food)

### Gallery Grid Select
Add a new question type `gallery-select` that renders a responsive grid of visual cards. Use this for:
- **Sleep quality** — cards with bed/moon imagery and descriptions
- **Stress level** — visual faces/emoji representing stress levels instead of a slider
- **Social connections** — visual cards showing isolation → community

### Free-form Text
Add a new question type `text-input` with an optional textarea where users can add notes. Use this for:
- Add an optional "Anything else about your health you'd like to share?" question near the end
- Add optional notes field to chronic conditions question ("Tell us more about your conditions")
- The free-form text gets passed to the AI scoring API for richer analysis

## Content Improvements (Priority 4)

### More evidence-based questions
Research and add these science-backed questions to the introductory quiz:
1. **VO2 max proxy** — "Can you have a conversation while walking briskly uphill?" or similar cardiorespiratory fitness proxy
2. **Grip strength proxy** — "Can you open a tight jar lid easily?" (grip strength is a strong longevity predictor — Leong et al., Lancet 2015)
3. **Sitting time** — "How many hours per day do you spend sitting?" (sedentary behavior independent of exercise — Ekelund et al., Lancet 2016)
4. **Protein intake** — "How many protein-rich meals do you eat daily?" (muscle protein synthesis — Phillips et al.)
5. **Fasting glucose awareness** — "Do you know your fasting blood glucose level?" (metabolic health awareness)
6. **Mental health** — "How often do you feel anxious or depressed?" (mental health impacts physical longevity)
7. **Hydration** — "How much water do you drink daily?"
8. **Cold/heat exposure** — "Do you practice cold plunges, saunas, or deliberate temperature exposure?"

### Add scientific citations
Where relevant, add brief citation tooltips or footnotes to question descriptions. Example:
- Sleep: "Adults sleeping 7-8 hours show lowest all-cause mortality (Cappuccio et al., Sleep 2010)"
- Exercise: "150+ min/week moderate activity reduces mortality 31% (Arem et al., JAMA 2015)"
- Social: "Social isolation increases mortality risk comparable to smoking 15 cigarettes/day (Holt-Lunstad et al., 2015)"

### Update the fallback scorer and AI prompt
- Add scoring logic for new questions in `route.ts` `buildFallbackResult()`
- Update the AI system prompt to reference the new question types and free-form text
- Keep citations in the AI prompt so it can reference them in recommendations

## Advanced Assessment (Priority 5)

### Create a separate "Advanced Assessment" flow
- After completing the intro quiz and seeing results, offer "Want a deeper analysis? Take the Advanced Assessment"
- Route: `/quiz/healthspan/advanced`
- The advanced quiz should:
  1. **Import answers from the intro quiz** (don't re-ask what we already know)
  2. **Dynamically branch based on answers:**
     - If they exercise → ask about specific routines, estimate 1RM for key lifts (squat, bench, deadlift) based on reps/weight
     - If they lift weights → ask about training split, years training, whether they track progressive overload
     - If they selected chronic conditions → ask condition-specific follow-ups
     - If they have poor sleep → ask about sleep hygiene specifics (caffeine timing, screen time, room temp)
  3. **Body composition beyond BMI:**
     - "Have you ever had a DEXA scan?" → if yes, ask for body fat %
     - If no DEXA: show a grid of body fat % reference images (male/female) and ask them to pick closest match
     - Use visual body fat estimation for more accurate scoring than BMI alone
  4. **Biomarker awareness:**
     - "Do you track any of these biomarkers?" (HbA1c, lipid panel, hsCRP, testosterone/estrogen, thyroid)
     - If yes → ask for values where known
  5. **Advanced scoring** should weight these detailed inputs more heavily than the intro quiz estimates

### Body fat % visual picker
- Create a gallery-select with reference images showing different body fat percentages
- Separate galleries for male and female
- Use public domain / CC-licensed body composition reference images, or describe them clearly for the AI to generate
- Ranges: Male (8-10%, 12-15%, 18-20%, 25%+), Female (15-18%, 20-25%, 28-32%, 35%+)

## Technical Notes

### File structure
- Quiz config: `src/lib/quiz/healthspan-config.ts`
- Quiz types: `src/lib/quiz/healthspan-types.ts`
- Quiz UI engine: `src/components/quiz/QuizEngine.tsx`
- Quiz results: `src/components/quiz/QuizResult.tsx`
- API route: `src/app/api/quiz/healthspan/route.ts`
- Quiz page: `src/app/quiz/healthspan/page.tsx`
- Styles: `src/app/globals.css` (889 lines of custom CSS — migrate quiz styles to Tailwind)

### Current stack
- Next.js 16, React 19, TypeScript
- NO shadcn yet — needs to be initialized
- NO Tailwind yet in config (uses custom CSS vars in globals.css)
- Vercel AI SDK with Anthropic + xAI

### Migration approach
1. Install Tailwind CSS + shadcn/ui
2. Migrate quiz components to shadcn (keep existing site CSS for non-quiz pages to avoid breaking things)
3. New question types use shadcn exclusively
4. Don't break existing non-quiz pages — be surgical

### When finished
- Run `npm run build` and ensure clean build
- Commit all changes to `feature/quiz-v2` branch
- Push branch to GitHub
- Run: `openclaw system event --text "Done: Quiz V2 upgrade complete — shadcn, new question types, evidence-based content, advanced assessment" --mode now`
