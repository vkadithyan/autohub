import express from 'express';
import pool from '../config/db.js';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT id, make, model, year, vin, customer_id FROM vehicles ORDER BY id DESC');
        res.json({ success: true, data: rows, count: rows.length });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

router.post('/', async (req, res) => {
    try {
        const { make, model, year, customer_id } = req.body;
        if (!make || !model || !year || !customer_id) {
            return res.status(400).json({ success: false, message: 'All fields are required' });
        }

        const [result] = await pool.execute(
            'INSERT INTO vehicles (make, model, year, customer_id) VALUES (?, ?, ?, ?)',
            [make, model, year, customer_id]
        );
        
        res.json({ success: true, message: 'Vehicle added successfully', vehicle_id: result.insertId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

export default router;
