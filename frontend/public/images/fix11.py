#!/usr/bin/env python3
import io, sys
SRC = "/sessions/nice-keen-cannon/mnt/Desktop--outputs/universal_kingdom_website.html"
h = io.open(SRC, "r", encoding="utf-8").read()
E = []

# ---- R1: replace offers array with config-driven engine ----
old_offers = '''const offers=[
 {id:"student",n:"Campus Thrill Deal",p:"20% OFF",s:"College ID",d:"Show your college ID and unlock 20% off Student Fun Passes — valid only on display of a current-year college ID at entry.",bg:"bg-green"},
 {id:"kids",n:"Little Legends Saturday",p:"KIDS FREE",s:"Saturdays · Online",d:"Big adventures for little explorers! Every Saturday — online booking only — each Adult Fun Pass unlocks FREE entry for 2 kids below 130 cm.",bg:"bg-purple"},
 {id:"independence",n:"Freedom Fun Fest",p:"₹800 + tax",s:"15 Aug only",d:"Celebrate Independence Day with unlimited thrills — Adult Fun Pass at ₹800 (before tax), valid only on 15 August.",bg:"bg-yellow"},
 {id:"birthday",n:"Birthday Buddy Treat",p:"BUY 1 GET 1",s:"Birthday ID proof",d:"Celebrate your birthday with a FREE ticket for your favourite person — buy 1 Adult Fun Pass, get 1 free. Carry valid birthday ID at entry.",bg:"bg-red"},
 {id:"midweek",n:"Triple Thrill Days",p:"BUY 2 GET 1",s:"Every Tue & Wed",d:"Every Tuesday & Wednesday — buy 2 tickets and get 1 FREE across all pass categories: Adult, Child, Senior, Student & Double Fun Pass.",bg:"bg-blue"},
 {id:"friendship",n:"Friendship Trio Treat",p:"BUY 2 GET 1",s:"2 Aug only",d:"Two besties book, the third bestie goes FREE! Buy 2 tickets and get 1 free this Friendship Day, 2 August.",bg:"bg-yellow"},
 {id:"dfpadult",n:"Double the Fun Deal",p:"₹1,313",s:"Save ₹402",d:"Double Fun Pass — Adult. Two days, double the adventures, one special price. Regular ₹1,715 → offer ₹1,313. Add the Double Fun Pass — Adult to your tickets.",bg:"bg-purple"},
 {id:"dfpchild",n:"Little Explorer Double Pass",p:"₹1,128",s:"Save ₹275",d:"Double Fun Pass — Child. Double the fun for your little adventurer. Regular ₹1,403 → offer ₹1,128. Add the Double Fun Pass — Child to your tickets.",bg:"bg-red"}
];'''

