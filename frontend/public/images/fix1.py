#!/usr/bin/env python3
import io, sys

SRC = "/sessions/nice-keen-cannon/mnt/Desktop--outputs/universal_kingdom_website.html"

with io.open(SRC, "r", encoding="utf-8") as fh:
    html = fh.read()

edits = []  # (label, old, new, expected_count)

# 1) SEO meta + favicon + JSON-LD (insert after <title>)
title = "<title>VGP Universal Kingdom — Family Amusement Park</title>"
seo = title + """
<meta name="description" content="VGP Universal Kingdom, Chennai — a family amusement & water park with 22 rides, 11 water-park attractions, a pet zoo, dining and stay. Book Fun Passes online at special prices.">
<meta name="keywords" content="VGP Universal Kingdom, amusement park Chennai, water park, family rides, Fun Pass, ECR Chennai">
<meta name="author" content="VGP Universal Kingdom">
<meta name="robots" content="index, follow">
<link rel="canonical" href="https://vgpuniversalkingdom.in/">
<meta property="og:type" content="website">
<meta property="og:site_name" content="VGP Universal Kingdom">
<meta property="og:title" content="VGP Universal Kingdom — Family Amusement Park">
<meta property="og:description" content="22 rides, 11 water-park attractions, pet zoo, dining & stay by the Bay of Bengal. Book your Fun Pass online.">
<meta property="og:url" content="https://vgpuniversalkingdom.in/">
<meta property="og:image" content="https://vgpuniversalkingdom.in/wp-content/uploads/2025/12/logo.png">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="VGP Universal Kingdom — Family Amusement Park">
<meta name="twitter:description" content="22 rides, 11 water-park attractions, pet zoo, dining & stay by the Bay of Bengal. Book your Fun Pass online.">
<meta name="twitter:image" content="https://vgpuniversalkingdom.in/wp-content/uploads/2025/12/logo.png">
<link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='88'>\U0001F451</text></svg>">
<script type="application/ld+json">
{"@context":"https://schema.org","@type":"AmusementPark","name":"VGP Universal Kingdom","description":"Family amusement and water park with 22 rides, 11 water-park attractions, a pet zoo, dining and stay by the Bay of Bengal.","url":"https://vgpuniversalkingdom.in/","telephone":"+91-7358227778","openingHoursSpecification":{"@type":"OpeningHoursSpecification","dayOfWeek":["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],"opens":"00:00","closes":"23:59"},"image":"https://vgpuniversalkingdom.in/wp-content/uploads/2025/12/logo.png"}
</script>"""
edits.append(("seo", title, seo, 1))

# 2) Fix malformed CSS selector
edits.append(("css-bug", ".hero-video,{position:absolute}", "", 1))

# 3) Duplicate H1 -> H2 (keep only the home hero H1)
edits.append(("h1-rides", "<h1>The Ride Timetable \U0001F3A2</h1>", "<h2>The Ride Timetable \U0001F3A2</h2>", 1))
edits.append(("h1-parks-open", '<h1 class="crazy-title">', '<h2 class="crazy-title">', 1))
edits.append(("h1-parks-close", '<span class="lt">!</span></h1>', '<span class="lt">!</span></h2>', 1))

# 4) Icon-button aria-labels + nav landmark + modal roles + toast live region
edits.append(("nav", "<nav>", '<nav aria-label="Primary navigation">', 1))
edits.append(("hamburger",
    '<button class="hamburger" onclick="toggleDrawer(true)">☰</button>',
    '<button class="hamburger" onclick="toggleDrawer(true)" aria-label="Open menu">☰</button>', 1))
edits.append(("drawer-close",
    '<button class="close" onclick="toggleDrawer(false)">✕</button>',
    '<button class="close" onclick="toggleDrawer(false)" aria-label="Close menu">✕</button>', 1))
edits.append(("login-x",
    '<button class="x" onclick="closeModal(\'login-modal\')">✕</button>',
    '<button class="x" onclick="closeModal(\'login-modal\')" aria-label="Close login">✕</button>', 1))
