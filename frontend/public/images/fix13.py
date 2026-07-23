#!/usr/bin/env python3
import io, sys
SRC = "/sessions/nice-keen-cannon/mnt/Desktop--outputs/universal_kingdom_website.html"
h = io.open(SRC, "r", encoding="utf-8").read()
E = []

# 1-7) coupon codes on each offer
codes = {
 '{id:"student",name:"Campus Thrill Deal",': '{id:"student",code:"CAMPUS20",name:"Campus Thrill Deal",',
 '{id:"kids",name:"Little Legends Saturday",': '{id:"kids",code:"LITTLELEGENDS",name:"Little Legends Saturday",',
 '{id:"independence",name:"Freedom Fun Fest",': '{id:"independence",code:"FREEDOM800",name:"Freedom Fun Fest",',
 '{id:"birthday",name:"Birthday Buddy Treat",': '{id:"birthday",code:"BIRTHDAYBOGO",name:"Birthday Buddy Treat",',
 '{id:"midweek",name:"Adi Thalubadi",': '{id:"midweek",code:"ADITHALUBADI",name:"Adi Thalubadi",',
 '{id:"friendship",name:"Friendship Trio Fun Pass",': '{id:"friendship",code:"FRIENDTRIO",name:"Friendship Trio Fun Pass",',
 '{id:"double",name:"Double Fun Pass",': '{id:"double",code:"DOUBLEFUN",name:"Double Fun Pass",',
}
for o,n in codes.items(): E.append(("code", o, n, 1))

# 8) coupon-zone container in checkout
E.append(("container",
 '        <h3>🧾 Checkout</h3>\n        <div class="applied-offer" id="applied-offer"></div>',
 '        <h3>🧾 Checkout</h3>\n        <div id="coupon-zone"></div>\n        <div class="applied-offer" id="applied-offer"></div>',
 1))

# 9) renderCheckout -> call renderCouponZone
E.append(("rc-call",
 " if(!selOffer){var b=bestOffer(); if(b) selOffer=b;}\n document.getElementById('c-date').value=selDate||'Not selected';",
 " if(!selOffer){var b=bestOffer(); if(b) selOffer=b;}\n renderCouponZone();\n document.getElementById('c-date').value=selDate||'Not selected';",
 1))

# 10) applied-offer coupon code
E.append(("ao-code",
 "'🎁 Best offer applied automatically: <b>'+esc(selOffer.name)+'</b>'+(disc.amt?",
 "'🎁 Best offer applied automatically: <b>'+esc(selOffer.name)+'</b>'+(selOffer.code?' <span style=\"opacity:.85\">(code '+esc(selOffer.code)+')</span>':'')+(disc.amt?",
 1))

# 11) summary: coupon code row + policy note before total
E.append(("summary-code",
 " rows+='<div class=\"row total\"><span>Total payable</span><span>'+fmt(sub+conv)+'</span></div>';",
 " if(selOffer&&selOffer.code){rows+='<div class=\"row\"><span>Coupon code</span><span>'+esc(selOffer.code)+'</span></div>';}\n"
 " if(selOffer){rows+='<div class=\"row\" style=\"font-size:.76rem;color:var(--purple)\"><span>Displayed prices include the 15% online discount · one promotional offer per booking</span><span></span></div>';}\n"
 " rows+='<div class=\"row total\"><span>Total payable</span><span>'+fmt(sub+conv)+'</span></div>';",
 1))

