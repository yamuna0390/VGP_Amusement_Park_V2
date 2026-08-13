const mysql = require('mysql2/promise');
async function run() {
  const conn = await mysql.createConnection({host: 'localhost', user: 'root', password: 'Yam@9809', database: 'amusement_park'});
  
  try {
    await conn.execute(`ALTER TABLE bookings ADD COLUMN invoice_number VARCHAR(30) NULL UNIQUE`);
    console.log('Added invoice_number column');
  } catch (e) {
    if (e.code === 'ER_DUP_FIELDNAME') console.log('invoice_number column already exists');
    else throw e;
  }
  
  try {
    await conn.execute(`CREATE TABLE invoice_sequences (
      id BIGINT NOT NULL AUTO_INCREMENT,
      invoice_date DATE NOT NULL,
      last_sequence INT NOT NULL DEFAULT 0,
      PRIMARY KEY (id),
      UNIQUE KEY uq_invoice_date (invoice_date)
    )`);
    console.log('Created invoice_sequences table');
  } catch (e) {
    if (e.code === 'ER_TABLE_EXISTS_ERROR') console.log('invoice_sequences table already exists');
    else throw e;
  }
  
  process.exit(0);
}
run();
