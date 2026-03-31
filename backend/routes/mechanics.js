import express from 'express';
import pool from '../config/db.js';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT id, name, specialty, phone, status FROM mechanics ORDER BY id DESC');
        res.json({ success: true, data: rows, count: rows.length });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

router.post('/', async (req, res) => {
    try {
        const { name, specialty, phone } = req.body;
        if (!name || !specialty) {
            return res.status(400).json({ success: false, message: 'Name and specialty are required' });
        }

        const [result] = await pool.execute(
            'INSERT INTO mechanics (name, specialty, phone, status) VALUES (?, ?, ?, ?)',
            [name, specialty, phone || null, 'available']
        );
        
        res.json({ success: true, message: 'Mechanic added successfully', mechanic_id: result.insertId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

export default router;
