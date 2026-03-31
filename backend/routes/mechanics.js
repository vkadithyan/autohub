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

router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        // Unassign mechanic from active bookings
        await pool.execute('UPDATE bookings SET mechanic_id = NULL WHERE mechanic_id = ?', [id]);
        // Remove associated user login
        await pool.execute('DELETE FROM users WHERE reference_id = ? AND role = "mechanic"', [id]);
        
        const [result] = await pool.execute('DELETE FROM mechanics WHERE id = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Mechanic not found' });
        }
        res.json({ success: true, message: 'Mechanic deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

export default router;
