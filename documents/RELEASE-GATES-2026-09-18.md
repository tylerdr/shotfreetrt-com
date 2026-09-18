# ShotFreeTRT release and revenue gates — September 18, 2026

## Status

PR #13 implements the concern-led education/quiz/return journey. It is **not production-accepted or revenue-activated**. Successful compilation is evidence of a working build, not evidence of safe dependencies, browser behavior, a custom-domain release, clinical approval, customer value or settled revenue.

## Verified application evidence

Head `1e6cf20940c64a7236ad60ab27256f87b3561a1b` was tested in GitHub Actions run [35395430216](https://github.com/tylerdr/shotfreetrt-com/actions/runs/35395430216), application job [105763073738](https://github.com/tylerdr/shotfreetrt-com/actions/runs/35395430216/job/105763073738). The checkout was the proposed merge of that head into main `205a12ba4ac7650ac2160ec79f135b38ddf97a4d`.

- 73/73 tests passed, zero failures.
- ESLint passed with zero errors and one existing warning in `commitlint.config.js`.
- Next.js 16.1.6 compiled and ran full TypeScript validation.
- 188/188 static/SSG pages generated, including all four topic and four concern-quiz routes.
- The prior failing test asserted the obsolete `disabled={!currentAnswer}` implementation. It now checks the stronger valid-option guard and includes a behavioral regression proving truthy invalid option IDs cannot generate a brief. The code was not weakened to satisfy a string test.

Additional built-HTML acceptance is provided by `scripts/check-built-journeys.mjs`. It inspects actual prerendered files without a browser or external requests. CI builds with a non-production GA test identifier to prove the main root contains the configured loader while isolated topic/quiz/worksheet documents do not. This test build is never deployed or uploaded. Its exact run result must be checked separately; script existence alone is not a passing receipt.

The CI application job uses a standard GitHub-hosted public-repository runner, read-only repository permissions and no secrets, deployment step, browser automation, artifact upload or configured cache. It automatically skips on a private repository rather than assuming paid minutes are approved. The old docs-only check remains but is no longer presented as application validation.

## Dependency findings: unresolved release gate

The same run's production-dependency audit (`npm audit --omit=dev`) reported **11 affected package entries**: six low, one moderate, three high and one critical. The all-dependency install summary reported 24 entries. Counts are package-level audit classifications, not a count of independently exploitable application paths or proof of compromise.

The critical classification is for the existing pinned `next@16.1.6`, including two August 25, 2026 maintainer advisories:

- [GHSA-2xp9-vwfh-vxw4](https://github.com/vercel/next.js/security/advisories/GHSA-2xp9-vwfh-vxw4): image optimization involving AVIF and the underlying libheif dependency. The advisory identifies 16.3.3 as a patched version. Actual exposure depends on image handling and deployment; this review did not demonstrate exploitability or exploitation.
- [GHSA-p293-qw3h-jr36](https://github.com/vercel/next.js/security/advisories/GHSA-p293-qw3h-jr36): Windows-hosted filesystem behavior, patched in 16.3.3. Do not report this as an established Windows deployment issue on Vercel without runtime evidence.

The audit also listed Next.js request/response, image and server-component advisories; transitive `sharp`, `postcss` and `nanoid` high entries; a moderate `baseline-browser-mapping` entry; and low AI SDK dependency entries. Some reported paths may be inactive or build-time-only in this application. No blanket dismissal based on a version scan is appropriate either.

The audit recommends **Next.js 16.3.5**, a real [maintainer release](https://github.com/vercel/next.js/releases/tag/v16.3.5) dated September 11. This is a remediation candidate, not a tested upgrade performed by this PR. The runtime audit step is explicitly reporting-only; a green CI badge does not approve its findings.

### Required remediation acceptance

1. Upgrade Next.js to a verified supported patched version and align the related tooling where required. Regenerate and commit the actual lockfile; do not merely change the version string or delete the lockfile.
2. Audit the resolved production dependency tree again, review any remaining high/critical findings and document applicability. Do not use `npm audit fix --force` blindly.
3. Re-run locked installation, all tests, lint, full type validation/build, generated-route checks, image handling and private-root navigation on the changed dependency tree.
4. Keep this dependency correction separate and reviewable. It should be reusable as a platform lesson, not silently applied across unrelated ventures without their compatibility checks.

No dependency versions, authentication permissions, provider settings or billing configuration were changed in response to these findings. The current branch is held in draft pending remediation/review; no security clearance is claimed.

## Deployment verification remains open

Diagnostic PR #12 really merged at `205a12ba4ac7650ac2160ec79f135b38ddf97a4d`. Vercel listed a READY production-target deployment `dpl_CVDbyuwHkZBwmLZ21LSqEkvbGtRz` for that revision, but a subsequent lookup of `shotfreetrt.com` still returned older deployment `dpl_9nZFzYSLB7hLctv4jP8Uy9rnZ1ob`, revision `ee2b5ca36fde9f4f605687db84170ba466f564e9`. Treat this as conflicting/incomplete deployment evidence, not proof of a live update. The web reader could not fetch `/api/release` and still returned the pre-journey homepage.

The new PR's first Vercel preview failed the obsolete test before its correction. Vercel's exposed build-log and deploy actions returned tool-not-found errors; preview share-link generation failed. Later preview states must be read against their exact SHA, not inferred from a GitHub commit.

After approved deployment, run `node scripts/verify-production-funnel.mjs <approved-merge-sha>` and verify root and www aliases, the release endpoint/header, the four public topics, four quiz variants, canonicals, sitemap and illustrations. This checker is HTTP-only. Integrated browser/mobile/keyboard/print/download/clipboard and network checks remain distinct requirements.

## Revenue: actual missing business prerequisites

No approved ShotFreeTRT-specific paid offer or signed affiliate agreement was established in the inspected records. A narrow live Stripe product-name search for `ShotFree` returned no matches; this is not a complete catalog/alias audit. The earlier $49 dossier and clinic setup/retainer proposals must not be treated as accepted offers.

Before a real paid or commission-bearing funnel can be called ready, record the authorized offer/partner, exact terms and price/commission, marketing disclosures, deliverable acceptance, payment/refund or commission reconciliation, tested fulfillment and an agent-owned support path. Keep clinical decisions separate from any commercial optimization. Free-quiz completion, an outbound click or a downloaded reminder is not revenue.

No checkout, affiliate activation, email campaign, customer billing or automatic calendar write was performed. The new generic share and calendar features are user-initiated utility, not a measured referral or retention engine.

## Next owned work

The build/QA role owns dependency correction and exact-head acceptance; the release role owns custom-domain reconciliation; the commercial role prepares a bounded offer or specific partner agreement for the required approval. Tyler is not assigned recurring fulfillment. These are recorded next actions, not already dispatched Amble tasks. Amble access was not discovered; canonical reconciliation remains pending without a fabricated receipt.
