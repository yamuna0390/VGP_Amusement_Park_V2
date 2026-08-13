const mysql = require("mysql2/promise");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

async function runTests() {
  const conn = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Yam@9809",
    database: "amusement_park"
  });

  const [users] = await conn.execute("SELECT id FROM users LIMIT 1");
  const testUserId = users.length > 0 ? users[0].id : null;

  const API_URL = "http://localhost:5000/api/booking/session";
  const JWT_SECRET = "vgp_backend_2026_super_secret_key";
  
  console.log("\n--- TEST A: NO AUTH HEADER ---");
  const resA = await fetch(API_URL, { method: "POST" });
  const headersA = [...resA.headers.entries()];
  const cookieA = headersA.find(h => h[0].toLowerCase() === 'set-cookie')?.[1];
  console.log("Status:", resA.status);
  console.log("Set-Cookie:", cookieA);
  
  const tokenA = cookieA ? cookieA.split(";")[0].split("=")[1] : null;
  const hashA = crypto.createHash("sha256").update(tokenA).digest("hex");
  
  const [rowsA] = await conn.execute("SELECT * FROM booking_sessions WHERE session_token_hash = ?", [hashA]);
  const dbA = rowsA[0];
  console.log("DB record user_id:", dbA.user_id);
  console.log("DB record matches token hash?", dbA.session_token_hash === hashA);
  console.log("DB booking_type:", dbA.booking_type);
  console.log("DB current_step:", dbA.current_step);
  console.log("DB expires_at:", dbA.expires_at);

  let dbB = null;
  let hashB = null;

  if (testUserId) {
    console.log("\n--- TEST B: VALID JWT ---");
    const token = jwt.sign({ id: testUserId, email: "test@vgp.com", role: "customer" }, JWT_SECRET, { expiresIn: "1h" });
    
    const resB = await fetch(API_URL, { 
      method: "POST", 
      headers: { "Authorization": `Bearer ${token}` } 
    });
    const headersB = [...resB.headers.entries()];
    const cookieB = headersB.find(h => h[0].toLowerCase() === 'set-cookie')?.[1];
    console.log("Status:", resB.status);
    console.log("Set-Cookie:", cookieB);
    
    const tokenB = cookieB ? cookieB.split(";")[0].split("=")[1] : null;
    hashB = crypto.createHash("sha256").update(tokenB).digest("hex");
    
    const [rowsB] = await conn.execute("SELECT * FROM booking_sessions WHERE session_token_hash = ?", [hashB]);
    dbB = rowsB[0];
    console.log("DB record user_id:", dbB.user_id);
    console.log("DB record matches token hash?", dbB.session_token_hash === hashB);
  }

  console.log("\n--- VERIFICATION 8 ---");
  console.log("Different tokens generated?", hashA !== hashB);

  await conn.end();
}

runTests().catch(console.error);
