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
  assert.equal(
    existsSync(new URL("../src/app/guides/longevity-blueprint/success/page.tsx", import.meta.url)),
    false
  );
  const guidePage = read("../src/app/guides/longevity-blueprint/page.tsx");
  assert.doesNotMatch(guidePage, /\$19|BuyButton|Purchase Complete/);
  assert.match(guidePage, /longevity-blueprint\.pdf/);
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

test("no source file references the retired candidacy-score or Roast Me quiz", () => {
  const filesToCheck = [
    "../src/app/page.tsx",
    "../src/app/decision-guide/page.tsx",
    "../src/app/resources/page.tsx",
    "../src/app/start-here/page.tsx",
    "../src/app/about/page.tsx"
  ];
  for (const file of filesToCheck) {
    const source = read(file);
    assert.doesNotMatch(source.toLowerCase(), /roast me|candidacy score/);
  }
});

test("og image metadata dimensions match the real file", () => {
  const layout = read("../src/app/layout.tsx");
  assert.match(layout, /width: 1024, height: 1024/);
});

test("GSC verification token is preserved", () => {
  const layout = read("../src/app/layout.tsx");
  assert.match(layout, /eFS_GYPi2qp4xAw2BQ1BEaj0aA8-X5NpuY8rxCfKmpU/);
});
