# Stripe Checkout Integration — AliveLongevity

## Goal
Wire Stripe Checkout to the "Longevity Blueprint" guide page. Convert from free PDF download to paid checkout ($19).

## Stripe Details
- Price ID: `price_1T7LXwCrDNIXmbyxFxKhIyOT`
- Amount: $19
- Product: The Longevity Blueprint (2026 Edition)
- Stripe keys are in environment: STRIPE_PUBLISHABLE_KEY, STRIPE_SECRET_KEY

## What to Build

### 1. Install stripe package
```bash
npm install stripe
```

### 2. Create API route: `src/app/api/checkout/route.ts`
- POST endpoint that creates a Stripe Checkout Session
- mode: 'payment' (one-time)
- line_items: the price ID above
- success_url: `{origin}/guides/longevity-blueprint/success?session_id={CHECKOUT_SESSION_ID}`
- cancel_url: `{origin}/guides/longevity-blueprint`
- Read STRIPE_SECRET_KEY from process.env

### 3. Create success page: `src/app/guides/longevity-blueprint/success/page.tsx`
- Thank you message
- Direct download link to the PDF: `/longevity-blueprint.pdf`
- Style consistent with existing site (green/nature theme with .hero, .card, .cta-button classes)
- Include a "Return to AliveLongevity" link

### 4. Update guide page: `src/app/guides/longevity-blueprint/page.tsx`
- Change from free download to paid:
  - Change crossed-out "$24" + "FREE" to just "$19"
  - Replace "Download Free PDF Guide" link with a buy button that POSTs to /api/checkout
  - Keep all existing sections (TOC, what you'll learn, who it's for, FAQ, newsletter)
  - Update schema.org Product offers price from "0" to "19"
- The buy button needs to be a client component

### 5. Create a BuyButton client component: `src/components/BuyButton.tsx`
- 'use client'
- onClick: POST to /api/checkout, get back {url}, redirect with window.location.href
- Loading state
- Style: green button matching existing cta-button style (background: #22c55e, color: #000, borderRadius: 12, fontWeight: 600)

## Important
- This is Next.js 16.1.6 (uses src/app/)
- Uses custom CSS classes (.hero, .card, .cta-button, etc.) — NOT shadcn
- Has a NewsletterCTA component already imported
- Keep existing page structure, just swap CTAs
- PDF stays in public/ for post-purchase download
- Build must pass: `npm run build`

## After Done
Commit all changes with message "feat: wire Stripe checkout to longevity blueprint ($19)"
Then run: openclaw system event --text "Done: AliveLongevity Stripe checkout wired ($19)" --mode now
