#!/usr/bin/env python3
import io, sys
SRC = "/sessions/nice-keen-cannon/mnt/Desktop--outputs/universal_kingdom_website.html"
h = io.open(SRC, "r", encoding="utf-8").read()
edits = []

# 1) Replace whole offers array with the new 8-offer catalog
old_offers = (
'const offers=[\n'
' {id:"early",n:"Early Bird",p:"15% OFF",s:"Advance booking",d:"Save 15% on all tickets when you book ahead. Not applicable for same-day booking.",bg:"bg-red"},\n'
' {id:"kids",n:"Little Legends",p:"KIDS FREE",s:"Saturdays · Online only",d:"Online only — every Saturday, each Adult Fun Pass unlocks FREE entry for 2 kids below 130 cm. Example: 1 adult + 3 kids = 2 kids free, 1 adult & 1 child charged.",bg:"bg-purple"},\n'
' {id:"independence",n:"Independence Day Special",p:"₹800 + tax",s:"15 Aug only",d:"Celebrate Independence Day — Adult Fun Pass at a special ₹800 (before 18% tax), valid only on 15 August.",bg:"bg-yellow"},\n'
' {id:"birthday",n:"Birthday Bonanza",p:"BUY 1 GET 1",s:"Birthday ID proof",d:"Celebrating a birthday? Buy 1 Adult Fun Pass and get 1 FREE — carry valid ID proving the birthday at entry.",bg:"bg-blue"},\n'
' {id:"student",n:"Student Pass",p:"20% OFF",s:"ID card must",d:"20% off College Student ID Fun Passes — valid ONLY on display of a current-year college ID card at the entrance.",bg:"bg-green"}\n'
'];'
)
new_offers = (
'const offers=[\n'
' {id:"student",n:"Campus Thrill Deal",p:"20% OFF",s:"College ID",d:"Show your college ID and unlock 20% off Student Fun Passes — valid only on display of a current-year college ID at entry.",bg:"bg-green"},\n'
' {id:"kids",n:"Little Legends Saturday",p:"KIDS FREE",s:"Saturdays · Online",d:"Big adventures for little explorers! Every Saturday — online booking only — each Adult Fun Pass unlocks FREE entry for 2 kids below 130 cm.",bg:"bg-purple"},\n'
' {id:"independence",n:"Freedom Fun Fest",p:"₹800 + tax",s:"15 Aug only",d:"Celebrate Independence Day with unlimited thrills — Adult Fun Pass at ₹800 (before tax), valid only on 15 August.",bg:"bg-yellow"},\n'
' {id:"birthday",n:"Birthday Buddy Treat",p:"BUY 1 GET 1",s:"Birthday ID proof",d:"Celebrate your birthday with a FREE ticket for your favourite person — buy 1 Adult Fun Pass, get 1 free. Carry valid birthday ID at entry.",bg:"bg-red"},\n'
' {id:"midweek",n:"Triple Thrill Days",p:"BUY 2 GET 1",s:"Tue & Wed · Jul 21–Aug 12",d:"Buy 2 tickets and get 1 FREE on Fun Pass & Double Fun Pass — every Tuesday & Wednesday from 21 July to 12 August.",bg:"bg-blue"},\n'
' {id:"friendship",n:"Friendship Trio Treat",p:"BUY 2 GET 1",s:"2 Aug only",d:"Two besties book, the third bestie goes FREE! Buy 2 tickets and get 1 free this Friendship Day, 2 August.",bg:"bg-yellow"},\n'
' {id:"dfpadult",n:"Double the Fun Deal",p:"₹1,313",s:"Save ₹402",d:"Double Fun Pass — Adult. Two days, double the adventures, one special price. Regular ₹1,715 → offer ₹1,313. Add the Double Fun Pass — Adult to your tickets.",bg:"bg-purple"},\n'
' {id:"dfpchild",n:"Little Explorer Double Pass",p:"₹1,128",s:"Save ₹275",d:"Double Fun Pass — Child. Double the fun for your little adventurer. Regular ₹1,403 → offer ₹1,128. Add the Double Fun Pass — Child to your tickets.",bg:"bg-red"}\n'
'];'
)
edits.append(("offers-array", old_offers, new_offers, 1))

# 2) Same-day guard: skip for the informational Double Fun Pass price offers
edits.append(("guard",
 " if(selDate && selDate<=todayISO()) return {amt:0,note:'⚠️ Offers are not valid for same-day bookings — pick a future date to enjoy this offer.'};",
 " if(selDate && selDate<=todayISO() && selOffer.id!=='dfpadult' && selOffer.id!=='dfpchild') return {amt:0,note:'⚠️ Offers are not valid for same-day bookings — pick a future date to enjoy this offer.'};",
 1))

# 3) Remove the now-unused Early Bird branch (early offer dropped from catalog)
old_early = (
" if(selOffer.id==='early'){\n"
"  if(!selDate) return {amt:0,note:'📅 Pick a future visit date to unlock the Early Bird discount.'};\n"
"  return {amt:.15*ticketSubtotal(),note:''};\n"
" }\n"
)
edits.append(("drop-early", old_early, "", 1))

