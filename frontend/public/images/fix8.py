#!/usr/bin/env python3
import io, sys
SRC = "/sessions/nice-keen-cannon/mnt/Desktop--outputs/universal_kingdom_website.html"
h = io.open(SRC, "r", encoding="utf-8").read()
edits = []

# 1) Replace offerCard with date-rule helpers + accordion renderer
old_oc = (
"function offerCard(o){var sel=(selOffer&&selOffer.id===o.id);return `<div class=\"offer-card ${o.bg}${sel?' selected':''}\" onclick=\"applyOffer('${o.id}')\">\n"
" <span class=\"offer-badge\">${o.s}</span><h3>${o.n}</h3><div class=\"price\">${o.p}</div><p>${o.d}</p>\n"
" <button class=\"apply\">${sel?'✓ Applied — tap to remove':'Apply & Book ➜'}</button></div>`;}"
)
new_oc = r"""function dateOk(id,isod){
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
function offerAcc(o){
 var open=(selOffer&&selOffer.id===o.id);
 var proceed=(open&&selDate&&dateOk(o.id,selDate));
 return '<div class="offer-acc '+o.bg+(open?' open':'')+'">'+
  '<button class="offer-acc-head" onclick="toggleOffer(\''+o.id+'\')" aria-expanded="'+open+'">'+
   '<span class="oa-badge">'+o.s+'</span>'+
   '<span class="oa-name">'+o.n+'</span>'+
   '<span class="oa-price">'+o.p+'</span>'+
   '<span class="oa-chev">'+(open?'▲':'▼')+'</span>'+
  '</button>'+
  '<div class="offer-acc-body">'+
   '<p>'+o.d+'</p>'+
   '<p class="oa-dates">\U0001F4C5 '+offerDatesLabel(o.id)+'</p>'+
   '<button class="apply" onclick="applyOffer(\''+o.id+'\')">'+(proceed?'Proceed with this offer ➜':'Apply & pick date ➜')+'</button>'+
  '</div></div>';
}"""
edits.append(("offerCard", old_oc, new_oc, 1))

# 2) renderOffers: accordion + filter book-page offers by selected date
old_ro = (
"function renderOffers(){\n"
" const g=document.getElementById('offer-grid'); if(g) g.innerHTML=offers.map(offerCard).join('');\n"
" const pl=document.getElementById('plan-offers'); if(pl) pl.innerHTML=offers.map(offerCard).join('');\n"
"}"
)
new_ro = (
"function renderOffers(){\n"
" const g=document.getElementById('offer-grid'); if(g) g.innerHTML=offers.map(offerAcc).join('');\n"
" const pl=document.getElementById('plan-offers'); if(!pl) return;\n"
" const list=(selDate? offers.filter(function(o){return dateOk(o.id,selDate);}) : offers);\n"
" pl.innerHTML = list.length? list.map(offerAcc).join('')\n"
"   : '<p class=\"no-offer\">\U0001F614 No offers available for '+selDate+'. Offers need a future date — pick another day or <a onclick=\"clearDate()\">clear the date</a>.</p>';\n"
" var hint=document.getElementById('offer-hint');\n"
" if(hint) hint.textContent = selDate? ('Showing offers valid on '+selDate) : (selOffer? ('Calendar now shows dates for '+selOffer.n) : 'Tap an offer to see its valid dates');\n"
"}"
)
edits.append(("renderOffers", old_ro, new_ro, 1))

