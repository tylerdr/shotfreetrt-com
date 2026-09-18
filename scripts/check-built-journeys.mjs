// Static production-build acceptance. No browser, network or customer input.
import assert from 'node:assert/strict';
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import path from 'node:path';
const root = path.resolve('.next/server/app');
const files = [];
function walk(dir) { for (const entry of readdirSync(dir, { withFileTypes: true })) { const absolute = path.join(dir, entry.name); if (entry.isDirectory()) walk(absolute); else files.push(absolute); } }
walk(root);
function htmlFor(route) {
 const suffix = route === '/' ? '/index.html' : `${route}.html`;
 const matches = files.filter(file => file.endsWith(suffix));
 assert.equal(matches.length,1,`Exactly one prerendered page for ${route}`);
 return readFileSync(matches[0], 'utf8');
}
function tags(html, name) {
 return (html.match(new RegExp(`<${name}\\b[^>]*>`, 'gi')) || []).map(raw => Object.fromEntries([...raw.matchAll(/([\w:-]+)=["']([^"']*)["']/g)].map(match => [match[1].toLowerCase(),match[2]])));
}
const slugs = ['energy-and-testing','fertility-questions','needle-free-options','clinic-costs'];
const routes = ['/topics', ...slugs.map(s=>`/topics/${s}`), ...slugs.map(s=>`/quiz/concern/${s}`), '/quiz/healthspan', '/decision-guide'];
const results = [];
for (const route of routes) {
 const html = htmlFor(route);
 assert.equal((html.match(/<h1(?:\s|>)/g) || []).length,1,`${route}: one visible H1`);
 assert.equal(tags(html,'link').find(tag=>tag.rel==='canonical')?.href,`https://shotfreetrt.com${route}`,`${route}: canonical`);
 assert.ok(!html.includes('googletagmanager.com/gtag/js'),`${route}: no GA loader in isolated document`);
 if (route.startsWith('/quiz/concern/')) {
   assert.match(tags(html,'meta').find(tag=>tag.name==='robots')?.content || '', /noindex/, `${route}: quiz noindex`);
   assert.ok(html.includes('Question ') && html.includes('of ') && html.includes('No answer is preselected'),`${route}: actual quiz opening`);
 }
 if (route.startsWith('/topics/')) {
   assert.ok(html.includes('BreadcrumbList'),`${route}: breadcrumb schema`);
   assert.ok(html.includes(`/quiz/concern/${route.split('/').at(-1)}`),`${route}: contextual CTA`);
   assert.ok(tags(html,'meta').some(tag=>tag.property==='og:image'),`${route}: explicit OG image`);
 }
 results.push({route,canonical:true,singleH1:true,noMarketingLoader:true});
}
// A CI-only test identifier makes the isolation check non-vacuous. Never upload
// this test build to production; normal Vercel builds use their configured env.
if (process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID === 'G-SFTCHECK00') assert.ok(htmlFor('/').includes('googletagmanager.com/gtag/js'),'Main root must contain the configured test loader');
for (const id of ['04','06','07','10']) assert.ok(existsSync(`public/media/sft-web-batch3-${id}.webp`),`Existing illustration ${id}`);
const sitemapPath = files.find(file=>file.endsWith('/sitemap.xml.body'));
assert.ok(sitemapPath,'Prerendered sitemap exists');
const sitemap = readFileSync(sitemapPath,'utf8');
for(const slug of slugs) assert.ok(sitemap.includes(`https://shotfreetrt.com/topics/${slug}`));
assert.ok(!sitemap.includes('/quiz/concern/'),'Private quiz variants excluded from sitemap');
console.log(JSON.stringify({tier:'built-html-v1',pages:results.length,results,limitations:['Not a browser interaction or accessibility test','Not proof of deployment, indexing, medical review or payment fulfillment']},null,2));