# 4) Add midweek / friendship / double-fun-pass branches before the student branch
old_student = (
" if(selOffer.id==='student'){\n"
"  if(!qty.student) return {amt:0,note:'ℹ️ Add a College Student ID Fun Pass to use this offer.'};"
)
new_student = (
" if(selOffer.id==='midweek'){\n"
"  if(!selDate) return {amt:0,note:'\U0001F4C5 Pick a Tuesday or Wednesday between 21 Jul and 12 Aug.'};\n"
"  var md=selDate.slice(5), dow=new Date(selDate+'T12:00:00').getDay();\n"
"  if(md<'07-21'||md>'08-12') return {amt:0,note:'⚠️ Triple Thrill Days runs 21 July–12 August only.'};\n"
"  if(dow!==2&&dow!==3) return {amt:0,note:'⚠️ Valid on Tuesdays & Wednesdays only — please pick one.'};\n"
"  var rm=buy2get1(); if(!rm) return {amt:0,note:'ℹ️ Add at least 3 passes — buy 2, get 1 free.'};\n"
"  return {amt:rm.amt,note:'✔️ '+rm.free+' ticket(s) FREE — buy 2, get 1 free.'};\n"
" }\n"
" if(selOffer.id==='friendship'){\n"
"  if(!selDate) return {amt:0,note:'\U0001F4C5 Pick 2 August to unlock the Friendship Day treat.'};\n"
"  if(selDate.slice(5)!=='08-02') return {amt:0,note:'⚠️ Friendship Trio Treat is valid only on 2 August.'};\n"
"  var rf=buy2get1(); if(!rf) return {amt:0,note:'ℹ️ Add at least 3 passes — two book, the third goes free.'};\n"
"  return {amt:rf.amt,note:'✔️ '+rf.free+' ticket(s) FREE — two book, the third bestie goes free!'};\n"
" }\n"
" if(selOffer.id==='dfpadult'){\n"
"  if(!qty.dfpa) return {amt:0,note:'ℹ️ Add a Double Fun Pass — Adult to enjoy ₹1,313 (save ₹402 vs ₹1,715).'};\n"
"  return {amt:0,note:'✅ Double Fun Pass — Adult already at the special ₹1,313 (save ₹402). Tax applies at checkout.'};\n"
" }\n"
" if(selOffer.id==='dfpchild'){\n"
"  if(!qty.dfpc) return {amt:0,note:'ℹ️ Add a Double Fun Pass — Child to enjoy ₹1,128 (save ₹275 vs ₹1,403).'};\n"
"  return {amt:0,note:'✅ Double Fun Pass — Child already at the special ₹1,128 (save ₹275). Tax applies at checkout.'};\n"
" }\n"
" if(selOffer.id==='student'){\n"
"  if(!qty.student) return {amt:0,note:'ℹ️ Add a College Student ID Fun Pass to use this offer.'};"
)
edits.append(("new-branches", old_student, new_student, 1))

# 5) Add buy2get1 helper just before offerDiscount
edits.append(("helper",
 "function offerDiscount(){",
 "function buy2get1(){\n"
 " var keys=['adult','child','senior','student','dfpa','dfpc'], arr=[];\n"
 " keys.forEach(function(k){for(var i=0;i<qty[k];i++)arr.push(prices[k]);});\n"
 " if(arr.length<3) return null;\n"
 " arr.sort(function(a,b){return a-b;});\n"
 " var free=Math.floor(arr.length/3), amt=0, i;\n"
 " for(i=0;i<free;i++)amt+=arr[i];\n"
 " return {free:free,amt:amt};\n"
 "}\n"
 "function offerDiscount(){",
 1))

# 6) Show regular (struck-through) price on the Double Fun Pass ticket rows
edits.append(("dfpa-row",
 'Universal Kingdom + Marine Kingdom · ₹1,313.00</span>',
 'Universal Kingdom + Marine Kingdom · <s>₹1,715.00</s> <b class="sale">₹1,313.00</b></span>', 1))
edits.append(("dfpc-row",
 'Universal Kingdom + Marine Kingdom · ₹1,128.00</span>',
 'Universal Kingdom + Marine Kingdom · <s>₹1,403.00</s> <b class="sale">₹1,128.00</b></span>', 1))

# 7) Double popup: show regular vs offer prices
edits.append(("double-popup",
 "One ticket, two kingdoms!<br>✅ VGP Universal Kingdom + VGP Marine Kingdom.<br>💰 Adult ₹1,313 · Child ₹1,128.",
 "One ticket, two kingdoms!<br>✅ VGP Universal Kingdom + VGP Marine Kingdom.<br>💰 Adult <s>₹1,715</s> ₹1,313 · Child <s>₹1,403</s> ₹1,128 (before tax).",
 1))

for label, old, new, exp in edits:
    c = h.count(old)
    if c != exp:
        print("FAIL [%s]: expected %d, found %d" % (label, exp, c)); sys.exit(1)
    h = h.replace(old, new); print("ok [%s]" % label)

io.open(SRC, "w", encoding="utf-8").write(h)
print("DONE")