new_engine = r'''/* ===== config-driven offer engine (admin-editable via localStorage 'ukdOffers') ===== */
const OFFER_DEFAULTS=[
 {id:"student",name:"Campus Thrill Deal",badge:"College ID",bg:"bg-green",kind:"pct-cat",pct:20,cats:["student"],minQty:1,weekdays:null,visitStart:"2026-07-01",visitEnd:"2026-12-31",bookEnd:"2026-12-31",online:false,needsId:true,needsDob:false,active:true,priority:3,desc:"Show your college ID and unlock 20% off Student Fun Passes.",dateLabel:"Any day · valid college ID required at entry"},
 {id:"kids",name:"Little Legends Saturday",badge:"Saturdays · Online",bg:"bg-purple",kind:"kids",cats:["child"],minQty:1,weekdays:[6],visitStart:"2026-07-01",visitEnd:"2026-12-31",bookEnd:"2026-12-31",online:true,needsId:false,needsDob:false,active:true,priority:5,desc:"Every Saturday (online booking only), each Adult Fun Pass unlocks FREE entry for 2 kids below 130 cm.",dateLabel:"Saturdays only · online booking"},
 {id:"independence",name:"Freedom Fun Fest",badge:"15 Aug only",bg:"bg-yellow",kind:"flat-adult",flat:800,cats:["adult"],minQty:1,weekdays:null,visitStart:"2026-08-15",visitEnd:"2026-08-15",bookEnd:"2026-08-15",online:false,needsId:false,needsDob:false,active:true,priority:6,desc:"Independence Day — Adult Fun Pass at ₹800 (before tax), valid only on 15 August 2026.",dateLabel:"Visit on 15 August 2026"},
 {id:"birthday",name:"Birthday Buddy Treat",badge:"Birthday month",bg:"bg-red",kind:"bogo-samecat",cats:["adult","child","senior","student"],minQty:2,weekdays:null,visitStart:"2026-07-01",visitEnd:"2026-12-31",bookEnd:"2026-12-31",online:false,needsId:true,needsDob:true,active:true,priority:4,desc:"Buy 1 ticket and get 1 free (same category) during the birthday person's birth month. Valid DOB proof required at entry.",dateLabel:"During the birthday person's birth month"},
 {id:"midweek",name:"Adi Thalubadi",badge:"Tue & Wed · Jul 21–Aug 12",bg:"bg-blue",kind:"b2g1-samecat",cats:["adult","child","senior","student","dfpa","dfpc"],minQty:3,weekdays:[2,3],visitStart:"2026-07-21",visitEnd:"2026-08-12",bookEnd:"2026-08-12",online:false,needsId:false,needsDob:false,active:true,priority:7,desc:"Buy 2 tickets and get 1 FREE (all three same category) on Tuesdays & Wednesdays, 21 July – 12 August 2026.",dateLabel:"Tuesdays & Wednesdays · 21 Jul – 12 Aug 2026"},
 {id:"friendship",name:"Friendship Trio Fun Pass",badge:"2 Aug only",bg:"bg-yellow",kind:"b2g1-samecat",cats:["adult","child","senior","student","dfpa","dfpc"],minQty:3,weekdays:null,visitStart:"2026-08-02",visitEnd:"2026-08-02",bookEnd:"2026-08-02",online:false,needsId:false,needsDob:false,active:true,priority:6,desc:"Two besties book, the third goes FREE! Buy 2 get 1 free (all three same category), visit on 2 August 2026.",dateLabel:"Visit on 2 August 2026"},
 {id:"double",name:"Double Fun Pass",badge:"2-day pass",bg:"bg-purple",kind:"info-double",cats:["dfpa","dfpc"],minQty:1,weekdays:null,visitStart:"2026-07-01",visitEnd:"2026-12-31",bookEnd:"2026-12-31",online:false,needsId:false,needsDob:false,active:true,priority:2,desc:"Two days, double the adventures, one special price. Adult ₹1,313 (save ₹402) · Child ₹1,128 (save ₹275).",dateLabel:"Any day · two-day validity"}
];
function loadOffers(){var base=OFFER_DEFAULTS.map(function(o){return Object.assign({},o);});try{var ov=JSON.parse(localStorage.getItem('ukdOffers')||'null');if(ov){base.forEach(function(o){if(ov[o.id])Object.assign(o,ov[o.id]);});}}catch(_){}return base;}
function saveOffers(map){try{localStorage.setItem('ukdOffers',JSON.stringify(map));}catch(_){}offers=loadOffers();}
let offers=loadOffers();
function dowOf(d){return new Date(d+'T12:00:00').getDay();}
function addDay(d,n){var t=new Date(d+'T12:00:00');t.setDate(t.getDate()+n);return t.toISOString().slice(0,10);}
function offStatus(o,today){if(!o.active||!o.visitStart||!o.visitEnd)return 'inactive';if(today>o.visitEnd||today>o.bookEnd)return 'expired';if(today<o.visitStart)return 'upcoming';return 'active';}
function firstEligibleVisit(o,fromISO){var t=todayISO();var start=(o.visitStart>fromISO?o.visitStart:fromISO);var d=(start>t?start:addDay(t,1));for(var i=0;i<400;i++){if(d>o.visitEnd||d>o.bookEnd)return null;if(d>t&&(!o.weekdays||o.weekdays.indexOf(dowOf(d))>=0))return d;d=addDay(d,1);}return null;}
function dateEligible(o,date){var t=todayISO();if(!date||date<=t)return false;var st=offStatus(o,t);if(st==='inactive'||st==='expired')return false;if(date<o.visitStart||date>o.visitEnd)return false;if(t>o.bookEnd)return false;if(o.weekdays&&o.weekdays.indexOf(dowOf(date))<0)return false;return true;}
function dateOk(id,date){var o=offers.find(function(x){return x.id===id;});return o?dateEligible(o,date):false;}
function priceTag(o){switch(o.kind){case 'pct-cat':return o.pct+'% OFF';case 'flat-adult':return '₹'+o.flat+'+tax';case 'kids':return 'KIDS FREE';case 'bogo-samecat':return 'BUY 1 GET 1';case 'b2g1-samecat':return 'BUY 2 GET 1';case 'info-double':return '2-DAY';default:return '';}}
function bogoSameCat(cats){var amt=0,free=0;cats.forEach(function(k){var n=qty[k]||0;var f=Math.floor(n/2);free+=f;amt+=f*prices[k];});return {amt:amt,free:free};}
function b2g1SameCat(cats){var amt=0,free=0;cats.forEach(function(k){var n=qty[k]||0;var f=Math.floor(n/3);free+=f;amt+=f*prices[k];});return {amt:amt,free:free};}
function reasonUnavailable(o){var t=todayISO();if(offStatus(o,t)==='expired')return '⏳ This offer has expired.';if(offStatus(o,t)==='inactive')return '⚠️ This offer is not currently active.';if(!selDate)return '📅 '+o.dateLabel+'.';if(selDate<=t)return '⚠️ Offers close at 12 AM — pick a future visit date.';var nx=firstEligibleVisit(o,selDate);return '⚠️ '+o.name+' is not valid for '+selDate+'.'+(nx?(' Next eligible date: '+nx+'.'):' No eligible date available — continue at the regular ticket price.');}
function evalOffer(o){if(!dateEligible(o,selDate))return {amt:0,ok:false,note:reasonUnavailable(o)};switch(o.kind){
 case 'pct-cat':{var c=o.cats[0];var n=qty[c]||0;if(n<1)return {amt:0,ok:false,note:'ℹ️ Add a '+labels[c]+' to use this offer.'};return {amt:o.pct/100*n*prices[c],ok:true,note:'🪩 '+o.pct+'% off '+labels[c]+' — carry valid ID at entry.'};}
 case 'flat-adult':{if(!qty.adult)return {amt:0,ok:false,note:'ℹ️ Add an Adult Fun Pass for the ₹'+o.flat+' special.'};return {amt:qty.adult*Math.max(0,prices.adult-o.flat),ok:true,note:'🇮🇳 Adult Fun Pass at ₹'+o.flat+' (before tax) each.'};}
 case 'kids':{if(!qty.adult)return {amt:0,ok:false,note:'ℹ️ Add an Adult Fun Pass — each adult unlocks 2 free kids.'};if(!qty.child)return {amt:0,ok:false,note:'ℹ️ Add Child Fun Passes — 2 free per adult.'};var fk=Math.min(qty.child,2*qty.adult);return {amt:fk*prices.child,ok:true,note:'✔️ '+fk+' kid(s) FREE below 130 cm.'};}
 case 'bogo-samecat':{var r=bogoSameCat(o.cats);if(!r.amt)return {amt:0,ok:false,note:'🎂 Add 2+ passes of the same category — buy 1 get 1 free.'};return {amt:r.amt,ok:true,note:'🎂 '+r.free+' ticket(s) FREE (same category) — valid DOB proof required at entry.'};}
 case 'b2g1-samecat':{var r2=b2g1SameCat(o.cats);if(!r2.amt)return {amt:0,ok:false,note:'ℹ️ Add 3+ passes of the same category — buy 2 get 1 free.'};return {amt:r2.amt,ok:true,note:'✔️ '+r2.free+' ticket(s) FREE (all three same category).'};}
 case 'info-double':{if(!qty.dfpa&&!qty.dfpc)return {amt:0,ok:false,note:'ℹ️ Add a Double Fun Pass to enjoy the two-day special price.'};return {amt:0,ok:true,note:'✅ Double Fun Pass special pricing applied (Adult ₹1,313 · Child ₹1,128).'};}
}return {amt:0,ok:false,note:''};}
function bestOffer(){if(!selDate)return null;var best=null,bestAmt=0;offers.forEach(function(o){if(!dateEligible(o,selDate))return;var r=evalOffer(o);if(r.ok&&r.amt>bestAmt){bestAmt=r.amt;best=o;}});return best;}'''
E.append(("engine", old_offers, new_engine, 1))

