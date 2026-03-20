import { readFileSync, writeFileSync } from 'fs';
import { marked } from 'marked';

const CONTENT_DIR = '/home/sprinter/.openclaw/workspace-ventures/ai-ventures/ventures/shotfreetrt.com/content';

const articlesConfig = [
  { file: 'article-trt-side-effects-2026-03-13.md', slug: 'trt-side-effects' },
  { file: 'article-how-long-does-trt-take-to-work-2026-03-14.md', slug: 'how-long-does-trt-take-to-work' },
  { file: 'article-testosterone-levels-by-age-2026-03-14.md', slug: 'testosterone-levels-by-age' },
  { file: 'article-testosterone-cypionate-vs-enanthate-2026-03-14.md', slug: 'testosterone-cypionate-vs-enanthate' },
  { file: 'article-natural-testosterone-boosters-2026-03-14.md', slug: 'natural-testosterone-boosters' },
  { file: 'article-trt-and-fertility-2026-03-15.md', slug: 'trt-and-fertility' },
  { file: 'article-stopping-trt-coming-off-2026-03-15.md', slug: 'stopping-trt' },
  { file: 'article-hcg-on-trt-2026-03-15.md', slug: 'hcg-on-trt' },
  { file: 'article-testosterone-injection-sites-2026-03-15.md', slug: 'testosterone-injection-sites' },
  { file: 'article-anastrozole-on-trt-2026-03-16.md', slug: 'anastrozole-on-trt' },
  { file: 'article-testosterone-gel-vs-injections-2026-03-16.md', slug: 'testosterone-gel-vs-injections' },
  { file: 'article-trt-insurance-coverage-2026-03-16.md', slug: 'trt-insurance-coverage' },
  { file: 'article-testosterone-and-weight-loss-2026-03-16.md', slug: 'testosterone-and-weight-loss' },
  { file: 'article-trt-and-sleep-apnea-2026-03-17.md', slug: 'trt-and-sleep-apnea' },
  { file: 'article-testosterone-and-mood-depression-2026-03-17.md', slug: 'testosterone-and-mood-depression' },
  { file: 'article-trt-and-cardiovascular-health-2026-03-17.md', slug: 'trt-and-cardiovascular-health' },
  { file: 'article-testosterone-and-libido-2026-03-18.md', slug: 'testosterone-and-libido' },
  { file: 'article-testosterone-and-erectile-dysfunction-2026-03-18.md', slug: 'testosterone-and-erectile-dysfunction' },
  { file: 'article-testosterone-and-prostate-health-2026-03-18.md', slug: 'testosterone-and-prostate-health' },
  { file: 'article-trt-and-hair-loss-2026-03-18.md', slug: 'trt-and-hair-loss' },
  { file: 'article-low-testosterone-causes-2026-03-19.md', slug: 'low-testosterone-causes' },
  { file: 'article-trt-pellets-vs-injections-2026-03-19.md', slug: 'trt-pellets-vs-injections' },
  { file: 'article-clomid-vs-trt-2026-03-19.md', slug: 'clomid-vs-trt' },
  { file: 'article-trt-dosage-starting-dose-2026-03-19.md', slug: 'trt-dosage' },
];

function extractDate(filename) {
  const match = filename.match(/(\d{4}-\d{2}-\d{2})/);
  return match ? match[1] : '';
}

