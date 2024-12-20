// src\config\database.js
const { Pool } = require('pg');

const pool = new Pool({
    host:  process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    port: process.env.PORT_DB, // default port for PostgreSQL 
    database: process.env.DATABASE,
});


pool.connect((err, client, done) => {
    if (err) {
        console.error('Error connecting to the database:', err);
    } else {
        console.log('Connected to the database' , process.env.HOST,process.env.PORT_DB);
        done();
    }
});



module.exports = pool;
