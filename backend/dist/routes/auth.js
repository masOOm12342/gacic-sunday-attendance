"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = require("../db");
const auth_1 = require("../middleware/auth");
const datetime_1 = require("../utils/datetime");
const router = (0, express_1.Router)();
// POST /api/auth/login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Email and password are required.' });
        }
        const cleanEmail = email.trim().toLowerCase();
        const admin = await (0, db_1.queryOne)(`SELECT * FROM admins WHERE LOWER(email) = ?`, [cleanEmail]);
        if (!admin) {
            return res.status(401).json({ success: false, message: 'Invalid admin email or password.' });
        }
        if (admin.status !== 'ACTIVE') {
            return res.status(403).json({
                success: false,
                message: 'Your admin account request is pending approval by Super Admin.'
            });
        }
        const passwordMatches = bcryptjs_1.default.compareSync(password, admin.password_hash);
        if (!passwordMatches) {
            return res.status(401).json({ success: false, message: 'Invalid admin email or password.' });
        }
        // Update last login
        const now = (0, datetime_1.getISTDateTimeString)();
        await (0, db_1.execute)(`UPDATE admins SET last_login = ? WHERE id = ?`, [now, admin.id]);
        const payload = {
            id: admin.id,
            email: admin.email,
            role: admin.role,
            full_name: admin.full_name
        };
        const token = jsonwebtoken_1.default.sign(payload, auth_1.JWT_SECRET, { expiresIn: '12h' });
        return res.json({
            success: true,
            message: 'Admin login successful',
            token,
            user: {
                id: admin.id,
                full_name: admin.full_name,
                email: admin.email,
                role: admin.role,
                last_login: now
            }
        });
    }
    catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ success: false, message: 'Internal server error during login.' });
    }
});
// GET /api/auth/me
router.get('/me', auth_1.authenticateToken, async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ success: false, message: 'Not authenticated.' });
        }
        const admin = await (0, db_1.queryOne)(`SELECT id, full_name, email, role, status, created_at, last_login FROM admins WHERE id = ?`, [req.user.id]);
        if (!admin) {
            return res.status(404).json({ success: false, message: 'Admin user not found.' });
        }
        return res.json({ success: true, user: admin });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: 'Error fetching session user.' });
    }
});
// POST /api/auth/request-access
router.post('/request-access', async (req, res) => {
    try {
        const { full_name, email, mobile_number, reason } = req.body;
        if (!full_name || !email || !mobile_number || !reason) {
            return res.status(400).json({ success: false, message: 'All fields are required.' });
        }
        const cleanEmail = email.trim().toLowerCase();
        // Check if email already registered as admin or request
        const existingAdmin = await (0, db_1.queryOne)(`SELECT id FROM admins WHERE LOWER(email) = ?`, [cleanEmail]);
        if (existingAdmin) {
            return res.status(400).json({ success: false, message: 'An active admin account with this email already exists.' });
        }
        const existingReq = await (0, db_1.queryOne)(`SELECT id, status FROM admin_requests WHERE LOWER(email) = ?`, [cleanEmail]);
        if (existingReq) {
            return res.status(400).json({
                success: false,
                message: `An admin request for this email is already ${existingReq.status.toLowerCase()}.`
            });
        }
        const now = (0, datetime_1.getISTDateTimeString)();
        await (0, db_1.execute)(`INSERT INTO admin_requests (full_name, email, mobile_number, reason, status, created_at) VALUES (?, ?, ?, ?, 'PENDING', ?)`, [full_name.trim(), cleanEmail, mobile_number.trim(), reason.trim(), now]);
        return res.status(201).json({
            success: true,
            message: 'Admin access request submitted successfully! It is now pending approval by the Super Admin.'
        });
    }
    catch (error) {
        console.error('Admin request error:', error);
        return res.status(500).json({ success: false, message: 'Failed to submit admin request.' });
    }
});
exports.default = router;