function extractMeta(raw) {
  const lines = raw.split('\n');
  const meta = {};

  // Title from H1
  const h1Match = raw.match(/^# (.+)/m);
  meta.title = h1Match ? h1Match[1].trim() : '';

  // Title tag - multiple formats
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    // Format: **Title tag:** `text` or **Title tag (≤60 chars):** text
    const m = line.match(/\*\*Title tag[^*]*\*\*:?\s*`?([^`\n]+)`?/i);
    if (m && m[1].trim()) {
      meta.titleTag = m[1].trim();
    }
    // Format: ## Title Tag (next line has the title)
    if (line.trim().match(/^## Title Tag\s*$/i) && i + 1 < lines.length) {
      const next = lines[i + 1].trim().replace(/^`|`$/g, '').trim();
      if (next && !next.startsWith('#')) meta.titleTag = next;
    }
  }

  // Meta description - multiple formats
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    // Format: **Meta description...:** `text` (same line)
    const m = line.match(/\*\*Meta description[^*]*\*\*:?\s*`?([^`\n]+)`?/i);
    if (m && m[1].trim()) {
      meta.description = m[1].trim();
    }
    // Format: **Meta description...:** (empty, desc on next line)
    const m2 = line.match(/\*\*Meta description[^*]*\*\*:?\s*$/i);
    if (m2 && i + 1 < lines.length) {
      const next = lines[i + 1].trim().replace(/^`|`$/g, '').trim();
      if (next && !next.startsWith('#') && !next.startsWith('**')) {
        meta.description = next;
      }
    }
    // Format: ## Meta Description or ### Meta Description
    if (line.trim().match(/^#{2,3} Meta Description\s*$/i) && i + 1 < lines.length) {
      const next = lines[i + 1].trim().replace(/^`|`$/g, '').trim();
      if (next && !next.startsWith('#')) {
        meta.description = meta.description || next;
      }
    }
  }

  // Word count
  for (const line of lines) {
    const m = line.match(/\*\*Word count[^*]*\*\*:?\s*~?(\d[\d,]*)/i);
    if (m) meta.wordCount = parseInt(m[1].replace(',', ''));
  }

  // Primary keyword
  for (const line of lines) {
    const m = line.match(/\*\*Primary keyword:?\*\*\s*(.+)/i);
    if (m) {
      let kw = m[1].trim()
        .replace(/\s*\(.*$/, '')     // remove parenthetical
        .replace(/\s*\/.*$/, '')     // remove / alternatives
        .replace(/["`]/g, '')        // remove quotes/backticks
        .trim();
      meta.primaryKeyword = kw;
    }
  }

  // Secondary keywords
  for (const line of lines) {
    const m = line.match(/\*\*Secondary keywords:?\*\*\s*(.+)/i);
    if (m) {
      meta.secondaryKeywords = m[1].trim()
        .split(',')
        .map(k => k.replace(/["`]/g, '').replace(/\s*\(.*?\)/g, '').trim())
        .filter(k => k.length > 0);
    }
  }

  return meta;
}

function extractArticleContent(raw) {
  const lines = raw.split('\n');
  let startIdx = -1;

  // Strategy 1: Find "## Article" or "## ARTICLE DRAFT"
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim().match(/^## (?:Article|ARTICLE DRAFT)\s*$/i)) {
      let j = i + 1;
      while (j < lines.length && (lines[j].trim() === '' || lines[j].trim() === '---')) j++;
      startIdx = j;
      break;
    }
  }

  // Strategy 2: Find medical disclaimer then ---
  if (startIdx === -1) {
    let disclaimerIdx = -1;
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].match(/medical disclaimer/i)) disclaimerIdx = i;
      if (disclaimerIdx >= 0 && i > disclaimerIdx && lines[i].trim() === '---') {
        startIdx = i + 1;
        break;
      }
    }
  }

  // Strategy 3: Second --- separator
  if (startIdx === -1) {
    let hrCount = 0;
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].trim() === '---') {
        hrCount++;
        if (hrCount === 2) { startIdx = i + 1; break; }
      }
    }
  }

  if (startIdx === -1) startIdx = 0;

  let content = lines.slice(startIdx).join('\n').trim();

  // Skip remaining metadata/image/SEO sections
  const contentLines = content.split('\n');
  let realStart = 0;
  const metaPatterns = [
    /^#{1,3}\s*(SEO|Image|OG |Inline Image|Title Tag|Meta Description|Internal Link|Quiz CTA|Keyword Cluster|Canonical|Schema|Imagery|Visual|H1:)/i,
    /^\*\*(Style|Visual|Alt text|File suggestion|Schema|Canonical|Internal links|CTA|Stage|Buyer|File:|Slug:|H1:).*\*\*/i,
  ];

  let inMetaSection = false;
  for (let i = 0; i < contentLines.length; i++) {
    const trimmed = contentLines[i].trim();
    const isMeta = metaPatterns.some(p => p.test(trimmed));

    if (isMeta) { inMetaSection = true; continue; }

    if (inMetaSection) {
      if (trimmed === '---') { inMetaSection = false; realStart = i + 1; continue; }
      if (trimmed.match(/^#{1,3}\s/) && !metaPatterns.some(p => p.test(trimmed))) {
        inMetaSection = false; realStart = i; break;
      }
      continue;
    }

    if (trimmed.length > 0) { realStart = i; break; }
  }

  content = contentLines.slice(realStart).join('\n').trim();

  // Remove duplicate H1 at start
  content = content.replace(/^# .+\n+/, '');

  // Remove trailing publish-ready notes and --- separators
  content = content.replace(/\n+\*[^*]*[Pp]ublish-ready[^*]*\*\s*$/, '');
  content = content.replace(/\n+---\s*$/, '');

  // Remove JSON-LD schema blocks at the end
  content = content.replace(/\n+```json?\n\{[\s\S]*?"@type":\s*"FAQPage"[\s\S]*?```\s*$/m, '');
  // Remove schema section headers
  content = content.replace(/\n+#{1,3}\s*FAQPage\s*\n+```json[\s\S]*?```/g, '');
  content = content.replace(/\n+#{1,3}\s*Article Schema\s*\n+```json[\s\S]*?```/g, '');
  // Remove trailing ### SEO or schema sections
  content = content.replace(/\n+#{1,3}\s*(SEO|Schema|Structured Data|JSON-LD)[\s\S]*$/m, '');
  // Remove internal link plan sections at the end
  content = content.replace(/\n+#{1,3}\s*Internal Link[\s\S]*$/m, '');
  // Remove CTA placement sections
  content = content.replace(/\n+#{1,3}\s*(Quiz )?CTA Placement[\s\S]*$/m, '');

  content = content.trim();
  return content;
}

function extractFAQMarkdown(raw) {
  const faqItems = [];

  // Find FAQ section heading - handles: ## FAQ, ## 11. FAQ, ### Frequently Asked Questions, etc.
  const faqMatch = raw.match(/^(#{1,3})\s*(?:\d+\.\s*)?(FAQ|Frequently Asked Questions)[^\n]*/im);

  let faqContent;
  if (faqMatch) {
    const faqIdx = raw.indexOf(faqMatch[0]);
    faqContent = raw.substring(faqIdx);
  } else {
    // No FAQ heading - look for **Q: pattern near end of article
    const qPattern = /\*\*Q:/;
    const firstQIdx = raw.search(qPattern);
    if (firstQIdx === -1) return faqItems;
    faqContent = raw.substring(firstQIdx);
  }

  const lines = faqContent.split('\n');

  let currentQ = null;
  let currentA = [];

  for (let i = 0; i < lines.length; i++) {
    const trimmed = lines[i].trim();

    // Stop conditions
    if (trimmed.match(/\*[^*]*publish-ready/i)) break;
    if (trimmed.startsWith('```')) break;
    if (trimmed.match(/^## Image Package/i)) break;
    if (trimmed.match(/^## (SEO|Internal Link|Quiz CTA|Schema|Structured)/i)) break;

    let qText = null;

    // **Q: question text** (with or without trailing **)
    const m1 = trimmed.match(/^\*\*Q:\s*(.+?)(?:\*\*\s*)?$/);
    if (m1) {
      qText = m1[1].replace(/\*\*$/, '').trim();
    }

    // **question text ending with ?** (only inside FAQ section)
    if (!qText && faqMatch) {
      const m2 = trimmed.match(/^\*\*(.+?\?)\*\*\s*$/);
      if (m2) qText = m2[1].trim();
    }

    // ### question text?
    if (!qText) {
      const m3 = trimmed.match(/^#{3,4}\s+(.+\?)$/);
      if (m3) qText = m3[1].trim();
    }

    if (qText) {
      if (currentQ) {
        const answer = currentA.join(' ').trim();
        if (answer) faqItems.push({ q: currentQ, a: answer });
      }
      currentQ = qText;
      currentA = [];
    } else if (currentQ && trimmed.length > 0 && trimmed !== '---') {
      if (trimmed.startsWith('*Publish-ready') || trimmed.startsWith('**Schema')) continue;
      // Strip leading "A: " from answers
      const answerLine = trimmed.replace(/^A:\s*/, '');
      currentA.push(answerLine);
    }
  }

  if (currentQ) {
    const answer = currentA.join(' ').trim();
    if (answer) faqItems.push({ q: currentQ, a: answer });
  }

  return faqItems;
}

function extractFAQJsonLD(raw) {
  const faqItems = [];

  // Find JSON-LD FAQ block
  const jsonBlocks = raw.matchAll(/```json?\n([\s\S]*?)```/g);
  for (const block of jsonBlocks) {
    const jsonStr = block[1];
    if (!jsonStr.includes('"FAQPage"')) continue;

    try {
      const obj = JSON.parse(jsonStr);
      if (obj['@type'] === 'FAQPage' && obj.mainEntity) {
        for (const entity of obj.mainEntity) {
          if (entity['@type'] === 'Question' && entity.name && entity.acceptedAnswer) {
            faqItems.push({
              q: entity.name,
              a: entity.acceptedAnswer.text || '',
            });
          }
        }
      }
    } catch {
      // Try to extract Q/A from malformed JSON using regex
      const questions = [...jsonStr.matchAll(/"name":\s*"([^"]+)"/g)];
      const answers = [...jsonStr.matchAll(/"text":\s*"([^"]+)"/g)];
      for (let i = 0; i < Math.min(questions.length, answers.length); i++) {
        faqItems.push({ q: questions[i][1], a: answers[i][1] });
      }
    }
  }

  return faqItems;
}

function extractFAQ(raw) {
  // Try markdown FAQ first
  let items = extractFAQMarkdown(raw);
  if (items.length > 0) return items;

  // Fall back to JSON-LD FAQ
  items = extractFAQJsonLD(raw);
  return items;
}

function mdToHtml(md) {
  return marked.parse(md, { gfm: true, breaks: false }).trim();
}

function escapeForTemplate(str) {
  return str.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$\{/g, '\\${');
}

const results = [];

for (const config of articlesConfig) {
  const filepath = `${CONTENT_DIR}/${config.file}`;
  const raw = readFileSync(filepath, 'utf-8');
  const meta = extractMeta(raw);
  const publishedAt = extractDate(config.file);

  const wordCount = meta.wordCount || 2500;
  const readTime = Math.round(wordCount / 200);

  const title = meta.titleTag || meta.title || '';
  const description = meta.description || '';

  const keywords = [];
  if (meta.primaryKeyword) keywords.push(meta.primaryKeyword);
  if (meta.secondaryKeywords) keywords.push(...meta.secondaryKeywords);

  const contentMd = extractArticleContent(raw);
  const faqItems = extractFAQ(raw);
  const contentHtml = mdToHtml(contentMd);

  if (!description) console.warn(`WARNING: Empty description for ${config.slug}`);
  if (!title) console.warn(`WARNING: Empty title for ${config.slug}`);

  results.push({
    slug: config.slug,
    title,
    description,
    publishedAt,
    readTime: `${readTime} min read`,
    keywords,
    contentHtml: escapeForTemplate(contentHtml),
    faqItems,
  });
}

// Generate TypeScript code
let output = '';
for (const r of results) {
  const kwStr = r.keywords.map(k => `      "${k.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`).join(',\n');

  let faqStr = '[]';
  if (r.faqItems.length > 0) {
    const faqEntries = r.faqItems.map(f => {
      const q = f.q.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
      const a = f.a.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
      return `      {\n        q: "${q}",\n        a: "${a}"\n      }`;
    }).join(',\n');
    faqStr = `[\n${faqEntries}\n    ]`;
  }

  output += `  {
    slug: "${r.slug}",
    title: "${r.title.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}",
    description: "${r.description.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}",
    publishedAt: "${r.publishedAt}",
    author,
    category: "TRT",
    readTime: "${r.readTime}",
    keywords: [
${kwStr}
    ],
    sections: [],
    faqItems: ${faqStr},
    content: \`${r.contentHtml}\`
  },\n`;
}

writeFileSync('/home/sprinter/Projects/shotfreetrt.com/scripts/generated-entries.ts', output);

// Diagnostics
console.log(`Generated ${results.length} article entries`);
for (const r of results) {
  console.log(`  ${r.slug}: title="${r.title.substring(0, 60)}" desc=${r.description.length}c faq=${r.faqItems.length} content=${r.contentHtml.length}c`);
}