edits.append(("ticket-x",
    '<button class="x" onclick="closeModal(\'ticket-modal\')">✕</button>',
    '<button class="x" onclick="closeModal(\'ticket-modal\')" aria-label="Close">✕</button>', 1))
edits.append(("login-modal-role",
    '<div class="modal" id="login-modal">',
    '<div class="modal" id="login-modal" role="dialog" aria-modal="true" aria-labelledby="login-title">', 1))
edits.append(("ticket-modal-role",
    '<div class="modal" id="ticket-modal">',
    '<div class="modal" id="ticket-modal" role="dialog" aria-modal="true" aria-labelledby="tp-title">', 1))
edits.append(("toast-live",
    '<div class="toast" id="toast"></div>',
    '<div class="toast" id="toast" role="status" aria-live="polite"></div>', 1))

# 5) Contact form: linked labels, ids, working handler
old_contact = (
'        <div class="field"><label>Name</label><input placeholder="Your name"></div>\n'
'        <div class="field"><label>Email</label><input placeholder="you@example.com"></div>\n'
'        <div class="field"><label>Message</label><input placeholder="How can we help?"></div>\n'
'        <button class="btn-next" onclick="toast(\'\U0001F4E8 Message sent — we\\\'ll reply soon!\')">Send Message</button>'
)
new_contact = (
'        <div class="field"><label for="ct-name">Name</label><input id="ct-name" autocomplete="name" placeholder="Your name"></div>\n'
'        <div class="field"><label for="ct-email">Email</label><input id="ct-email" type="email" autocomplete="email" placeholder="you@example.com"></div>\n'
'        <div class="field"><label for="ct-msg">Message</label><input id="ct-msg" placeholder="How can we help?"></div>\n'
'        <button class="btn-next" onclick="sendContact()">Send Message</button>'
)
edits.append(("contact-form", old_contact, new_contact, 1))

# 6) Booking checkout inputs: linked labels + tel type
old_book = (
'          <div class="field"><label>Name</label><input id="c-name" placeholder="Your full name"></div>\n'
'          <div class="field"><label>Email</label><input id="c-email" type="email" placeholder="you@example.com"></div>\n'
'          <div class="field"><label>Contact</label><input id="c-phone" placeholder="+91 98xxxxxx"></div>\n'
'          <div class="field"><label>Visit Date</label><input id="c-date" disabled></div>'
)
new_book = (
'          <div class="field"><label for="c-name">Name</label><input id="c-name" autocomplete="name" placeholder="Your full name"></div>\n'
'          <div class="field"><label for="c-email">Email</label><input id="c-email" type="email" autocomplete="email" placeholder="you@example.com"></div>\n'
'          <div class="field"><label for="c-phone">Contact</label><input id="c-phone" type="tel" inputmode="tel" autocomplete="tel" placeholder="+91 98xxxxxxxx"></div>\n'
'          <div class="field"><label for="c-date">Visit Date</label><input id="c-date" disabled></div>'
)
edits.append(("book-form", old_book, new_book, 1))

# 7) Login inputs: ids + linked labels + working handler
old_login = (
'    <div class="field"><label id="login-user-label">Email / Mobile</label><input placeholder="Enter email or mobile"></div>\n'
'    <div class="field"><label>Password</label><input type="password" placeholder="••••••••"></div>\n'
'    <div class="field" id="op-code" style="display:none"><label>Operator Code</label><input placeholder="e.g. UKD-OP-1234"></div>\n'
'    <button class="btn-next" style="width:100%" onclick="closeModal(\'login-modal\');toast(\'\U0001F511 Logged in! (demo)\')">Login</button>'
)
new_login = (
'    <div class="field"><label id="login-user-label" for="login-user">Email / Mobile</label><input id="login-user" autocomplete="username" placeholder="Enter email or mobile"></div>\n'
'    <div class="field"><label for="login-pass">Password</label><input id="login-pass" type="password" autocomplete="current-password" placeholder="••••••••"></div>\n'
'    <div class="field" id="op-code" style="display:none"><label for="login-op">Operator Code</label><input id="login-op" placeholder="e.g. UKD-OP-1234"></div>\n'
'    <button class="btn-next" style="width:100%" onclick="doLogin()">Login</button>'
)
edits.append(("login-form", old_login, new_login, 1))

