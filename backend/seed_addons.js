const mysql = require("mysql2/promise");
async function run() {
  const conn = await mysql.createConnection({host: "localhost", user: "root", password: "Yam@9809", database: "amusement_park"});
  await conn.execute("INSERT INTO addons (id, code, name, price, status, display_order) VALUES (1, 'LUNCH', 'Lunch Buffet', 500, 'Active', 1), (2, 'LOCKER', 'Locker', 100, 'Active', 2)");
  console.log("Addons inserted");
  process.exit(0);
}
run();
