import pool from './config/db.js';

async function fix() {
    try {
        try {
            await pool.query('ALTER TABLE users ADD COLUMN reference_id INT');
            console.log("Added reference_id column");
        } catch(e) {
            console.log("Column may exist:", e.message);
        }
        await pool.query("UPDATE users SET reference_id = 1 WHERE username = 'vk'");
        await pool.query("UPDATE users SET reference_id = 1 WHERE username = 'vimlu'");
        console.log("DB records fixed");
    } catch(e) {
        console.error("Error:", e);
    }
    process.exit(0);
}
fix();
