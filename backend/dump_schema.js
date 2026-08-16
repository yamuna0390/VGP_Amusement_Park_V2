const mysql = require('mysql2/promise');
const fs = require('fs');
require('dotenv').config();

async function getTables() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT,
    });
    const [tables] = await connection.execute('SHOW TABLES');
    let out = '';
    for (const row of tables) {
        const tableName = Object.values(row)[0];
        const [schema] = await connection.execute(`SHOW CREATE TABLE ${tableName}`);
        out += schema[0]['Create Table'] + '\n\n';
    }
    fs.writeFileSync('dump_schema2.txt', out, 'utf8');
    await connection.end();
}
getTables();