# 8) Replace pay() with validated, working, persisted booking + add helpers
old_pay = (
"function pay(){\n"
" const n=document.getElementById('c-name').value,e=document.getElementById('c-email').value,p=document.getElementById('c-phone').value;\n"
" if(!selDate){toast('\U0001F4C5 Please pick a visit date');bookStep(1);return;}\n"
" if(!n||!e||!p){toast('⚠️ Please fill name, email & contact');return;}\n"
" toast('\U0001F389 Booking confirmed for '+selDate+'! E-tickets sent to '+e);\n"
"}"
)
new_pay = r"""function esc(s){return String(s).replace(/[<>&"]/g,function(c){return {'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;'}[c];});}
function validEmail(x){return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(x);}
function validPhone(x){return /^[+]?\d[\d\s-]{7,14}$/.test(x);}
function pay(){
 var n=document.getElementById('c-name').value.trim();
 var e=document.getElementById('c-email').value.trim();
 var p=document.getElementById('c-phone').value.trim();
 if(!selDate){toast('\U0001F4C5 Please pick a visit date');bookStep(1);return;}
 var tixCount=['adult','child','senior','student','dfpa','dfpc'].reduce(function(s,k){return s+qty[k];},0);
 if(tixCount<1){toast('\U0001F3AB Add at least one ticket');bookStep(2);return;}
 if(!n){toast('⚠️ Please enter your name');document.getElementById('c-name').focus();return;}
 if(!validEmail(e)){toast('\U0001F4E7 Enter a valid email address');document.getElementById('c-email').focus();return;}
 if(!validPhone(p)){toast('\U0001F4F1 Enter a valid contact number');document.getElementById('c-phone').focus();return;}
 var disc=offerDiscount();
 var tixNet=Math.max(0,ticketSubtotal()-disc.amt);
 var food=qty.veg*prices.veg+qty.nonveg*prices.nonveg;
 var grand=tixNet+.18*tixNet+food+.05*food;
 var ref='UKD-'+(Date.now().toString(36)+Math.random().toString(36).slice(2,5)).toUpperCase().slice(-8);
 var booking={ref:ref,name:n,email:e,phone:p,date:selDate,total:grand,items:Object.assign({},qty),offer:selOffer?selOffer.n:null,ts:new Date().toISOString()};
 try{var all=JSON.parse(localStorage.getItem('ukdBookings')||'[]');all.push(booking);localStorage.setItem('ukdBookings',JSON.stringify(all));}catch(_){}
 document.getElementById('bstep4').innerHTML=
  '<div class="conf-card"><div class="conf-check">✅</div>'+
  '<h3>Booking Confirmed!</h3>'+
  '<p>Thank you, '+esc(n)+'. Your e-tickets for <b>'+esc(selDate)+'</b> have been sent to <b>'+esc(e)+'</b>.</p>'+
  '<div class="conf-ref">Booking reference<br><b>'+ref+'</b></div>'+
  '<div class="conf-total">Amount paid: <b>'+fmt(grand)+'</b></div>'+
  '<button class="btn-next" onclick="location.reload()">Make another booking</button></div>';
 document.getElementById('bstep4').scrollIntoView({behavior:'smooth',block:'center'});
 toast('\U0001F389 Booking confirmed — ref '+ref);
}
function sendContact(){
 var n=document.getElementById('ct-name').value.trim();
 var e=document.getElementById('ct-email').value.trim();
 var m=document.getElementById('ct-msg').value.trim();
 if(!n){toast('⚠️ Please enter your name');document.getElementById('ct-name').focus();return;}
 if(!validEmail(e)){toast('\U0001F4E7 Enter a valid email');document.getElementById('ct-email').focus();return;}
 if(!m){toast('✍️ Please enter a message');document.getElementById('ct-msg').focus();return;}
 try{var all=JSON.parse(localStorage.getItem('ukdMessages')||'[]');all.push({n:n,e:e,m:m,ts:new Date().toISOString()});localStorage.setItem('ukdMessages',JSON.stringify(all));}catch(_){}
 document.getElementById('ct-name').value='';document.getElementById('ct-email').value='';document.getElementById('ct-msg').value='';
 toast('\U0001F4E8 Thanks '+n+'! Your message was sent.');
}
function doLogin(){
 var u=document.getElementById('login-user').value.trim();
 var pw=document.getElementById('login-pass').value;
 var isOp=document.getElementById('tab-operator').classList.contains('active');
 if(!u){toast('⚠️ Enter your email or mobile');return;}
 if(pw.length<4){toast('\U0001F512 Password must be at least 4 characters');return;}
 if(isOp){var code=document.getElementById('login-op').value.trim();if(!/^UKD-OP-\d{4}$/i.test(code)){toast('\U0001F9F3 Enter a valid operator code (e.g. UKD-OP-1234)');return;}}
 try{localStorage.setItem('ukdUser',JSON.stringify({user:u,operator:isOp,ts:Date.now()}));}catch(_){}
 closeModal('login-modal');
 toast('\U0001F511 Welcome, '+u+'!');
 reflectLogin();
}
function reflectLogin(){
 var u=null;try{u=JSON.parse(localStorage.getItem('ukdUser')||'null');}catch(_){}
 document.querySelectorAll('.btn-login').forEach(function(b){
  if(u){b.textContent='\U0001F464 '+u.user.split('@')[0].slice(0,12);b.onclick=logout;}
  else{b.textContent='Login';b.onclick=function(){openLogin('guest');};}
 });
}
function logout(){try{localStorage.removeItem('ukdUser');}catch(_){}reflectLogin();toast('\U0001F44B Logged out');}
document.addEventListener('DOMContentLoaded',reflectLogin);"""
edits.append(("pay-fn", old_pay, new_pay, 1))

