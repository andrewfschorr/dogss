var mysql = require('mysql');
require('dotenv').config()

var pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
});

pool.getConnection(function(err) {
    if (err) throw err;
});

module.exports = pool;
