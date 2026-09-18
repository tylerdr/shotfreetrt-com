import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = (path) => readFileSync(path, "utf8");
const homepage = read("src/app/(main)/page.tsx");
const config = read("next.config.mjs");
const route = read("src/app/api/release/route.ts");

const retiredHomepageClaims = [
  "Start AI Testosterone Plan",
  "let AI build your 30-day game plan",
  "The 4-block Shot Free TRT system",
  "Best first move for most guys",
  "EVERY CLAIM SOURCED",
  "highest-leverage 30-day protocol",
];

test("decision-first homepage contract cannot silently regress to retired treatment-plan copy", () => {
  for (const claim of retiredHomepageClaims) {
    assert.ok(!homepage.includes(claim), `retired homepage claim returned: ${claim}`);
  }
  assert.match(homepage, /Considering TRT\?/);
  assert.match(homepage, /Compare before/);
  assert.match(homepage, /No treatment score\. Education, not medical care\./);
  assert.match(homepage, /Clinical decisions require a licensed clinician/);
});

test("every hosted response exposes a release and copy-contract marker", () => {
  assert.match(config, /VERCEL_GIT_COMMIT_SHA/);
  assert.match(config, /X-ShotFreeTRT-Release/);
  assert.match(config, /X-ShotFreeTRT-Copy-Contract/);
  assert.match(config, /decision-first-v1/);
});

test("release endpoint is structured, uncached, and tied to the deployed Git revision", () => {
  assert.match(route, /VERCEL_GIT_COMMIT_SHA/);
  assert.match(route, /decision-first-v1/);
  assert.match(route, /no-store, max-age=0/);
  assert.match(route, /X-Content-Type-Options/);
});
