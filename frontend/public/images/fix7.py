#!/usr/bin/env python3
import io, sys
SRC = "/sessions/nice-keen-cannon/mnt/Desktop--outputs/universal_kingdom_website.html"
h = io.open(SRC, "r", encoding="utf-8").read()
edits = []

# 1) Rebuild step 1: offers LEFT, calendar RIGHT (side by side, one screen), no timings
old_bstep1 = (
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
new_bstep1 = (
'      <div id="bstep1">\n'
'        <div class="book-grid">\n'
'          <div class="book-offers">\n'
'            <div class="offers-head">\n'
'              <h3 class="plan-title">🎁 Pick an offer <span class="opt">(optional)</span></h3>\n'
'              <p class="offers-sub">Tap a deal to auto-apply it · future dates only</p>\n'
'            </div>\n'
'            <div id="plan-offers" class="offers-strip"></div>\n'
'          </div>\n'
'          <div class="panel book-date">\n'
'            <h3>📅 Choose your visit date</h3>\n'
'            <p style="font-weight:700;color:var(--green-deep);margin-bottom:10px">7 hours of non-stop thrills — open all 365 days, 24×7!</p>\n'
'            <div class="cal" id="cal"></div>\n'
'            <div class="nav-btns"><span></span><button class="btn-next" onclick="proceedDate()">Proceed to Tickets ➜</button></div>\n'
'          </div>\n'
'        </div>\n'
'      </div>'
)
edits.append(("bstep1", old_bstep1, new_bstep1, 1))

# 2) CSS: two-column book grid + compact offers list on left, sticky calendar right
css = (
"/* ---------- Book Now: offers left, calendar right ---------- */\n"
".book-grid{display:grid;grid-template-columns:1.15fr .85fr;gap:24px;max-width:1140px;margin:0 auto;align-items:start}\n"
".book-offers{min-width:0}\n"
".book-offers .offers-head{text-align:left;margin:0 0 12px}\n"
".book-offers .offers-strip{grid-template-columns:repeat(auto-fill,minmax(180px,1fr));margin:0}\n"
".book-date{max-width:none;position:sticky;top:80px}\n"
"@media(max-width:860px){.book-grid{grid-template-columns:1fr}.book-date{position:static}.book-offers .offers-strip{grid-template-columns:repeat(auto-fill,minmax(160px,1fr))}}\n"
"@media(max-width:560px){.book-offers .offers-strip{grid-template-columns:1fr}}\n"
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
