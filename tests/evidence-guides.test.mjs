import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { evidenceGuides, evidenceSources, renderEvidenceGuide, oralMonitoringWindows, billingIllustration, escapeHtml } from '../src/data/evidence-guides.ts';

const read = path => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const expectedSlugs = ['enclomiphene-vs-trt','oral-testosterone','trt-cost-2026'];
test('refresh targets exactly three established URLs, with no duplicates', () => assert.deepEqual(evidenceGuides.map(g=>g.slug),expectedSlugs));
test('all source URLs use HTTPS and no affiliate query', () => {
 for (const source of Object.values(evidenceSources)) { assert.equal(new URL(source.url).protocol,'https:'); assert.doesNotMatch(source.url,/utm_|affiliate|ref=/); }
});
for (const guide of evidenceGuides) {
 const html = renderEvidenceGuide(guide);
 test(`${guide.slug}: substantial article body`, () => assert.ok(html.replace(/<[^>]*>/g,' ').split(/\s+/).length >= 800));
 test(`${guide.slug}: unique section ids and working TOC anchors`, () => {
  const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
  assert.equal(new Set(ids).size,ids.length);
  for(const match of html.matchAll(/href="#([^"]+)"/g))assert.ok(ids.includes(match[1]),`Missing anchor ${match[1]}`);
 });
 test(`${guide.slug}: source references match the article's bibliography`, () => {
  const used = new Set([...guide.sections.map(s=>s.html),...guide.faqItems.map(f=>f.sources.map(id=>`#evidence-source-${id}`).join(' '))].join(' ').match(/#evidence-source-[a-z0-9]+/g));
  assert.deepEqual([...used].sort(),guide.sourceIds.map(id=>`#evidence-source-${id}`).sort());
 });
 test(`${guide.slug}: visible FAQ text is the metadata source`, () => {
  for(const faq of guide.faqItems) { assert.ok(html.includes(`<h3>${faq.q}</h3>`)); assert.ok(html.includes(`<p>${faq.a}`)); }
 });
 test(`${guide.slug}: no individualized score or dosage recipe`, () => {
  assert.doesNotMatch(html,/\b\d+(?:\.\d+)?\s*mg\b|TRT candidacy score|guaranteed pregnancy|Start AI Testosterone Plan/i);
  assert.ok(html.includes('No clinician-review credential is claimed'));
 });
 test(`${guide.slug}: exact free funnel destinations`, () => {
  assert.ok(html.includes('href="/quiz/healthspan"'));
  assert.ok(html.includes('href="/decision-guide"'));
  assert.doesNotMatch(html,/<form|<script|onerror=|onclick=|javascript:/i);
 });
 test(`${guide.slug}: desktop/mobile assets exist with accessible titles`, () => {
  for(const path of [guide.diagram,guide.diagram.replace('.svg','-mobile.svg')]){
   const url=new URL(`../public${path}`,import.meta.url); assert.ok(existsSync(fileURLToPath(url)));
   const svg=readFileSync(url,'utf8'); assert.match(svg,/<title id="title">/); assert.match(svg,/<desc id="desc">/);
   assert.doesNotMatch(svg,/<script|<image|http[^\s]+\.(png|jpg)/i);
  }
  assert.match(html,/<source media="\(max-width: 600px\)"/);
 });
}
test('monitoring windows match the three current labels', () => assert.deepEqual(oralMonitoringWindows.map(({product,start,end})=>[product,start,end]),[['Kyzatrex',3,5],['Jatenzo',6,6],['Tlando',8,9]]));
test('annualized budget is not advance-billed cash', () => {
 const b=billingIllustration(); assert.equal(b.monthlyAnnualCents,238800); assert.equal(b.fourWeekAnnualizedCents,259411); assert.equal(b.first365DaysAdvanceBilledCents,278600);
 assert.equal(b.advanceChargeDays.length,14); assert.equal(b.advanceChargeDays[0],0); assert.equal(b.advanceChargeDays.at(-1),364);
});
test('illustration rejects unsafe numeric inputs', () => { for(const n of [-1,NaN,Infinity,0.5,10000001])assert.throws(()=>billingIllustration(n),RangeError); });
test('HTML attribute escape covers quotes and markup', () => assert.equal(escapeHtml(`<a x="'&">`),'&lt;a x=&quot;&#39;&amp;&quot;&gt;'));
test('all article consumers use the shared catalog', () => {
 for(const path of ['src/app/(main)/blog/[slug]/page.tsx','src/app/(main)/blog/page.tsx','src/components/RelatedLinks.tsx','src/app/sitemap.ts']){
  assert.match(read(path),/@\/data\/article-catalog/); assert.doesNotMatch(read(path),/@\/data\/articles["']/);
 }
});
test('catalog preserves publication history, replaces body and FAQs, and strips listing bodies', () => {
 const source=read('src/data/article-catalog.ts');
 for(const fragment of ['publishedAt: article.publishedAt','content: renderEvidenceGuide(guide)','guide.faqItems.map','content: undefined, sections: [], faqItems: undefined'])assert.ok(source.includes(fragment));
 assert.match(read('src/app/(main)/blog/page.tsx'),/posts\.map\(toArticleListing\)/);
});
test('updated date, safe JSON and explicit OG image are rendered', () => {
 const source=read('src/app/(main)/blog/[slug]/page.tsx');
 assert.match(source,/Updated <time/); assert.ok(source.includes('JSON.stringify(value).replace(/</g,')); assert.match(source,/images: \[\{ url: "\/og-shotfreetrt.png"/);
});
