// TRT and Acne — Cycle 129 (2026-04-04)
// Added as separate file to avoid articles.ts edit conflicts

import { BlogArticle } from "./articles";

const author = "ShotFreeTRT Editorial Team";

export const trtAndAcneArticle: BlogArticle = {
  slug: "trt-and-acne",
  title: "TRT and Acne: Why Testosterone Causes Breakouts — and What Actually Fixes Them",
  description: "Acne is one of the most common TRT side effects. Here's the exact mechanism, why some men get it and others don't, which delivery methods are riskier, and the treatment hierarchy that actually works.",
  publishedAt: "2026-04-04",
  author,
  category: "TRT",
  readTime: "11 min read",
  keywords: [
    "trt and acne",
    "testosterone acne",
    "does trt cause acne",
    "testosterone replacement therapy acne",
    "acne on trt",
    "trt acne treatment",
    "testosterone and skin",
    "trt side effects acne",
    "does testosterone cause acne",
    "how to prevent acne on trt"
  ],
  sections: [],
  content: `
<p>Acne is one of the most consistently reported side effects of testosterone replacement therapy — and one of the most manageable once you understand why it happens.</p>
<p>The short version: testosterone raises DHT, DHT stimulates sebaceous glands, and more sebum production means more acne risk. But whether you actually break out depends on your individual DHT sensitivity, delivery method, dosing protocol, and a few correctable variables that most TRT guides skip entirely.</p>

<h2>The Mechanism: Why TRT Causes Acne</h2>
<p>The pathway is straightforward:</p>
<ol>
  <li><strong>Exogenous testosterone enters your system</strong></li>
  <li><strong>Some of it converts to DHT (dihydrotestosterone)</strong> via the enzyme 5-alpha reductase, which is highly active in skin tissue</li>
  <li><strong>DHT binds to androgen receptors in sebaceous glands</strong>, stimulating sebum (skin oil) production</li>
  <li><strong>Elevated sebum creates the environment for acne</strong> — P. acnes bacteria proliferate, pores clog, inflammation follows</li>
</ol>
<p>This is the same mechanism behind puberty-related acne. Testosterone spikes → DHT rises → sebaceous glands go into overdrive. TRT essentially recreates that androgenic surge in adult skin that may not have seen high androgen levels for years.</p>

<h2>Why Some Men on TRT Get Acne and Others Don't</h2>
<p>The determining factor is <strong>androgen receptor sensitivity in your skin</strong> — a largely genetic trait. Two men on identical TRT protocols with identical serum T and DHT levels can have completely different acne outcomes based on how responsive their sebaceous glands are to androgenic stimulation.</p>
<p>Higher-risk profile:</p>
<ul>
  <li>History of acne during puberty or early adulthood</li>
  <li>Oily skin at baseline</li>
  <li>Family history of cystic or hormonal acne</li>
  <li>Higher DHT conversion (influenced by 5-alpha reductase activity — also the gene tied to male pattern baldness)</li>
  <li>Delivery methods with elevated DHT ratios (topicals and pellets)</li>
  <li>Starting TRT after a long period of low testosterone (sudden androgenic surge hits more reactive skin)</li>
</ul>
<p>Lower-risk profile:</p>
<ul>
  <li>No significant acne history</li>
  <li>Dry or combination skin type</li>
  <li>Protocol that achieves T optimization without supraphysiologic peaks</li>
  <li>Injection-based protocols (lower DHT conversion than topicals)</li>
</ul>

<h2>Delivery Method and Acne Risk</h2>

<table style="width:100%;border-collapse:collapse;margin:24px 0;">
  <thead>
    <tr style="background:#1e1e2e;">
      <th style="padding:10px;border:1px solid #2a2a3a;text-align:left;">Delivery Method</th>
      <th style="padding:10px;border:1px solid #2a2a3a;text-align:left;">DHT Conversion</th>
      <th style="padding:10px;border:1px solid #2a2a3a;text-align:left;">Relative Acne Risk</th>
      <th style="padding:10px;border:1px solid #2a2a3a;text-align:left;">Notes</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding:10px;border:1px solid #2a2a3a;">Testosterone gel/cream</td>
      <td style="padding:10px;border:1px solid #2a2a3a;">High</td>
      <td style="padding:10px;border:1px solid #2a2a3a;">⚠️ Highest</td>
      <td style="padding:10px;border:1px solid #2a2a3a;">Applied to skin → 5-alpha reductase acts directly at application site; DHT/T ratio consistently elevated vs injections</td>
    </tr>
    <tr style="background:#1a1a2a;">
      <td style="padding:10px;border:1px solid #2a2a3a;">Testosterone pellets</td>
      <td style="padding:10px;border:1px solid #2a2a3a;">High</td>
      <td style="padding:10px;border:1px solid #2a2a3a;">⚠️ High</td>
      <td style="padding:10px;border:1px solid #2a2a3a;">Sustained supraphysiologic T in first 4–6 weeks post-insertion; DHT follows; irreversible short term</td>
    </tr>
    <tr>
      <td style="padding:10px;border:1px solid #2a2a3a;">Testosterone cypionate/enanthate (weekly IM)</td>
      <td style="padding:10px;border:1px solid #2a2a3a;">Moderate</td>
      <td style="padding:10px;border:1px solid #2a2a3a;">🟡 Moderate</td>
      <td style="padding:10px;border:1px solid #2a2a3a;">Peak T (and DHT) in first 48–72 hours post-injection; T-to-DHT ratio lower than topicals</td>
    </tr>
    <tr style="background:#1a1a2a;">
      <td style="padding:10px;border:1px solid #2a2a3a;">Daily SubQ (cypionate/enanthate)</td>
      <td style="padding:10px;border:1px solid #2a2a3a;">Moderate-Low</td>
      <td style="padding:10px;border:1px solid #2a2a3a;">🟢 Lower</td>
      <td style="padding:10px;border:1px solid #2a2a3a;">Stable serum T without large peaks = more consistent, lower DHT relative to total T area under curve</td>
    </tr>
    <tr>
      <td style="padding:10px;border:1px solid #2a2a3a;">Oral TRT (Jatenzo/Kyzatrex)</td>
      <td style="padding:10px;border:1px solid #2a2a3a;">Low</td>
      <td style="padding:10px;border:1px solid #2a2a3a;">🟢 Lowest</td>
      <td style="padding:10px;border:1px solid #2a2a3a;">Lymphatic absorption bypasses first-pass; DHT/T ratio lower than all other methods; SHBG suppression may offset some</td>
    </tr>
  </tbody>
</table>

<p><strong>Key insight:</strong> If you're getting acne on a gel protocol and unwilling to stop, switching to daily SubQ injections or oral TRT will typically reduce DHT levels and acne severity — often without any additional treatment.</p>

<div style="border: 1px solid #2a2a3a; border-radius: 8px; padding: 16px; margin: 24px 0; background: #12121a;">
  <p style="font-weight: 600; margin-bottom: 8px;">Not sure which TRT protocol is right for your situation?</p>
  <p style="margin-bottom: 12px;">Our free quiz helps you map your symptoms, skin history, and goals to the right delivery method and approach.</p>
  <a href="/quiz" style="display: inline-block; background: #6366f1; color: white; padding: 10px 20px; border-radius: 6px; text-decoration: none; font-weight: 600;">Take the Free TRT Decision Quiz →</a>
</div>

<h2>Where TRT Acne Typically Appears</h2>
<p>Androgen-driven acne follows a predictable distribution pattern that differs from typical teenage acne:</p>
<ul>
  <li><strong>Back and shoulders</strong> — most common on TRT; highest density of sebaceous glands relative to skin area</li>
  <li><strong>Chest</strong> — often correlates with "bacne" severity</li>
  <li><strong>Face (jawline and chin)</strong> — classic hormonal acne location; often cystic</li>
  <li><strong>Scalp</strong> — often overlooked; contributes to scalp folliculitis that can mimic dandruff</li>
</ul>
<p>If acne is presenting primarily on your upper back and shoulders, and it's new since starting TRT, the mechanism is almost certainly androgenic. This is different from comedonal (blackhead) acne, which is more about pore occlusion and less about sebum volume.</p>

<h2>The Treatment Hierarchy: What Actually Works</h2>
<p>The right first step is almost never an oral antibiotic. Work through this sequence:</p>

<h3>Step 1: Protocol Optimization (Before Medication)</h3>
<ul>
  <li><strong>Check your DHT level</strong> — If you haven't measured serum DHT, do so. Very high DHT (>1,000 pg/mL or >3.5 nmol/L) confirms the androgenic pathway and guides treatment</li>
  <li><strong>Switch delivery methods</strong> — Gel to injection (or injection to daily SubQ) is often enough to reduce acne severity by 50–70% without any topical treatment</li>
  <li><strong>Reduce injection peak without reducing total dose</strong> — If you're on once-weekly injections, splitting to twice-weekly (same total weekly dose) reduces peak T and peak DHT, smoothing the androgenic stimulus on skin</li>
  <li><strong>Audit your dose</strong> — Supraphysiologic T (serum total T consistently >1,100 ng/dL) dramatically increases DHT conversion; reducing to high-normal range (700–900 ng/dL) often resolves acne without additional treatment</li>
</ul>

<h3>Step 2: Topical Treatment (First-Line Skin Care)</h3>
<ul>
  <li><strong>Benzoyl peroxide (BPO) 5–10%</strong> — Kills P. acnes bacteria; most effective OTC option for back and chest acne; available as body wash for large surface areas</li>
  <li><strong>Salicylic acid 2%</strong> — Keratolytic; helps unclog pores; best used as a wash rather than leave-on for body acne</li>
  <li><strong>Adapalene 0.1% (Differin, OTC)</strong> — Topical retinoid; reduces comedones; best for facial acne; requires 8–12 weeks to see full benefit</li>
  <li><strong>Zinc pyrithione</strong> — Anti-microbial; useful for scalp folliculitis and mild back acne when combined with BPO routine</li>
</ul>
<p>For body acne specifically: BPO body wash (10%) used daily in the shower is more practical than leave-on gels and often sufficient for mild-to-moderate cases.</p>

<h3>Step 3: Prescription Topicals (Moderate Acne)</h3>
<ul>
  <li><strong>Clindamycin + benzoyl peroxide (Clindoxyl, Duac)</strong> — Combination prescription; reduces antibiotic resistance by pairing antibiotic with BPO</li>
  <li><strong>Tretinoin 0.025–0.05%</strong> — Prescription-strength retinoid; more effective than adapalene for moderate-severe facial acne; requires sun protection</li>
  <li><strong>Dapsone 5% gel (Aczone)</strong> — Anti-inflammatory topical; useful for inflammatory (red) acne lesions on the face</li>
</ul>

<h3>Step 4: Systemic Options (Severe or Cystic Acne)</h3>
<ul>
  <li><strong>Doxycycline 50–100 mg/day</strong> — Short-term antibiotic; most common systemic first-line; reduces P. acnes and inflammation; use 3–4 months maximum to reduce resistance</li>
  <li><strong>Isotretinoin (Accutane)</strong> — Reserved for severe, cystic, or scarring-risk acne; reduces sebaceous gland size long-term; highly effective but requires iPledge monitoring and lab surveillance; safe in men on TRT with appropriate dermatologist oversight</li>
  <li><strong>Spironolactone</strong> — Anti-androgen; rarely used in men due to feminizing effects (gynecomastia risk); not appropriate for most TRT patients</li>
</ul>

<h3>Step 5: DHT-Reduction Options (If Protocol Changes Insufficient)</h3>
<p>If acne persists despite protocol optimization and topical treatment, DHT reduction is worth discussing:</p>
<ul>
  <li><strong>Finasteride 1 mg/day</strong> — 5-alpha reductase inhibitor; reduces DHT 60–70%; directly addresses the root mechanism; risk of sexual side effects in a minority of men (post-finasteride syndrome is real but uncommon)</li>
  <li><strong>Dutasteride 0.5 mg/day</strong> — Dual 5AR inhibitor (type I + II); reduces DHT 85–95%; more complete DHT suppression than finasteride; same sexual side effect risk profile with longer washout period</li>
</ul>
<p><strong>Important note on finasteride/dutasteride on TRT:</strong> Reducing DHT also removes some of DHT's physiologic benefits — libido, cognitive clarity in some men, and the erythropoiesis contribution. Monitor libido and mood after starting. If side effects occur, they typically resolve within 4–6 weeks of stopping. If you're concerned about hair loss as well, this approach addresses both simultaneously.</p>

<h2>Quick-Reference: Acne Decision Table</h2>

<table style="width:100%;border-collapse:collapse;margin:24px 0;">
  <thead>
    <tr style="background:#1e1e2e;">
      <th style="padding:10px;border:1px solid #2a2a3a;text-align:left;">Acne Severity</th>
      <th style="padding:10px;border:1px solid #2a2a3a;text-align:left;">Location</th>
      <th style="padding:10px;border:1px solid #2a2a3a;text-align:left;">First Step</th>
      <th style="padding:10px;border:1px solid #2a2a3a;text-align:left;">Escalation if Needed</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding:10px;border:1px solid #2a2a3a;">Mild (few small pimples)</td>
      <td style="padding:10px;border:1px solid #2a2a3a;">Face, back</td>
      <td style="padding:10px;border:1px solid #2a2a3a;">BPO wash + protocol check (delivery method / dose / frequency)</td>
      <td style="padding:10px;border:1px solid #2a2a3a;">Adapalene or salicylic acid; reassess at 8 weeks</td>
    </tr>
    <tr style="background:#1a1a2a;">
      <td style="padding:10px;border:1px solid #2a2a3a;">Moderate (multiple inflamed lesions)</td>
      <td style="padding:10px;border:1px solid #2a2a3a;">Back, chest, face</td>
      <td style="padding:10px;border:1px solid #2a2a3a;">Switch delivery method if on gel; BPO 10% body wash; prescription topical</td>
      <td style="padding:10px;border:1px solid #2a2a3a;">Doxycycline short course + continue topicals; check DHT level</td>
    </tr>
    <tr>
      <td style="padding:10px;border:1px solid #2a2a3a;">Severe (cystic, nodular, or widespread)</td>
      <td style="padding:10px;border:1px solid #2a2a3a;">Any</td>
      <td style="padding:10px;border:1px solid #2a2a3a;">Dermatology referral; stop gel if applicable; oral antibiotic bridge</td>
      <td style="padding:10px;border:1px solid #2a2a3a;">Isotretinoin if scarring risk; finasteride/dutasteride to reduce DHT</td>
    </tr>
    <tr style="background:#1a1a2a;">
      <td style="padding:10px;border:1px solid #2a2a3a;">Primarily scalp folliculitis</td>
      <td style="padding:10px;border:1px solid #2a2a3a;">Scalp</td>
      <td style="padding:10px;border:1px solid #2a2a3a;">Zinc pyrithione shampoo + ketoconazole shampoo alternating</td>
      <td style="padding:10px;border:1px solid #2a2a3a;">Topical clindamycin; assess DHT level</td>
    </tr>
    <tr>
      <td style="padding:10px;border:1px solid #2a2a3a;">Acne clearly worsening post-injection peak</td>
      <td style="padding:10px;border:1px solid #2a2a3a;">Back, shoulders</td>
      <td style="padding:10px;border:1px solid #2a2a3a;">Split dose to twice-weekly; check if reducing peak T resolves</td>
      <td style="padding:10px;border:1px solid #2a2a3a;">Switch to daily SubQ; measure DHT at peak and trough</td>
    </tr>
  </tbody>
</table>

<h2>What Not to Do</h2>
<ul>
  <li><strong>Don't stop TRT for acne alone</strong> — Acne is manageable. Stopping TRT for acne without trying the treatment hierarchy first is rarely the right call.</li>
  <li><strong>Don't assume it's permanent</strong> — Many men see significant improvement after the first 3–6 months on TRT as skin adjusts to the new androgen environment. Don't overreact to early-onset acne before exploring whether it stabilizes.</li>
  <li><strong>Don't use long-term oral antibiotics as a primary strategy</strong> — Antibiotics address bacterial proliferation (one step in the cascade) but don't address the root sebum overproduction mechanism. Long-term antibiotic use drives resistance without solving the cause.</li>
  <li><strong>Don't add finasteride before optimizing protocol</strong> — Finasteride has real sexual side effect risk. Always try delivery method switch and dose optimization before adding a 5AR inhibitor.</li>
</ul>

<h2>The Connection Between Acne and Hair Loss on TRT</h2>
<p>If you're experiencing both acne and hair thinning on TRT, the shared mechanism is DHT. Men who react strongly to DHT in sebaceous glands are often the same men who react strongly in hair follicles (genetic androgenic alopecia).</p>
<p>In this case, finasteride or dutasteride simultaneously addresses both issues — reducing sebaceous gland DHT stimulation and reducing DHT's attack on hair follicles. This is one of the cleaner TRT side-effect management tradeoffs: one drug fixing two related problems.</p>
<p>See: <a href="/blog/trt-and-hair-loss">TRT and Hair Loss →</a> for the full hair preservation tradeoff table.</p>

<div style="border: 1px solid #2a2a3a; border-radius: 8px; padding: 16px; margin: 24px 0; background: #12121a;">
  <p style="font-weight: 600; margin-bottom: 8px;">Getting acne on TRT and unsure which path to take?</p>
  <p style="margin-bottom: 12px;">Our quiz can help you determine whether your protocol, dosing, or delivery method might be the first thing to fix.</p>
  <a href="/quiz" style="display: inline-block; background: #6366f1; color: white; padding: 10px 20px; border-radius: 6px; text-decoration: none; font-weight: 600;">Take the Free TRT Decision Quiz →</a>
</div>

<h2>Frequently Asked Questions</h2>
<p><strong>Does everyone get acne on TRT?</strong><br/>No. Acne incidence in TRT clinical trials ranges from roughly 5–15%, depending on dose, delivery method, and patient population. Many men experience no meaningful skin changes. Those with prior acne history or oily skin are at highest risk.</p>
<p><strong>How long does TRT acne last?</strong><br/>Acne that appears in the first 4–8 weeks of TRT often improves as the body adapts to the new androgen environment. If it persists beyond 3 months or is worsening, active management is warranted rather than waiting.</p>
<p><strong>Is TRT acne different from regular acne?</strong><br/>Androgen-driven acne tends to be inflammatory (red, cystic) rather than primarily comedonal (blackheads). It typically concentrates on the back, shoulders, and jawline rather than the T-zone of the face. The mechanism — DHT-stimulated sebum overproduction — is the same as puberty acne.</p>
<p><strong>Does switching from gel to injections help with acne?</strong><br/>Often yes. Gels produce a higher DHT/T ratio than injections because 5-alpha reductase activity is high at the skin application site. Switching to injections (particularly daily SubQ) typically reduces DHT levels and acne severity in gel-related cases.</p>
<p><strong>Can I use Accutane while on TRT?</strong><br/>Yes, with monitoring. Isotretinoin and TRT can be used concurrently. Both affect lipids — testosterone can suppress HDL and isotretinoin elevates triglycerides — so a lipid panel before and during treatment is appropriate. A dermatologist familiar with hormonal acne is the right specialist for this combination.</p>
<p><strong>Will reducing my TRT dose fix the acne?</strong><br/>If your serum testosterone is supraphysiologic (consistently above 1,100 ng/dL), reducing dose often helps. If you're at a therapeutic level (700–900 ng/dL) and still breaking out, dose reduction alone is unlikely to resolve acne without triggering return of low-T symptoms — protocol optimization (delivery method, frequency) is a better lever.</p>
<p><strong>Does DHT cream or gel (applied topically for DHT) make acne worse?</strong><br/>Yes. Topically applied DHT bypasses conversion entirely and delivers the active androgen directly to skin sebaceous glands. This is generally not recommended for men prone to acne or hair loss.</p>
<p><strong>Is scalp acne or folliculitis related to TRT?</strong><br/>Yes. Scalp folliculitis — inflamed hair follicles on the scalp — is a DHT-related androgenic effect. It often co-occurs with scalp oiliness and mild dandruff-like presentation. Zinc pyrithione + ketoconazole shampoo alternating is the standard first-line approach.</p>

<p>Related: <a href="/blog/trt-and-hair-loss">TRT and Hair Loss →</a> | <a href="/blog/trt-side-effects">TRT Side Effects: What's Real and What's Overstated →</a> | <a href="/blog/trt-protocol-optimization">TRT Protocol Optimization →</a> | <a href="/blog/testosterone-gel-vs-injections">Testosterone Gel vs Injections →</a> | <a href="/blog/anastrozole-on-trt">Anastrozole on TRT →</a> | <a href="/blog/trt-and-hair-loss">TRT and Hair Loss →</a></p>
`,
  faqItems: [
    {
      q: "Does everyone get acne on TRT?",
      a: "No. Acne incidence in TRT clinical trials ranges from roughly 5–15%, depending on dose, delivery method, and patient population. Many men experience no meaningful skin changes. Those with prior acne history or oily skin are at highest risk."
    },
    {
      q: "How long does TRT acne last?",
      a: "Acne that appears in the first 4–8 weeks of TRT often improves as the body adapts to the new androgen environment. If it persists beyond 3 months or is worsening, active management is warranted rather than waiting."
    },
    {
      q: "Does switching from gel to injections help with acne on TRT?",
      a: "Often yes. Gels produce a higher DHT/T ratio than injections because 5-alpha reductase activity is high at the skin application site. Switching to injections (particularly daily SubQ) typically reduces DHT levels and acne severity in gel-related cases."
    },
    {
      q: "Can I use Accutane while on TRT?",
      a: "Yes, with monitoring. Both affect lipids — testosterone can suppress HDL and isotretinoin elevates triglycerides — so a lipid panel before and during treatment is appropriate. A dermatologist familiar with hormonal acne is the right specialist for this combination."
    },
    {
      q: "Will reducing my TRT dose fix the acne?",
      a: "If your serum testosterone is supraphysiologic (consistently above 1,100 ng/dL), reducing dose often helps. If you're at a therapeutic level (700–900 ng/dL) and still breaking out, delivery method optimization — not dose reduction — is usually the better first lever."
    },
    {
      q: "Is acne a reason to stop TRT?",
      a: "Rarely. Acne is manageable through protocol optimization (switching delivery method, splitting dose frequency) and topical or systemic treatment. Stopping TRT for acne without working through the treatment hierarchy first is almost never the right call."
    },
    {
      q: "Does finasteride help with TRT acne?",
      a: "Yes — finasteride reduces DHT by 60–70% by inhibiting 5-alpha reductase, directly addressing the root mechanism of androgen-driven acne. It's reserved for cases where protocol optimization and topical treatment haven't worked, given the risk of sexual side effects in a minority of men."
    },
    {
      q: "Is scalp folliculitis related to TRT?",
      a: "Yes. Scalp folliculitis is a DHT-related androgenic effect that often co-occurs with scalp oiliness on TRT. Zinc pyrithione plus ketoconazole shampoo (alternating) is the standard first-line approach."
    }
  ]
};
