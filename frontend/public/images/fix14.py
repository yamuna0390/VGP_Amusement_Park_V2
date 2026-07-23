#!/usr/bin/env python3
import io, sys, re
SRC = "/sessions/nice-keen-cannon/mnt/Desktop--outputs/universal_kingdom_website.html"
h = io.open(SRC, "r", encoding="utf-8").read()
E = []

# 1) ONLINE15 offer as first default
E.append(("online15-def",
 'const OFFER_DEFAULTS=[\n {id:"student",code:"CAMPUS20",name:"Campus Thrill Deal",',
 'const OFFER_DEFAULTS=[\n'
 ' {id:"online15",code:"ONLINE15",name:"Online Booking Offer",badge:"Online 15%",bg:"bg-green",kind:"online15",cats:["adult","child","senior"],minQty:1,weekdays:null,visitStart:"2026-07-01",visitEnd:"2026-12-31",bookEnd:"2026-12-31",online:true,needsId:false,needsDob:false,active:true,priority:1,desc:"15% online booking discount — already included in the displayed ticket prices.",dateLabel:"Online booking · already applied in shown prices"},\n'
 ' {id:"student",code:"CAMPUS20",name:"Campus Thrill Deal",',
 1))

# 2) evalOffer online15 case
E.append(("online15-eval",
 " case 'pct-cat':{var c=o.cats[0];",
 " case 'online15':{if(!qty.adult&&!qty.child&&!qty.senior)return {amt:0,ok:false,note:'ℹ️ Applies to Adult, Child & Senior Fun Passes.'};return {amt:0,ok:true,note:'✅ 15% online discount already included in the shown prices.'};}\n case 'pct-cat':{var c=o.cats[0];",
 1))

# 3) priceTag online15
E.append(("online15-tag",
 "function priceTag(o){switch(o.kind){case 'pct-cat':return o.pct+'% OFF';",
 "function priceTag(o){switch(o.kind){case 'online15':return '15% OFF';case 'pct-cat':return o.pct+'% OFF';",
 1))

# 4) chg + revalidateOffer
E.append(("chg",
 "function chg(k,v){qty[k]=Math.max(0,qty[k]+v);document.getElementById('q-'+k).textContent=qty[k];updateLiveTotal();updateLLHint();}",
 "function chg(k,v){qty[k]=Math.max(0,qty[k]+v);document.getElementById('q-'+k).textContent=qty[k];revalidateOffer();updateLiveTotal();updateLLHint();}\n"
 "function revalidateOffer(){if(selOffer&&(!dateEligible(selOffer,selDate)||!evalOffer(selOffer).ok)){var nm=selOffer.name;selOffer=null;toast('ℹ️ \"'+nm+'\" no longer matches your ticket selection — the best available offer will be re-applied at checkout.');}}",
 1))

# 5) pickDate revalidation
E.append(("pickDate",
 "function pickDate(dt){selDate=dt;renderCal();renderOffers();}",
 "function pickDate(dt){selDate=dt;if(selOffer&&!dateEligible(selOffer,selDate)){var nm=selOffer.name;selOffer=null;toast('Your selected offer ('+nm+') is not valid for the new visit date. The best available offer will be applied for the updated booking.');}renderCal();renderOffers();}",
 1))

# 6) CSS
css = ('.cz-sec{font-weight:800;color:var(--purple);font-size:.82rem;text-transform:uppercase;letter-spacing:.5px;margin:14px 0 8px}\n'
 '.cz-tag{display:inline-block;background:#fff;color:var(--purple);font-size:.62rem;font-weight:800;padding:2px 8px;border-radius:20px;letter-spacing:.5px;margin-bottom:6px}\n'
 '.cz-elig{font-size:.74rem;opacity:.92;margin-bottom:8px;line-height:1.4}\n'
 '.cz-save{color:#CFF5D8}\n'
 '.cz-card.cz-off{background:#ece7f2 !important;color:#7a6a95}\n'
 '.cz-card.cz-off .cz-code{background:rgba(0,0,0,.08)}\n'
 '.cz-card.cz-off .cz-save{color:var(--green-deep)}\n'
 '.cz-card.cz-off .apply{background:#d9cfe8;color:#8a7aa5}\n'
 '</style>')
E.append(("css", "</style>", css, 1))

for label, old, new, exp in E:
    c = h.count(old)
    if c != exp:
        print("FAIL [%s]: expected %d, found %d" % (label, exp, c)); sys.exit(1)
    h = h.replace(old, new); print("ok [%s]" % label)

