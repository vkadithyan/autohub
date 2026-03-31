import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../config/db.js';

const router = express.Router();

router.post('/login', async (req, res) => {
    try {
        const { username, password, role } = req.body;
        
        const [rows] = await pool.execute(
            'SELECT id, username, password, role, reference_id FROM users WHERE username = ? AND role = ?',
            [username, role]
        );

        if (rows.length === 0) {
            return res.status(401).json({ success: false, message: 'User not found' });
        }

        const user = rows[0];
        
        // PHP backend might have stored plain text or $2y$ hashed password.
        // We handle standard bcrypt hashes. If plaintext check fails, try bcrypt.
        let isMatch = false;
        if (password === user.password) {
            isMatch = true;
        } else {
            isMatch = await bcrypt.compare(password, user.password);
        }

        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid password' });
        }

        const token = jwt.sign(
            { id: user.reference_id || user.id, username: user.username, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.json({
            success: true,
            message: 'Login successful',
            token,
            user: { id: user.reference_id || user.id, username: user.username, role: user.role }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

router.post('/register', async (req, res) => {
    try {
        const { name, email, phone, username, password, role = 'customer' } = req.body;
        if (!name || !email || !username || !password) {
            return res.status(400).json({ success: false, message: 'Missing required fields' });
        }

        const validRoles = ['customer', 'mechanic', 'admin'];
        if (!validRoles.includes(role)) {
            return res.status(400).json({ success: false, message: 'Invalid role' });
        }

        const [userCheck] = await pool.execute('SELECT id FROM users WHERE username = ?', [username]);
        if (userCheck.length > 0) return res.status(409).json({ success: false, message: 'Username already taken' });

        let referenceId = null;

        if (role === 'customer') {
            const [emailCheck] = await pool.execute('SELECT id FROM customers WHERE email = ?', [email]);
            if (emailCheck.length > 0) return res.status(409).json({ success: false, message: 'Email already registered' });

            const [custResult] = await pool.execute(
                'INSERT INTO customers (name, email, phone) VALUES (?, ?, ?)',
                [name, email, phone || null]
            );
            referenceId = custResult.insertId;
        } else if (role === 'mechanic') {
            const [mechResult] = await pool.execute(
                'INSERT INTO mechanics (name, specialty, phone, status) VALUES (?, ?, ?, ?)',
                [name, 'General Service', phone || null, 'available']
            );
            referenceId = mechResult.insertId;
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        await pool.execute(
            'INSERT INTO users (username, password, role, reference_id) VALUES (?, ?, ?, ?)',
            [username, hashedPassword, role, referenceId]
        );

        res.json({ success: true, message: 'Registration successful! Please login.', reference_id: referenceId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

export default router;