# 12) coupon functions before pay
funcs = '''function offerSaving(o){if(!dateEligible(o,selDate))return null;var r=evalOffer(o);return r.ok?r.amt:null;}
function renderCouponZone(){
 var z=document.getElementById('coupon-zone'); if(!z) return;
 var eligible=[],needMore=[],notElig=[];
 offers.forEach(function(o){
  if(dateEligible(o,selDate)){var r=evalOffer(o);if(r.ok)eligible.push({o:o,amt:r.amt});else needMore.push({o:o,reason:r.note});}
  else notElig.push({o:o,reason:reasonUnavailable(o)});
 });
 eligible.sort(function(a,b){return b.amt-a.amt;});
 var html='<h3 class="cz-h">Apply an Offer or Coupon Code</h3>';
 html+='<div class="cz-manual"><input id="coupon-input" placeholder="Enter coupon code" aria-label="Coupon code"><button class="btn-next" onclick="applyCoupon()">Apply</button></div>';
 if(eligible.length){
  html+='<div class="cz-cards">'+eligible.map(function(x){var o=x.o,best=(selOffer&&selOffer.id===o.id);
   return '<div class="cz-card '+o.bg+(best?' cz-best':'')+'"><div class="cz-name">'+o.name+'</div><div class="cz-code">'+(o.code||'')+'</div><div class="cz-benefit">'+priceTag(o)+' &middot; You save <b>'+fmt(x.amt)+'</b></div><button class="apply" onclick="applyOfferCode(\\''+o.id+'\\')">'+(best?'✓ Applied':'Apply This Offer')+'</button></div>';
  }).join('')+'</div>';
 } else { html+='<p class="no-offer">No offers are available for your selected visit date. You can continue booking at the regular ticket price.</p>'; }
 html+='<details class="cz-compare"><summary>Compare all offers for '+(selDate||'this date')+'</summary><table class="cz-table"><tr><th>Offer</th><th>You save</th><th>Status</th></tr>';
 eligible.forEach(function(x){var best=(selOffer&&selOffer.id===x.o.id);html+='<tr><td>'+x.o.name+'</td><td>'+fmt(x.amt)+'</td><td>'+(best?'Best offer applied':'Available')+'</td></tr>';});
 needMore.forEach(function(x){html+='<tr><td>'+x.o.name+'</td><td>&mdash;</td><td>Complete eligibility</td></tr>';});
 notElig.forEach(function(x){html+='<tr class="cz-dim"><td>'+x.o.name+'</td><td>&mdash;</td><td>'+esc(x.reason).slice(0,80)+'</td></tr>';});
 html+='</table></details>';
 if(selOffer&&selOffer.id==='birthday'){
  html+='<div class="cz-bday"><b>\U0001F382 Birthday Buddy Treat — eligibility</b>'+
   '<div class="field"><label for="bd-name">Birthday person’s name</label><input id="bd-name" placeholder="Full name as per ID"></div>'+
   '<div class="field"><label for="bd-dob">Date of birth</label><input id="bd-dob" type="date"></div>'+
   '<label class="cz-check"><input type="checkbox" id="bd-ok"> I confirm the name and date of birth are correct and valid original ID proof will be shown at the entrance.</label>'+
   '<p class="cz-warn">Important: The birthday person must be present during the visit. Name &amp; DOB are verified using valid original ID proof at the entrance. If information is incorrect or proof is not produced, the complimentary ticket is cancelled and the price difference is payable before entry.</p></div>';
 }
 html+='<p class="cz-policy">Only one VGP promotional ticket offer or coupon can be applied per booking. Promotional offers cannot be combined with each other. Regular-priced food, parking, lockers, merchandise and other paid add-ons may be added. Partner-funded bank or payment cashback may apply separately, subject to campaign terms.</p>';
 z.innerHTML=html;
}
function applyCoupon(){
 var el=document.getElementById('coupon-input'); if(!el)return;
 var code=el.value.trim().toUpperCase(); if(!code){toast('Enter a coupon code');return;}
 var o=offers.find(function(x){return (x.code||'').toUpperCase()===code;});
 if(!o){toast('❌ Invalid coupon code — please check and try again.');return;}
 if(offStatus(o,todayISO())==='expired'){toast('This coupon has expired. Please select another available offer.');return;}
 if(!dateEligible(o,selDate)||!evalOffer(o).ok){toast('This coupon is valid, but it cannot be applied to the selected date, ticket category or ticket quantity.');return;}
 var replacing=(selOffer&&selOffer.id!==o.id);
 selOffer=o; renderCheckout();
 toast((replacing?'Replaced existing offer — one per booking. ':'')+'✅ Coupon applied. You saved '+fmt(evalOffer(o).amt)+'.');
}
function applyOfferCode(id){
 var o=offers.find(function(x){return x.id===id;}); if(!o)return;
 if(!dateEligible(o,selDate)||!evalOffer(o).ok){toast('Not eligible for the selected date or tickets.');return;}
 var replacing=(selOffer&&selOffer.id!==id);
 selOffer=o; renderCheckout();
 toast((replacing?'Only one promotional offer per booking — replaced. ':'')+'\U0001F381 '+o.name+' applied — you save '+fmt(evalOffer(o).amt)+'.');
}
function pay(){'''
E.append(("funcs", "function pay(){", funcs, 1))

