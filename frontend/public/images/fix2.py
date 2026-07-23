#!/usr/bin/env python3
import io, sys
SRC = "/sessions/nice-keen-cannon/mnt/Desktop--outputs/universal_kingdom_website.html"
h = io.open(SRC, "r", encoding="utf-8").read()

old = (
"function offerDiscount(){\n"
" if(!selOffer) return {amt:0,note:''};\n"
" if(selOffer.id==='early'){\n"
"  if(!selDate||selDate<=todayISO()) return {amt:0,note:'⚠️ Early Bird is not applicable for same-day booking.'};\n"
"  return {amt:.15*ticketSubtotal(),note:''};\n"
" }"
)
new = (
"function offerDiscount(){\n"
" if(!selOffer) return {amt:0,note:''};\n"
" /* Offers are never valid for same-day (or past) visit dates */\n"
" if(selDate && selDate<=todayISO()) return {amt:0,note:'⚠️ Offers are not valid for same-day bookings — pick a future date to enjoy this offer.'};\n"
" if(selOffer.id==='early'){\n"
"  if(!selDate) return {amt:0,note:'\U0001F4C5 Pick a future visit date to unlock the Early Bird discount.'};\n"
"  return {amt:.15*ticketSubtotal(),note:''};\n"
" }"
)
c = h.count(old)
if c != 1:
    print("FAIL: found", c, "occurrences"); sys.exit(1)
h = h.replace(old, new)
io.open(SRC, "w", encoding="utf-8").write(h)
print("OK: same-day offer guard added")
