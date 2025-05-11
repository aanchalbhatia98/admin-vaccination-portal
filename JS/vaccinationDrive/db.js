// db.js
/*const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',       // Update as per your setup
  password: 'BITS$Mtech1998',       // Update as per your setup
  database: 'vaccination_portal'
});

db.connect(err => {
  if (err) {
    console.error('DB connection failed:', err);
    process.exit(1);
  }
  console.log('Connected to MySQL');
});

module.exports = db;*/
const mysql = require('mysql2/promise');

const db = mysql.createPool({
  host: 'localhost',
  user: 'root',       
  password: 'BITS$Mtech1998',       
  database: 'vaccination_portal',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = db;
