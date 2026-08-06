"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = require("../db");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Super Admin: GET /api/database/info
router.get('/info', auth_1.authenticateToken, auth_1.requireSuperAdmin, async (req, res) => {
    try {
        const memberCount = await (0, db_1.queryOne)(`SELECT COUNT(*) as count FROM members`);
        const attendanceCount = await (0, db_1.queryOne)(`SELECT COUNT(*) as count FROM attendance`);
        const adminCount = await (0, db_1.queryOne)(`SELECT COUNT(*) as count FROM admins`);
        const requestCount = await (0, db_1.queryOne)(`SELECT COUNT(*) as count FROM admin_requests`);
        const settings = await (0, db_1.query)(`SELECT * FROM system_settings`);
        return res.json({
            success: true,
            tables: [
                { name: 'members', records: memberCount?.count || 0 },
                { name: 'attendance', records: attendanceCount?.count || 0 },
                { name: 'admins', records: adminCount?.count || 0 },
                { name: 'admin_requests', records: requestCount?.count || 0 },
                { name: 'system_settings', records: settings.length }
            ],
            settings
        });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: 'Failed to inspect database info.' });
    }
});
exports.default = router;
