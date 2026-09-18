import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { isAnalyticsExemptPath } from "../src/lib/analytics.ts";

function read(relativePath) {
  return readFileSync(new URL(relativePath, import.meta.url), "utf8");
}

test("newsletter API fails closed: no filesystem persistence, no fake success", () => {
  const source = read("../src/app/api/newsletter/route.ts");
  assert.doesNotMatch(source, /writeFile|readFile|fs\.|subscribers\.json/);
  assert.match(source, /status: 503/);
  assert.doesNotMatch(source, /status: 200|status: 201/);
});

test("newsletter CTA is a real link, not a dead form posting nowhere", () => {
  const source = read("../src/components/NewsletterCTA.tsx");
  assert.doesNotMatch(source, /<form|action="#"/);
  assert.match(source, /href="\/decision-guide"|href=\{href\}/);
});

test("purchase flow is fully disabled: no BuyButton, checkout route, or $19 claim", () => {
  assert.equal(existsSync(new URL("../src/components/BuyButton.tsx", import.meta.url)), false);
  assert.equal(existsSync(new URL("../src/app/api/checkout/route.ts", import.meta.url)), false);
  const guidePage = read("../src/app/(main)/guides/longevity-blueprint/page.tsx");
  assert.doesNotMatch(guidePage, /\$19|BuyButton|Purchase Complete/);
  assert.match(guidePage, /longevity-blueprint\.pdf/);
});

test("longevity-blueprint success URL is a compatibility redirect, not a fake purchase-complete page", () => {
  const source = read("../src/app/(main)/guides/longevity-blueprint/success/page.tsx");
  assert.match(source, /redirect\("\/guides\/longevity-blueprint"\)/);
  const nonCommentLines = source
    .split("\n")
    .filter((line) => !line.trim().startsWith("//"))
    .join("\n");
  assert.doesNotMatch(nonCommentLines, /Purchase Complete|session_id.*verified|verified.*purchase/i);
});

test("longevity-blueprint guide source has no stale price and no unqualified outcome guarantees", () => {
  const source = read("../guides/longevity-blueprint.md");
  assert.doesNotMatch(source, /\$24/);
  assert.match(source, /shotfreetrt\.com/i);
  assert.doesNotMatch(source, /Most adults can generate major improvements/);
});

test("legacy quiz API is removed, not just unlinked", () => {
  assert.equal(
    existsSync(new URL("../src/app/api/quiz/healthspan/route.ts", import.meta.url)),
    false
  );
});

test("quiz and decision-guide screens are exempt from page-view analytics", () => {
  assert.equal(isAnalyticsExemptPath("/quiz/healthspan"), true);
  assert.equal(isAnalyticsExemptPath("/quiz/healthspan/advanced"), true);
  assert.equal(isAnalyticsExemptPath("/decision-guide"), true);
  assert.equal(isAnalyticsExemptPath("/pricing"), false);
  assert.equal(isAnalyticsExemptPath("/"), false);
});

test("analytics provider and GA component both honor the exemption", () => {
  const provider = read("../src/components/analytics-provider.tsx");
  assert.match(provider, /isAnalyticsExemptPath/);
  const ga = read("../src/components/GoogleAnalytics.tsx");
  assert.match(ga, /isAnalyticsExemptPath/);
  assert.match(ga, /send_page_view:\s*false/);
});

test("quiz and decision-guide sit under a separate root layout that never renders GA or the Supabase tracker", () => {
  assert.equal(existsSync(new URL("../src/app/(isolated)/layout.tsx", import.meta.url)), true);
  assert.equal(existsSync(new URL("../src/app/(isolated)/quiz", import.meta.url)), true);
  assert.equal(existsSync(new URL("../src/app/(isolated)/decision-guide", import.meta.url)), true);
  const isolatedLayout = read("../src/app/(isolated)/layout.tsx");
  assert.doesNotMatch(isolatedLayout, /from "@\/components\/GoogleAnalytics"|from "@\/components\/analytics-provider"|<GoogleAnalytics|<AnalyticsProvider/);
  const mainLayout = read("../src/app/(main)/layout.tsx");
  assert.match(mainLayout, /from "@\/components\/GoogleAnalytics"/);
  assert.match(mainLayout, /from "@\/components\/analytics-provider"/);
});

test("no source file references the retired candidacy-score or Roast Me quiz", () => {
  const filesToCheck = [
    "../src/app/(main)/page.tsx",
    "../src/app/(isolated)/decision-guide/page.tsx",
    "../src/app/(main)/resources/page.tsx",
    "../src/app/(main)/start-here/page.tsx",
    "../src/app/(main)/about/page.tsx"
  ];
  for (const file of filesToCheck) {
    const source = read(file);
    assert.doesNotMatch(source.toLowerCase(), /roast me|candidacy score/);
  }
});

test("og image metadata dimensions match the real file, including the homepage's own openGraph override", () => {
  const layout = read("../src/app/(main)/layout.tsx");
  assert.match(layout, /width: 1024, height: 1024/);
  const home = read("../src/app/(main)/page.tsx");
  assert.match(home, /width: 1024, height: 1024/);
});

test("GSC verification token is preserved", () => {
  const siteMetadata = read("../src/app/site-metadata.ts");
  assert.match(siteMetadata, /eFS_GYPi2qp4xAw2BQ1BEaj0aA8-X5NpuY8rxCfKmpU/);
  const mainLayout = read("../src/app/(main)/layout.tsx");
  const isolatedLayout = read("../src/app/(isolated)/layout.tsx");
  assert.match(mainLayout, /baseSiteMetadata/);
  assert.match(isolatedLayout, /baseSiteMetadata/);
});

test("quiz privacy copy distinguishes no-transmission from no-collection and does not claim leaving the page destroys data", () => {
  const engine = read("../src/components/quiz/DecisionQuizEngine.tsx");
  assert.doesNotMatch(engine, /No symptoms, lab values, or health details are collected/);
  assert.doesNotMatch(engine, /leave the page|leaving the page/i);
});
