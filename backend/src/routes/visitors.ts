import { Router, Request, Response } from 'express';
import { query, queryOne, execute, generateNextVisitorId, generateNextRegistrationId } from '../db';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth';
import { Visitor, Member } from '../types';
import { getISTDateTimeString } from '../utils/datetime';

const router = Router();

// ──────────────────────────────────────────────────────────────
// PUBLIC: POST /api/visitors/register
// First-time visitor self-registration
// ──────────────────────────────────────────────────────────────
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { full_name, mobile_number, address, place_city, invited_by, notes } = req.body;

    if (!full_name || !mobile_number || !address || !place_city) {
      return res.status(400).json({
        success: false,
        message: 'Full Name, Mobile Number, Address, and Place/City are required.'
      });
    }

    const cleanName  = full_name.trim();
    const cleanMobile = mobile_number.trim();

    // Check for duplicate visitor (same name + mobile, ACTIVE status)
    const existingVisitor = await queryOne<Visitor>(
      `SELECT * FROM visitors WHERE LOWER(full_name) = LOWER(?) AND mobile_number = ? AND status = 'ACTIVE'`,
      [cleanName, cleanMobile]
    );

    if (existingVisitor) {
      return res.status(409).json({
        success: false,
        isDuplicate: true,
        message: `Visitor "${existingVisitor.full_name}" with mobile ${existingVisitor.mobile_number} is already registered (Visitor ID: ${existingVisitor.visitor_id}).`,
        existingVisitor
      });
    }

    const visitor_id = await generateNextVisitorId();
    const now = getISTDateTimeString();

    const result = await execute(
      `INSERT INTO visitors (visitor_id, full_name, mobile_number, address, place_city, invited_by, notes, status, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'ACTIVE', ?, ?)`,
      [
        visitor_id,
        cleanName,
        cleanMobile,
        address.trim(),
        place_city.trim(),
        invited_by ? invited_by.trim() : null,
        notes    ? notes.trim()    : null,
        now,
        now
      ]
    );

    const createdVisitor = await queryOne<Visitor>(`SELECT * FROM visitors WHERE id = ?`, [result.lastID]);

    return res.status(201).json({
      success: true,
      message: 'Visitor registered successfully! Welcome to Glorious Apostolic Church!',
      visitor: createdVisitor
    });
  } catch (error: any) {
    console.error('Visitor registration error:', error);
    return res.status(500).json({ success: false, message: 'Failed to register visitor.' });
  }
});

// ──────────────────────────────────────────────────────────────
// ADMIN: GET /api/visitors
// List & search active (non-transferred) visitors
// ──────────────────────────────────────────────────────────────
router.get('/', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { search, status } = req.query;

    let sql = `SELECT * FROM visitors WHERE 1=1`;
    const params: any[] = [];

    // Default: only show ACTIVE visitors; pass ?status=ALL to see transferred too
    if (!status || status === 'ACTIVE') {
      sql += ` AND status = 'ACTIVE'`;
    }

    if (search) {
      const pat = `%${String(search).trim()}%`;
      sql += ` AND (visitor_id LIKE ? OR full_name LIKE ? OR mobile_number LIKE ? OR place_city LIKE ?)`;
      params.push(pat, pat, pat, pat);
    }

    sql += ` ORDER BY id DESC`;

    const visitors = await query<Visitor>(sql, params);
    return res.json({ success: true, count: visitors.length, visitors });
  } catch (error: any) {
    console.error('Error fetching visitors:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch visitors.' });
  }
});

// ──────────────────────────────────────────────────────────────
// ADMIN: GET /api/visitors/recent-today
// Visitors registered today (for dashboard)
// ──────────────────────────────────────────────────────────────
router.get('/recent-today', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    // IST date portion in created_at (format: "DD/MM/YYYY HH:mm:ss")
    // We filter by today's date string embedded in created_at
    const visitors = await query<Visitor>(
      `SELECT * FROM visitors ORDER BY id DESC LIMIT 5`
    );
    return res.json({ success: true, visitors });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Failed to fetch recent visitors.' });
  }
});

// ──────────────────────────────────────────────────────────────
// ADMIN: POST /api/visitors/:id/transfer
// Transfer a visitor to the official registered members list
// ──────────────────────────────────────────────────────────────
router.post('/:id/transfer', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const visitorId = req.params.id;

    // Fetch visitor record
    const visitor = await queryOne<Visitor>(`SELECT * FROM visitors WHERE id = ?`, [visitorId]);
    if (!visitor) {
      return res.status(404).json({ success: false, message: 'Visitor not found.' });
    }

    if (visitor.status === 'TRANSFERRED') {
      return res.status(409).json({
        success: false,
        message: `Visitor "${visitor.full_name}" has already been transferred to registered members (Member ID: ${visitor.transferred_member_reg_id}).`
      });
    }

    // Check if a member with same name+mobile already exists
    const existingMember = await queryOne<Member>(
      `SELECT * FROM members WHERE LOWER(full_name) = LOWER(?) AND mobile_number = ?`,
      [visitor.full_name, visitor.mobile_number]
    );

    if (existingMember) {
      return res.status(409).json({
        success: false,
        message: `A member named "${existingMember.full_name}" with mobile ${existingMember.mobile_number} already exists (${existingMember.reg_id}). Cannot transfer.`
      });
    }

    // Generate next sequential member Registration ID
    const reg_id = await generateNextRegistrationId();
    const now = getISTDateTimeString();

    // Insert visitor into members table
    const memberResult = await execute(
      `INSERT INTO members (reg_id, full_name, mobile_number, email, address, place_city, gender, dob, adhaar_number, notes, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        reg_id,
        visitor.full_name,
        visitor.mobile_number,
        null,                // email — visitor form doesn't collect it
        visitor.address,
        visitor.place_city,
        null,                // gender
        null,                // dob
        null,                // adhaar_number
        visitor.notes || null,
        now,
        now
      ]
    );

    const newMember = await queryOne<Member>(`SELECT * FROM members WHERE id = ?`, [memberResult.lastID]);

    // Mark visitor as TRANSFERRED
    await execute(
      `UPDATE visitors SET status = 'TRANSFERRED', transferred_member_reg_id = ?, updated_at = ? WHERE id = ?`,
      [reg_id, now, visitorId]
    );

    return res.status(200).json({
      success: true,
      message: `Visitor "${visitor.full_name}" successfully transferred to Registered Members with ID: ${reg_id}.`,
      member: newMember
    });
  } catch (error: any) {
    console.error('Transfer error:', error);
    return res.status(500).json({ success: false, message: 'Failed to transfer visitor to member.' });
  }
});

// ──────────────────────────────────────────────────────────────
// ADMIN: DELETE /api/visitors/:id
// ──────────────────────────────────────────────────────────────
router.delete('/:id', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const visitorId = req.params.id;
    const visitor = await queryOne<Visitor>(`SELECT * FROM visitors WHERE id = ?`, [visitorId]);
    if (!visitor) {
      return res.status(404).json({ success: false, message: 'Visitor not found.' });
    }
    await execute(`DELETE FROM visitors WHERE id = ?`, [visitorId]);
    return res.json({ success: true, message: `Visitor "${visitor.full_name}" deleted successfully.` });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Failed to delete visitor.' });
  }
});

export default router;