# ---- R2a: remove old dateOk ----
old_dateok = '''function dateOk(id,isod){
 if(isod<=todayISO()) return false;
 var dow=new Date(isod+'T12:00:00').getDay(), md=isod.slice(5);
 switch(id){
  case 'kids': return dow===6;
  case 'independence': return md==='08-15';
  case 'friendship': return md==='08-02';
  case 'midweek': return dow===2||dow===3;
  default: return true;
 }
}
function offerDatesLabel(id){
 switch(id){
  case 'kids': return 'Valid on Saturdays';
  case 'independence': return 'Valid on 15 August only';
  case 'friendship': return 'Valid on 2 August only';
  case 'midweek': return 'Valid every Tuesday & Wednesday';
  default: return 'Valid on any future date';
 }
}
'''
E.append(("rm-old-dateok", old_dateok, "", 1))

# ---- R2b: offerAcc ----
old_acc = '''function offerAcc(o){
 var open=(selOffer&&selOffer.id===o.id);
 var proceed=(open&&selDate&&dateOk(o.id,selDate));
 return '<div class="offer-acc '+o.bg+(open?' open':'')+'">'+
  '<button class="offer-acc-head" onclick="toggleOffer(\\''+o.id+'\\')" aria-expanded="'+open+'">'+
   '<span class="oa-badge">'+o.s+'</span>'+
   '<span class="oa-name">'+o.n+'</span>'+
   '<span class="oa-price">'+o.p+'</span>'+
   '<span class="oa-chev">'+(open?'▲':'▼')+'</span>'+
  '</button>'+
  '<div class="offer-acc-body">'+
   '<p>'+o.d+'</p>'+
   '<p class="oa-dates">\\U0001F4C5 '+offerDatesLabel(o.id)+'</p>'+
   '<button class="apply" onclick="applyOffer(\\''+o.id+'\\')">'+(proceed?'Proceed with this offer ➜':'Apply & pick date ➜')+'</button>'+
  '</div></div>';
}'''
new_acc = '''function offerAcc(o){
 var t=todayISO(), st=offStatus(o,t), elig=dateEligible(o,selDate), open=(selOffer&&selOffer.id===o.id);
 var tag = elig? '' : (st==='upcoming'?' · UPCOMING':st==='expired'?' · EXPIRED':st==='inactive'?' · INACTIVE':(selDate?' · NOT ELIGIBLE':''));
 var nx=firstEligibleVisit(o,t);
 var btn = elig
   ? '<button class="apply" onclick="applyOffer(\\''+o.id+'\\')">Apply & pick date ➜</button>'
   : '<button class="apply" disabled>'+(st==='expired'?'Offer ended':(nx?('Select '+nx):'Not available'))+'</button>';
 return '<div class="offer-acc '+o.bg+(open?' open':'')+(elig?'':' offdim')+'">'+
  '<button class="offer-acc-head" onclick="toggleOffer(\\''+o.id+'\\')" aria-expanded="'+open+'">'+
   '<span class="oa-badge">'+o.badge+tag+'</span>'+
   '<span class="oa-name">'+o.name+'</span>'+
   '<span class="oa-price">'+priceTag(o)+'</span>'+
   '<span class="oa-chev">'+(open?'▲':'▼')+'</span>'+
  '</button>'+
  '<div class="offer-acc-body">'+
   '<p>'+o.desc+'</p>'+
   '<p class="oa-dates">\U0001F4C5 '+o.dateLabel+'</p>'+
   btn+
  '</div></div>';
}'''
E.append(("offerAcc", old_acc, new_acc, 1))

