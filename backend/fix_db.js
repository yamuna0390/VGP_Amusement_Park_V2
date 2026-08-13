require('dotenv').config();
const db = require('./src/config/database');
async function run() {
  try {
    const conn = await db.getConnection();
    const [result] = await conn.query("UPDATE invoice_sequences SET last_sequence = 4 WHERE invoice_date = '2026-08-12';");
    console.log('Update successful:', result.affectedRows, 'rows affected');
    conn.release();
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}
run();
