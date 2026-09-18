// Read-only HTTP acceptance check. Does not simulate a browser or a purchase.
// Usage: node scripts/verify-production-funnel.mjs <expected-40-character-merge-sha>
import assert from 'node:assert/strict';
const expected = process.argv[2];
assert.match(expected ?? '', /^[a-f0-9]{40}$/, 'Pass the exact approved production Git SHA');
const origin = 'https://shotfreetrt.com';
const slugs = ['energy-and-testing','fertility-questions','needle-free-options','clinic-costs'];
const checked = [];
async function read(path) {
 const response = await fetch(`${origin}${path}`, { cache: 'no-store', redirect: 'follow', signal: AbortSignal.timeout(20000) });
 assert.equal(new URL(response.url).origin, origin, 'Unexpected redirect origin');
 assert.equal(response.status, 200, `${path} HTTP status`);
 assert.equal(response.headers.get('x-shotfreetrt-release'), expected, `${path} release header`);
 checked.push(path);
 return response;
}
function tags(html, tag) { return (html.match(new RegExp(`<${tag}\\b[^>]*>`, 'gi')) ?? []).map(raw => Object.fromEntries([...raw.matchAll(/([\w:-]+)=["']([^"']*)["']/g)].map(m => [m[1].toLowerCase(),m[2]]))); }
const releaseResponse = await read('/api/release');
assert.match(releaseResponse.headers.get('cache-control') ?? '', /no-store/);
const release = await releaseResponse.json();
assert.equal(release.release, expected); assert.equal(release.copyContract, 'decision-first-v1');
const home = await (await read('/')).text();
assert.ok(home.includes('Considering TRT?')); assert.ok(home.includes('What matters to you today?'));
assert.ok(!home.includes('Start AI Testosterone Plan'));
for(const path of ['/topics',...slugs.map(s=>`/topics/${s}`),...slugs.map(s=>`/quiz/concern/${s}`),'/quiz/healthspan','/decision-guide']) {
 const html = await (await read(path)).text();
 const canonical = tags(html,'link').find(tag=>tag.rel==='canonical');
 assert.equal(canonical?.href,`${origin}${path}`,`${path} canonical`);
 assert.ok((html.match(/<h1(?:\s|>)/g) ?? []).length===1,`${path} one H1`);
 assert.ok(!html.includes('googletagmanager.com/gtag/js'),`${path} must not render the GA loader`);
 if(path.startsWith('/quiz/concern/')) assert.match(tags(html,'meta').find(tag=>tag.name==='robots')?.content ?? '', /noindex/);
}
const sitemap = await (await read('/sitemap.xml')).text();
for(const slug of slugs) assert.ok(sitemap.includes(`${origin}/topics/${slug}`));
assert.ok(!sitemap.includes('/quiz/concern/'));
for(const id of ['04','06','07','10']) {
 const response = await read(`/media/sft-web-batch3-${id}.webp`);
 assert.match(response.headers.get('content-type') ?? '', /image\/webp/);
 assert.ok((await response.arrayBuffer()).byteLength > 100);
}
console.log(JSON.stringify({ tier:'http-only-v1', checkedAt:new Date().toISOString(), expectedRelease:expected, checked, limitations:['Does not establish browser interaction or visual accessibility','Does not establish clinical approval, indexing, analytics network isolation or paid fulfillment'] },null,2));
