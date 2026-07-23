#!/usr/bin/env python3
import io, sys
SRC = "/sessions/nice-keen-cannon/mnt/Desktop--outputs/universal_kingdom_website.html"
h = io.open(SRC, "r", encoding="utf-8").read()
edits = []

# 1) Ornament CSS
css = (
"/* ---------- royal ornament dividers (brand patterns) ---------- */\n"
".ornament{height:24px;margin:14px auto 24px;max-width:1080px;background-repeat:repeat-x;background-position:center;background-size:auto 20px;opacity:.85;pointer-events:none}\n"
".orn-swirl{background-image:url(\"assets/orn_swirl.svg\")}\n"
".orn-zig{background-image:url(\"assets/orn_zig.svg\")}\n"
".orn-cross{background-image:url(\"assets/orn_cross.svg\")}\n"
".ornament-top{margin:0 auto 18px}\n"
"</style>"
)
edits.append(("css", "</style>", css, 1))

# 2) JS: inject a rotating ornament divider under every section heading
anchor = "document.addEventListener('DOMContentLoaded',function(){document.querySelectorAll('.scroll-banner').forEach(function(b,i){b.classList.add('sb-c'+(i%5));});});"
inject = anchor + "\ndocument.addEventListener('DOMContentLoaded',function(){var p=['orn-swirl','orn-zig','orn-cross'],i=0;document.querySelectorAll('.section-head').forEach(function(sh){var d=document.createElement('div');d.className='ornament '+p[i%3];i++;sh.parentNode.insertBefore(d,sh.nextSibling);});});"
edits.append(("js", anchor, inject, 1))

for label, old, new, exp in edits:
    c = h.count(old)
    if c != exp:
        print("FAIL [%s]: expected %d, found %d" % (label, exp, c)); sys.exit(1)
    h = h.replace(old, new); print("ok [%s]" % label)

io.open(SRC, "w", encoding="utf-8").write(h)
print("DONE")
