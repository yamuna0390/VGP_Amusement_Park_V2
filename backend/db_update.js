const mysql = require("mysql2/promise");
async function run() {
    const c = await mysql.createConnection({host: 'localhost', user: 'root', password: 'Yam@9809', database: 'amusement_park'});
    await c.execute("UPDATE addons SET addon_type = 'MEAL_COUPON', price = 200 WHERE id = 1");
    await c.end();
}
run();
