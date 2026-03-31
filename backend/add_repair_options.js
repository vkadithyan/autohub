import pool from './config/db.js';

async function run() {
    try {
        const insertQuery = `
            INSERT INTO services (name, description, estimated_duration, price)
            VALUES 
            ('Engine Diagnostics & Repair', 'Comprehensive engine testing and repair work', 180, 2500.00),
            ('Transmission Service', 'Fluid change and transmission health check', 120, 1500.00),
            ('AC Gas Refill & Repair', 'Air conditioning check, gas refill and maintenance', 60, 800.00),
            ('Suspension Overhaul', 'Struts, shocks and full suspension repair', 240, 3000.00),
            ('Battery Replacement', 'Check old battery and install a new one', 30, 400.00),
            ('Dent & Scratch Repair', 'Remove dents and repaint affected areas', 150, 1800.00)
        `;
        await pool.query(insertQuery);
        console.log("Successfully inserted new repair options!");
    } catch(e) {
        console.error("DB Error:", e);
    }
    process.exit(0);
}
run();
