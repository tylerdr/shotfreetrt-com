import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  buildDecisionBrief,
  isQuizComplete,
  QUIZ_QUESTIONS
} from "../src/lib/quiz/decision-quiz.ts";

const FULL_ANSWERS = {
  intent: "comparing-providers",
  testingStage: "not-tested",
  fertilityPriority: "high",
  routePreference: "avoid",
  costClarity: "no-idea",
  timing: "this-month"
};

test("quiz has exactly 6 questions, each with 4 options and no lab/symptom inputs", () => {
  assert.equal(QUIZ_QUESTIONS.length, 6);
  const forbidden = /\b(testosterone level|ng\/dl|lh\b|fsh\b|prolactin|hematocrit|psa\b)/i;
  for (const question of QUIZ_QUESTIONS) {
    assert.equal(question.options.length, 4, `${question.id} should have 4 options`);
    assert.doesNotMatch(question.title, forbidden);
    assert.doesNotMatch(question.helpText, forbidden);
    for (const option of question.options) {
      assert.doesNotMatch(option.label, forbidden);
    }
  }
});

test("brief is null until every question is answered (required-answer gating)", () => {
  assert.equal(isQuizComplete({}), false);
  assert.equal(buildDecisionBrief({}), null);

  const partial = { ...FULL_ANSWERS };
  delete partial.timing;
  assert.equal(isQuizComplete(partial), false);
  assert.equal(buildDecisionBrief(partial), null);

  assert.equal(isQuizComplete(FULL_ANSWERS), true);
  assert.notEqual(buildDecisionBrief(FULL_ANSWERS), null);
});

test("brief never contains a numeric score or candidacy field", () => {
  const brief = buildDecisionBrief(FULL_ANSWERS);
  assert.equal("score" in brief, false);
  assert.equal("candidacyScore" in brief, false);
  assert.equal("priority" in brief, false);
  const serialized = JSON.stringify(brief);
  assert.doesNotMatch(serialized.toLowerCase(), /candidacy|"score"/);
});

test("situation summary has one line per answered question, traceable to that answer", () => {
  const brief = buildDecisionBrief(FULL_ANSWERS);
  assert.equal(brief.situationSummary.length, 6);
  assert.match(brief.situationSummary[0], /actively comparing clinics or providers/i);
  assert.match(brief.situationSummary[2], /fertility soon is a high priority/i);
});

test("fertility question is prioritized with a reason when fertility matters", () => {
  const brief = buildDecisionBrief(FULL_ANSWERS);
  const fertilityItem = brief.prioritizedQuestions.find((item) =>
    item.question.toLowerCase().includes("children")
  );
  assert.ok(fertilityItem, "expected the fertility visit-question to be present");
  assert.equal(brief.prioritizedQuestions[0].question, fertilityItem.question);
  assert.match(fertilityItem.reason, /fertility matters/i);
});

test("fertility question is not force-boosted when fertility is not a priority", () => {
  const brief = buildDecisionBrief({
    ...FULL_ANSWERS,
    fertilityPriority: "not-priority"
  });
  const fertilityItem = brief.prioritizedQuestions.find((item) =>
    item.question.toLowerCase().includes("children")
  );
  assert.ok(fertilityItem);
  assert.equal(fertilityItem.reason, null);
});

test("cost-unclear answers surface pricing pages as the next action", () => {
  const brief = buildDecisionBrief({ ...FULL_ANSWERS, costClarity: "no-idea" });
  assert.equal(brief.primaryAction.href, "/pricing");

  const withQuote = buildDecisionBrief({ ...FULL_ANSWERS, costClarity: "multiple-quotes" });
  assert.equal(withQuote.primaryAction.href, "/decision-guide");
});

test("reading paths always resolve, cap at 3, and never duplicate", () => {
  for (const intent of QUIZ_QUESTIONS[0].options) {
    const brief = buildDecisionBrief({ ...FULL_ANSWERS, intent: intent.id });
    assert.ok(brief.readingPaths.length >= 1 && brief.readingPaths.length <= 3);
    const hrefs = brief.readingPaths.map((path) => path.href);
    assert.equal(new Set(hrefs).size, hrefs.length);
  }
});

test("quiz engine keeps answers in component memory only: no fetch, storage, or analytics", () => {
  const component = readFileSync(
    new URL("../src/components/quiz/DecisionQuizEngine.tsx", import.meta.url),
    "utf8"
  );
  assert.doesNotMatch(
    component,
    /fetch\(|localStorage\.|sessionStorage\.|sendBeacon|gtag\(|trackEvent\(|trackPageView\(|trackCtaClick\(|XMLHttpRequest/
  );
  assert.match(component, /window\.print\(\)/);
  assert.match(component, /Back/);
  assert.match(component, /disabled=\{!currentAnswer\}/);
});

test("retired quiz routes redirect instead of rendering a fake score, and stay live", () => {
  const files = [
    "../src/app/quiz/page.tsx",
    "../src/app/quiz/healthspan/advanced/page.tsx",
    "../src/app/quiz/healthspan/result/[shareId]/page.tsx"
  ];
  for (const file of files) {
    const source = readFileSync(new URL(file, import.meta.url), "utf8");
    assert.match(source, /redirect\(/, `${file} should redirect`);
    assert.doesNotMatch(
      source,
      /QuizResult|QuizEngine|AdvancedQuizEngine|api\/quiz\/healthspan/,
      `${file} should not render or call the retired scoring UI/API`
    );
  }
});

test("the real quiz entry page renders the deterministic engine, not the retired scoring UI", () => {
  const source = readFileSync(
    new URL("../src/app/quiz/healthspan/page.tsx", import.meta.url),
    "utf8"
  );
  assert.match(source, /DecisionQuizEngine/);
  assert.doesNotMatch(source.toLowerCase(), /candidacy|roast/);
});