# ---- R2c: renderOffers ----
old_ro = '''function renderOffers(){
 const g=document.getElementById('offer-grid'); if(g) g.innerHTML=offers.map(offerAcc).join('');
 const pl=document.getElementById('plan-offers'); if(!pl) return;
 const list=(selDate? offers.filter(function(o){return dateOk(o.id,selDate);}) : offers);
 pl.innerHTML = list.length? list.map(offerAcc).join('')
   : '<p class="no-offer">\U0001F614 No offers available for '+selDate+'. Offers need a future date — pick another day or <a onclick="clearDate()">clear the date</a>.</p>';
 var hint=document.getElementById('offer-hint');
 if(hint) hint.textContent = selDate? ('Showing offers valid on '+selDate) : (selOffer? ('Calendar now shows dates for '+selOffer.n) : 'Tap an offer to see its valid dates');
}'''
new_ro = '''function renderOffers(){
 var t=todayISO();
 var g=document.getElementById('offer-grid');
 if(g){
  var avail=offers.filter(function(o){return offStatus(o,t)==='active';});
  var upc=offers.filter(function(o){return offStatus(o,t)==='upcoming';});
  var html='<h3 class="offers-sec-h">\U0001F3AB Available now</h3>';
  html+= avail.length? '<div class="offers-strip">'+avail.map(offerAcc).join('')+'</div>'
    : '<p class="no-offer">No offers are available right now. Regular tickets are always available for booking.</p>';
  if(upc.length){ html+='<h3 class="offers-sec-h">⏳ Upcoming offers</h3><div class="offers-strip">'+upc.map(offerAcc).join('')+'</div>'; }
  g.innerHTML=html;
 }
 var pl=document.getElementById('plan-offers'); if(!pl) return;
 if(selDate){
  var elig=offers.filter(function(o){return dateEligible(o,selDate);});
  pl.innerHTML= elig.length? elig.map(offerAcc).join('')
   : '<p class="no-offer">No offers are available for your selected visit date. You can continue booking at the regular ticket price or <a onclick="clearDate()">select another date</a> to explore available offers.</p>';
 } else { pl.innerHTML=offers.map(offerAcc).join(''); }
 var hint=document.getElementById('offer-hint');
 if(hint) hint.textContent = selDate? ('Offers available for '+selDate) : (selOffer? ('Calendar shows dates for '+selOffer.name) : 'Pick a date or tap an offer to see valid dates');
}'''
E.append(("renderOffers", old_ro, new_ro, 1))

