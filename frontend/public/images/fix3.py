#!/usr/bin/env python3
import io, sys
SRC = "/sessions/nice-keen-cannon/mnt/Desktop--outputs/universal_kingdom_website.html"
h = io.open(SRC, "r", encoding="utf-8").read()
edits = []

# 1) Offers array: rename Little Royals -> Little Legends (online only) + add 2 new offers
old_offers = (
'const offers=[\n'
' {id:"early",n:"Early Bird",p:"15% OFF",s:"Advance booking",d:"Save 15% on all tickets when you book ahead. Not applicable for same-day booking.",bg:"bg-red"},\n'
' {id:"kids",n:"Little Royals",p:"KIDS FREE",s:"Saturdays only",d:"Every Saturday, each Adult Fun Pass unlocks FREE entry for 2 kids below 130 cm. Example: 1 adult + 3 kids = 2 kids free, 1 adult & 1 child charged.",bg:"bg-purple"},\n'
' {id:"student",n:"Student Pass",p:"20% OFF",s:"ID card must",d:"20% off College Student ID Fun Passes — valid ONLY on display of a current-year college ID card at the entrance.",bg:"bg-green"}\n'
'];'
)
new_offers = (
'const offers=[\n'
' {id:"early",n:"Early Bird",p:"15% OFF",s:"Advance booking",d:"Save 15% on all tickets when you book ahead. Not applicable for same-day booking.",bg:"bg-red"},\n'
' {id:"kids",n:"Little Legends",p:"KIDS FREE",s:"Saturdays · Online only",d:"Online only — every Saturday, each Adult Fun Pass unlocks FREE entry for 2 kids below 130 cm. Example: 1 adult + 3 kids = 2 kids free, 1 adult & 1 child charged.",bg:"bg-purple"},\n'
' {id:"independence",n:"Independence Day Special",p:"₹800 + tax",s:"15 Aug only",d:"Celebrate Independence Day — Adult Fun Pass at a special ₹800 (before 18% tax), valid only on 15 August.",bg:"bg-yellow"},\n'
' {id:"birthday",n:"Birthday Bonanza",p:"BUY 1 GET 1",s:"Birthday ID proof",d:"Celebrating a birthday? Buy 1 Adult Fun Pass and get 1 FREE — carry valid ID proving the birthday at entry.",bg:"bg-blue"},\n'
' {id:"student",n:"Student Pass",p:"20% OFF",s:"ID card must",d:"20% off College Student ID Fun Passes — valid ONLY on display of a current-year college ID card at the entrance.",bg:"bg-green"}\n'
'];'
)
edits.append(("offers-array", old_offers, new_offers, 1))

# 2) kids note wording Little Royals -> Little Legends
edits.append(("kids-note",
 "return {amt:0,note:'⚠️ Little Royals is valid on Saturdays only — please pick a Saturday.'};",
 "return {amt:0,note:'⚠️ Little Legends is valid on Saturdays only — please pick a Saturday.'};",
 1))

# 3) Insert Independence Day + Birthday discount branches before the student branch
old_student = (
" if(selOffer.id==='student'){\n"
"  if(!qty.student) return {amt:0,note:'ℹ️ Add a College Student ID Fun Pass to use this offer.'};"
)
new_student = (
" if(selOffer.id==='independence'){\n"
"  if(!selDate) return {amt:0,note:'\U0001F4C5 Pick 15 August as your visit date to unlock this offer.'};\n"
"  if(selDate.slice(5)!=='08-15') return {amt:0,note:'⚠️ Independence Day Special is valid only on 15 August.'};\n"
"  if(!qty.adult) return {amt:0,note:'ℹ️ Add an Adult Fun Pass — special price ₹800 (before tax) each on 15 August.'};\n"
"  const perAdultSaving=Math.max(0,prices.adult-800);\n"
"  return {amt:qty.adult*perAdultSaving,note:'\U0001F1EE\U0001F1F3 Adult Fun Pass at ₹800 (before tax) each this Independence Day.'};\n"
" }\n"
" if(selOffer.id==='birthday'){\n"
"  if(qty.adult<2) return {amt:0,note:'\U0001F382 Add 2 or more Adult Fun Passes — buy 1, get 1 free.'};\n"
"  const freeAdults=Math.floor(qty.adult/2);\n"
"  return {amt:freeAdults*prices.adult,note:'\U0001F382 '+freeAdults+' Adult Fun Pass(es) FREE — carry valid birthday ID proof at entry.'};\n"
" }\n"
" if(selOffer.id==='student'){\n"
"  if(!qty.student) return {amt:0,note:'ℹ️ Add a College Student ID Fun Pass to use this offer.'};"
)
edits.append(("new-branches", old_student, new_student, 1))

# 4) Popup wording Little Royals -> Little Legends
edits.append(("popup-note",
 "free below 130 cm with the Little Royals offer!",
 "free below 130 cm with the Little Legends offer!",
 1))

# 5) Visible tax note in ticket step (prices shown before tax)
edits.append(("tax-note",
 '        <h3>🎟️ Select your Fun Passes</h3>',
 '        <h3>🎟️ Select your Fun Passes</h3>\n'
 '        <p class="tax-note">All prices shown are <b>before tax</b>. GST is added at checkout — <b>18%</b> on theme-park tickets and <b>5%</b> on food.</p>',
 1))

# 6) tax-note styling
edits.append(("tax-note-css",
 "</style>",
 ".tax-note{font-size:.82rem;font-weight:700;color:var(--purple);background:var(--blue);border-radius:12px;padding:8px 12px;margin:2px 0 12px}\n</style>",
 1))

for label, old, new, exp in edits:
    c = h.count(old)
    if c != exp:
        print("FAIL [%s]: expected %d, found %d" % (label, exp, c)); sys.exit(1)
    h = h.replace(old, new); print("ok [%s]" % label)

io.open(SRC, "w", encoding="utf-8").write(h)
print("DONE")
