"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const db_1 = require("../db");
const auth_1 = require("../middleware/auth");
const datetime_1 = require("../utils/datetime");
const router = (0, express_1.Router)();
// Super Admin: GET /api/admin/requests (List admin requests)
router.get('/', auth_1.authenticateToken, auth_1.requireSuperAdmin, async (req, res) => {
    try {
        const requests = await (0, db_1.query)(`SELECT * FROM admin_requests ORDER BY id DESC`);
        const activeAdmins = await (0, db_1.query)(`SELECT id, full_name, email, role, status, created_at, last_login FROM admins ORDER BY id ASC`);
        return res.json({ success: true, requests, activeAdmins });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: 'Failed to fetch admin requests.' });
    }
});
// Super Admin: POST /api/admin/requests/:id/approve
router.post('/:id/approve', auth_1.authenticateToken, auth_1.requireSuperAdmin, async (req, res) => {
    try {
        const requestId = req.params.id;
        const requestItem = await (0, db_1.queryOne)(`SELECT * FROM admin_requests WHERE id = ?`, [requestId]);
        if (!requestItem) {
            return res.status(404).json({ success: false, message: 'Admin request not found.' });
        }
        if (requestItem.status === 'APPROVED') {
            return res.status(400).json({ success: false, message: 'This request is already approved.' });
        }
        const { role = 'ADMIN', temporary_password = 'ChurchAdmin@2026' } = req.body;
        const passwordHash = bcryptjs_1.default.hashSync(temporary_password, 10);
        const now = (0, datetime_1.getISTDateTimeString)();
        // 1. Create or update admin account
        const existingAdmin = await (0, db_1.queryOne)(`SELECT id FROM admins WHERE LOWER(email) = LOWER(?)`, [requestItem.email]);
        if (!existingAdmin) {
            await (0, db_1.execute)(`INSERT INTO admins (full_name, email, password_hash, role, status, created_at) VALUES (?, ?, ?, ?, 'ACTIVE', ?)`, [requestItem.full_name, requestItem.email.toLowerCase(), passwordHash, role, now]);
        }
        else {
            await (0, db_1.execute)(`UPDATE admins SET status = 'ACTIVE', role = ?, password_hash = ? WHERE LOWER(email) = LOWER(?)`, [role, passwordHash, requestItem.email.toLowerCase()]);
        }
        // 2. Mark request APPROVED
        await (0, db_1.execute)(`UPDATE admin_requests SET status = 'APPROVED', reviewed_at = ? WHERE id = ?`, [now, requestId]);
        return res.json({
            success: true,
            message: `Admin access approved for ${requestItem.full_name} (${requestItem.email})! Temporary Password: ${temporary_password}`
        });
    }
    catch (error) {
        console.error('Approve error:', error);
        return res.status(500).json({ success: false, message: 'Failed to approve admin request.' });
    }
});
// Super Admin: POST /api/admin/requests/:id/reject
router.post('/:id/reject', auth_1.authenticateToken, auth_1.requireSuperAdmin, async (req, res) => {
    try {
        const requestId = req.params.id;
        const requestItem = await (0, db_1.queryOne)(`SELECT * FROM admin_requests WHERE id = ?`, [requestId]);
        if (!requestItem) {
            return res.status(404).json({ success: false, message: 'Admin request not found.' });
        }
        const now = (0, datetime_1.getISTDateTimeString)();
        await (0, db_1.execute)(`UPDATE admin_requests SET status = 'REJECTED', reviewed_at = ? WHERE id = ?`, [now, requestId]);
        return res.json({ success: true, message: `Admin request for ${requestItem.email} rejected.` });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: 'Failed to reject admin request.' });
    }
});
// Super Admin: DELETE /api/admin/requests/:id
router.delete('/:id', auth_1.authenticateToken, auth_1.requireSuperAdmin, async (req, res) => {
    try {
        const requestId = req.params.id;
        await (0, db_1.execute)(`DELETE FROM admin_requests WHERE id = ?`, [requestId]);
        return res.json({ success: true, message: 'Admin request record deleted.' });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: 'Failed to delete admin request.' });
    }
});
// Super Admin: DELETE /api/admin/admins/:id (Delete Admin User)
router.delete('/admin-user/:id', auth_1.authenticateToken, auth_1.requireSuperAdmin, async (req, res) => {
    try {
        const adminId = req.params.id;
        const adminUser = await (0, db_1.queryOne)(`SELECT * FROM admins WHERE id = ?`, [adminId]);
        if (!adminUser) {
            return res.status(404).json({ success: false, message: 'Admin account not found.' });
        }
        if (adminUser.email.toLowerCase() === 'gacic_admin@gmail.com') {
            return res.status(403).json({ success: false, message: 'The primary permanent Super Admin account cannot be deleted!' });
        }
        await (0, db_1.execute)(`DELETE FROM admins WHERE id = ?`, [adminId]);
        return res.json({ success: true, message: `Admin user ${adminUser.email} deleted.` });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: 'Failed to delete admin user.' });
    }
});
exports.default = router;
