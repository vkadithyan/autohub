import express from 'express';
import pool from '../config/db.js';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT id, name, email, phone, created_at FROM customers ORDER BY created_at DESC');
        res.json({ success: true, data: rows, count: rows.length });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

router.post('/', async (req, res) => {
    try {
        const { name, email, phone } = req.body;
        if (!name || !email) {
            return res.status(400).json({ success: false, message: 'Name and email are required' });
        }

        const [result] = await pool.execute(
            'INSERT INTO customers (name, email, phone) VALUES (?, ?, ?)',
            [name, email, phone || null]
        );
        
        res.json({ success: true, message: 'Customer created successfully', customer_id: result.insertId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        // Remove associated data to prevent foreign key constraint issues
        await pool.execute('DELETE FROM bookings WHERE customer_id = ?', [id]);
        await pool.execute('DELETE FROM vehicles WHERE customer_id = ?', [id]);
        await pool.execute('DELETE FROM users WHERE reference_id = ? AND role = "customer"', [id]);
        
        const [result] = await pool.execute('DELETE FROM customers WHERE id = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Customer not found' });
        }
        res.json({ success: true, message: 'Customer deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

export default router;