# ---- R2d: applyOffer ----
old_ao = '''function applyOffer(id){
 selOffer=offers.find(o=>o.id===id);
 go('book');
 renderOffers(); renderCal();
 if(!selDate){bookStep(1);toast('\U0001F4C5 Now pick a highlighted date for this offer');return;}
 if(!dateOk(id,selDate)){selDate='';renderOffers();renderCal();bookStep(1);toast('\U0001F4C5 Pick a date valid for this offer');return;}
 bookStep(2);toast('\U0001F381 "'+selOffer.n+'" applied — choose your tickets');
}'''
new_ao = '''function applyOffer(id){
 selOffer=offers.find(function(o){return o.id===id;});
 go('book');
 renderOffers(); renderCal();
 if(!selDate){bookStep(1);toast('\U0001F4C5 Now pick a highlighted date for this offer');return;}
 if(!dateOk(id,selDate)){selDate='';renderOffers();renderCal();bookStep(1);toast('\U0001F4C5 Pick a date valid for this offer');return;}
 bookStep(2);toast('\U0001F381 "'+selOffer.name+'" applied — choose your tickets');
}'''
E.append(("applyOffer", old_ao, new_ao, 1))

# ---- R2e: toggleOffer ----
old_to = '''function toggleOffer(id){
 if(selOffer&&selOffer.id===id){selOffer=null;}
 else{selOffer=offers.find(o=>o.id===id); if(selDate&&!dateOk(id,selDate)) selDate='';}
 renderOffers(); renderCal();
}'''
new_to = '''function toggleOffer(id){
 if(selOffer&&selOffer.id===id){selOffer=null;}
 else{selOffer=offers.find(function(o){return o.id===id;}); if(selDate&&!dateOk(id,selDate)) selDate='';}
 renderOffers(); renderCal();
}'''
E.append(("toggleOffer", old_to, new_to, 1))

# ---- R3: todayISO -> IST ----
E.append(("todayISO",
 "function todayISO(){const t=new Date();return iso(t.getFullYear(),t.getMonth(),t.getDate())}",
 "function todayISO(){try{return new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Kolkata'}).format(new Date());}catch(_){var t=new Date();return iso(t.getFullYear(),t.getMonth(),t.getDate());}}",
 1))

# ---- R4: renderCal cal-filter selOffer.n -> name ----
E.append(("cal-filter",
 'if(selOffer) h+=`<p class="cal-filter">\U0001F4C5 Dates for <b>${selOffer.n}</b> · <a onclick="clearOffer()">show all</a></p>`;',
 'if(selOffer) h+=`<p class="cal-filter">\U0001F4C5 Dates for <b>${selOffer.name}</b> · <a onclick="clearOffer()">show all</a></p>`;',
 1))

# ---- R5: updateLiveTotal selOffer.n -> name ----
E.append(("liveTotal",
 " var txt=(selOffer?('🎁 '+selOffer.n+' · '):'')+'🧮 '+n+' ticket'+(n===1?'':'s')+(food?' + food':'')+' · Subtotal '+fmt(tix+food)+' (before tax)';",
 " var txt=(selOffer?('🎁 '+selOffer.name+' · '):'')+'🧮 '+n+' ticket'+(n===1?'':'s')+(food?' + food':'')+' · Subtotal '+fmt(tix+food)+' (before tax)';",
 1))

