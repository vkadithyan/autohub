import fs from 'fs';
import pool from './config/db.js';
async function run() {
    try {
        const [u] = await pool.query('SELECT * FROM users ORDER BY id DESC LIMIT 5');
        fs.writeFileSync('test_output2.txt', JSON.stringify({users: u}, null, 2));
    } catch(e) { console.error("DB Error:", e); }
    process.exit(0);
}
run();
