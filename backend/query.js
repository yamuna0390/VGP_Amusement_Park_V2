const mysql = require("mysql2/promise");
mysql.createConnection({host: "localhost", user: "root", password: "Yam@9809", database: "amusement_park"}).then(conn => {
  conn.execute("DESCRIBE ticket_types").then(([rows1]) => {
    console.log("ticket_types:", rows1);
    conn.execute("DESCRIBE offers").then(([rows2]) => {
      console.log("offers:", rows2);
      process.exit(0);
    });
  });
});