# 7) Replace renderCouponZone via regex (anchored by following applyCoupon)
new_rcz = r'''function online15Saving(){var s=0;['adult','child','senior'].forEach(function(k){s+=qty[k]*((mrp[k]||prices[k])-prices[k]);});return s;}
function couponSearch(){var q=((document.getElementById('coupon-search')||{}).value||'').trim().toLowerCase();document.querySelectorAll('#coupon-zone .cz-card').forEach(function(c){c.style.display=(!q||(c.getAttribute('data-search')||'').indexOf(q)>=0)?'':'none';});}
function czCard(x,opts){opts=opts||{};var o=x.o,sel=(selOffer&&selOffer.id===o.id);var benefit;
 if(o.id==='online15'){benefit=priceTag(o)+' &middot; <span class="cz-save">already included — you saved '+fmt(online15Saving())+'</span>';}
 else{benefit=priceTag(o)+(x.amt!=null?' &middot; <span class="cz-save">You save '+fmt(x.amt)+'</span>':'');}
 return '<div class="cz-card '+o.bg+(sel?' cz-best':'')+'" data-search="'+esc((o.name+' '+(o.code||'')).toLowerCase())+'">'+
  (opts.badge?'<span class="cz-tag">'+opts.badge+'</span>':'')+
  '<div class="cz-name">'+o.name+'</div>'+
  '<div class="cz-code">'+(o.code||'')+'</div>'+
  '<div class="cz-benefit">'+benefit+'</div>'+
  '<div class="cz-elig">'+o.dateLabel+'</div>'+
  '<button class="apply" onclick="applyOfferCode(\''+o.id+'\')">'+(sel?'✓ Applied':(opts.btn||'Apply This Offer'))+'</button>'+
  '</div>';
}
function renderCouponZone(){
 var z=document.getElementById('coupon-zone'); if(!z) return;
 var best=bestOffer();
 var elig=[],reqDetails=[],notElig=[];
 offers.forEach(function(o){
  if(!dateEligible(o,selDate)){notElig.push({o:o,reason:reasonUnavailable(o)});return;}
  var r=evalOffer(o);
  if(!r.ok){notElig.push({o:o,reason:r.note});return;}
  if(o.needsDob||o.needsId){reqDetails.push({o:o,amt:r.amt});}
  else{elig.push({o:o,amt:r.amt});}
 });
 elig.sort(function(a,b){return b.amt-a.amt;});
 var html='<h3 class="cz-h">Apply an Offer or Coupon Code</h3>';
 html+='<div class="cz-manual"><input id="coupon-search" placeholder="Search an offer or enter coupon code" aria-label="Search offers or coupon code" oninput="couponSearch()" onkeydown="if(event.key===\'Enter\')applyCoupon()"><button class="btn-next" onclick="applyCoupon()">Apply</button></div>';
 if(best){var br=evalOffer(best);html+='<div class="cz-sec">Best Offer for You</div><div class="cz-cards">'+czCard({o:best,amt:br.amt},{badge:'BEST OFFER'})+'</div>';}
 var others=elig.filter(function(x){return !best||x.o.id!==best.id;});
 if(others.length){html+='<div class="cz-sec">Other Eligible Offers</div><div class="cz-cards">'+others.map(function(x){return czCard(x,{});}).join('')+'</div>';}
 var rd=reqDetails.filter(function(x){return !best||x.o.id!==best.id;});
 if(rd.length){html+='<div class="cz-sec">Complete Details to Unlock</div><div class="cz-cards">'+rd.map(function(x){var lbl=x.o.id==='birthday'?'Enter Birthday Details':(x.o.id==='student'?'Enter Student Details':'Check Eligibility');return czCard(x,{btn:lbl});}).join('')+'</div>';}
 if(notElig.length){html+='<div class="cz-sec">Not Eligible</div><div class="cz-cards">'+notElig.map(function(x){return '<div class="cz-card cz-off" data-search="'+esc((x.o.name+' '+(x.o.code||'')).toLowerCase())+'"><div class="cz-name">'+x.o.name+'</div><div class="cz-code">'+(x.o.code||'')+'</div><div class="cz-elig">'+esc(x.reason)+'</div><button class="apply" disabled>Not available</button></div>';}).join('')+'</div>';}
 if(!best&&!others.length&&!rd.length){html+='<p class="no-offer">No offers are available for your selected visit date and ticket combination. You can continue booking at the regular ticket price.</p>';}
 if(selOffer&&selOffer.id==='birthday'){html+='<div class="cz-bday"><b>\U0001F382 Birthday Buddy Treat — eligibility</b><div class="field"><label for="bd-name">Birthday person’s name</label><input id="bd-name" placeholder="Full name as per ID"></div><div class="field"><label for="bd-dob">Date of birth</label><input id="bd-dob" type="date"></div><label class="cz-check"><input type="checkbox" id="bd-ok"> I confirm the name and date of birth are correct and valid original ID proof will be shown at the entrance.</label><p class="cz-warn">Important: The birthday person must be present during the visit. Name &amp; DOB are verified using valid original ID proof at the entrance. If information is incorrect or proof is not produced, the complimentary ticket is cancelled and the price difference is payable before entry.</p></div>';}
 html+='<p class="cz-policy">Only one VGP promotional ticket offer or coupon can be applied per booking. Promotional ticket offers cannot be combined with each other. Regular-priced food, parking, lockers, merchandise and other paid add-ons may be added. Partner-funded bank or payment cashback may apply separately, subject to campaign terms.</p>';
 z.innerHTML=html;
}
function applyCoupon'''
pat = re.compile(r"function renderCouponZone\(\)\{[\s\S]*?\n\}\nfunction applyCoupon")
if len(pat.findall(h)) != 1:
    print("FAIL: renderCouponZone regex matched", len(pat.findall(h))); sys.exit(1)
h = pat.sub(lambda m: new_rcz, h, count=1); print("ok [renderCouponZone]")

io.open(SRC, "w", encoding="utf-8").write(h)
print("DONE")
