#!/usr/bin/env python3
import io, sys
SRC = "/sessions/nice-keen-cannon/mnt/Desktop--outputs/universal_kingdom_website.html"
h = io.open(SRC, "r", encoding="utf-8").read()
edits = []

# 1) Remove subtitle line + watch button; keep CTAs; add bottom band between raja & sepoy
old = (
'    <h1>A New Time Table!</h1>\n'
'    <p>Something New For Everyone — under the reign of the great Kutti Raja 👑</p>\n'
'    <button class="watch-pill" onclick="openIntro()"><span class="play-btn"></span>Watch the Kingdom come alive</button>\n'
'    <div class="hero-ctas">\n'
'      <button class="cta-big cta-red" onclick="go(\'book\')">Book Tickets</button>\n'
'      <button class="cta-big cta-green" onclick="go(\'rides\')">Explore Rides</button>\n'
'    </div>'
)
new = (
'    <h1>A New Time Table!</h1>\n'
'    <div class="hero-ctas">\n'
'      <button class="cta-big cta-red" onclick="go(\'book\')">Book Tickets</button>\n'
'      <button class="cta-big cta-green" onclick="go(\'rides\')">Explore Rides</button>\n'
'    </div>\n'
'    <div class="hero-band">Something New For Everyone — under the reign of the great Kutti Raja 👑</div>'
)
edits.append(("hero-markup", old, new, 1))

# 2) Band styling (bottom, centered between the two characters)
css = (
".hero-band{position:absolute;bottom:30px;left:50%;transform:translateX(-50%);z-index:6;"
"width:min(640px,calc(100% - 40px));background:linear-gradient(135deg,var(--red),var(--purple));"
"color:#FDDB00;font-weight:800;font-size:clamp(.92rem,2.1vw,1.12rem);text-align:center;"
"padding:13px 28px;border-radius:40px;border:3px solid #fff;box-shadow:0 5px 0 rgba(0,0,0,.28)}\n"
"@media(max-width:520px){.hero-band{bottom:16px;padding:10px 18px;font-size:.9rem}}\n"
"</style>"
)
edits.append(("css", "</style>", css, 1))

for label, o, n, exp in edits:
    c = h.count(o)
    if c != exp:
        print("FAIL [%s]: expected %d, found %d" % (label, exp, c)); sys.exit(1)
    h = h.replace(o, n); print("ok [%s]" % label)

io.open(SRC, "w", encoding="utf-8").write(h)
print("DONE")
