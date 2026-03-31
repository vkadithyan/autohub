import express from 'express';
import pool from '../config/db.js';

const router = express.Router();

// Get bookings
router.get('/', async (req, res) => {
    try {
        const { mechanic_id } = req.query;
        let query = `
            SELECT b.id, b.customer_id, b.vehicle_id, b.service_id, b.mechanic_id,
                   b.booking_date, b.status, b.created_at, c.name as customer_name,
                   v.make as vehicle_make, v.model as vehicle_model, m.name as mechanic_name
            FROM bookings b
            LEFT JOIN customers c ON b.customer_id = c.id
            LEFT JOIN vehicles v ON b.vehicle_id = v.id
            LEFT JOIN mechanics m ON b.mechanic_id = m.id
        `;
        const queryParams = [];

        if (mechanic_id) {
            query += ` WHERE b.mechanic_id = ?`;
            queryParams.push(mechanic_id);
        }

        query += ` ORDER BY b.created_at DESC`;

        const [rows] = await pool.query(query, queryParams);
        res.json({ success: true, data: rows, count: rows.length });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Add booking
router.post('/', async (req, res) => {
    try {
        const { customer_id, vehicle_id, service_id } = req.body;
        if (!customer_id || !vehicle_id) {
            return res.status(400).json({ success: false, message: 'Customer ID and Vehicle ID are required' });
        }

        const status = 'pending';
        const bookingDate = new Date().toISOString().slice(0, 19).replace('T', ' ');

        const [result] = await pool.execute(
            'INSERT INTO bookings (customer_id, vehicle_id, booking_date, status, service_id) VALUES (?, ?, ?, ?, ?)',
            [customer_id, vehicle_id, bookingDate, status, service_id || null]
        );
        
        res.json({ success: true, message: 'Booking created successfully', booking_id: result.insertId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Assign Mechanic to Booking
router.put('/:id/assign', async (req, res) => {
    try {
        const { id } = req.params;
        const { mechanic_id } = req.body;
        
        if (!mechanic_id) {
            return res.status(400).json({ success: false, message: 'Mechanic ID is required' });
        }

        await pool.execute(
            'UPDATE bookings SET mechanic_id = ?, status = ? WHERE id = ?',
            [mechanic_id, 'in_progress', id]
        );
        
        res.json({ success: true, message: 'Mechanic assigned successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Update Booking Status
router.put('/:id/status', async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        
        if (!status) {
            return res.status(400).json({ success: false, message: 'Status is required' });
        }

        await pool.execute(
            'UPDATE bookings SET status = ? WHERE id = ?',
            [status, id]
        );
        
        res.json({ success: true, message: 'Booking status updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

export default router;
