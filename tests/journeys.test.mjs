import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { journeys, getJourney, quizPath, journeyForArticle, journeySources, SHARE_GUIDE_URL } from '../src/lib/journeys.ts';
import { QUIZ_QUESTIONS, buildDecisionBrief } from '../src/lib/quiz/decision-quiz.ts';
import { buildBriefReminder } from '../src/lib/brief-reminder.ts';
const read = path => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const canonicalIds = QUIZ_QUESTIONS.map(q => q.id).sort();

test('four distinct, static decision-concern routes', () => {
 assert.equal(journeys.length,4); assert.equal(new Set(journeys.map(j=>j.slug)).size,4);
 assert.equal(getJourney('not-a-topic'),undefined);
});
for(const journey of journeys){
 test(`${journey.slug}: asks the same six questions once, without assumed answers`, () => {
  assert.deepEqual([...journey.questionOrder].sort(),canonicalIds);
  assert.equal(new Set(journey.questionOrder).size,6);
  assert.equal('answers' in journey,false); assert.equal('prefill' in journey,false);
  assert.equal(buildDecisionBrief({}),null);
 });
 test(`${journey.slug}: has unique useful content, valid artwork and sources`, () => {
  assert.equal(journey.lessons.length,3); assert.equal(journey.preview.length,3); assert.equal(journey.faqs.length,3);
  assert.ok(existsSync(new URL(`../public${journey.image}`,import.meta.url)));
  for(const item of [...journey.lessons,...journey.faqs])if(item.source)assert.ok(journeySources[item.source]);
  assert.ok(quizPath(journey).startsWith('/quiz/concern/')); assert.ok(!quizPath(journey).includes('?'));
 });
 test(`${journey.slug}: reordering cannot change the result for identical answers`, () => {
  const answers=Object.fromEntries(QUIZ_QUESTIONS.map(q=>[q.id,q.options[0].id]));
  const reordered=Object.fromEntries(journey.questionOrder.map(id=>[id,answers[id]]));
  assert.deepEqual(buildDecisionBrief(reordered),buildDecisionBrief(answers));
 });
}
test('clinical source links are primary HTTPS references', () => {
 for(const source of Object.values(journeySources)){ const url=new URL(source.url);assert.equal(url.protocol,'https:');assert.ok(['www.endocrine.org','www.fda.gov'].includes(url.hostname)); }
});
test('contextual article routing is explicit and unknown articles get no inferred condition', () => {
 assert.equal(journeyForArticle('oral-testosterone')?.slug,'needle-free-options');
 assert.equal(journeyForArticle('trt-cost-2026')?.slug,'clinic-costs');
 assert.equal(journeyForArticle('unmapped-article'),undefined);
});
test('topics and quiz variants use isolated root; unknown slugs fail closed', () => {
 for(const path of ['src/app/(isolated)/topics/page.tsx','src/app/(isolated)/topics/[slug]/page.tsx','src/app/(isolated)/quiz/concern/[slug]/page.tsx'])assert.ok(existsSync(new URL(`../${path}`,import.meta.url)));
 assert.match(read('src/app/(isolated)/topics/[slug]/page.tsx'),/notFound\(\)/);
 assert.match(read('src/app/(isolated)/quiz/concern/[slug]/page.tsx'),/notFound\(\)/);
 assert.doesNotMatch(read('src/app/(isolated)/layout.tsx'),/<GoogleAnalytics|<AnalyticsProvider/);
});
test('public topic metadata is canonical; quiz variants are noindex and excluded from sitemap', () => {
 assert.match(read('src/app/(isolated)/topics/[slug]/page.tsx'),/BreadcrumbList/);
 assert.match(read('src/app/(isolated)/topics/[slug]/page.tsx'),/canonical:/);
 assert.match(read('src/app/(isolated)/quiz/concern/[slug]/page.tsx'),/index: false/);
 assert.doesNotMatch(read('src/app/sitemap.ts'),/url:.*quiz\/concern/);
});
test('new selection and response flows have no automatic network or persistent storage calls', () => {
 for(const path of ['src/components/quiz/DecisionQuizEngine.tsx','src/components/journeys/BriefNextSteps.tsx'])assert.doesNotMatch(read(path),/\bfetch\(|sendBeacon\(|localStorage\.|sessionStorage\.|gtag\(|trackEvent\(/);
 assert.match(read('src/components/quiz/DecisionQuizEngine.tsx'),/useState<QuizAnswers>\(\{\}\)/);
 assert.match(read('src/components/journeys/BriefNextSteps.tsx'),/clipboard.writeText\(SHARE_GUIDE_URL\)/);
 assert.equal(SHARE_GUIDE_URL,'https://shotfreetrt.com/');
});
test('generic calendar export has correct exclusive end date and no health answers', () => {
 const text=buildBriefReminder(new Date(2026,8,18,12,0,0),'test-id');
 assert.ok(text.includes('DTSTART;VALUE=DATE:20260925\r\n'));
 assert.ok(text.includes('DTEND;VALUE=DATE:20260926\r\n'));
 assert.ok(text.endsWith('END:VCALENDAR\r\n'));
 assert.doesNotMatch(text,/fertility|testosterone|diagnosis|symptom|email|RRULE/i);
 assert.match(text,/SUMMARY:Review my checklist/);
});
test('calendar export handles month/year boundaries without custom patient inputs', () => {
 const text=buildBriefReminder(new Date(2026,11,28,12),'year-end');
 assert.match(text,/DTSTART;VALUE=DATE:20270104/); assert.match(text,/DTEND;VALUE=DATE:20270105/);
 assert.throws(()=>buildBriefReminder(new Date('invalid'),'id'),TypeError);
 assert.throws(()=>buildBriefReminder(new Date(),'id\r\nATTENDEE:other'),TypeError);
});
test('sticky mobile CTA has bottom clearance and is absent in print', () => {
 const text=read('src/app/(isolated)/topics/[slug]/page.tsx');
 assert.match(text,/pb-24/);assert.match(text,/safe-area-inset-bottom/);assert.match(text,/md:hidden print:hidden/);
});
