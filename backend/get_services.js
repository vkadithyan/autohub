import fs from 'fs';
import pool from './config/db.js';
async function run() {
    try {
        const [rows] = await pool.query('SELECT * FROM services');
        console.log(rows);
    } catch(e) { console.error("DB Error:", e); }
    process.exit(0);
}
run();