# 3) applyOffer + toggleOffer + clearDate + clearOffer
old_ao = (
"function applyOffer(id){\n"
" if(selOffer&&selOffer.id===id){selOffer=null;go('book');bookStep(1);toast('Offer removed');return;}\n"
" selOffer=offers.find(o=>o.id===id);\n"
" go('book');\n"
" if(selDate){bookStep(4);toast('🎁 \"'+selOffer.n+'\" applied at checkout!');}\n"
" else {bookStep(1);toast('🎁 \"'+selOffer.n+'\" auto-applies at checkout — now pick your visit date!');}\n"
"}"
)
new_ao = (
"function applyOffer(id){\n"
" selOffer=offers.find(o=>o.id===id);\n"
" go('book');\n"
" renderOffers(); renderCal();\n"
" if(!selDate){bookStep(1);toast('\U0001F4C5 Now pick a highlighted date for this offer');return;}\n"
" if(!dateOk(id,selDate)){selDate='';renderOffers();renderCal();bookStep(1);toast('\U0001F4C5 Pick a date valid for this offer');return;}\n"
" bookStep(2);toast('🎁 \"'+selOffer.n+'\" applied — choose your tickets');\n"
"}\n"
"function toggleOffer(id){\n"
" if(selOffer&&selOffer.id===id){selOffer=null;}\n"
" else{selOffer=offers.find(o=>o.id===id); if(selDate&&!dateOk(id,selDate)) selDate='';}\n"
" renderOffers(); renderCal();\n"
"}\n"
"function clearDate(){selDate='';renderOffers();renderCal();}\n"
"function clearOffer(){selOffer=null;renderOffers();renderCal();}"
)
edits.append(("applyOffer", old_ao, new_ao, 1))

# 4) renderCal: bigger + offer-filtered dates + highlight
old_rc = (
"function renderCal(){\n"
" const c=document.getElementById('cal'); if(!c) return;\n"
" const t=new Date(); if(calY===undefined){calY=t.getFullYear();calM=t.getMonth();}\n"
" const first=new Date(calY,calM,1).getDay(), days=new Date(calY,calM+1,0).getDate();\n"
" const atCur=(calY===t.getFullYear()&&calM===t.getMonth());\n"
" let h=`<div class=\"cal-head\"><button class=\"cal-nav\" ${atCur?'disabled':''} onclick=\"calShift(-1)\">‹</button><b>${MN[calM]} ${calY}</b><button class=\"cal-nav\" onclick=\"calShift(1)\">›</button></div>`;\n"
" h+='<div class=\"cal-grid\">'+['SUN','MON','TUE','WED','THU','FRI','SAT'].map(d=>`<span class=\"dow\">${d}</span>`).join('');\n"
" for(let i=0;i<first;i++)h+='<span></span>';\n"
" for(let d=1;d<=days;d++){\n"
"  const dt=iso(calY,calM,d);\n"
"  const off=dt<todayISO();\n"
"  h+=`<button class=\"day${dt===selDate?' sel':''}\" ${off?'disabled':''} onclick=\"pickDate('${dt}')\">${d}</button>`;\n"
" }\n"
" c.innerHTML=h+'</div>';\n"
"}"
)
new_rc = (
"function renderCal(){\n"
" const c=document.getElementById('cal'); if(!c) return;\n"
" const t=new Date(); if(calY===undefined){calY=t.getFullYear();calM=t.getMonth();}\n"
" const first=new Date(calY,calM,1).getDay(), days=new Date(calY,calM+1,0).getDate();\n"
" const atCur=(calY===t.getFullYear()&&calM===t.getMonth());\n"
" let h=`<div class=\"cal-head\"><button class=\"cal-nav\" ${atCur?'disabled':''} onclick=\"calShift(-1)\">‹</button><b>${MN[calM]} ${calY}</b><button class=\"cal-nav\" onclick=\"calShift(1)\">›</button></div>`;\n"
" if(selOffer) h+=`<p class=\"cal-filter\">\U0001F4C5 Dates for <b>${selOffer.n}</b> · <a onclick=\"clearOffer()\">show all</a></p>`;\n"
" h+='<div class=\"cal-grid\">'+['SUN','MON','TUE','WED','THU','FRI','SAT'].map(d=>`<span class=\"dow\">${d}</span>`).join('');\n"
" for(let i=0;i<first;i++)h+='<span></span>';\n"
" for(let d=1;d<=days;d++){\n"
"  const dt=iso(calY,calM,d);\n"
"  const past=dt<todayISO();\n"
"  const okOffer=selOffer? dateOk(selOffer.id,dt):true;\n"
"  const disabled=past||!okOffer;\n"
"  const cls='day'+(dt===selDate?' sel':'')+(selOffer&&okOffer?' okday':'');\n"
"  h+=`<button class=\"${cls}\" ${disabled?'disabled':''} onclick=\"pickDate('${dt}')\">${d}</button>`;\n"
" }\n"
" c.innerHTML=h+'</div>';\n"
"}"
)
edits.append(("renderCal", old_rc, new_rc, 1))