# 13) birthday validation in pay
E.append(("bday-validate",
 " if(selOffer && !dateEligible(selOffer,selDate)){selOffer=null;renderCheckout();toast('⚠️ Offer no longer valid — total updated to regular price');return;}",
 " if(selOffer && !dateEligible(selOffer,selDate)){selOffer=null;renderCheckout();toast('⚠️ Offer no longer valid — total updated to regular price');return;}\n"
 " if(selOffer && selOffer.id==='birthday'){var bn=(document.getElementById('bd-name')||{}).value,bd=(document.getElementById('bd-dob')||{}).value,bok=(document.getElementById('bd-ok')||{}).checked;"
 "if(!bn||!bn.trim()){toast('\U0001F382 Enter the birthday person’s name');return;}"
 "if(!bd){toast('\U0001F382 Enter the birthday person’s date of birth');return;}"
 "if(bd.slice(5,7)!==selDate.slice(5,7)){toast('\U0001F382 Visit date must fall within the birthday month.');return;}"
 "if(!bok){toast('\U0001F382 Please confirm the birthday declaration.');return;}}",
 1))

# 14) CSS
css = ('.cz-h{color:var(--purple);font-size:1.15rem;margin:6px 0 10px;font-family:\'Roboto Condensed\',\'Arial Narrow\',Helvetica,sans-serif;text-transform:uppercase}\n'
 '.cz-manual{display:flex;gap:8px;margin-bottom:14px}\n'
 '.cz-manual input{flex:1;padding:11px 14px;border:2px solid var(--yellow-deep);border-radius:12px;font-weight:700;text-transform:uppercase}\n'
 '.cz-manual .btn-next{padding:10px 20px}\n'
 '.cz-cards{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:12px;margin-bottom:14px}\n'
 '.cz-card{border-radius:14px;padding:14px;color:#fff;box-shadow:0 4px 0 rgba(0,0,0,.15)}\n'
 '.cz-card.cz-best{outline:3px solid #fff;box-shadow:0 0 0 3px var(--purple),0 6px 0 rgba(0,0,0,.2)}\n'
 '.cz-name{font-family:\'Roboto Condensed\',\'Arial Narrow\',Helvetica,sans-serif;font-weight:700;text-transform:uppercase;font-size:1.05rem}\n'
 '.cz-code{display:inline-block;background:rgba(255,255,255,.25);border-radius:8px;padding:2px 8px;font-size:.72rem;font-weight:800;letter-spacing:1px;margin:4px 0}\n'
 '.cz-benefit{font-size:.85rem;font-weight:700;margin-bottom:8px}\n'
 '.cz-card .apply{background:#fff;border:none;font-weight:800;padding:7px 16px;border-radius:20px;cursor:pointer;color:var(--purple);font-family:\'Nunito\'}\n'
 '.cz-compare{margin:6px 0 14px;font-size:.85rem}\n'
 '.cz-compare summary{cursor:pointer;font-weight:800;color:var(--purple)}\n'
 '.cz-table{width:100%;border-collapse:collapse;margin-top:8px}\n'
 '.cz-table th,.cz-table td{border-bottom:1px solid #E6DCC8;padding:6px 8px;text-align:left;font-size:.82rem}\n'
 '.cz-table td:nth-child(2){text-align:right;font-weight:800}\n'
 '.cz-table tr.cz-dim{opacity:.6}\n'
 '.cz-bday{background:#FFF3D6;border:2px solid var(--yellow-deep);border-radius:12px;padding:12px 14px;margin:6px 0 14px}\n'
 '.cz-check{display:flex;gap:8px;align-items:flex-start;font-size:.82rem;font-weight:700;margin:8px 0}\n'
 '.cz-warn{font-size:.78rem;color:var(--red);font-weight:700;line-height:1.5;margin-top:6px}\n'
 '.cz-policy{font-size:.76rem;color:var(--green-deep);font-weight:700;line-height:1.5;background:#F6F1E7;border-radius:10px;padding:10px 12px;margin-top:6px}\n'
 '</style>')
E.append(("css", "</style>", css, 1))

for label, old, new, exp in E:
    c = h.count(old)
    if c != exp:
        print("FAIL [%s]: expected %d, found %d" % (label, exp, c)); sys.exit(1)
    h = h.replace(old, new); print("ok [%s]" % label)

io.open(SRC, "w", encoding="utf-8").write(h)
print("DONE")
