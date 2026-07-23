#!/usr/bin/env python3
import io, sys
SRC = "/sessions/nice-keen-cannon/mnt/Desktop--outputs/universal_kingdom_website.html"
h = io.open(SRC, "r", encoding="utf-8").read()
edits = []

# 1) Step indicators -> clickable
old_steps = (
'        <div class="step now" id="st1"><span class="num">1</span> Visit Date & Offers</div>\n'
'        <div class="step" id="st2"><span class="num">2</span> Tickets</div>\n'
'        <div class="step" id="st3"><span class="num">3</span> Add-on Food</div>\n'
'        <div class="step" id="st4"><span class="num">4</span> Checkout</div>'
)
new_steps = (
'        <div class="step now" id="st1" onclick="bookStep(1)"><span class="num">1</span> Date &amp; Offers</div>\n'
'        <div class="step" id="st2" onclick="gotoStep(2)"><span class="num">2</span> Tickets</div>\n'
'        <div class="step" id="st3" onclick="gotoStep(3)"><span class="num">3</span> Food</div>\n'
'        <div class="step" id="st4" onclick="gotoStep(4)"><span class="num">4</span> Checkout</div>'
)
edits.append(("steps", old_steps, new_steps, 1))

# 2) Step 1 layout: offers grid on top (all offers), centered date panel below
old_bstep1 = (
'      <div id="bstep1">\n'
'        <div class="plan-grid">\n'
'          <div class="plan-left">\n'
'            <h3 class="plan-title">🎁 Offers for you</h3>\n'
'            <div id="plan-offers"></div>\n'
'          </div>\n'
'          <div class="panel plan-right">\n'
'            <h3>📅 Plan Your Adventure</h3>\n'
'            <p style="font-weight:700;color:var(--green-deep);margin-bottom:10px">7 hours of non-stop thrills, twists, and unforgettable excitement!</p>\n'
'            <div class="cal" id="cal"></div>\n'
'            <p class="cal-note">✅ Open all 365 days — 24×7×365, Monday to Sunday!</p>\n'
'            <div class="timings">\n'
'              <div class="t-head"><span></span><span>Park Timings</span><span>Water Timings</span></div>\n'
'              <div class="t-row"><b>Weekdays</b><span>9:30 AM – 6:00 PM</span><span>12:30 PM – 5:30 PM</span></div>\n'
'              <div class="t-row"><b>Weekends</b><span>9:30 AM – 7:00 PM</span><span>12:00 PM – 6:00 PM</span></div>\n'
'            </div>\n'
'            <div class="nav-btns"><span></span><button class="btn-next" onclick="proceedDate()">Proceed ➜</button></div>\n'
'          </div>\n'
'        </div>\n'
'      </div>'
)
new_bstep1 = (
'      <div id="bstep1">\n'
'        <div class="offers-head">\n'
'          <h3 class="plan-title">🎁 Pick an offer <span class="opt">(optional)</span></h3>\n'
'          <p class="offers-sub">Tap a deal to auto-apply it at checkout · all offers apply to future dates only</p>\n'
'        </div>\n'
'        <div id="plan-offers" class="offers-strip"></div>\n'
'        <div class="panel plan-right">\n'
'          <h3>📅 Choose your visit date</h3>\n'
'          <p style="font-weight:700;color:var(--green-deep);margin-bottom:10px">7 hours of non-stop thrills — open all 365 days, 24×7!</p>\n'
'          <div class="cal" id="cal"></div>\n'
'          <div class="timings">\n'
'            <div class="t-head"><span></span><span>Park Timings</span><span>Water Timings</span></div>\n'
'            <div class="t-row"><b>Weekdays</b><span>9:30 AM – 6:00 PM</span><span>12:30 PM – 5:30 PM</span></div>\n'
'            <div class="t-row"><b>Weekends</b><span>9:30 AM – 7:00 PM</span><span>12:00 PM – 6:00 PM</span></div>\n'
'          </div>\n'
'          <div class="nav-btns"><span></span><button class="btn-next" onclick="proceedDate()">Proceed to Tickets ➜</button></div>\n'
'        </div>\n'
'      </div>'
)
edits.append(("bstep1", old_bstep1, new_bstep1, 1))

# 3) Live-total bar in tickets step
edits.append(("live2",
 '        <div class="nav-btns"><button class="btn-back" onclick="bookStep(1)">⬅ Back</button><button class="btn-next" onclick="bookStep(3)">Next: Food ➜</button></div>',
 '        <div class="live-total"></div>\n'
 '        <div class="nav-btns"><button class="btn-back" onclick="bookStep(1)">⬅ Back</button><button class="btn-next" onclick="bookStep(3)">Next: Food ➜</button></div>',
 1))
# 4) Live-total bar in food step
edits.append(("live3",
 '        <div class="nav-btns"><button class="btn-back" onclick="bookStep(2)">⬅ Back</button><button class="btn-next" onclick="bookStep(4)">Next: Checkout ➜</button></div>',
 '        <div class="live-total"></div>\n'
 '        <div class="nav-btns"><button class="btn-back" onclick="bookStep(2)">⬅ Back</button><button class="btn-next" onclick="bookStep(4)">Next: Checkout ➜</button></div>',
 1))