# ---- R6: offerDiscount -> wrapper ----
old_od_start = "function offerDiscount(){\n if(!selOffer) return {amt:0,note:''};\n /* Offers are never valid for same-day (or past) visit dates */"
# replace whole offerDiscount body by matching from its start to its closing before renderCheckout
import re
m = re.search(r"function offerDiscount\(\)\{.*?\n\}\nfunction renderCheckout", h, re.S)
if not m:
    print("FAIL: offerDiscount block not found"); sys.exit(1)
old_od = m.group(0)
new_od = ("function offerDiscount(){ if(!selOffer) return {amt:0,note:''}; var r=evalOffer(selOffer); return {amt:r.amt,note:r.note}; }\n"
          "function grandTotal(){var disc=offerDiscount();var tix=ticketSubtotal();var tixNet=Math.max(0,tix-disc.amt);var food=qty.veg*prices.veg+qty.nonveg*prices.nonveg;var sub=tixNet+.18*tixNet+food+.05*food;var conv=Math.round(sub*0.02*100)/100;return {sub:sub,conv:conv,grand:sub+conv,disc:disc.amt};}\n"
          "function removeOffer(){selOffer=null;renderCheckout();toast('Offer removed — regular price');}\n"
          "function renderCheckout")
E.append(("offerDiscount", old_od, new_od, 1))

# ---- R7: renderCheckout body ----
old_rc = '''function renderCheckout(){
 document.getElementById('c-date').value=selDate||'Not selected';
 const ao=document.getElementById('applied-offer');
 const disc=offerDiscount();
 if(selOffer){ao.style.display='block';ao.textContent='🎁 Offer applied: '+selOffer.n+' ('+selOffer.s+')'+(disc.amt?' — saving '+fmt(disc.amt):'')+(disc.note?' · '+disc.note:'');}
 else ao.style.display='none';
 const FOOD=['veg','nonveg'];
 let rows='',tix=0,food=0;
 for(const k in qty){if(qty[k]>0){const amt=qty[k]*prices[k];
  if(FOOD.includes(k)) food+=amt; else tix+=amt;
  rows+=`<div class="row"><span>${labels[k]} × ${qty[k]}</span><span>${fmt(amt)}</span></div>`;}}
 if(disc.amt){rows+=`<div class="row" style="color:var(--green-deep)"><span>Offer: ${selOffer.n}</span><span>− ${fmt(disc.amt)}</span></div>`;}
 const tixNet=Math.max(0,tix-disc.amt);
 const gstT=.18*tixNet, gstF=.05*food;
 if(tixNet) rows+=`<div class="row"><span>GST on tickets (18%)</span><span>+ ${fmt(gstT)}</span></div>`;
 if(food)   rows+=`<div class="row"><span>GST on food (5%)</span><span>+ ${fmt(gstF)}</span></div>`;
 rows+=`<div class="row total"><span>Total</span><span>${fmt(tixNet+gstT+food+gstF)}</span></div>`;
 document.getElementById('summary').innerHTML=rows;
}'''
new_rc = '''function renderCheckout(){
 if(!selOffer){var b=bestOffer(); if(b) selOffer=b;}
 document.getElementById('c-date').value=selDate||'Not selected';
 var ao=document.getElementById('applied-offer');
 var disc=offerDiscount();
 if(selOffer){
  var req=(selOffer.needsDob?' · 🎂 carry DOB proof':'')+(selOffer.needsId?' · 🪩 carry ID proof':'');
  ao.style.display='block';
  ao.innerHTML='🎁 Best offer applied automatically: <b>'+esc(selOffer.name)+'</b>'+(disc.amt?' — you save '+fmt(disc.amt):'')+(disc.note?' · '+disc.note:'')+req+' &nbsp;<a onclick="removeOffer()" style="color:#fff;text-decoration:underline;cursor:pointer">remove</a>';
 } else { ao.style.display='none'; }
 var FOOD=['veg','nonveg'];
 var rows='',tix=0,food=0,k;
 for(k in qty){ if(qty[k]>0){ var amt=qty[k]*prices[k]; if(FOOD.indexOf(k)>=0) food+=amt; else tix+=amt;
   rows+='<div class="row"><span>'+labels[k]+' × '+qty[k]+'</span><span>'+fmt(amt)+'</span></div>'; } }
 if(disc.amt){ rows+='<div class="row" style="color:var(--green-deep)"><span>Offer: '+esc(selOffer.name)+'</span><span>− '+fmt(disc.amt)+'</span></div>'; }
 var tixNet=Math.max(0,tix-disc.amt);
 var gstT=.18*tixNet, gstF=.05*food, sub=tixNet+gstT+food+gstF, conv=Math.round(sub*0.02*100)/100;
 if(tixNet) rows+='<div class="row"><span>GST on tickets (18%)</span><span>+ '+fmt(gstT)+'</span></div>';
 if(food) rows+='<div class="row"><span>GST on food (5%)</span><span>+ '+fmt(gstF)+'</span></div>';
 rows+='<div class="row"><span>Convenience fee (2%)</span><span>+ '+fmt(conv)+'</span></div>';
 rows+='<div class="row total"><span>Total payable</span><span>'+fmt(sub+conv)+'</span></div>';
 document.getElementById('summary').innerHTML=rows;
}'''
E.append(("renderCheckout", old_rc, new_rc, 1))

