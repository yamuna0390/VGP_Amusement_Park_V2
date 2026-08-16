const mysql = require('mysql2/promise');
require('dotenv').config();

async function setAdmin() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT,
    });
    
    // update user 1 to be admin, if not exists insert one
    await connection.execute(`
        INSERT INTO users (id, full_name, email, password, role) 
        VALUES (1, 'Admin', 'admin@vgp.com', 'password', 'admin')
        ON DUPLICATE KEY UPDATE role = 'admin'
    `);
    
    await connection.end();
}
setAdmin().then(() => console.log('Admin set'));
