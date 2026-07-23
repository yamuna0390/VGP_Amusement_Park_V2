#!/usr/bin/env python3
import io, sys
SRC = "/sessions/nice-keen-cannon/mnt/Desktop--outputs/universal_kingdom_website.html"
h = io.open(SRC, "r", encoding="utf-8").read()
edits = []

# A) Replace flat yellow-board banner base with colorful gradient banner
old_a = (
'.scroll-banner{background:url("assets/bg_794f63782c81.png");background-size:100% 100%;box-shadow:none;border-radius:0;padding:22px 58px 26px}\n'
'.scroll-banner:before,.scroll-banner:after{display:none}\n'
'.scroll-banner h2{color:var(--red);text-shadow:none}\n'
'.scroll-banner .kicker{color:#8F5426}'
)
new_a = (
'.scroll-banner{background:linear-gradient(135deg,var(--purple),var(--purple-deep));color:#fff;border-radius:16px;padding:15px 44px;box-shadow:0 6px 0 rgba(0,0,0,.22);border:3px solid #fff}\n'
'.scroll-banner:before,.scroll-banner:after{display:none}\n'
'.scroll-banner h2{color:#fff;text-shadow:2px 2px 0 rgba(0,0,0,.22)}\n'
'.scroll-banner .kicker{color:var(--yellow)}'
)
edits.append(("banner-base", old_a, new_a, 1))

# B) Replace grey-scroll / ribbon image variants with a 5-colour palette
old_b = (
'.sb-scroll{background-image:url("assets/bg_9e1f596f519b.png");padding:22px 86px 30px}\n'
'.sb-scroll h2{color:var(--red)}\n'
'.sb-scroll .kicker{color:#7A4A00}\n'
'.sb-ribbon{background-image:url("assets/bg_076cfef3ca90.png");padding:18px 66px 24px;min-height:84px}\n'
'.sb-ribbon h2{color:#fff}\n'
'.sb-ribbon .kicker{color:#FDDB00}'
)
new_b = (
'.sb-scroll{padding:15px 50px}\n'
'.sb-ribbon{padding:15px 50px;min-height:0}\n'
'.sb-scroll h2,.sb-ribbon h2{color:#fff;text-shadow:2px 2px 0 rgba(0,0,0,.22)}\n'
'.sb-scroll .kicker,.sb-ribbon .kicker{color:var(--yellow)}\n'
'/* multi-colour banner palette (auto-cycled by JS) */\n'
'.sb-c0{background:linear-gradient(135deg,var(--purple),var(--purple-deep))}\n'
'.sb-c1{background:linear-gradient(135deg,var(--red),var(--red-dark))}\n'
'.sb-c2{background:linear-gradient(135deg,#22A7B3,#0E7C88)}\n'
'.sb-c3{background:linear-gradient(135deg,#2E9E6B,#1C7A4F)}\n'
'.sb-c4{background:linear-gradient(135deg,#2B6CB0,#173F73)}\n'
'.sb-c0 h2,.sb-c1 h2,.sb-c2 h2,.sb-c3 h2,.sb-c4 h2{color:#fff}\n'
'.sb-c0 .kicker,.sb-c1 .kicker,.sb-c2 .kicker,.sb-c3 .kicker,.sb-c4 .kicker{color:var(--yellow)}'
)
edits.append(("banner-palette", old_b, new_b, 1))

# C) Auto-assign rotating colours to every banner on load
edits.append(("banner-js",
 "document.addEventListener('DOMContentLoaded',reflectLogin);",
 "document.addEventListener('DOMContentLoaded',reflectLogin);\n"
 "document.addEventListener('DOMContentLoaded',function(){document.querySelectorAll('.scroll-banner').forEach(function(b,i){b.classList.add('sb-c'+(i%5));});});",
 1))

for label, old, new, exp in edits:
    c = h.count(old)
    if c != exp:
        print("FAIL [%s]: expected %d, found %d" % (label, exp, c)); sys.exit(1)
    h = h.replace(old, new); print("ok [%s]" % label)

io.open(SRC, "w", encoding="utf-8").write(h)
print("DONE")