# ---- R8: pay body ----
old_pay = '''function pay(){
 var n=document.getElementById('c-name').value.trim();
 var e=document.getElementById('c-email').value.trim();
 var p=document.getElementById('c-phone').value.trim();
 if(!selDate){toast('\\U0001F4C5 Please pick a visit date');bookStep(1);return;}
 var tixCount=['adult','child','senior','student','dfpa','dfpc'].reduce(function(s,k){return s+qty[k];},0);
 if(tixCount<1){toast('\\U0001F3AB Add at least one ticket');bookStep(2);return;}
 if(!n){toast('⚠️ Please enter your name');document.getElementById('c-name').focus();return;}
 if(!validEmail(e)){toast('\\U0001F4E7 Enter a valid email address');document.getElementById('c-email').focus();return;}
 if(!validPhone(p)){toast('\\U0001F4F1 Enter a valid contact number');document.getElementById('c-phone').focus();return;}
 var disc=offerDiscount();
 var tixNet=Math.max(0,ticketSubtotal()-disc.amt);
 var food=qty.veg*prices.veg+qty.nonveg*prices.nonveg;
 var grand=tixNet+.18*tixNet+food+.05*food;
 var ref='UKD-'+(Date.now().toString(36)+Math.random().toString(36).slice(2,5)).toUpperCase().slice(-8);
 var booking={ref:ref,name:n,email:e,phone:p,date:selDate,total:grand,items:Object.assign({},qty),offer:selOffer?selOffer.n:null,ts:new Date().toISOString()};
 try{var all=JSON.parse(localStorage.getItem('ukdBookings')||'[]');all.push(booking);localStorage.setItem('ukdBookings',JSON.stringify(all));}catch(_){}
 document.getElementById('bstep4').innerHTML=
  '<div class="conf-card"><div class="conf-check">✅</div>'+
  '<h3>Booking Confirmed!</h3>'+
  '<p>Thank you, '+esc(n)+'. Your e-tickets for <b>'+esc(selDate)+'</b> have been sent to <b>'+esc(e)+'</b>.</p>'+
  '<div class="conf-ref">Booking reference<br><b>'+ref+'</b></div>'+
  '<div class="conf-total">Amount paid: <b>'+fmt(grand)+'</b></div>'+
  '<button class="btn-next" onclick="location.reload()">Make another booking</button></div>';
 document.getElementById('bstep4').scrollIntoView({behavior:'smooth',block:'center'});
 toast('\\U0001F389 Booking confirmed — ref '+ref);
}'''
new_pay = '''function pay(){
 var n=document.getElementById('c-name').value.trim();
 var e=document.getElementById('c-email').value.trim();
 var p=document.getElementById('c-phone').value.trim();
 if(!selDate){toast('\U0001F4C5 Please pick a visit date');bookStep(1);return;}
 var tixCount=['adult','child','senior','student','dfpa','dfpc'].reduce(function(s,k){return s+qty[k];},0);
 if(tixCount<1){toast('\U0001F3AB Add at least one ticket');bookStep(2);return;}
 if(!n){toast('⚠️ Please enter your name');document.getElementById('c-name').focus();return;}
 if(!validEmail(e)){toast('\U0001F4E7 Enter a valid email address');document.getElementById('c-email').focus();return;}
 if(!validPhone(p)){toast('\U0001F4F1 Enter a valid contact number');document.getElementById('c-phone').focus();return;}
 /* re-validate offer on "server" (recompute) before charging */
 if(selOffer && !dateEligible(selOffer,selDate)){selOffer=null;renderCheckout();toast('⚠️ Offer no longer valid — total updated to regular price');return;}
 var gt=grandTotal(); var grand=gt.grand;
 var ref='UKD-'+(Date.now().toString(36)+Math.random().toString(36).slice(2,5)).toUpperCase().slice(-8);
 var offerName=selOffer?selOffer.name:'No offer (regular price)';
 var booking={ref:ref,name:n,email:e,phone:p,date:selDate,total:grand,items:Object.assign({},qty),offer:offerName,ts:new Date().toISOString()};
 try{var all=JSON.parse(localStorage.getItem('ukdBookings')||'[]');all.push(booking);localStorage.setItem('ukdBookings',JSON.stringify(all));}catch(_){}
 var qdata='VGP%20Universal%20Kingdom%0ARef:%20'+ref+'%0AVisit:%20'+selDate+'%0AOffer:%20'+encodeURIComponent(offerName)+'%0APaid:%20INR%20'+grand.toFixed(2);
 var qurl='https://api.qrserver.com/v1/create-qr-code/?size=190x190&margin=8&data='+qdata;
 document.getElementById('bstep4').innerHTML=
  '<div class="conf-card"><div class="conf-check">✅</div>'+
  '<h3>Booking Confirmed!</h3>'+
  '<p>Thank you, '+esc(n)+'. Your e-ticket for <b>'+esc(selDate)+'</b> has been sent to <b>'+esc(e)+'</b>.</p>'+
  '<img class="conf-qr" src="'+qurl+'" alt="QR e-ticket for booking '+ref+'" width="190" height="190" loading="lazy">'+
  '<div class="conf-ref">Booking ID<br><b>'+ref+'</b></div>'+
  '<div class="conf-meta">Visit date: <b>'+esc(selDate)+'</b><br>Offer: <b>'+esc(offerName)+'</b></div>'+
  '<div class="conf-total">Amount paid: <b>'+fmt(grand)+'</b></div>'+
  '<button class="btn-next" onclick="window.print()">\U0001F9FE Download / print invoice</button> '+
  '<button class="btn-back" onclick="location.reload()">Make another booking</button></div>';
 document.getElementById('bstep4').scrollIntoView({behavior:'smooth',block:'center'});
 toast('\U0001F389 Booking confirmed — '+ref);
}'''
E.append(("pay", old_pay, new_pay, 1))

