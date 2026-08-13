const mysql = require("mysql2/promise");
const crypto = require("crypto");

async function runTests() {
  const conn = await mysql.createConnection({
    host: "localhost", user: "root", password: "Yam@9809", database: "amusement_park"
  });

  const API_URL = "http://localhost:5000/api/booking/session";
  let cookie = "";
  let sessionId = null;

  async function createSession(visitDate = "2026-08-12", bookingType = "REGULAR", offerId = null) {
    const res1 = await fetch(API_URL, { method: "POST" });
    const headers = [...res1.headers.entries()];
    cookie = headers.find(h => h[0].toLowerCase() === 'set-cookie')[1].split(";")[0];
    const token = cookie.split("=")[1];
    const hash = crypto.createHash("sha256").update(token).digest("hex");
    const [rows] = await conn.execute("SELECT id FROM booking_sessions WHERE session_token_hash = ?", [hash]);
    sessionId = rows[0].id;

    if (visitDate) {
        await fetch(API_URL, {
            method: "PATCH",
            headers: { "Content-Type": "application/json", "Cookie": cookie },
            body: JSON.stringify({ visitDate, bookingType, offerId })
        });
    }
  }

  async function putItems(body, testCookie = cookie) {
    const res = await fetch(API_URL + "/items", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...(testCookie && { "Cookie": testCookie })
      },
      body: JSON.stringify(body)
    });
    const data = await res.json();
    return { status: res.status, data };
  }

  // Helper to assert conditions
  function assertTest(name, condition, details = "") {
    console.log(`${name}:`, condition ? "PASSED" : `FAILED - ${details}`);
  }

  // --------------------------------------------------
  // TEST 1: REGULAR ADULT
  // --------------------------------------------------
  await createSession("2026-08-12", "REGULAR");
  let res = await putItems({ tickets: [{ ticketTypeId: 1, quantity: 2 }] });
  let t = res.data.data?.items?.tickets[0];
  assertTest("TEST 1", res.status === 200 && t.quantity === 2 && t.paidQuantity === 2 && t.freeQuantity === 0);

  // --------------------------------------------------
  // TEST 2: REGULAR MULTIPLE TICKETS
  // --------------------------------------------------
  res = await putItems({ tickets: [{ ticketTypeId: 1, quantity: 2 }, { ticketTypeId: 2, quantity: 1 }] });
  let t2 = res.data.data?.items?.tickets.find(x => x.ticketTypeId === 2);
  assertTest("TEST 2", res.status === 200 && res.data.data.items.tickets.length === 2 && t2.paidQuantity === 1);

  // --------------------------------------------------
  // TEST 3: ADDONS
  // --------------------------------------------------
  res = await putItems({ tickets: [{ ticketTypeId: 1, quantity: 1 }], addons: [{ addonId: 1, quantity: 2 }, { addonId: 2, quantity: 1 }] });
  let a1 = res.data.data?.items?.addons.find(x => x.addonId === 1);
  assertTest("TEST 3", res.status === 200 && a1.paidQuantity === 2);

  // --------------------------------------------------
  // TEST 4: REPLACE
  // --------------------------------------------------
  res = await putItems({ tickets: [{ ticketTypeId: 2, quantity: 1 }], addons: [{ addonId: 2, quantity: 1 }] });
  let tk = res.data.data?.items?.tickets;
  let ad = res.data.data?.items?.addons;
  assertTest("TEST 4", res.status === 200 && tk.length === 1 && ad.length === 1 && tk[0].ticketTypeId === 2 && ad[0].addonId === 2);

  // --------------------------------------------------
  // TEST 5-11: AADI ADULT (Buy 2 Get 1) -> id: 4, min_qty: 2, free_qty: 1
  // --------------------------------------------------
  await createSession("2026-08-12", "OFFER", 4);
  res = await putItems({ tickets: [{ ticketTypeId: 1, quantity: 1 }] });
  t = res.data.data?.items?.tickets[0];
  assertTest("TEST 5", res.status === 200 && t.quantity === 1 && t.paidQuantity === 1 && t.freeQuantity === 0);

  res = await putItems({ tickets: [{ ticketTypeId: 1, quantity: 2 }] });
  t = res.data.data?.items?.tickets[0];
  assertTest("TEST 6", res.status === 200 && t.quantity === 2 && t.paidQuantity === 2 && t.freeQuantity === 1);

  res = await putItems({ tickets: [{ ticketTypeId: 1, quantity: 3 }] });
  t = res.data.data?.items?.tickets[0];
  assertTest("TEST 7", res.status === 200 && t.quantity === 3 && t.paidQuantity === 3 && t.freeQuantity === 1);

  res = await putItems({ tickets: [{ ticketTypeId: 1, quantity: 4 }] });
  t = res.data.data?.items?.tickets[0];
  assertTest("TEST 8", res.status === 200 && t.quantity === 4 && t.paidQuantity === 4 && t.freeQuantity === 2);

  res = await putItems({ tickets: [{ ticketTypeId: 1, quantity: 5 }] });
  t = res.data.data?.items?.tickets[0];
  assertTest("TEST 9", res.status === 200 && t.quantity === 5 && t.paidQuantity === 5 && t.freeQuantity === 2);

  res = await putItems({ tickets: [{ ticketTypeId: 1, quantity: 6 }] });
  t = res.data.data?.items?.tickets[0];
  assertTest("TEST 10", res.status === 200 && t.quantity === 6 && t.paidQuantity === 6 && t.freeQuantity === 3);

  res = await putItems({ tickets: [{ ticketTypeId: 1, quantity: 7 }] });
  t = res.data.data?.items?.tickets[0];
  assertTest("TEST 11", res.status === 200 && t.quantity === 7 && t.paidQuantity === 7 && t.freeQuantity === 3);

  // --------------------------------------------------
  // TEST 12-14: BIRTHDAY (Buy 1 Get 1) -> id: 3, min_qty: 1, free_qty: 1
  // --------------------------------------------------
  await createSession("2026-08-12", "OFFER", 3);
  res = await putItems({ tickets: [{ ticketTypeId: 1, quantity: 1 }] });
  t = res.data.data?.items?.tickets[0];
  assertTest("TEST 12", res.status === 200 && t.quantity === 1 && t.paidQuantity === 1 && t.freeQuantity === 1);
  
  res = await putItems({ tickets: [{ ticketTypeId: 1, quantity: 2 }] });
  t = res.data.data?.items?.tickets[0];
  assertTest("TEST 13", res.status === 200 && t.quantity === 2 && t.paidQuantity === 2 && t.freeQuantity === 2);
  
  res = await putItems({ tickets: [{ ticketTypeId: 1, quantity: 3 }] });
  t = res.data.data?.items?.tickets[0];
  assertTest("TEST 14", res.status === 200 && t.quantity === 3 && t.paidQuantity === 3 && t.freeQuantity === 3);

  // --------------------------------------------------
  // TEST 15-17: LITTLE LEGEND (Buy 1 Get 2) -> id: 6, min_qty: 1, free_qty: 2
  // Saturday visitDate to be valid
  // --------------------------------------------------
  await createSession("2026-08-15", "OFFER", 6);
  res = await putItems({ tickets: [{ ticketTypeId: 2, quantity: 1 }] }); // assuming child is mapped
  t = res.data.data?.items?.tickets[0];
  // Wait, I need to check which ticket is mapped to Little Legend! Let's just use 1 and see.
  // The prompt says "assuming child is mapped". Let's test with ticketTypeId: 2 (child)
  res = await putItems({ tickets: [{ ticketTypeId: 2, quantity: 1 }] });
  t = res.data.data?.items?.tickets[0];
  assertTest("TEST 15", res.status === 200 && t.quantity === 1 && t.paidQuantity === 1 && t.freeQuantity === 2);

  res = await putItems({ tickets: [{ ticketTypeId: 2, quantity: 2 }] });
  t = res.data.data?.items?.tickets[0];
  assertTest("TEST 16", res.status === 200 && t.quantity === 2 && t.paidQuantity === 2 && t.freeQuantity === 4);

  res = await putItems({ tickets: [{ ticketTypeId: 2, quantity: 3 }] });
  t = res.data.data?.items?.tickets[0];
  assertTest("TEST 17", res.status === 200 && t.quantity === 3 && t.paidQuantity === 3 && t.freeQuantity === 6);

  // --------------------------------------------------
  // TEST 18: OFFER INVALID TICKET
  // AADIB2G1 -> Adult and Child allowed. Let's send ticketTypeId: 3 (Senior)
  // --------------------------------------------------
  await createSession("2026-08-12", "OFFER", 4);
  res = await putItems({ tickets: [{ ticketTypeId: 3, quantity: 1 }] });
  assertTest("TEST 18", res.status === 200 && res.data.data.items.tickets[0].pricingType === 'REGULAR', res.data.message);

  // --------------------------------------------------
  // TEST 19: OFFER CHILD
  // --------------------------------------------------
  res = await putItems({ tickets: [{ ticketTypeId: 2, quantity: 4 }] });
  t = res.data.data?.items?.tickets[0];
  assertTest("TEST 19", res.status === 200 && t.quantity === 4 && t.paidQuantity === 4 && t.freeQuantity === 2);

  // --------------------------------------------------
  // TEST 20: PERCENTAGE OFFER (EARLYBIRD15 -> id: 1)
  // --------------------------------------------------
  // Need to provide advance days, e.g. 2026-08-20 (assuming > 3 days)
  await createSession("2026-08-20", "OFFER", 1);
  res = await putItems({ tickets: [{ ticketTypeId: 1, quantity: 3 }] });
  t = res.data.data?.items?.tickets[0];
  assertTest("TEST 20", res.status === 200 && t.quantity === 3 && t.paidQuantity === 3 && t.freeQuantity === 0);

  // --------------------------------------------------
  // TEST 21: DUPLICATE TICKET
  // --------------------------------------------------
  res = await putItems({ tickets: [{ ticketTypeId: 1, quantity: 1 }, { ticketTypeId: 1, quantity: 2 }] });
  assertTest("TEST 21", res.status === 400 && res.data.code === 'VALIDATION_ERROR');

  // --------------------------------------------------
  // TEST 22: INVALID TICKET
  // --------------------------------------------------
  res = await putItems({ tickets: [{ ticketTypeId: 999999, quantity: 1 }] });
  assertTest("TEST 22", res.status === 404 && res.data.code === 'TICKET_NOT_FOUND');

  // --------------------------------------------------
  // TEST 23: INVALID ADDON
  // --------------------------------------------------
  res = await putItems({ tickets: [{ ticketTypeId: 1, quantity: 1 }], addons: [{ addonId: 999999, quantity: 1 }] });
  assertTest("TEST 23", res.status === 400 && res.data.code === 'ADDON_NOT_AVAILABLE');

  // --------------------------------------------------
  // TEST 24: NO TICKETS
  // --------------------------------------------------
  res = await putItems({ tickets: [], addons: [{ addonId: 1, quantity: 1 }] });
  assertTest("TEST 24", res.status === 400 && res.data.code === 'VALIDATION_ERROR');

  // --------------------------------------------------
  // TEST 25: ZERO QUANTITY
  // --------------------------------------------------
  res = await putItems({ tickets: [{ ticketTypeId: 1, quantity: 0 }] });
  assertTest("TEST 25", res.status === 400 && res.data.code === 'VALIDATION_ERROR');

  // --------------------------------------------------
  // TEST 26: NEGATIVE QUANTITY
  // --------------------------------------------------
  res = await putItems({ tickets: [{ ticketTypeId: 1, quantity: -1 }] });
  assertTest("TEST 26", res.status === 400 && res.data.code === 'VALIDATION_ERROR');

  // --------------------------------------------------
  // TEST 27: PRICE TAMPERING
  // --------------------------------------------------
  res = await putItems({ tickets: [{ ticketTypeId: 1, quantity: 2, unitPrice: 1, paidQuantity: 1, freeQuantity: 99 }] });
  // Should reject unknown fields due to unknown(false)
  assertTest("TEST 27", res.status === 400 && res.data.code === 'VALIDATION_ERROR');

  // --------------------------------------------------
  // TEST 28: ADDON PRICE TAMPERING
  // --------------------------------------------------
  res = await putItems({ tickets: [{ ticketTypeId: 1, quantity: 1 }], addons: [{ addonId: 1, quantity: 1, price: 0 }] });
  assertTest("TEST 28", res.status === 400 && res.data.code === 'VALIDATION_ERROR');

  // --------------------------------------------------
  // TEST 29: ATOMIC ROLLBACK
  // --------------------------------------------------
  await putItems({ tickets: [{ ticketTypeId: 1, quantity: 2 }] }); // Setup
  res = await putItems({ tickets: [{ ticketTypeId: 1, quantity: 1 }], addons: [{ addonId: 999999, quantity: 1 }] });
  const items = await conn.execute("SELECT * FROM booking_session_items WHERE session_id = ?", [sessionId]);
  assertTest("TEST 29", res.status === 400 && items[0].length === 1 && items[0][0].quantity === 2);

  // --------------------------------------------------
  // TEST 30: SESSION EXPIRY
  // --------------------------------------------------
  await conn.execute("UPDATE booking_sessions SET expires_at = '2000-01-01' WHERE id = ?", [sessionId]);
  res = await putItems({ tickets: [{ ticketTypeId: 1, quantity: 1 }] });
  assertTest("TEST 30", res.status === 403 && res.data.code === 'SESSION_EXPIRED');

  // --------------------------------------------------
  // TEST 31: MISSING COOKIE
  // --------------------------------------------------
  res = await putItems({ tickets: [{ ticketTypeId: 1, quantity: 1 }] }, "");
  assertTest("TEST 31", res.status === 401 && res.data.code === 'SESSION_NOT_FOUND');

  // --------------------------------------------------
  // TEST 32: STEP 1 NOT COMPLETED
  // --------------------------------------------------
  await createSession(null); // Do not run PATCH
  res = await putItems({ tickets: [{ ticketTypeId: 1, quantity: 1 }] });
  assertTest("TEST 32", res.status === 400 && res.data.code === 'BOOKING_STEP_INCOMPLETE');

  // --------------------------------------------------
  // TEST 33: CURRENT STEP
  // --------------------------------------------------
  await createSession("2026-08-12", "REGULAR");
  res = await putItems({ tickets: [{ ticketTypeId: 1, quantity: 1 }] });
  let [sess] = await conn.execute("SELECT current_step FROM booking_sessions WHERE id = ?", [sessionId]);
  assertTest("TEST 33", res.status === 200 && sess[0].current_step === 2);

  // --------------------------------------------------
  // TEST 34: MIXED LITTLE LEGEND
  // --------------------------------------------------
  await createSession("2026-08-15", "OFFER", 6);
  res = await putItems({ tickets: [{ ticketTypeId: 1, quantity: 2 }, { ticketTypeId: 2, quantity: 3 }] });
  let tkAdult = res.data.data?.items?.tickets.find(t => t.ticketTypeId === 1);
  let tkChild = res.data.data?.items?.tickets.find(t => t.ticketTypeId === 2);
  assertTest("TEST 34", 
    res.status === 200 && 
    tkAdult && tkAdult.paidQuantity === 2 && tkAdult.freeQuantity === 0 &&
    tkChild && tkChild.paidQuantity === 3 && tkChild.freeQuantity === 6
  );

  // --------------------------------------------------
  // TEST 35: MIXED AADI
  // --------------------------------------------------
  await createSession("2026-08-12", "OFFER", 4);
  res = await putItems({ tickets: [{ ticketTypeId: 1, quantity: 4 }, { ticketTypeId: 2, quantity: 3 }, { ticketTypeId: 3, quantity: 2 }] });
  tkAdult = res.data.data?.items?.tickets.find(t => t.ticketTypeId === 1);
  tkChild = res.data.data?.items?.tickets.find(t => t.ticketTypeId === 2);
  let tkSenior = res.data.data?.items?.tickets.find(t => t.ticketTypeId === 3);
  assertTest("TEST 35", 
    res.status === 200 && 
    tkAdult && tkAdult.paidQuantity === 4 && tkAdult.freeQuantity === 2 &&
    tkChild && tkChild.paidQuantity === 3 && tkChild.freeQuantity === 1 &&
    tkSenior && tkSenior.paidQuantity === 2 && tkSenior.freeQuantity === 0
  );

  // --------------------------------------------------
  // TEST 36: MIXED EARLY BIRD
  // --------------------------------------------------
  await createSession("2026-08-20", "OFFER", 1);
  res = await putItems({ tickets: [{ ticketTypeId: 1, quantity: 2 }, { ticketTypeId: 2, quantity: 2 }, { ticketTypeId: 4, quantity: 2 }] });
  tkAdult = res.data.data?.items?.tickets.find(t => t.ticketTypeId === 1);
  tkChild = res.data.data?.items?.tickets.find(t => t.ticketTypeId === 2);
  let tkStudent = res.data.data?.items?.tickets.find(t => t.ticketTypeId === 4);
  assertTest("TEST 36", 
    res.status === 200 && 
    tkAdult && tkAdult.paidQuantity === 2 && tkAdult.freeQuantity === 0 && tkAdult.pricingType === 'OFFER' &&
    tkChild && tkChild.paidQuantity === 2 && tkChild.freeQuantity === 0 && tkChild.pricingType === 'OFFER' &&
    tkStudent && tkStudent.paidQuantity === 2 && tkStudent.freeQuantity === 0 && tkStudent.pricingType === 'REGULAR'
  );

  // --------------------------------------------------
  // TEST 37: ONLY UNMAPPED TICKETS
  // --------------------------------------------------
  await createSession("2026-08-15", "OFFER", 6);
  res = await putItems({ tickets: [{ ticketTypeId: 1, quantity: 2 }] });
  tkAdult = res.data.data?.items?.tickets.find(t => t.ticketTypeId === 1);
  assertTest("TEST 37", 
    res.status === 200 && 
    tkAdult && tkAdult.paidQuantity === 2 && tkAdult.freeQuantity === 0 && tkAdult.pricingType === 'REGULAR'
  );

  // --------------------------------------------------
  // TEST 38: MAPPED TICKET BELOW PROMOTION THRESHOLD
  // --------------------------------------------------
  await createSession("2026-08-12", "OFFER", 4);
  res = await putItems({ tickets: [{ ticketTypeId: 1, quantity: 1 }] });
  tkAdult = res.data.data?.items?.tickets.find(t => t.ticketTypeId === 1);
  assertTest("TEST 38", 
    res.status === 200 && 
    tkAdult && tkAdult.paidQuantity === 1 && tkAdult.freeQuantity === 0
  );

  // --------------------------------------------------
  // TEST 39: MIXED TICKETS + ADDONS
  // --------------------------------------------------
  await createSession("2026-08-15", "OFFER", 6);
  res = await putItems({ tickets: [{ ticketTypeId: 1, quantity: 2 }, { ticketTypeId: 2, quantity: 3 }], addons: [{ addonId: 1, quantity: 2 }, { addonId: 2, quantity: 1 }] });
  tkAdult = res.data.data?.items?.tickets.find(t => t.ticketTypeId === 1);
  tkChild = res.data.data?.items?.tickets.find(t => t.ticketTypeId === 2);
  let adMeal = res.data.data?.items?.addons.find(a => a.addonId === 1);
  let adLocker = res.data.data?.items?.addons.find(a => a.addonId === 2);
  assertTest("TEST 39", 
    res.status === 200 && 
    tkAdult && tkAdult.paidQuantity === 2 && tkAdult.freeQuantity === 0 &&
    tkChild && tkChild.paidQuantity === 3 && tkChild.freeQuantity === 6 &&
    adMeal && adMeal.paidQuantity === 2 && adMeal.freeQuantity === 0 &&
    adLocker && adLocker.paidQuantity === 1 && adLocker.freeQuantity === 0
  );

  // --------------------------------------------------
  // TEST 40: PRICE SECURITY
  // --------------------------------------------------
  await createSession("2026-08-12", "REGULAR");
  res = await putItems({ tickets: [{ ticketTypeId: 1, quantity: 2, unitPrice: 1, paidQuantity: 1, freeQuantity: 99 }] });
  assertTest("TEST 40", res.status === 400 && res.data.code === 'VALIDATION_ERROR');

  // --------------------------------------------------
  // TEST 41: ATOMIC ROLLBACK
  // --------------------------------------------------
  await createSession("2026-08-12", "REGULAR");
  await putItems({ tickets: [{ ticketTypeId: 1, quantity: 2 }, { ticketTypeId: 2, quantity: 1 }] });
  res = await putItems({ tickets: [{ ticketTypeId: 1, quantity: 1 }], addons: [{ addonId: 999999, quantity: 1 }] });
  const items41 = await conn.execute("SELECT * FROM booking_session_items WHERE session_id = ?", [sessionId]);
  assertTest("TEST 41", res.status === 400 && items41[0].length === 2 && items41[0].find(i => i.ticket_type_id == 1).quantity === 2);

  // --------------------------------------------------
  // TEST 42: EXPIRED SESSION
  // --------------------------------------------------
  await createSession("2026-08-12", "REGULAR");
  await conn.execute("UPDATE booking_sessions SET expires_at = '2000-01-01' WHERE id = ?", [sessionId]);
  res = await putItems({ tickets: [{ ticketTypeId: 1, quantity: 1 }] });
  assertTest("TEST 42", res.status === 403 && res.data.code === 'SESSION_EXPIRED');

  // --------------------------------------------------
  // TEST 43: INACTIVE TICKET
  // --------------------------------------------------
  await createSession("2026-08-12", "REGULAR");
  res = await putItems({ tickets: [{ ticketTypeId: 999999, quantity: 1 }] });
  assertTest("TEST 43", res.status === 404 && res.data.code === 'TICKET_NOT_FOUND');

  // --------------------------------------------------
  // TEST 44: INACTIVE ADDON
  // --------------------------------------------------
  res = await putItems({ tickets: [{ ticketTypeId: 1, quantity: 1 }], addons: [{ addonId: 999999, quantity: 1 }] });
  assertTest("TEST 44", res.status === 400 && res.data.code === 'ADDON_NOT_AVAILABLE');

  await conn.end();
}

runTests().catch(console.error);
