#!/usr/bin/env python3
import io, sys
SRC = "/sessions/nice-keen-cannon/mnt/Desktop--outputs/universal_kingdom_website.html"
h = io.open(SRC, "r", encoding="utf-8").read()
E = []

# 1) littleLegends() helper before evalOffer
E.append(("helper",
 "function evalOffer(o){if(!dateEligible(o,selDate))",
 "function littleLegends(){var A=qty.adult||0,C=qty.child||0;var free=Math.min(C,A*2);var qualAdults=Math.ceil(free/2);var extra=C-free;var surcharge=qualAdults*((mrp.adult||prices.adult)-prices.adult);var saving=free*prices.child-surcharge;return {A:A,C:C,free:free,qualAdults:qualAdults,extra:extra,surcharge:surcharge,saving:saving};}\n"
 "function evalOffer(o){if(!dateEligible(o,selDate))",
 1))

# 2) kids case new logic
old_kids = ("case 'kids':{if(!qty.adult)return {amt:0,ok:false,note:'ℹ️ Add an Adult Fun Pass — each adult unlocks 2 free kids.'};"
 "if(!qty.child)return {amt:0,ok:false,note:'ℹ️ Add Child Fun Passes — 2 free per adult.'};"
 "var fk=Math.min(qty.child,2*qty.adult);return {amt:fk*prices.child,ok:true,note:'✔️ '+fk+' kid(s) FREE below 130 cm.'};}")
new_kids = ("case 'kids':{if(!qty.adult)return {amt:0,ok:false,note:'ℹ️ Add at least 1 Adult Fun Pass — one full-price adult covers up to 2 children.'};"
 "if(!qty.child)return {amt:0,ok:false,note:'ℹ️ Add Child Fun Passes — 2 children go free per full-price adult.'};"
 "var ll=littleLegends();var msg;if(ll.extra>0){var need=Math.ceil(ll.C/2);msg='✔️ '+ll.free+' child(ren) FREE with '+ll.qualAdults+' full-price adult(s). '+ll.extra+' extra child(ren) at regular price — add '+(need-ll.A)+' more adult(s) to free all '+ll.C+'. Adult 15% online discount not applicable.';}"
 "else{msg='✔️ All '+ll.free+' child(ren) FREE with '+ll.qualAdults+' full-price adult(s). Adult 15% online discount not applicable on Little Legends.';}"
 "return {amt:ll.saving,ok:true,note:msg};}")
E.append(("kids-case", old_kids, new_kids, 1))

# 3) renderCheckout offer line -> Little Legends breakdown
old_line = ' if(disc.amt){ rows+=\'<div class="row" style="color:var(--green-deep)"><span>Offer: \'+esc(selOffer.name)+\'</span><span>− \'+fmt(disc.amt)+\'</span></div>\'; }'
new_line = (' if(selOffer && selOffer.id===\'kids\'){ var llc=littleLegends();'
 ' rows+=\'<div class="row" style="color:var(--green-deep)"><span>Little Legends: \'+llc.free+\' child ticket(s) FREE</span><span>− \'+fmt(llc.free*prices.child)+\'</span></div>\';'
 ' if(llc.surcharge) rows+=\'<div class="row" style="color:var(--red)"><span>Adult 15% online discount removed (\'+llc.qualAdults+\' × \'+fmt(mrp.adult-prices.adult)+\')</span><span>+ \'+fmt(llc.surcharge)+\'</span></div>\';'
 ' if(llc.extra) rows+=\'<div class="row"><span>\'+llc.extra+\' regular child ticket(s) — offer limit reached</span><span>at regular price</span></div>\';'
 ' } else if(disc.amt){ rows+=\'<div class="row" style="color:var(--green-deep)"><span>Offer: \'+esc(selOffer.name)+\'</span><span>− \'+fmt(disc.amt)+\'</span></div>\'; }')
E.append(("checkout-line", old_line, new_line, 1))

# 4) chg -> also updateLLHint, and define updateLLHint
old_chg = "function chg(k,v){qty[k]=Math.max(0,qty[k]+v);document.getElementById('q-'+k).textContent=qty[k];updateLiveTotal();}"
new_chg = ("function chg(k,v){qty[k]=Math.max(0,qty[k]+v);document.getElementById('q-'+k).textContent=qty[k];updateLiveTotal();updateLLHint();}\n"
 "function updateLLHint(){var el=document.getElementById('ll-hint');if(!el)return;if(!selOffer||selOffer.id!=='kids'||!qty.child){el.style.display='none';return;}var ll=littleLegends();el.style.display='block';"
 "if(ll.extra>0){var need=Math.ceil(ll.C/2);el.innerHTML='\U0001F451 <b>Little Legends:</b> one full-price adult covers 2 children. '+ll.free+' child(ren) get the offer; '+ll.extra+' charged at regular price. Add <b>'+(need-ll.A)+'</b> more full-price adult(s) to extend the benefit to all '+ll.C+'.<br><i>The 15% online discount is not applicable on the qualifying adult ticket.</i>';}"
 "else{el.innerHTML='\U0001F451 <b>Little Legends:</b> all '+ll.C+' child(ren) qualify with '+ll.qualAdults+' full-price adult(s).<br><i>The 15% online discount is not applicable on the qualifying adult ticket(s).</i>';}}")
E.append(("chg", old_chg, new_chg, 1))

# 5) bookStep -> call updateLLHint
E.append(("bookStep",
 " if(n===4) renderCheckout();\n updateLiveTotal();\n",
 " if(n===4) renderCheckout();\n updateLiveTotal();updateLLHint();\n",
 1))

# 6) bstep2 -> ll-hint element after tax-note
E.append(("bstep2",
 '        <p class="tax-note">All prices shown are <b>before tax</b>. GST is added at checkout — <b>18%</b> on theme-park tickets and <b>5%</b> on food.</p>',
 '        <p class="tax-note">All prices shown are <b>before tax</b>. GST is added at checkout — <b>18%</b> on theme-park tickets and <b>5%</b> on food.</p>\n        <div id="ll-hint" class="ll-hint" style="display:none"></div>',
 1))

# 7) CSS
E.append(("css",
 "</style>",
 ".ll-hint{background:#FFF3D6;border:2px solid var(--yellow-deep);border-radius:12px;padding:10px 14px;margin:0 0 12px;font-size:.85rem;font-weight:700;color:var(--ink);line-height:1.5}\n.ll-hint i{font-weight:600;color:var(--red)}\n</style>",
 1))

for label, old, new, exp in E:
    c = h.count(old)
    if c != exp:
        print("FAIL [%s]: expected %d, found %d" % (label, exp, c)); sys.exit(1)
    h = h.replace(old, new); print("ok [%s]" % label)

io.open(SRC, "w", encoding="utf-8").write(h)
print("DONE")
