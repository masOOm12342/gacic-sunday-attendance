"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = require("../db");
const auth_1 = require("../middleware/auth");
const datetime_1 = require("../utils/datetime");
const router = (0, express_1.Router)();
// Public POST /api/members/register (Public Registration)
router.post('/register', async (req, res) => {
    try {
        const { full_name, mobile_number, email, address, place_city, gender, dob, notes } = req.body;
        if (!full_name || !mobile_number || !address || !place_city) {
            return res.status(400).json({
                success: false,
                message: 'Full Name, Mobile Number, Address, and Place/City are required.'
            });
        }
        const cleanName = full_name.trim();
        const cleanMobile = mobile_number.trim();
        // Duplicate Check: Check if BOTH Full Name AND Mobile Number match an existing member
        const existingDuplicate = await (0, db_1.queryOne)(`SELECT * FROM members WHERE LOWER(full_name) = LOWER(?) AND mobile_number = ?`, [cleanName, cleanMobile]);
        if (existingDuplicate) {
            return res.status(409).json({
                success: false,
                isDuplicate: true,
                message: `Member "${existingDuplicate.full_name}" with mobile ${existingDuplicate.mobile_number} is already registered (Registration ID: ${existingDuplicate.reg_id}).`,
                existingMember: existingDuplicate
            });
        }
        // Generate unique Registration ID
        const reg_id = await (0, db_1.generateNextRegistrationId)();
        const now = (0, datetime_1.getISTDateTimeString)();
        const result = await (0, db_1.execute)(`INSERT INTO members (reg_id, full_name, mobile_number, email, address, place_city, gender, dob, notes, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [
            reg_id,
            cleanName,
            cleanMobile,
            email ? email.trim() : null,
            address.trim(),
            place_city.trim(),
            gender || null,
            dob || null,
            notes ? notes.trim() : null,
            now,
            now
        ]);
        const createdMember = await (0, db_1.queryOne)(`SELECT * FROM members WHERE id = ?`, [result.lastID]);
        return res.status(201).json({
            success: true,
            message: 'Member registered successfully!',
            member: createdMember
        });
    }
    catch (error) {
        console.error('Registration error:', error);
        return res.status(500).json({ success: false, message: 'Failed to process member registration.' });
    }
});
// Admin GET /api/members (List & Search Members)
router.get('/', auth_1.authenticateToken, async (req, res) => {
    try {
        const { search, gender, place } = req.query;
        let sql = `SELECT * FROM members WHERE 1=1`;
        const params = [];
        if (search) {
            const searchPattern = `%${String(search).trim()}%`;
            sql += ` AND (reg_id LIKE ? OR full_name LIKE ? OR mobile_number LIKE ? OR place_city LIKE ? OR email LIKE ?)`;
            params.push(searchPattern, searchPattern, searchPattern, searchPattern, searchPattern);
        }
        if (gender && gender !== 'ALL') {
            sql += ` AND gender = ?`;
            params.push(gender);
        }
        if (place) {
            sql += ` AND place_city LIKE ?`;
            params.push(`%${place}%`);
        }
        sql += ` ORDER BY id DESC`;
        const members = await (0, db_1.query)(sql, params);
        return res.json({ success: true, count: members.length, members });
    }
    catch (error) {
        console.error('Error fetching members:', error);
        return res.status(500).json({ success: false, message: 'Failed to fetch members.' });
    }
});
// Admin GET /api/members/:id
router.get('/:id', auth_1.authenticateToken, async (req, res) => {
    try {
        const member = await (0, db_1.queryOne)(`SELECT * FROM members WHERE id = ? OR reg_id = ?`, [req.params.id, req.params.id]);
        if (!member) {
            return res.status(404).json({ success: false, message: 'Member not found.' });
        }
        return res.json({ success: true, member });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: 'Error retrieving member details.' });
    }
});
// Admin POST /api/members (Manual Add)
router.post('/', auth_1.authenticateToken, async (req, res) => {
    try {
        const { full_name, mobile_number, email, address, place_city, gender, dob, notes } = req.body;
        if (!full_name || !mobile_number || !address || !place_city) {
            return res.status(400).json({ success: false, message: 'Full Name, Mobile Number, Address, and Place/City are required.' });
        }
        const cleanName = full_name.trim();
        const cleanMobile = mobile_number.trim();
        const existingDuplicate = await (0, db_1.queryOne)(`SELECT * FROM members WHERE LOWER(full_name) = LOWER(?) AND mobile_number = ?`, [cleanName, cleanMobile]);
        if (existingDuplicate) {
            return res.status(409).json({
                success: false,
                isDuplicate: true,
                message: `Member "${existingDuplicate.full_name}" with mobile ${existingDuplicate.mobile_number} already exists.`
            });
        }
        const reg_id = await (0, db_1.generateNextRegistrationId)();
        const now = (0, datetime_1.getISTDateTimeString)();
        const result = await (0, db_1.execute)(`INSERT INTO members (reg_id, full_name, mobile_number, email, address, place_city, gender, dob, notes, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [
            reg_id,
            cleanName,
            cleanMobile,
            email ? email.trim() : null,
            address.trim(),
            place_city.trim(),
            gender || null,
            dob || null,
            notes ? notes.trim() : null,
            now,
            now
        ]);
        const createdMember = await (0, db_1.queryOne)(`SELECT * FROM members WHERE id = ?`, [result.lastID]);
        return res.status(201).json({ success: true, message: 'Member created successfully!', member: createdMember });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: 'Error creating member.' });
    }
});
// Admin PUT /api/members/:id (Edit Member)
router.put('/:id', auth_1.authenticateToken, async (req, res) => {
    try {
        const memberId = req.params.id;
        const { full_name, mobile_number, email, address, place_city, gender, dob, notes } = req.body;
        const existing = await (0, db_1.queryOne)(`SELECT * FROM members WHERE id = ?`, [memberId]);
        if (!existing) {
            return res.status(404).json({ success: false, message: 'Member not found.' });
        }
        const now = (0, datetime_1.getISTDateTimeString)();
        await (0, db_1.execute)(`UPDATE members SET
        full_name = ?,
        mobile_number = ?,
        email = ?,
        address = ?,
        place_city = ?,
        gender = ?,
        dob = ?,
        notes = ?,
        updated_at = ?
       WHERE id = ?`, [
            full_name ? full_name.trim() : existing.full_name,
            mobile_number ? mobile_number.trim() : existing.mobile_number,
            email !== undefined ? (email ? email.trim() : null) : existing.email,
            address ? address.trim() : existing.address,
            place_city ? place_city.trim() : existing.place_city,
            gender !== undefined ? gender : existing.gender,
            dob !== undefined ? dob : existing.dob,
            notes !== undefined ? notes : existing.notes,
            now,
            memberId
        ]);
        const updated = await (0, db_1.queryOne)(`SELECT * FROM members WHERE id = ?`, [memberId]);
        return res.json({ success: true, message: 'Member updated successfully!', member: updated });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: 'Error updating member.' });
    }
});
// Admin DELETE /api/members/:id
router.delete('/:id', auth_1.authenticateToken, async (req, res) => {
    try {
        const memberId = req.params.id;
        const existing = await (0, db_1.queryOne)(`SELECT * FROM members WHERE id = ?`, [memberId]);
        if (!existing) {
            return res.status(404).json({ success: false, message: 'Member not found.' });
        }
        // Delete associated attendance first
        await (0, db_1.execute)(`DELETE FROM attendance WHERE member_id = ?`, [memberId]);
        await (0, db_1.execute)(`DELETE FROM members WHERE id = ?`, [memberId]);
        return res.json({ success: true, message: `Member ${existing.full_name} (${existing.reg_id}) deleted successfully.` });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: 'Failed to delete member.' });
    }
});
exports.default = router;