# 5) pickDate: also refresh offers (date -> only valid offers)
edits.append(("pickDate",
 "function pickDate(dt){selDate=dt;renderCal();}",
 "function pickDate(dt){selDate=dt;renderCal();renderOffers();}",
 1))

# 6) live total: include applied offer name (carries to next page)
edits.append(("liveTotal",
 " var txt='🧮 '+n+' ticket'+(n===1?'':'s')+(food?' + food':'')+' · Subtotal '+fmt(tix+food)+' (before tax)';",
 " var txt=(selOffer?('🎁 '+selOffer.n+' · '):'')+'🧮 '+n+' ticket'+(n===1?'':'s')+(food?' + food':'')+' · Subtotal '+fmt(tix+food)+' (before tax)';",
 1))

# 7) offers-head: dynamic hint element
edits.append(("hint",
 '              <p class="offers-sub">Tap a deal to auto-apply it · future dates only</p>',
 '              <p class="offers-sub" id="offer-hint">Tap an offer to see its valid dates</p>',
 1))

# 8) CSS: accordion + bigger calendar + wider calendar column
css = (
"/* ---------- offers accordion + bigger calendar ---------- */\n"
".book-grid{grid-template-columns:.92fr 1.08fr}\n"
".book-offers .offers-strip{display:block}\n"
".offer-acc{border-radius:14px;color:#fff;margin-bottom:10px;overflow:hidden;box-shadow:0 4px 0 rgba(0,0,0,.16)}\n"
".offer-acc-head{width:100%;border:none;background:transparent;color:inherit;display:grid;grid-template-columns:auto 1fr auto auto;align-items:center;gap:10px;padding:13px 15px;cursor:pointer;text-align:left;font-family:'Nunito'}\n"
".oa-badge{font-size:.6rem;font-weight:800;background:rgba(255,255,255,.25);padding:3px 8px;border-radius:20px;white-space:nowrap}\n"
".oa-name{font-family:'Roboto Condensed','Arial Narrow',Helvetica,sans-serif;font-weight:700;text-transform:uppercase;font-size:1rem;line-height:1.05}\n"
".oa-price{font-family:'Roboto Condensed','Arial Narrow',Helvetica,sans-serif;font-weight:700;color:#FDDB00;font-size:1.02rem;white-space:nowrap}\n"
".oa-chev{font-size:.62rem;opacity:.85}\n"
".offer-acc-body{max-height:0;overflow:hidden;transition:max-height .3s ease;padding:0 15px}\n"
".offer-acc.open .offer-acc-body{max-height:340px;padding:0 15px 15px}\n"
".offer-acc-body p{font-size:.85rem;font-weight:600;margin-bottom:8px;opacity:.97}\n"
".oa-dates{color:#FDDB00 !important;font-weight:800 !important}\n"
".offer-acc-body .apply{background:#fff;border:none;font-weight:800;padding:8px 18px;border-radius:22px;cursor:pointer;font-family:'Nunito';color:var(--purple)}\n"
".no-offer{background:#FFF7D6;color:var(--ink);border:2px dashed var(--yellow-deep);border-radius:14px;padding:14px;font-weight:700;font-size:.9rem}\n"
".no-offer a,.cal-filter a{color:var(--red);cursor:pointer;text-decoration:underline;font-weight:800}\n"
".book-date .day{padding:15px 0;font-size:1.1rem;border-radius:12px}\n"
".book-date .cal-grid{gap:6px}\n"
".book-date .dow{font-size:.8rem;padding:6px 0}\n"
".book-date .cal-head{font-size:1.2rem;margin-bottom:8px}\n"
".day.okday:not([disabled]){background:#FFEDA6;box-shadow:inset 0 0 0 2px var(--yellow-deep)}\n"
".cal-filter{font-size:.82rem;font-weight:700;color:var(--purple);margin:2px 0 10px}\n"
"@media(max-width:860px){.book-grid{grid-template-columns:1fr}}\n"
"</style>"
)
edits.append(("css", "</style>", css, 1))

for label, old, new, exp in edits:
    c = h.count(old)
    if c != exp:
        print("FAIL [%s]: expected %d, found %d" % (label, exp, c)); sys.exit(1)
    h = h.replace(old, new); print("ok [%s]" % label)

io.open(SRC, "w", encoding="utf-8").write(h)
print("DONE")