# 9) Append CSS for confirmation card + hero h2 sizing + focus ring (before </style>)
css_add = """
/* ---------- fixes: confirmation card + accessible hero h2 + focus ring ---------- */
.conf-card{text-align:center;padding:22px 10px}
.conf-check{font-size:3rem;line-height:1}
.conf-card h3{color:var(--purple);margin:6px 0 8px}
.conf-ref{background:var(--blue);color:var(--purple);border-radius:14px;padding:12px;margin:14px auto;max-width:320px;font-size:1rem}
.conf-ref b{font-size:1.35rem;letter-spacing:1.5px}
.conf-total{font-weight:800;color:var(--red);font-size:1.2rem;margin:6px 0 16px}
.hero h2{font-size:clamp(2.4rem,6vw,4.2rem);color:#FDDB00;text-shadow:3px 3px 0 var(--red);position:relative;z-index:2}
@media(max-width:760px){.hero h2{font-size:2.2rem}}
@media(max-width:460px){.hero h2{font-size:1.85rem}}
:focus-visible{outline:3px solid var(--purple);outline-offset:2px}
</style>"""
edits.append(("css-add", "</style>", css_add, 1))

# Apply
for label, old, new, exp in edits:
    c = html.count(old)
    if c != exp:
        print("FAIL [%s]: expected %d occurrence(s), found %d" % (label, exp, c))
        sys.exit(1)
    html = html.replace(old, new)
    print("ok   [%s] (%d)" % (label, c))

with io.open(SRC, "w", encoding="utf-8") as fh:
    fh.write(html)
print("ALL EDITS APPLIED")
