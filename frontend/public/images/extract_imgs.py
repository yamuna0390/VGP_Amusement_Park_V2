#!/usr/bin/env python3
import io, os, re, base64, hashlib

SRC = "/sessions/nice-keen-cannon/mnt/Desktop--outputs/universal_kingdom_website.html"
ASSETS_DIR = "/sessions/nice-keen-cannon/mnt/Desktop--outputs/assets"
os.makedirs(ASSETS_DIR, exist_ok=True)

with io.open(SRC, "r", encoding="utf-8") as fh:
    html = fh.read()

before = len(html)
EXT = {"jpeg": "jpg", "jpg": "jpg", "png": "png", "gif": "gif",
       "webp": "webp", "svg+xml": "svg"}

# match src="data:image/<type>;base64,<data>"  (only base64 raster images inside src="")
pat = re.compile(r'src="data:image/([a-zA-Z0-9.+-]+);base64,([^"]+)"')

seen = {}
count = 0

def repl(m):
    global count
    typ = m.group(1).lower()
    data = m.group(2)
    ext = EXT.get(typ, "bin")
    h = hashlib.md5(data.encode("utf-8")).hexdigest()[:12]
    if h in seen:
        return 'src="assets/%s" loading="lazy" decoding="async"' % seen[h]
    fname = "img_%s.%s" % (h, ext)
    try:
        raw = base64.b64decode(data)
    except Exception as e:
        return m.group(0)  # leave untouched on decode error
    with open(os.path.join(ASSETS_DIR, fname), "wb") as out:
        out.write(raw)
    seen[h] = fname
    count += 1
    return 'src="assets/%s" loading="lazy" decoding="async"' % fname

html = pat.sub(repl, html)

with io.open(SRC, "w", encoding="utf-8") as fh:
    fh.write(html)

after = len(html)
total_assets = sum(os.path.getsize(os.path.join(ASSETS_DIR, f)) for f in os.listdir(ASSETS_DIR))
print("unique images extracted:", count)
print("html chars before:", before)
print("html chars after :", after)
print("assets total bytes:", total_assets)
print("remaining data:image in html:", html.count("data:image/"))
