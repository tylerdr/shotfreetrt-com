/** Run with Node 22.16+: node --experimental-strip-types scripts/generate-evidence-visuals.mjs */
import { mkdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { billingIllustration, oralMonitoringWindows, EVIDENCE_CHECKED_AT, escapeHtml } from '../src/data/evidence-guides.ts';
const dir = fileURLToPath(new URL('../public/media/research/', import.meta.url));
mkdirSync(dir, { recursive: true });
const money = cents => new Intl.NumberFormat('en-US', {style:'currency',currency:'USD',maximumFractionDigits:2}).format(cents/100);
const t=(x,y,text,size=22,weight=400,fill='#193536')=>`<text x="${x}" y="${y}" font-size="${size}" font-weight="${weight}" fill="${fill}">${escapeHtml(text)}</text>`;
const rect=(x,y,w,h,fill='#fffdf8')=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="18" fill="${fill}" stroke="#c4c7bd"/>`;
const line=(x1,y1,x2,y2)=>`<path d="M${x1} ${y1} L${x2} ${y2}" fill="none" stroke="#507677" stroke-width="3"/>`;
function shell(title,desc,body,mobile=false){
 const w=mobile?480:960,h=mobile?800:640;
 return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-labelledby="title desc"><title id="title">${escapeHtml(title)}</title><desc id="desc">${escapeHtml(desc)}</desc><rect width="${w}" height="${h}" rx="24" fill="#e9e5da"/><g font-family="Arial, Helvetica, sans-serif">${body}${t(mobile?24:40,h-42,'ShotFreeTRT · Educational comparison',mobile?16:18,600)}${t(mobile?24:40,h-18,`Sources checked ${EVIDENCE_CHECKED_AT} · See article for references`,mobile?12:15,400)}</g></svg>\n`;
}
function mechanism(mobile){
 let b=t(mobile?24:40,44,'MECHANISM ≠ OUTCOME',18,700,'#496969');
 b+=t(mobile?24:40,88,mobile?'Different paths.':'Different paths. Different questions.',mobile?34:40,700);
 if(mobile)b+=t(24,125,'Different questions.',34,700);
 const cards=[['Stimulate a signal',['Enclomiphene','LH / FSH signaling','Testicular production']],['Supply a hormone',['Replacement testosterone','Hormone enters circulation','LH / FSH can decrease']]];
 cards.forEach(([title,steps],i)=>{
  const x=mobile?24:40+i*460,y=mobile?152+i*208:134,w=mobile?432:420,h=mobile?190:270;
  b+=rect(x,y,w,h)+t(x+22,y+38,title,25,700);
  steps.forEach((text,j)=>{
    const yy=y+76+j*(mobile?42:65);
    b+=`<circle cx="${x+30}" cy="${yy-6}" r="13" fill="#193536"/>`+t(x+26,yy-1,String(j+1),14,700,'#ffffff')+t(x+54,yy,text,mobile?19:22);
    if(j<2)b+=line(x+30,yy+11,x+30,yy+(mobile?23:43));
  });
 });
 if(mobile){b+=rect(24,584,432,132,'#dce5de')+t(44,617,'Do not collapse the endpoints',23,700)+t(44,652,'Blood testosterone ≠ sperm concentration',18)+t(44,682,'Sperm concentration ≠ pregnancy',18);}
 else {b+=rect(40,436,880,115,'#dce5de')+t(64,472,'Do not collapse the endpoints',26,700)+t(64,516,'Blood testosterone  ≠  sperm concentration  ≠  pregnancy',25);}
 return shell('Enclomiphene and replacement testosterone: mechanisms are not outcome guarantees','Qualitative illustration. LH and FSH are pituitary hormones. The cited trials studied hormonal and sperm endpoints, not a guarantee of pregnancy. See the adjacent HTML explanation and sources.',b,mobile);
}
function monitoring(mobile){
 const x=mobile?24:40;
 let b=t(x,44,'PRODUCT-SPECIFIC MONITORING',18,700,'#496969')+t(x,88,mobile?'When is the blood draw?':'The same blood test. A different clock.',mobile?30:38,700);
 b+=t(x,mobile?121:124,'Hours after the morning dose—not time to benefit.',mobile?16:22);
 oralMonitoringWindows.forEach((row,i)=>{
  const y=mobile?150+i*177:163+i*116,w=mobile?432:880,h=mobile?160:98;
  b+=rect(x,y,w,h)+t(x+22,y+34,row.product,25,700);
  if(mobile){b+=t(x+22,y+79,row.hours,34,700,'#2658a3');b+=t(x+22,y+110,'Confirm the first check and timing',17)+t(x+22,y+136,'with your prescriber. See the article.',17);}
  else {
    b+=t(x+22,y+69,row.hours,25,700,'#2658a3');
    const start=360,scale=50;
    b+=line(start,y+39,start+9*scale,y+39);
    for(let hour=0;hour<=9;hour++)b+=t(start+hour*scale-5,y+75,String(hour),16);
    if(row.start===row.end)b+=`<circle cx="${start+row.start*scale}" cy="${y+39}" r="11" fill="#2658a3"/>`;
    else b+=`<rect x="${start+row.start*scale}" y="${y+29}" width="${(row.end-row.start)*scale}" height="20" rx="10" fill="#2658a3"/>`;
  }
 });
 b+=t(x,mobile?714:551,'Not a dose-adjustment or effectiveness chart.',mobile?17:22,600);
 return shell('Oral testosterone monitoring windows by product','Kyzatrex: 3 to 5 hours. Jatenzo: 6 hours. Tlando: 8 to 9 hours after the morning dose. Follow the exact product label and prescriber instructions; initial testing schedules also differ.',b,mobile);
}
function billing(mobile){
 const n=billingIllustration(),x=mobile?24:40;
 let b=t(x,44,'ONE AMOUNT. DIFFERENT CLOCKS.',18,700,'#496969')+t(x,88,mobile?'What does “$199” mean?':'What does a “$199” payment mean?',mobile?31:39,700);
 b+=t(x,122,'Illustrative arithmetic—not a clinic invoice.',mobile?17:22);
 const cards=[['Calendar-month plan',n.monthlyAnnualCents,'$199 × 12'],['Every-28-day plan',n.fourWeekAnnualizedCents,'$199 × 365 ÷ 28']];
 cards.forEach(([label,amount,formula],i)=>{
  const xx=mobile?24:40+i*460,y=mobile?149+i*174:158,w=mobile?432:420;
  b+=rect(xx,y,w,158)+t(xx+22,y+34,label,23,700)+t(xx+22,y+87,money(amount),mobile?42:46,700)+t(xx+22,y+124,formula+' · annualized budget',mobile?16:18);
 });
 const y=mobile?514:358;
 b+=rect(x,y,mobile?432:880,mobile?194:188,'#dce5de')+t(x+22,y+36,'Cash charges can be different',mobile?23:27,700);
 b+=t(x+22,y+83,`${money(n.first365DaysAdvanceBilledCents)} = 14 advance payments`,mobile?25:32,700);
 b+=t(x+22,y+120,'Days 0, 28, …, 364. Last payment covers',mobile?18:23)+t(x+22,y+150,'service beyond the 365-day window.',mobile?18:23);
 return shell('Calendar-month cost, 28-day annualized budget, and advance-billed cash','A hypothetical $199 monthly charge costs $2,388 over 12 months. The 28-day annualized service budget is $2,594.11. With advance billing from day 0 through day 364, 14 charges total $2,786 and the last payment covers service beyond the window.',b,mobile);
}
for(const [name,fn] of [['mechanism-and-outcomes',mechanism],['oral-monitoring-windows',monitoring],['billing-periods',billing]]){
 for(const mobile of [false,true])writeFileSync(`${dir}/${name}${mobile?'-mobile':''}.svg`,fn(mobile));
}