# ---- R9: offers page container ----
E.append(("offer-grid-container",
 '<div class="grid g3" id="offer-grid"></div>',
 '<div id="offer-grid" class="offers-page"></div>',
 1))

# ---- R10: CSS ----
css = ('.offer-acc.offdim{opacity:.6;filter:grayscale(.3)}\n'
 '.apply[disabled]{opacity:.85;cursor:not-allowed;background:#e8e0f5;color:#7a6a95}\n'
 '.offers-sec-h{color:var(--purple);font-size:1.15rem;margin:6px 0 12px;font-family:\'Roboto Condensed\',\'Arial Narrow\',Helvetica,sans-serif;text-transform:uppercase;letter-spacing:.5px}\n'
 '.offers-page .offers-strip{display:grid;grid-template-columns:repeat(auto-fill,minmax(230px,1fr));gap:14px;margin-bottom:22px}\n'
 '.conf-qr{display:block;margin:14px auto;border:6px solid #fff;border-radius:14px;box-shadow:0 4px 14px rgba(0,0,0,.18);background:#fff}\n'
 '.conf-meta{font-weight:700;color:var(--purple);margin:6px 0;line-height:1.5}\n'
 '@media print{nav,.ticker,.drawer,.overlay,.nav-btns,.steps,.hero-band,.ornament{display:none!important}}\n'
 '</style>')
E.append(("css", "</style>", css, 1))

for label, old, new, exp in E:
    c = h.count(old)
    if c != exp:
        print("FAIL [%s]: expected %d, found %d" % (label, exp, c)); sys.exit(1)
    h = h.replace(old, new); print("ok [%s]" % label)

io.open(SRC, "w", encoding="utf-8").write(h)
print("DONE")