# 5) offerCard: selected-state highlight
old_oc = (
'function offerCard(o){return `<div class="offer-card ${o.bg}" onclick="applyOffer(\'${o.id}\')">\n'
' <span class="offer-badge">${o.s}</span><h3>${o.n}</h3><div class="price">${o.p}</div><p>${o.d}</p>\n'
' <button class="apply">Apply & Book ➜</button></div>`;}'
)
new_oc = (
'function offerCard(o){var sel=(selOffer&&selOffer.id===o.id);return `<div class="offer-card ${o.bg}${sel?\' selected\':\'\'}" onclick="applyOffer(\'${o.id}\')">\n'
' <span class="offer-badge">${o.s}</span><h3>${o.n}</h3><div class="price">${o.p}</div><p>${o.d}</p>\n'
' <button class="apply">${sel?\'✓ Applied — tap to remove\':\'Apply & Book ➜\'}</button></div>`;}'
)
edits.append(("offerCard", old_oc, new_oc, 1))

# 6) applyOffer: allow toggle off + keep offers visible on step 1
old_ao = (
'function applyOffer(id){\n'
' selOffer=offers.find(o=>o.id===id);\n'
' go(\'book\');\n'
' if(selDate){bookStep(4);toast(\'🎁 "\'+selOffer.n+\'" applied at checkout!\');}\n'
' else {bookStep(1);toast(\'🎁 "\'+selOffer.n+\'" will be auto-applied — pick your visit date!\');}\n'
'}'
)
new_ao = (
'function applyOffer(id){\n'
' if(selOffer&&selOffer.id===id){selOffer=null;go(\'book\');bookStep(1);toast(\'Offer removed\');return;}\n'
' selOffer=offers.find(o=>o.id===id);\n'
' go(\'book\');\n'
' if(selDate){bookStep(4);toast(\'🎁 "\'+selOffer.n+\'" applied at checkout!\');}\n'
' else {bookStep(1);toast(\'🎁 "\'+selOffer.n+\'" auto-applies at checkout — now pick your visit date!\');}\n'
'}'
)
edits.append(("applyOffer", old_ao, new_ao, 1))

# 7) chg -> also refresh live total
edits.append(("chg",
 "function chg(k,v){qty[k]=Math.max(0,qty[k]+v);document.getElementById('q-'+k).textContent=qty[k];}",
 "function chg(k,v){qty[k]=Math.max(0,qty[k]+v);document.getElementById('q-'+k).textContent=qty[k];updateLiveTotal();}\n"
 "function gotoStep(n){ if(n>=2 && !selDate){toast('\U0001F4C5 Please pick your visit date first');return;} bookStep(n); }\n"
 "function updateLiveTotal(){\n"
 " var tix=ticketSubtotal();\n"
 " var food=qty.veg*prices.veg+qty.nonveg*prices.nonveg;\n"
 " var n=['adult','child','senior','student','dfpa','dfpc'].reduce(function(s,k){return s+qty[k];},0);\n"
 " var txt='\U0001F9EE '+n+' ticket'+(n===1?'':'s')+(food?' + food':'')+' · Subtotal '+fmt(tix+food)+' (before tax)';\n"
 " document.querySelectorAll('.live-total').forEach(function(el){el.textContent=txt;});\n"
 "}",
 1))

# 8) bookStep -> refresh live total on each step
edits.append(("bookStep",
 " if(n===4) renderCheckout();\n document.getElementById('page-book').scrollIntoView({behavior:'smooth'});",
 " if(n===4) renderCheckout();\n updateLiveTotal();\n document.getElementById('page-book').scrollIntoView({behavior:'smooth'});",
 1))

# 9) CSS additions
css = (
"/* ---------- Book Now redesign ---------- */\n"
".step{cursor:pointer;transition:.15s}\n"
".step:hover{color:var(--purple)}\n"
".offers-head{text-align:center;max-width:900px;margin:0 auto 18px}\n"
".offers-head .opt{font-size:.78rem;color:#9a8bb8;font-weight:700}\n"
".offers-sub{color:var(--green-deep);font-weight:700;font-size:.9rem;margin-top:4px}\n"
".offers-strip{display:grid;grid-template-columns:repeat(auto-fill,minmax(230px,1fr));gap:14px;max-width:1120px;margin:0 auto 32px}\n"
".offers-strip .offer-card{padding:16px 18px;border-radius:16px;box-shadow:0 5px 0 rgba(0,0,0,.15);margin:0;display:flex;flex-direction:column}\n"
".offers-strip .offer-card h3{font-size:1.08rem;margin:2px 0}\n"
".offers-strip .offer-card .price{font-size:1.25rem;margin:4px 0}\n"
".offers-strip .offer-card p{font-size:.8rem;opacity:.95;flex:1;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}\n"
".offers-strip .offer-card .apply{margin-top:10px;padding:7px 16px;font-size:.85rem;align-self:flex-start}\n"
".offer-card.selected{outline:4px solid #fff;box-shadow:0 0 0 4px var(--purple),0 8px 0 rgba(0,0,0,.2)}\n"
".offer-card.selected .apply{background:var(--purple);color:#fff}\n"
".plan-right{max-width:660px;margin:0 auto}\n"
".live-total{background:var(--purple);color:#fff;font-weight:800;border-radius:14px;padding:12px 18px;margin-top:18px;text-align:center;font-size:.95rem;box-shadow:0 4px 0 var(--purple-deep)}\n"
"@media(max-width:560px){.offers-strip{grid-template-columns:1fr}}\n"
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
